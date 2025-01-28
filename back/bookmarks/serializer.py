from rest_framework import serializers
from .models import Workspace, Tag, Bookmark

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = '__all__'
    
    def create(self, validated_data):
        user = validated_data.pop('user')
        workspace = Workspace.objects.create(user=user, **validated_data)
        return workspace

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class BookmarkSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True)
    workspace = serializers.PrimaryKeyRelatedField(queryset=Workspace.objects.all())

    class Meta:
        model = Bookmark
        fields = ['id', 'url', 'title', 'status', 'tags', 'workspace']

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        bookmark = Bookmark.objects.create(**validated_data)
        bookmark.tags.set(tags)
        return bookmark

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tags'] = TagSerializer(instance.tags.all(), many=True).data
        return representation


