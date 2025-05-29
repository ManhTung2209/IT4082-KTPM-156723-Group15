from django.db import models
from django.core.validators import MinValueValidator
from Collections.models import Collection
from HouseHold_Resident.models import Household
from Users.models import User

class Contribution(models.Model):
    household = models.ForeignKey(Household, on_delete=models.CASCADE)
    code = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name='contributions_by_code',
        to_field='code',
        null=True,
        blank=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=0, validators=[MinValueValidator(1)])
    payment_date = models.DateField()
    is_reconciled = models.BooleanField(default=False)

    class Meta:
        unique_together = ('household', 'code')  # Đảm bảo cặp household và code là duy nhất

    def __str__(self):
        return f"{self.household} - {self.amount} - {self.payment_date}"