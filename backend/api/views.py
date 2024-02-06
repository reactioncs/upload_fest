from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from drf_spectacular.utils import extend_schema

from .serializers import *
from .models import *

@extend_schema(responses=ImageModelSerializer)
class ImageListApi(APIView):
    """
    Get all saved images.
    """

    def get(self, request):
        serializer = ImageModelSerializer(ImageModel.objects.all().order_by('created'), many=True)
        return Response(serializer.data)


# The FileField and ImageField classes are only suitable for use with MultiPartParser or FileUploadParser.
# Most parsers, such as e.g. JSON don't support file uploads.
# Django's regular FILE_UPLOAD_HANDLERS are used for handling uploaded files.
class ImageUploadApi(generics.CreateAPIView):
    """
    Upload one image.
    """

    authentication_classes = []
    serializer_class = ImageModelSerializer


@extend_schema(responses=None)
class ImageDeleteApi(generics.DestroyAPIView):
    """
    Delete one image.
    """

    authentication_classes = []

    def destroy(self, request, id):
        try:
            image = ImageModel.objects.get(id=id)
        except ImageModel.DoesNotExist:
            return Response("Image does not exist!", status=status.HTTP_404_NOT_FOUND)
        except ValidationError as err:
            return Response(err.message, status=status.HTTP_400_BAD_REQUEST)

        self.perform_destroy(image)
        return Response(status=status.HTTP_204_NO_CONTENT)
