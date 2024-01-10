from django.urls import path
from .views import *

urlpatterns = [
    path("names/", names_api),
]
