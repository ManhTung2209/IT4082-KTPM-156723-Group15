from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from .models import Collection
from .serializers import CollectionSerializer
from .permissions import CollectionPermission
from ActivityLog.models import ActivityLog

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [CollectionPermission]

    @action(detail=False, methods=['get'], url_path='count')
    def count(self, request):
        count = self.get_queryset().count()
        return Response({'count': count})

    def get_queryset(self):
        user = self.request.user
        return Collection.objects.filter(unit_code=user.unit_code)

    @action(detail=False, methods=["get"], url_path="all", permission_classes=[CollectionPermission])
    def get_all_collections(self, request):
        collections = Collection.objects.all()
        serializer = self.get_serializer(collections, many=True)
        return Response(
            {"detail": "Lấy tất cả khoản thu thành công", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            ActivityLog.objects.create(
                user = request.user,
                action = "Thêm khoản thu",
                content=f"Thêm khoản thu {serializer.data.get('name', '')}"
            )
            return Response(
                {"detail": "Tạo khoản thu thành công", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response({"error": str(e), "data": request.data}, status=500)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        ActivityLog.objects.create(
            user = request.user,
            action = "Sửa khoản thu",
            content=f"Sửa khoản thu {serializer.data.get('name', '')}"
        )
        return Response(
            {"detail": "Sửa khoản thu thành công", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        name = instance.name
        self.perform_destroy(instance)
        ActivityLog.objects.create(
            user = request.user,
            action = "Xóa khoản thu",
            content = f"Xóa khoản thu {name}"
        )
        return Response({"detail": "Xóa khoản thu thành công"}, status=status.HTTP_200_OK)