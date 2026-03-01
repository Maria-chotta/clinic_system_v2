from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('doctors/', views.DoctorListView.as_view(), name='doctor-list'),
    path('doctors/<int:id>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('doctor-profile/', views.DoctorProfileView.as_view(), name='doctor-profile'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('doctors/<int:user_id>/update/', views.AdminUpdateDoctorView.as_view(), name='admin-update-doctor'),
    
    # JWT Token URLs
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
