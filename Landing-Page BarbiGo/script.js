// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de navegación
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // Menú móvil
    burger.addEventListener('click', function() {
        // Alternar navegación
        nav.classList.toggle('nav-active');
        
        // Animar links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Animar burger
        burger.classList.toggle('nav-active');
    });
    
    // Suavizar scroll para links de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('nav-active');
                }
            }
        });
    });
    
    // Filtrar productos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase activa al botón actual
            this.classList.add('active');
            
            // Obtener la categoría del filtro
            const filterValue = this.getAttribute('data-filter');
            
            // Filtrar productos
            productCards.forEach(card => {
                if (filterValue === 'todos') {
                    card.style.display = 'block';
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // Funcionalidad para añadir productos al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    
    let cartItems = 0;
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Incrementar el contador del carrito
            cartItems++;
            cartCount.textContent = cartItems;
            
            // Obtener información del producto
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Animación para el botón
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // Mostrar mensaje de éxito (opcional)
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.innerHTML = `<p>¡${productName} agregado al carrito!</p>`;
            document.body.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                successMessage.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 300);
            }, 2000);
        });
    });
    
    // Validación del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores de los campos
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Aquí se puede agregar lógica para enviar el formulario por AJAX
            // Por ahora, solo mostramos un mensaje de éxito
            
            // Limpiar el formulario
            contactForm.reset();
            
            // Mostrar mensaje de éxito
            alert('¡Gracias por contactarnos! Te responderemos a la brevedad posible.');
        });
    }
    
    // Validación del formulario de newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener el valor del email
            const email = this.querySelector('input[type="email"]').value;
            
            // Aquí se puede agregar lógica para enviar la suscripción por AJAX
            
            // Limpiar el formulario
            newsletterForm.reset();
            
            // Mostrar mensaje de éxito
            alert('¡Gracias por suscribirte a nuestro boletín!');
        });
    }
    
    // Efecto de scroll para navbar
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Animación de aparición para secciones
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Testimonios - scroll automático (versión simplificada)
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (testimonials.length > 1) {
        setInterval(() => {
            testimonials.forEach(testimonial => {
                testimonial.style.opacity = '0';
            });
            
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.opacity = '1';
        }, 5000);
    }
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