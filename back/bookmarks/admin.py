from django.contrib import admin
from .models import Workspace, Tag, Bookmark

admin.site.register(Workspace)
admin.site.register(Tag)
admin.site.register(Bookmark)
# Register your models here.
