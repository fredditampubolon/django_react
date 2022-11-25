from re import L
from django.db import models


class ToDo(models.Model):
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=30)
    checked = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title