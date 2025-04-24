// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrito
    initCart();
    
    // Navegación móvil
    setupMobileNav();
    
    // Configurar filtros de productos
    setupProductFilters();
    
    // Configurar sliders de testimonios
    setupTestimonialSlider();
    
    // Configurar formulario de contacto
    setupContactForm();
    
    // Configurar el boletín de noticias
    setupNewsletter();
    
    // Inicializar el modal del carrito
    setupCartModal();
});

// Función para inicializar el carrito
function initCart() {
    // Obtener el carrito del localStorage o crear uno nuevo
    let cart = JSON.parse(localStorage.getItem('barbigo-cart')) || [];
    
    // Actualizar el contador del carrito
    updateCartCount(cart);
    
    // Configurar los botones de añadir al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Comprobar si el producto ya está en el carrito
            const existingProductIndex = cart.findIndex(item => item.id === productId);
            
            if (existingProductIndex > -1) {
                // Incrementar la cantidad si ya existe
                cart[existingProductIndex].quantity += 1;
            } else {
                // Añadir nuevo producto al carrito
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Guardar el carrito en localStorage
            localStorage.setItem('barbigo-cart', JSON.stringify(cart));
            
            // Actualizar el contador del carrito
            updateCartCount(cart);
            
            // Mostrar notificación
            showNotification(`${productName} añadido al carrito`);
            
            // Actualizar el modal del carrito si está abierto
            if (document.getElementById('cart-modal').style.display === 'block') {
                displayCartItems(cart);
            }
        });
    });
}

// Función para actualizar el contador del carrito
function updateCartCount(cart) {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Mostrar u ocultar el contador según si hay items
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

// Configurar navegación móvil
function setupMobileNav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Alternar navegación
        nav.classList.toggle('nav-active');
        
        // Animar enlaces
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Animar hamburguesa
        burger.classList.toggle('toggle');
    });
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        });
    });
}

// Configurar filtros de productos
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase activa al botón clickeado
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filtrar productos
            productCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Configurar slider de testimonios
function setupTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (!slider || testimonials.length <= 3) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Velocidad de scroll
        slider.scrollLeft = scrollLeft - walk;
    });
    
    // Auto scroll para móviles
    let scrollInterval;
    
    function startAutoScroll() {
        scrollInterval = setInterval(() => {
            slider.scrollLeft += 2; // Velocidad de scroll
            
            // Reiniciar cuando llegue al final
            if (slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth)) {
                slider.scrollLeft = 0;
            }
        }, 30);
    }
    
    function stopAutoScroll() {
        clearInterval(scrollInterval);
    }
    
    // Iniciar auto scroll en móviles
    if (window.innerWidth <= 768) {
        startAutoScroll();
    }
    
    // Detener scroll al interactuar
    slider.addEventListener('touchstart', stopAutoScroll);
    slider.addEventListener('mousedown', stopAutoScroll);
    
    // Reiniciar scroll después de interactuar
    slider.addEventListener('touchend', () => {
        if (window.innerWidth <= 768) {
            setTimeout(startAutoScroll, 5000);
        }
    });
    
    slider.addEventListener('mouseup', () => {
        if (window.innerWidth <= 768) {
            setTimeout(startAutoScroll, 5000);
        }
    });
    
    // Ajustar en cambio de tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            startAutoScroll();
        } else {
            stopAutoScroll();
        }
    });
}

// Configurar formulario de contacto
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Validación simple
        if (!name || !email || !message) {
            showNotification('Por favor complete todos los campos', 'error');
            return;
        }
        
        // Aquí iría el código para enviar el formulario a un servidor
        // Por ahora solo mostraremos una notificación de éxito
        
        // Resetear formulario
        contactForm.reset();
        
        // Mostrar mensaje de éxito
        showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
    });
}

// Configurar boletín de noticias
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (!email) {
            showNotification('Por favor ingrese su email', 'error');
            return;
        }
        
        // Aquí iría el código para suscribir al newsletter
        
        // Resetear formulario
        this.reset();
        
        // Mostrar mensaje de éxito
        showNotification('¡Gracias por suscribirse a nuestro boletín!');
    });
}

// Configurar modal del carrito
function setupCartModal() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!cartIcon || !cartModal || !closeModal) return;
    
    // Abrir modal al hacer clic en el icono del carrito
    cartIcon.addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('barbigo-cart')) || [];
        displayCartItems(cart);
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    });
    
    // Cerrar modal al hacer clic en la X
    closeModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Habilitar scroll
    });
    
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Habilitar scroll
        }
    });
    
    // Configurar botón de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('barbigo-cart')) || [];
            
            if (cart.length === 0) {
                showNotification('Su carrito está vacío', 'error');
                return;
            }
            
            // Aquí iría el código para procesar el checkout
            // Por ahora solo mostraremos una notificación
            
            showNotification('¡Gracias por su compra! Procesando pedido...');
            
            // Limpiar carrito
            localStorage.removeItem('barbigo-cart');
            updateCartCount([]);
            
            // Cerrar modal
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
}

// Mostrar items del carrito en el modal
function displayCartItems(cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    // Limpiar contenedor
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Su carrito está vacío</p>';
        cartTotalElement.textContent = '$0';
        return;
    }
    
    // Calcular total
    let total = 0;
    
    // Añadir cada item al modal
    cart.forEach(item => {
        // Extraer solo el número del precio
        const priceString = item.price.replace(/[^\d]/g, '');
        const price = parseInt(priceString);
        
        // Añadir al total
        total += price * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price}</p>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                <span class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </span>
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Mostrar total formateado
    cartTotalElement.textContent = `$${total.toLocaleString()}`;
    
    // Configurar botones de cantidad
    setupQuantityButtons();
}

// Configurar botones de cantidad
function setupQuantityButtons() {
    const increaseButtons = document.querySelectorAll('.increase');
    const decreaseButtons = document.querySelectorAll('.decrease');
    const removeButtons = document.querySelectorAll('.remove-item');
    
    // Aumentar cantidad
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            updateItemQuantity(productId, 1);
        });
    });
    
    // Disminuir cantidad
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            updateItemQuantity(productId, -1);
        });
    });
    
    // Eliminar item
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            removeCartItem(productId);
        });
    });
}

// Actualizar cantidad de item
function updateItemQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('barbigo-cart')) || [];
    
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex > -1) {
        cart[productIndex].quantity += change;
        
        // Eliminar item si la cantidad es 0 o menos
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }
        
        // Guardar cambios
        localStorage.setItem('barbigo-cart', JSON.stringify(cart));
        
        // Actualizar la visualización
        updateCartCount(cart);
        displayCartItems(cart);
    }
}

// Eliminar item del carrito
function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem('barbigo-cart')) || [];
    
    const updatedCart = cart.filter(item => item.id !== productId);
    
    // Guardar cambios
    localStorage.setItem('barbigo-cart', JSON.stringify(updatedCart));
    
    // Actualizar la visualización
    updateCartCount(updatedCart);
    displayCartItems(updatedCart);
}

// Mostrar notificaciones
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Añadir a la página
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Configurar botón de cierre
    const closeButton = notification.querySelector('.close-notification');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto cerrar después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Smooth scroll para links de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Ajustar por el header fijo
                behavior: 'smooth'
            });
        }
    });
});

// Añadir estilos CSS adicionales para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .appear {
        opacity: 1;
        transform: translateY(0);
    }
    
    .success-message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s;
    }
    
    .success-message.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .add-to-cart.clicked {
        animation: pulse 0.3s;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    
    header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .testimonial {
        transition: opacity 0.6s ease;
    }
`;

document.head.appendChild(style); 