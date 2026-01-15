from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BudgetUsageReportAPIView, CategoryViewSet, DashboardAPIView, IncomeExpenseChartAPIView, MonthlyReportAPIView, RegisterAPIView, TransactionViewSet, BudgetViewSet, IncomeViewSet, ExpenseViewSet, ExpenseCategoryReportAPIView
from .views import MonthlySummaryAPIView





router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='categories')
router.register('transactions', TransactionViewSet, basename='transactions')
router.register('budgets', BudgetViewSet, basename='budgets')
# finance/urls.py
router.register('income', IncomeViewSet, basename='income')
router.register('expenses', ExpenseViewSet, basename='expenses')
router.register(r'budget', BudgetViewSet, basename='budget')


urlpatterns = router.urls
urlpatterns += [
    path('reports/monthly/', MonthlyReportAPIView.as_view(),name='monthly-report'),
    path('reports/budget-usage/', BudgetUsageReportAPIView.as_view(), name='budget-usage'),
    path('dashboard/', DashboardAPIView.as_view()),
    path("register/", RegisterAPIView.as_view()),
    path("reports/summary/", MonthlySummaryAPIView.as_view()),
    path("reports/income-expense/", IncomeExpenseChartAPIView.as_view()),
    path("reports/expense-by-category/", ExpenseCategoryReportAPIView.as_view()),
    path('budget/', BudgetUsageReportAPIView.as_view(), name='budget'),

]