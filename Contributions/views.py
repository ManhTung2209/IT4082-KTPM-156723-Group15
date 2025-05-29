from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Contribution
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
        status_data = {
            'household_id': contribution.household.household_id,
            'code': contribution.code.code,
            'status': 'PAID'
        }
        status_serializer = ContributionStatusSerializer(data=status_data)
        if status_serializer.is_valid():
            return Response(
                {"message": "Tạo khoản nộp thành công!", "data": serializer.data, "status": status_serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(status_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
    GET: Lấy chi tiết khoản nộp
    """
    contribution = get_object_or_404(Contribution, pk=pk)
    serializer = ContributionSerializer(contribution)
    status_data = {
        'household_id': contribution.household.household_id,
        'code': contribution.code.code,
        'status': 'PAID'
    }
    status_serializer = ContributionStatusSerializer(data=status_data)
    if status_serializer.is_valid():
        return Response(
            {"data": serializer.data, "status": status_serializer.data},
            status=status.HTTP_200_OK
        )
    return Response(status_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        status_data = {
            'household_id': contribution.household.household_id,
            'code': contribution.code.code,
            'status': 'PAID'
        }
        status_serializer = ContributionStatusSerializer(data=status_data)
        if status_serializer.is_valid():
            return Response(
                {"message": "Cập nhật thành công!", "data": serializer.data, "status": status_serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(status_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
        status_data = {
            'household_id': contribution.household.household_id,
            'code': contribution.code.code,
            'status': 'PAID'
        }
        status_serializer = ContributionStatusSerializer(data=status_data)
        if status_serializer.is_valid():
            return Response(
                {"message": "Cập nhật thành công!", "data": serializer.data, "status": status_serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(status_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
    status_data = {
        'household_id': contribution.household.household_id,
        'code': contribution.code.code,
        'status': 'UNPAID'
    }
    contribution.delete()
    status_serializer = ContributionStatusSerializer(data=status_data)
    if status_serializer.is_valid():
        return Response(
            {"message": "Xóa thành công!", "status": status_serializer.data},
            status=status.HTTP_200_OK
        )
    return Response(status_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contribution_status_check(request):
    """
    GET: Hiển thị trạng thái nộp của tất cả hộ gia đình cho tất cả khoản thu
    """
    # Lấy tất cả hộ gia đình và khoản thu
    households = Household.objects.all()
    collections = Collection.objects.all()

    # Tạo danh sách trạng thái cho tất cả cặp household-collection
    status_list = []
    for household in households:
        for collection in collections:
            contribution = Contribution.objects.filter(
                household=household,
                code=collection
            ).first()
            status_data = {
                'household_id': household.household_id,
                'code': collection.code,
                'status': 'PAID' if contribution else 'UNPAID'
            }
            status_list.append(status_data)

    # Serialize danh sách trạng thái
    serializer = ContributionStatusSerializer(status_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)