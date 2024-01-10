from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import uuid


@api_view(["GET"])
def names_api(request):
    names = [
        "Hubert Adkins",
        "Vivian Maxwell",
        "Emmett King",
        "Alexander Hunter",
        "Thelma Mcgee",
        "Rachael Cunningham",
        "Angelina Cole",
    ]

    response = map(lambda name: {"id": str(uuid.uuid4()), "name": name}, names)

    return Response(response, status=status.HTTP_200_OK)
