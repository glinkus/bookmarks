from django.db import models
from django.contrib.auth.models import User

class Workspace(models.Model):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class Bookmark(models.Model):
    url = models.URLField();
    title = models.CharField(max_length=50)
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('redirect', 'Redirect'),
            ('dead', 'Dead'),
        ],
        default='active'
    )
    tags = models.ManyToManyField(Tag, blank=True)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
