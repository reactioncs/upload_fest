from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError

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


@api_view(["DELETE"])
def delete_api(request, id):
    try:
        image = ImageModel.objects.get(id=id)
    except ImageModel.DoesNotExist:
        return Response("Image does not exist!", status=status.HTTP_404_NOT_FOUND)
    except ValidationError as err:
        return Response(err.message, status=status.HTTP_400_BAD_REQUEST)
    
    image.delete()

    return Response("Delete successful.", status=status.HTTP_200_OK)
