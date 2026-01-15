from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, generics
from .models import Category, Transaction, Budget, Income, Expense
from .serializers import CategorySerializer,RegisterSerializer, TransactionSerializer, BudgetSerializer, IncomeSerializer, ExpenseSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum
from decimal import Decimal
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny
from datetime import date





class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # 🔥 VERY IMPORTANT

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# finance/views.py
class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Income.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# finance/views.py
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Income.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MonthlyReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        month = int(request.query_params.get('month'))
        year = int(request.query_params.get('year'))

        if not month or not year:
            return Response(
                {"error": "month and year are required"},
            status=400
    )


        incomes = Income.objects.filter(
            user=user,
            date__month=month,
            date__year=year
        )

        expenses = Expense.objects.filter(
            user=user,
            date__month=month,
            date__year=year
        )

        total_income = incomes.aggregate(total=Sum('amount'))['total'] or 0
        total_expense = expenses.aggregate(total=Sum('amount'))['total'] or 0

        category_expenses = (
            expenses
            .values('category__name')
            .annotate(total=Sum('amount'))
        )

        category_data = {
            item['category__name']: item['total']
            for item in category_expenses
        }

        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "savings": total_income - total_expense,
            "category_expenses": category_data
        })
    
class BudgetUsageReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        month = request.query_params.get("month")
        year = request.query_params.get("year")

        # Validate query params
        if not month or not year:
            return Response(
                {"error": "month and year are required"},
                status=400
            )

        month = int(month)
        year = int(year)

        budgets = Budget.objects.filter(
            user=user,
            month=month,
            year=year
        ).select_related("category")

        response = []

        for budget in budgets:
            spent = (
                Expense.objects.filter(
                    user=user,
                    category=budget.category,
                    date__month=month,
                    date__year=year
                )
                .aggregate(total=Sum("amount"))
                .get("total") or 0
            )

            limit = budget.monthly_limit
            remaining = limit - spent

            # Calculate percentage
            percentage_used = int((spent / limit) * 100) if limit > 0 else 0

            # Determine status
            if spent >= limit:
                status_label = "EXCEEDED"
            elif spent >= limit * Decimal('0.8'):
                status_label = "WARNING"
            else:
                status_label = "OK"

            response.append({
                "category_id": budget.category.id,
                "category": budget.category.name,
                "limit": float(limit),
                "spent": float(spent),
                "remaining": float(remaining),
                "percentage_used": percentage_used,
                "status": status_label
            })

        return Response(response)
    
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['date', 'amount']
    ordering = ['-date']

    def get_queryset(self):
        qs = Expense.objects.filter(user=self.request.user)

        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if month and year:
            qs = qs.filter(date__month=month, date__year=year)

        return qs
    
class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['date', 'amount']
    ordering = ['-date']

    def get_queryset(self):
        qs = Income.objects.filter(user=self.request.user)

        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if month and year:
            qs = qs.filter(date__month=month, date__year=year)

        return qs

class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        if not month or not year:
            return Response(
                {"error": "month and year required"},
                status=400
            )

        month = int(month)
        year = int(year)

        total_income = Income.objects.filter(
            user=user,
            date__month=month,
            date__year=year
        ).aggregate(total=Sum('amount'))['total'] or 0

        total_expense = Expense.objects.filter(
            user=user,
            date__month=month,
            date__year=year
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "savings": total_income - total_expense
        })
    
class IncomeListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Income.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request   # 🔥 REQUIRED
        return context 
    


class MonthlySummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = int(request.GET.get("month", date.today().month))
        year = int(request.GET.get("year", date.today().year))

        income_total = (
            Income.objects
            .filter(user=request.user, date__month=month, date__year=year)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        expense_total = (
            Expense.objects
            .filter(user=request.user, date__month=month, date__year=year)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        return Response({
            "income": income_total,
            "expense": expense_total,
            "balance": income_total - expense_total
        })
    
class IncomeExpenseChartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = int(request.GET.get("month", date.today().month))
        year = int(request.GET.get("year", date.today().year))

        income = (
            Income.objects
            .filter(user=request.user, date__month=month, date__year=year)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        expense = (
            Expense.objects
            .filter(user=request.user, date__month=month, date__year=year)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        return Response([
            { "name": "Income", "amount": income },
            { "name": "Expense", "amount": expense }
        ])

class ExpenseCategoryReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = int(request.GET.get("month", date.today().month))
        year = int(request.GET.get("year", date.today().year))

        data = (
            Expense.objects
            .filter(
                user=request.user,
                date__month=month,
                date__year=year
            )
            .values("category__name")
            .annotate(total=Sum("amount"))
        )

        result = [
            {
                "category": item["category__name"],
                "total": item["total"]
            }
            for item in data
        ]

        return Response(result)
    
class BudgetUsageReportAPIView(APIView):
    def get(self, request):
        user = request.user
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        budgets = Budget.objects.filter(user=user, month=month, year=year)
        expenses = Expense.objects.filter(user=user, date__month=month, date__year=year)

        report = []
        for b in budgets:
            spent = expenses.filter(category=b.category).aggregate(total=Sum('amount'))['total'] or Decimal('0')
            usage_percent = (spent / b.monthly_limit) * 100 if b.monthly_limit > 0 else 0
            report.append({
                'category': b.category.name,
                'budget': float(b.monthly_limit),
                'spent': float(spent),
                'usage_percent': round(usage_percent, 2)
            })

        return Response(report)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)