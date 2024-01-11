from django.urls import path
from .views import *

urlpatterns = [
    path("images/", get_images_api),
    path("upload/", upload_api),
]
