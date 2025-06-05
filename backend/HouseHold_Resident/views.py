from .models import Citizen, Household
from rest_framework.response import Response
from rest_framework import status
from .serializers import CitizenSerializer,HouseholdSerializer
from rest_framework import viewsets
from .permissions import HouseHold_ResidentPermission
from ActivityLog.models import ActivityLog
from rest_framework.decorators import action

class CitizenViewSet(viewsets.ModelViewSet):
    queryset = Citizen.objects.all()
    serializer_class = CitizenSerializer
    permission_classes = [HouseHold_ResidentPermission]

    @action(detail=False, methods=['get'], url_path='count')
    def count(self, request):
        count = self.get_queryset().count()
        return Response({'count': count})
    
    def get_queryset(self):
        return Citizen.objects.all()
    
    def create(self, request, *args, **kwargs):
        try:
            data = super().create(request, *args, **kwargs)
            household_id = request.data.get('household')
            if household_id:
                household = Household.objects.get(pk=household_id)
                household.number_people += 1
                household.save()
            # citizen_id = data.data.get('id')
            ActivityLog.objects.create(
                user = request.user,
                # action = "Thêm cư dân",
                content=f"Thêm cư dân mới: {data.data.get('full_name', '')}"
            )
            return Response(
                {"message": "Citizen created successfully",
                 "data":data.data},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
            response.data['message'] = "Citizen updated successfully"
            ActivityLog.objects.create(
                user = request.user,
                content=f"Cập nhật thông tin cư dân: {response.data.get('full_name', '')}"
            )
            return response
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            full_name = getattr(instance, 'full_name', 'Unknown')
            data = super().destroy(request, *args, **kwargs)
            ActivityLog.objects.create(
                user = request.user,
                content=f"Xóa cư dân: {full_name}"
            )
            return Response(
                {"message": "Citizen deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
class HouseholdViewSet(viewsets.ModelViewSet):
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer
    permission_classes = [HouseHold_ResidentPermission]

    @action(detail=False, methods=['get'], url_path='count')
    def count(self, request):
        count = self.get_queryset().count()
        return Response({'count': count})
    
    def get_queryset(self):
        return Household.objects.all()
    
    def create(self, request, *args, **kwargs):
        try:
            data = super().create(request, *args, **kwargs)
            return Response(
                {"message": "Household created successfully",
                 "data":data.data},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            old_block = instance.block_name
            old_room = instance.room_number
            old_owner = instance.owner_name

            response = super().update(request, *args, **kwargs)

            new_block = request.data.get('block_name', old_block)
            new_room = request.data.get('room_number', old_room)
            new_owner = request.data.get('owner_name', old_owner)

            changes = []
            if old_block != new_block and old_owner == new_owner and new_room == old_room:
                changes.append(f"Chủ hộ '{old_owner}' chuyển từ tòa '{old_block}' sang tòa '{new_block}'")

            if old_block == new_block and old_room == new_room and old_owner != new_owner:
                changes.append(f"Chủ hộ mới của tòa '{old_block}' có số phòng '{old_room}' là '{new_owner}'") 
            
            if changes:
                ActivityLog.objects.create(
                    user = request.user,
                    content=f"Cập nhật hộ dân: " + ", ".join(changes)
                )
            response.data['message'] = "Household updated successfully"
            return response
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def destroy(self, request, *args, **kwargs):
        try:
            super().destroy(request, *args, **kwargs)
            return Response(
                {"message": "Household deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )