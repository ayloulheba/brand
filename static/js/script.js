function changeImage(imageSrc) {
    document.getElementById('main-image').src = imageSrc;
}

document.querySelector('.quantity-btn.minus').addEventListener('click', function() {
    const input = this.nextElementSibling;
    if (input.value > 1) input.value--;
});

document.querySelector('.quantity-btn.plus').addEventListener('click', function() {
    const input = this.previousElementSibling;
    input.value++;
});

function calculateItemTotal(quantity, price) {
    return quantity * price;
}

document.getElementById('quantity').addEventListener('change', function() {
    const quantity = parseInt(this.value);
    const price = parseFloat("{{ product.price }}"); // Assuming product price is in decimal format
    const total = calculateItemTotal(quantity, price);
    document.getElementById('modal-price').textContent = `Total: $${total.toFixed(2)}`;
});

function calculateTotalBill(items) {
    let total = 0;
    items.forEach(item => {
        const quantity = parseInt(item.quantity);
        const price = parseFloat(item.price);
        total += quantity * price;
    });
    return total.toFixed(2);
}

const basketLink = document.getElementById('basket-link');
basketLink.addEventListener('click', function() {
    $.ajax({
        type: "GET",
        url: "{% url 'view_basket' %}",
        success: function(response) {
            const basketItemsDiv = document.getElementById('basket-items');
            basketItemsDiv.innerHTML = ''; // Clear previous items

            if (response.basket.length > 0) {
                response.basket.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'basket-item';
                    itemDiv.innerHTML = `
                        <p>Product: ${item.product_name}</p>
                        <p>Price: ${item.price}</p>
                        <p>Color: ${item.color}</p>
                        <p>Size: ${item.size}</p>
                        <p>Quantity: <input type="number" value="${item.quantity}" onchange="editBasketItem(${item.product_id}, this.value)"></p>
                        <button onclick="deleteBasketItem(${item.product_id})" class="delete-icon">🗑️</button>
                        <button onclick="editBasketItem(${item.product_id}, this.value)" class="edit-icon">✏️</button>
                    `;
                    basketItemsDiv.appendChild(itemDiv);
                });

                const totalBill = calculateTotalBill(response.basket);
                const totalBillDiv = document.createElement('div');
                totalBillDiv.innerHTML = `<p>Total Bill: $${totalBill}</p>`;
                document.getElementById('total-bill').innerHTML = '';
                document.getElementById('total-bill').appendChild(totalBillDiv);

                basketModal.style.display = "block";
            } else {
                alert('Basket is empty');
            }
        }
    });
});

function addToBasket() {
    const product_id = "{{ product.id }}";
    const quantity = document.getElementById('quantity').value;
    const color = document.getElementById('color') ? document.getElementById('color').value : 'N/A';
    const size = document.getElementById('size') ? document.getElementById('size').value : 'N/A';

    $.ajax({
        type: "POST",
        url: "{% url 'add_to_basket' %}",
        data: {
            product_id: product_id,
            quantity: quantity,
            color: color,
            size: size,
            csrfmiddlewaretoken: '{{ csrf_token }}'
        },
        success: function(response) {
            alert(response.message);
        }
    });
}

document.querySelector('.add-to-cart').addEventListener('click', function() {
    addToBasket();
});

function editBasketItem(productId, newQuantity) {
    $.ajax({
        type: "POST",
        url: "{% url 'edit_basket_item' %}",
        data: {
            product_id: productId,
            quantity: newQuantity,
            csrfmiddlewaretoken: '{{ csrf_token }}'
        },
        success: function(response) {
            if (response.success) {
                basketLink.click(); // Reload basket data after edit
            } else {
                alert('Failed to edit item');
            }
        }
    });
}

// JavaScript function for deleting basket item
function deleteBasketItem(productId) {
    $.ajax({
        type: "POST",
        url: "{% url 'delete_basket_item' %}",
        data: JSON.stringify({'product_id': productId}),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                basketLink.click(); // Reload basket data after delete
            } else {
                alert('Failed to delete item: ' + response.error);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            alert('Error deleting item');
            console.error(xhr.responseText);
        }
    });
}


function sendBillViaWhatsApp() {
    const basketItemsDiv = document.getElementById('basket-items');
    const country = document.getElementById('checkout-country').value;
    const address = document.getElementById('checkout-address').value;
    const phone = document.getElementById('checkout-phone').value;

    let message = `Checkout details:\nCountry: ${country}\nAddress: ${address}\nPhone: ${phone}\n\nItems:\n`;
    
    const basketItems = basketItemsDiv.querySelectorAll('.basket-item');
    basketItems.forEach(item => {
        const product = item.querySelector('p:nth-child(1)').textContent.split(': ')[1];
        const price = item.querySelector('p:nth-child(2)').textContent.split(': ')[1];
        const color = item.querySelector('p:nth-child(3)').textContent.split(': ')[1];
        const size = item.querySelector('p:nth-child(4)').textContent.split(': ')[1];
        const quantity = item.querySelector('p:nth-child(5)').querySelector('input').value;
        message += `Product: ${product}\nPrice: ${price}\nColor: ${color}\nSize: ${size}\nQuantity: ${quantity}\n\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    const companyPhoneNumber = '9647808437905';
    const whatsappUrl = `https://wa.me/${companyPhoneNumber}?text=${encodedMessage}`;

    // Send the WhatsApp message
    window.open(whatsappUrl, '_blank');
}

const basketModal = document.getElementById('basketModal');
const closeBasketBtn = document.querySelector('.close-basket');

closeBasketBtn.onclick = function() {
    basketModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == basketModal) {
        basketModal.style.display = "none";
    }
}