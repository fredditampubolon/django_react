from django.contrib import admin

from todo.models import ToDo


@admin.register(ToDo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ['title', 'checked', 'created']
