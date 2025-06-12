from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Contribution, ContributionStatus
from .serializers import ContributionSerializer, ContributionStatusSerializer
from Collections.models import Collection
from HouseHold_Resident.models import Household

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def contribution_create(request):
    """
    POST: Tạo mới khoản nộp
    Body: household, code, amount, payment_date
    """
    serializer = ContributionSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        contribution = serializer.save()
        # Cập nhật hoặc tạo ContributionStatus
        status_instance, created = ContributionStatus.objects.update_or_create(
            household=contribution.household,
            code=contribution.code,
            defaults={'status': 'ĐÃ NỘP'}
        )
        status_serializer = ContributionStatusSerializer(status_instance)
        return Response(
            {"message": "Tạo khoản nộp thành công!", "data": serializer.data, "status": status_serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contribution_list(request):
    """
    GET: Lấy danh sách khoản nộp
    Query params: room_number (tùy chọn), code (tùy chọn)
    """
    room_number = request.query_params.get('room_number', None)
    code = request.query_params.get('code', None)

    contributions = Contribution.objects.all()

    if room_number:
        contributions = contributions.filter(household__room_number=room_number)
    if code:
        contributions = contributions.filter(code__code=code)

    if not contributions.exists():
        return Response({"message": "Không tìm thấy khoản nộp nào!"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ContributionSerializer(contributions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contribution_detail(request, pk):
    """
    GET: Xem chi tiết khoản nộp
    """
    contribution = get_object_or_404(Contribution, pk=pk)
    serializer = ContributionSerializer(contribution)
    status_instance = ContributionStatus.objects.filter(
        household=contribution.household, code=contribution.code
    ).first()
    status_data = {
        'household_id': contribution.household.household_id,
        'block_name': contribution.household.block_name,
        'room_number': contribution.household.room_number,
        'owner_name': contribution.household.owner_name,
        'code': contribution.code.code,
        'collection_name': getattr(contribution.code, 'name', contribution.code.code),
        'status': 'ĐÃ NỘP'
    } if not status_instance else ContributionStatusSerializer(status_instance).data
    return Response(
        {"data": serializer.data, "status": status_data},
        status=status.HTTP_200_OK
    )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def contribution_update(request, pk):
    """
    PUT: Cập nhật toàn bộ thông tin khoản nộp
    Body: household, code, amount, payment_date
    """
    contribution = get_object_or_404(Contribution, pk=pk)
    if contribution.is_reconciled:
        return Response({"message": "Khoản nộp đã sao kê, không thể sửa!"}, status=status.HTTP_403_FORBIDDEN)
    serializer = ContributionSerializer(contribution, data=request.data, partial=False, context={'request': request})
    if serializer.is_valid():
        contribution = serializer.save()
        # Cập nhật ContributionStatus
        status_instance, created = ContributionStatus.objects.update_or_create(
            household=contribution.household,
            code=contribution.code,
            defaults={'status': 'ĐÃ NỘP'}
        )
        status_serializer = ContributionStatusSerializer(status_instance)
        return Response(
            {"message": "Cập nhật thành công!", "data": serializer.data, "status": status_serializer.data},
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def contribution_partial_update(request, pk):
    """
    PATCH: Cập nhật một phần thông tin khoản nộp
    Body: household, code, amount, payment_date (tùy chọn)
    """
    contribution = get_object_or_404(Contribution, pk=pk)
    if contribution.is_reconciled:
        return Response({"message": "Khoản nộp đã sao kê, không thể sửa!"}, status=status.HTTP_403_FORBIDDEN)
    serializer = ContributionSerializer(contribution, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        contribution = serializer.save()
        # Cập nhật ContributionStatus
        status_instance, created = ContributionStatus.objects.update_or_create(
            household=contribution.household,
            code=contribution.code,
            defaults={'status': 'ĐÃ NỘP'}
        )
        status_serializer = ContributionStatusSerializer(status_instance)
        return Response(
            {"message": "Cập nhật thành công!", "data": serializer.data, "status": status_serializer.data},
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def contribution_delete(request, pk):
    """
    DELETE: Xóa khoản nộp
    """
    contribution = get_object_or_404(Contribution, pk=pk)
    if contribution.is_reconciled:
        return Response({"message": "Khoản nộp đã được thống kê, không thể xóa!"}, status=status.HTTP_403_FORBIDDEN)
    # Cập nhật ContributionStatus thành CHƯA NỘP
    status_instance, created = ContributionStatus.objects.update_or_create(
        household=contribution.household,
        code=contribution.code,
        defaults={'status': 'CHƯA NỘP'}
    )
    contribution.delete()
    status_serializer = ContributionStatusSerializer(status_instance)
    return Response(
        {"message": "Xóa thành công!", "status": status_serializer.data},
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contribution_status_check(request):
    """
    GET: Hiển thị trạng thái nộp của tất cả hộ dân cho một khoản thu cụ thể (dựa vào code).
    Nếu hộ dân chưa nộp, sẽ trả về trạng thái 'CHƯA NỘP'.
    """
    code_filter = request.query_params.get('code')
    if not code_filter:
        return Response(
            {"detail": "Thiếu tham số 'code'."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        collection = Collection.objects.get(code=code_filter)
    except Collection.DoesNotExist:
        return Response(
            {"detail": "Khoản thu không tồn tại."},
            status=status.HTTP_404_NOT_FOUND
        )

    if collection.type == "Tự nguyện":
        # Chỉ lấy những hộ dân đã nộp
        paid_statuses = ContributionStatus.objects.filter(
            code=collection,
            status='ĐÃ NỘP'
        )
        all_statuses = [ContributionStatusSerializer(status).data for status in paid_statuses]
        return Response(all_statuses, status=status.HTTP_200_OK)

    households = Household.objects.all()
    all_statuses = []

    for household in households:
        try:
            status_obj = ContributionStatus.objects.get(household=household, code=collection)
            serializer = ContributionStatusSerializer(status_obj)
            all_statuses.append(serializer.data)
        except ContributionStatus.DoesNotExist:
            # Nếu chưa nộp, trả về thông tin hộ + trạng thái CHƯA NỘP
            status_data = {
                'household_id': household.household_id,
                'block_name': household.block_name,
                'room_number': household.room_number,
                'owner_name': household.owner_name,
                'code': collection.code,
                'collection_name': collection.name,
                'status': 'CHƯA NỘP'
            }
            all_statuses.append(status_data)

    return Response(all_statuses, status=status.HTTP_200_OK)
