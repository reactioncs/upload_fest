from rest_framework import serializers
from .models import *


class ImageModelSerializer(serializers.ModelSerializer):
    url = serializers.FileField(source="file")

    class Meta:
        model = ImageModel
        fields = ["id", "title", "url"]