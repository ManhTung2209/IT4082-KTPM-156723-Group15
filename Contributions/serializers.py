from rest_framework import serializers
from .models import Contribution
from Collections.models import Collection
from HouseHold_Resident.models import Household

class ContributionSerializer(serializers.ModelSerializer):
    code = serializers.CharField(write_only=True)
    collection_code = serializers.CharField(source='code.code', read_only=True)
    household = serializers.PrimaryKeyRelatedField(queryset=Household.objects.all())
    household_id = serializers.IntegerField(source='household.household_id', read_only=True)

    class Meta:
        model = Contribution
        fields = ['id', 'household', 'household_id', 'code', 'collection_code', 'amount', 'payment_date', 'is_reconciled']
        read_only_fields = ['is_reconciled', 'household_id', 'collection_code']

    def validate(self, data):
        code = data.get('code')
        household = data.get('household')
        if code and not Collection.objects.filter(code=code).exists():
            raise serializers.ValidationError({"code": "Mã khoản thu không tồn tại!"})
        if not Household.objects.filter(pk=household.pk).exists():
            raise serializers.ValidationError({"household": "Hộ gia đình không tồn tại!"})
        
        # Kiểm tra tính duy nhất của household và code
        if self.instance:  # Trường hợp cập nhật
            if Contribution.objects.filter(
                household=household,
                code__code=code
            ).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError({"non_field_errors": "Khoản nộp cho hộ gia đình và mã khoản thu này đã tồn tại!"})
        else:  # Trường hợp tạo mới
            if Contribution.objects.filter(
                household=household,
                code__code=code
            ).exists():
                raise serializers.ValidationError({"non_field_errors": "Khoản nộp cho hộ gia đình và mã khoản thu này đã tồn tại!"})
        
        return data

    def create(self, validated_data):
        code_value = validated_data.pop('code')
        collection = Collection.objects.get(code=code_value)
        validated_data['code'] = collection
        return super().create(validated_data)

    def update(self, instance, validated_data):
        code_value = validated_data.pop('code', None)
        if code_value:
            collection = Collection.objects.get(code=code_value)
            validated_data['code'] = collection
        return super().update(instance, validated_data)

class ContributionStatusSerializer(serializers.Serializer):
    household_id = serializers.IntegerField()
    code = serializers.CharField()
    status = serializers.CharField()