from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ActivityLog
import pytz

@api_view(['GET'])
def recent_activities(request):
    vn_tz = pytz.timezone('Asia/Ho_Chi_Minh')
    logs = ActivityLog.objects.order_by('-created_at')[:5]
    data = [
        {
            "action": log.action,
            "content": log.content,
            "date": log.created_at.astimezone(vn_tz).strftime("%d/%m/%Y %H:%M"),
            "user": log.user.username if log.user else "Hệ thống"
        }
        for log in logs
    ]
    return Response(data)
