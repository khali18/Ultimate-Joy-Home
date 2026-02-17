// Mr. J Electrical and Electronics - Main JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupFormHandlers();
    setupAnimations();
    setupMobileMenu();
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Form Handlers
function setupFormHandlers() {
    const contactForm = document.getElementById('contactForm');
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentForm);
    }
}

// Handle Contact Form
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        type: 'contact'
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
            e.target.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
        console.error('Contact form error:', error);
    }
}

// Handle Appointment Form
async function handleAppointmentForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        message: formData.get('message'),
        type: 'appointment'
    };
    
    console.log('Submitting appointment data:', data);
    
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Appointment response status:', response.status);
        
        if (response.ok) {
            showNotification('Appointment request submitted successfully! We will confirm shortly.', 'success');
            e.target.reset();
        } else {
            const errorData = await response.json();
            console.error('Appointment response error:', errorData);
            throw new Error('Failed to submit appointment');
        }
    } catch (error) {
        showNotification('Failed to submit appointment. Please try again.', 'error');
        console.error('Appointment form error:', error);
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Setup Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.service-card, .about-text, .contact-form, .info-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
}

// Product Data
const productsData = [
    {
        id: 1,
        name: 'Circuit Breaker Panel',
        category: 'electrical',
        description: 'Modern circuit breaker panel with advanced safety features and easy installation.',
        price: 2999.99,
        icon: '⚡',
        badge: 'Best Seller'
    },
    {
        id: 2,
        name: 'LED Light Bulbs Set',
        category: 'electrical',
        description: 'Energy-efficient LED bulbs with long lifespan and bright illumination.',
        price: 459.99,
        icon: '💡',
        badge: 'Eco-Friendly'
    },
    {
        id: 3,
        name: 'Solar Panel Kit',
        category: 'solar',
        description: 'Complete solar panel kit with mounting hardware and inverter.',
        price: 12999.99,
        icon: '☀️',
        badge: 'Popular'
    },
    {
        id: 4,
        name: 'Battery Charger',
        category: 'electronics',
        description: 'Universal battery charger for multiple battery types with fast charging.',
        price: 899.99,
        icon: '🔋',
        badge: 'New'
    },
    {
        id: 5,
        name: 'Electrical Tester',
        category: 'accessories',
        description: 'Professional electrical tester for voltage, current, and resistance.',
        price: 1599.99,
        icon: '🔧',
        badge: 'Pro Tool'
    },
    {
        id: 6,
        name: 'Solar Inverter',
        category: 'solar',
        description: 'High-efficiency solar inverter for grid-tie systems.',
        price: 8999.99,
        icon: '🔄',
        badge: 'Premium'
    },
    {
        id: 7,
        name: 'Wire Strippers',
        category: 'accessories',
        description: 'Professional wire strippers with multiple gauge settings.',
        price: 349.99,
        icon: '✂️',
        badge: 'Essential'
    },
    {
        id: 8,
        name: 'Smart Switch',
        category: 'electronics',
        description: 'WiFi-enabled smart switch for home automation.',
        price: 799.99,
        icon: '📱',
        badge: 'Smart Home'
    }
];

// Service Data
const servicesData = [
    {
        id: 1,
        title: 'Electrical Services',
        description: 'Complete electrical solutions for residential and commercial properties including wiring, panel upgrades, and troubleshooting.',
        icon: '⚡'
    },
    {
        id: 2,
        title: 'Electronics Repair',
        description: 'Professional repair services for all electronic devices including TVs, computers, and home appliances.',
        icon: '🔧'
    },
    {
        id: 3,
        title: 'Solar Systems',
        description: 'Design, installation, and maintenance of solar panel systems for energy-efficient solutions.',
        icon: '☀️'
    },
    {
        id: 4,
        title: 'Solar Repair',
        description: 'Expert repair and maintenance services for existing solar systems to ensure optimal performance.',
        icon: '🔋'
    },
    {
        id: 5,
        title: 'Emergency Services',
        description: '24/7 emergency electrical and solar services for urgent repairs and system failures.',
        icon: '🚨'
    },
    {
        id: 6,
        title: 'Consultation',
        description: 'Professional consultation for energy efficiency, system design, and technology upgrades.',
        icon: '💡'
    }
];

// Load Products
function loadProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = '';
        productsData.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        // Setup filter buttons
        setupProductFilters();
    }
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;
    card.innerHTML = `
        <div class="product-image">
            ${product.icon}
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <span class="product-category">${product.category}</span>
            <p class="product-description">${product.description}</p>
            <div class="product-price">GHS ${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="product-btn btn-primary" onclick="buyProduct(${product.id})">Buy Now</button>
                <button class="product-btn btn-secondary" onclick="viewProduct(${product.id})">View Details</button>
            </div>
        </div>
    `;
    return card;
}

// Setup Product Filters
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            // Filter products
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Buy Product
function buyProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        // In a real application, this would add to cart or redirect to checkout
        showNotification(`${product.name} added to cart!`, 'success');
        
        // Scroll to contact section for order inquiry
        setTimeout(() => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            showNotification('Please contact us to complete your purchase.', 'info');
        }, 2000);
    }
}

// View Product Details
function viewProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        alert(`Product Details:\n\nName: ${product.name}\nCategory: ${product.category}\nPrice: GHS ${product.price.toFixed(2)}\n\n${product.description}\n\nContact us to order this product!`);
    }
}

// Load Services
function loadServices() {
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.innerHTML = '';
        servicesData.forEach(service => {
            const serviceCard = createServiceCard(service);
            servicesGrid.appendChild(serviceCard);
        });
    }
}

// Create Service Card
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
        <div class="service-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <button class="cta-button" onclick="bookService('${service.title}')">Book Service</button>
    `;
    return card;
}

// Book Service
function bookService(serviceName) {
    const appointmentForm = document.getElementById('appointmentForm');
    const serviceSelect = document.getElementById('service');
    
    if (appointmentForm && serviceSelect) {
        serviceSelect.value = serviceName;
        appointmentForm.scrollIntoView({ behavior: 'smooth' });
        showNotification(`Selected service: ${serviceName}`, 'info');
    } else {
        showNotification('Please navigate to the contact section to book this service.', 'info');
    }
}

// Utility Functions
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && !validatePhone(input.value)) {
            showError(input, 'Please enter a valid phone number');
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

// Show Error
function showError(input, message) {
    clearError(input);
    
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = '#ef4444';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';
    
    input.style.borderColor = '#ef4444';
    input.parentNode.appendChild(error);
}

// Clear Error
function clearError(input) {
    input.style.borderColor = '';
    const error = input.parentNode.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

// Initialize services and products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    loadProducts();
});

// Export functions for global access
window.bookService = bookService;
window.showNotification = showNotification;
window.buyProduct = buyProduct;
window.viewProduct = viewProduct;
