from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, DoctorProfile

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active')
    list_filter = ('role', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone_number', 'profile_picture', 'address', 'date_of_birth')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(DoctorProfile)

