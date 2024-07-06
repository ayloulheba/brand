from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

from .models import CarouselSlide, Service, Testimonial, ContactInfo,About,Product, Category

def home(request):
    slides = CarouselSlide.objects.all()
    about = About.objects.first()
    services = Service.objects.all()
    testimonials = Testimonial.objects.all()
    contact_info = ContactInfo.objects.first()
    products = Product.objects.all()

    categories = Category.objects.all()
    products_per_slide = 4
    
    # Calculate number of dots based on products count and products_per_slide
    products_count = products.count()
    dots_count = max(1, int((products_count + products_per_slide - 1) / products_per_slide))
        
    context = {
        'slides': slides,
        'about':about,
        'services': services,
        'testimonials': testimonials,
        'contact_info': contact_info,
        'products': products, 
        'dots': range(1, dots_count + 1),  # Generate range of dots
        'categories':categories
    }
    return render(request, 'index.html', context)

def category_products(request, category_name):
    # Assuming 'Product' model has a 'category' field
    products = Product.objects.filter(category__name=category_name)  # Filter products by category name
    
    context = {
        'category_name': category_name,
        'products': products,
    }
    return render(request, 'our-products.html', context)


def product_list(request):
    categories = Category.objects.all()
    products = Product.objects.all()
    return render(request, 'our-products.html', {'categories': categories, 'products': products})



def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'single-product.html', {'product': product})

@csrf_exempt
def add_to_basket(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = request.POST.get('quantity')
        color = request.POST.get('color')
        size = request.POST.get('size')

        if not all([product_id, quantity]):
            return JsonResponse({'error': 'Product ID and quantity are required'}, status=400)

        try:
            quantity = int(quantity)
        except ValueError:
            return JsonResponse({'error': 'Invalid quantity'}, status=400)

        product = get_object_or_404(Product, id=product_id)
        basket = request.session.get('basket', [])

        basket_item = {
            'product_id': product.id,
            'product_name': product.name,
            'price': str(product.price),
            'color': color,
            'size': size,
            'quantity': quantity
        }

        basket.append(basket_item)
        request.session['basket'] = basket

        return JsonResponse({'message': 'Item added to basket'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def view_basket(request):
    basket = request.session.get('basket', [])
    return JsonResponse({'basket': basket})


@require_POST
def delete_basket_item(request, item_id):
    basket = request.session.get('basket', {})
    
    if str(item_id) in basket:
        del basket[str(item_id)]
        request.session['basket'] = basket
        return JsonResponse({'success': True, 'message': 'Item deleted successfully'})
    else:
        return JsonResponse({'success': False, 'error': 'Item not found in basket'}, status=404)

@require_POST
def edit_basket_item(request, item_id):
    quantity = int(request.POST.get('quantity', 1))
    basket = request.session.get('basket', {})

    if str(item_id) in basket:
        basket[str(item_id)]['quantity'] = quantity
        request.session['basket'] = basket
        return JsonResponse({'success': True, 'message': 'Item quantity updated successfully'})
    else:
        return JsonResponse({'success': False, 'error': 'Item not found in basket'}, status=404)
    
    
def clear_basket(request):
    try:
        del request.session['basket']
        return JsonResponse({'success': True})
    except KeyError:
        return JsonResponse({'success': False, 'error': 'Basket not found in session'}, status=404)    