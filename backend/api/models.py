from django.db import models
import uuid
import os


def save_file(instance, filename):
    _, ext = os.path.splitext(filename)
    return f"{instance.id}{ext}"


class ImageModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=64)
    file = models.FileField(upload_to=save_file)

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.file.delete()
        return super().delete(*args, **kwargs)
