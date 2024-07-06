# -*- coding: utf-8 -*-
from django.urls import path
from . import views

urlpatterns = [
      path('', views.home, name='home'),
      path('our-products/', views.product_list, name='products'),
      path('category/<str:category_name>/', views.category_products, name='category-products'),

      path('product/<int:pk>/', views.product_detail, name='product_detail'),
      path('add-to-basket/', views.add_to_basket, name='add_to_basket'),
      path('view-basket/', views.view_basket, name='view_basket'),
      path('delete_basket_item/<int:item_id>/', views.delete_basket_item, name='delete_basket_item'),
      path('edit_basket_item/<int:item_id>/', views.edit_basket_item, name='edit_basket_item'),
      path('clear_basket/', views.clear_basket, name='clear_basket'),
      

      

      
      
]