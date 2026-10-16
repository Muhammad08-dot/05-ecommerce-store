from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Email-based manager — username is derived from the email address."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('An email address is required.')
        extra_fields.setdefault('username', email)
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Storefront customer. `role` distinguishes shoppers from staff."""

    class Role(models.TextChoices):
        CUSTOMER = 'customer', 'Customer'
        ADMIN = 'admin', 'Admin'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CUSTOMER)

    # Keep username optional — customers sign up with email.
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN or self.is_superuser

    def save(self, *args, **kwargs):
        if not self.username and self.email:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email
