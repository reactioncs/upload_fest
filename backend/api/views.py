from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .forms import *
from .serializers import *
from .models import *


@api_view(["GET"])
def get_images_api(request):
    images = ImageModel.objects.all()

    serializer = ImageModelSerializer(images, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def upload_api(request):
    form = ImageModelForm(request.POST, request.FILES)
    if not form.is_valid():
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    
    image = form.save()
    serializer = ImageModelSerializer(image)
    
    return Response(serializer.data, status=status.HTTP_200_OK)
