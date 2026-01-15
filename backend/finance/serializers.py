from rest_framework import serializers


from .models import Category, Income, Transaction, Budget, Expense

from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['user']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user']


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['user']

# finance/serializers.py
class IncomeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Income
        fields = ["id", "category", "category_name", "amount", "date", "note"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        if user.is_anonymous:
            raise serializers.ValidationError("Authentication required")

        return Income.objects.create(user=user, **validated_data)


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ["id", "amount", "category", "date", "note", "category_name"]

    category_name = serializers.CharField(source="category.name", read_only=True)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Budget
        fields = "__all__"
        read_only_fields = ["user"]

class BudgetUsageSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name')
    spent = serializers.SerializerMethodField()
    usage_percent = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = ['category', 'budget', 'spent', 'usage_percent']

    def get_spent(self, obj):
        month = obj.month
        year = obj.year
        # sum all expenses for this user/category/month/year
        return Expense.objects.filter(
            user=obj.user,
            category=obj.category,
            date__month=month,
            date__year=year
        ).aggregate(total=models.Sum('amount'))['total'] or 0

    def get_usage_percent(self, obj):
        spent = self.get_spent(obj)
        return round(spent / obj.monthly_limit * 100, 2) if obj.monthly_limit else 0 
    
class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Budget
        fields = "__all__"

