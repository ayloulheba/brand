from django.contrib import admin
from .models import CarouselSlide, Service, Testimonial, ContactForm, ContactInfo,About, Category, Product, ProductImage, Color, Size

@admin.register(CarouselSlide)
class CarouselSlideAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')
    
    
@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')    

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'icon_class')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'company_name')

@admin.register(ContactForm)
class ContactFormAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message')

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('phone', 'email', 'address')

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ColorInline(admin.TabularInline):
    model = Color
    extra = 1

class SizeInline(admin.TabularInline):
    model = Size
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline, ColorInline, SizeInline]

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage)
admin.site.register(Color)
admin.site.register(Size)
