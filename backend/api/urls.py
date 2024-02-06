from django.urls import path
from .views import *

urlpatterns = [
    path("images/", ImageListApi.as_view()),
    path("upload/", ImageUploadApi.as_view()),
    path("delete/<slug:id>", ImageDeleteApi.as_view())
]
