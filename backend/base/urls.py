from base import views
from django.contrib import admin
from django.urls import path


urlpatterns = [
    path('admin', admin.site.urls),

    path('register', views.register),
    path('login', views.MyTokenObtainPairView.as_view()),
    path('refresh-token', views.refresh_token),
    path('api/password-reset/', views.password_reset_request, name='password_reset_request'),
    path('api/password-reset/confirm/<int:user_id>/<str:token>/', views.password_reset_confirm, name='password_reset_confirm'),

    path('products/',views.products_public),
    path('products/<int:id>',views.products_public),
    path('authproducts', views.products),
    path('authproducts/<int:id>', views.products),
    path('orders', views.OrderListCreate.as_view(), name='order-list-create'),

    # path('create-category', views.CreateCategoryView.as_view()),

]
