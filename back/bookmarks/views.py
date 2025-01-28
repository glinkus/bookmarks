from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Tag, Workspace, Bookmark
from .serializer import TagSerializer, WorkspaceSerializer, BookmarkSerializer
from django.http import Http404
from django.contrib.auth.models import User
from django.db import models

class WorkspaceList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        workspaces = Workspace.objects.filter(user=request.user)
        serializer = WorkspaceSerializer(workspaces, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = WorkspaceSerializer(data=data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class WorkspaceDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            return Workspace.objects.get(pk=pk, user=self.request.user)
        except Workspace.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        workspace = self.get_object(pk)
        serializer = WorkspaceSerializer(workspace)
        return Response(serializer.data)
    
    def put(self, request, pk):
        workspace = self.get_object(pk)
        serializer = WorkspaceSerializer(workspace, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        workspace = self.get_object(pk)
        workspace.delete()
        return Response({'message': 'Wokspace deleted'}, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        workspace = self.get_object(pk)
        serializer = WorkspaceSerializer(workspace, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Tag
class TagList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tag = Tag.objects.all()
        serializer = TagSerializer(tag, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data
        serializer = TagSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TagDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            return Tag.objects.get(pk=pk)
        except Tag.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        tag = self.get_object(pk)
        serializer = TagSerializer(tag)
        return Response(serializer.data)
    
    def put(self, request, pk):
        tag = self.get_object(pk)
        serializer = TagSerializer(tag, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        tag = self.get_object(pk)
        tag.delete()
        return Response({'message': 'Tag deleted'}, status=status.HTTP_200_OK)
    
#Bookmarks
class BookmarkList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        workspace_id = request.query_params.get('workspace_id')
        if not workspace_id:
            return Response({"error": "Add workspace ID."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            workspace = Workspace.objects.get(id=workspace_id, user=request.user)
        except Workspace.DoesNotExist:
            return Response({'error': 'Did not find workspace'}, status=status.HTTP_404_NOT_FOUND)

        bookmarks = Bookmark.objects.filter(workspace=workspace)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data
        print(data)
        try:
            workspace = Workspace.objects.get(id=data.get('workspace'), user=request.user)
        except Workspace.DoesNotExist:
            return Response({'error': 'Did not find workspace'}, status=status.HTTP_400_BAD_REQUEST)
        
        data['workspace'] = workspace.id

        serilizer = BookmarkSerializer(data=data)
        if serilizer.is_valid():
            serilizer.save()
            return Response(serilizer.data, status=status.HTTP_200_OK)
        return Response(serilizer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookmarkDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Bookmark.objects.get(pk=pk, workspace__user=self.request.user)
        except Bookmark.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        bookmark = self.get_object(pk)
        serializer = BookmarkSerializer(bookmark)
        return Response(serializer.data)
    
    def put(self, request, pk):
        bookmark = self.get_object(pk)
        data = request.data
        print("Before try")
        try:
            workspace = Workspace.objects.get(id=data.get('workspace'), user=request.user)
        except Workspace.DoesNotExist:
            print("Does not exist")
            return Response({'error': 'Did not find workspace'}, status=status.HTTP_400_BAD_REQUEST)

        data['workspace'] = workspace.id
        serializer = BookmarkSerializer(bookmark, data=data)

        if serializer.is_valid():
            serializer.save()
            print("Valid")
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def delete(self, request, pk):
        bookmark = self.get_object(pk)
        bookmark.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'enter username and password'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username):
            return Response({'error': 'username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, password=password)
        return Response({'message': 'new user created'}, status=status.HTTP_201_CREATED)

class SearchBookmarks(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("query", "")
        if not query:
            return Response({"error": "Must include smth."}, status=status.HTTP_400_BAD_REQUEST)

        bookmarks = Bookmark.objects.filter(
            workspace__user=request.user
        ).filter(
            models.Q(title__icontains=query) |
            models.Q(url__icontains=query) |
            models.Q(tags__name__icontains=query)
        ).distinct()

        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)

    
