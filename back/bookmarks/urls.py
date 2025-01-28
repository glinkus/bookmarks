from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import WorkspaceList, WorkspaceDetail
from .views import BookmarkList, BookmarkDetail
from .views import TagList, TagDetail
from .views import RegisterView
from .views import SearchBookmarks

urlpatterns = [
    path('workspaces/', WorkspaceList.as_view(), name='workspace-list'),
    path('workspaces/<int:pk>/', WorkspaceDetail.as_view(), name='workspace-detail'),
    path('bookmarks/', BookmarkList.as_view(), name='bookmark-list'),
    path('bookmarks/<int:pk>/', BookmarkDetail.as_view(), name='bookmark-detail'),
    path('tag/', TagList.as_view(), name='tag-list'),
    path('tag/<int:pk>/', TagDetail.as_view(), name='tag-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('search/bookmarks/', SearchBookmarks.as_view(), name='search-bookmarks'),
]
