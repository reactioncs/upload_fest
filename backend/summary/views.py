from django.shortcuts import render
from api.models import ImageModel


def summary_view(request):
    images = ImageModel.objects.all()
    context = {"images": images, "meta": request.META}
    return render(request, "summary.html", context)
