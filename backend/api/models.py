from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
import uuid
import os

ext_validator = FileExtensionValidator(["png", "jpg", "webp"])


def size_validator(file):
    if file.size > 10 * 1024 * 1024:
        raise ValidationError("Size exceeds 10M.")


def save_file(instance, filename):
    _, ext = os.path.splitext(filename)
    return f"{instance.id}{ext}"


class ImageModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=64)
    file = models.FileField(upload_to=save_file, validators=[size_validator, ext_validator])
    created = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.file.delete()
        return super().delete(*args, **kwargs)
