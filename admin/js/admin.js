// Ultimate Joy Home - Admin Panel JavaScript

// Global Variables
let currentSection = 'dashboard';
let appointments = [];
let contacts = [];
let customers = [];
let services = [];
let products = [];

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    initializeAdmin();
    loadDashboardData();
    setupEventListeners();
});

// Initialize Admin
function initializeAdmin() {
    // Update admin user display
    const adminUserElement = document.querySelector('.admin-user span');
    if (adminUserElement) {
        adminUserElement.textContent = `Welcome, ${getCurrentUser()}`;
    }
    
    // Load initial data
    loadData();
}

// Authentication check
function isAuthenticated() {
    return sessionStorage.getItem('adminAuthenticated') === 'true' || 
           localStorage.getItem('adminAuthenticated') === 'true';
}

// Get current user
function getCurrentUser() {
    return sessionStorage.getItem('adminUser') || localStorage.getItem('adminUser') || 'Admin';
}

// Load Data from Server
async function loadData() {
    try {
        // Load appointments
        const appointmentsResponse = await fetch('/api/appointments');
        if (appointmentsResponse.ok) {
            appointments = await appointmentsResponse.json();
        }
        
        // Load contacts
        const contactsResponse = await fetch('/api/contacts');
        if (contactsResponse.ok) {
            contacts = await contactsResponse.json();
        }
        
        // Load customers
        const customersResponse = await fetch('/api/customers');
        if (customersResponse.ok) {
            customers = await customersResponse.json();
        }
        
        // Load services
        const servicesResponse = await fetch('/api/services');
        if (servicesResponse.ok) {
            services = await servicesResponse.json();
        }
        
        // Load products
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
            products = await productsResponse.json();
        }
        
        updateDashboardStats();
    } catch (error) {
        console.error('Error loading data:', error);
        // Load sample data for demo
        loadSampleData();
    }
}

// Load Sample Data (for demo purposes)
function loadSampleData() {
    appointments = [
        { id: 1, customerName: 'John Doe', email: 'john@email.com', phone: '555-0101', service: 'Electrical Services', date: '2024-02-20', time: '10:00 AM', status: 'pending' },
        { id: 2, customerName: 'Jane Smith', email: 'jane@email.com', phone: '555-0102', service: 'Solar Systems', date: '2024-02-21', time: '2:00 PM', status: 'confirmed' }
    ];
    
    contacts = [
        { id: 1, name: 'Mike Johnson', email: 'mike@email.com', phone: '555-0103', service: 'Electrical', message: 'Need electrical wiring for new construction...', date: '2024-02-18', status: 'new' }
    ];
    
    customers = [
        { id: 1, name: 'John Doe', email: 'john@email.com', phone: '555-0101', totalServices: 3, lastService: '2024-02-15' }
    ];
    
    services = [
        { id: 1, name: 'Electrical Services', description: 'Complete electrical solutions', price: 1500 },
        { id: 2, name: 'Electronics Repair', description: 'Professional repair services', price: 750 }
    ];
    
    products = [
        { id: 1, name: 'Circuit Breaker Panel', category: 'electrical', description: 'Modern circuit breaker panel', price: 2999.99, badge: 'Best Seller', icon: '⚡' },
        { id: 2, name: 'Solar Panel Kit', category: 'solar', description: 'Complete solar panel kit', price: 12999.99, badge: 'Popular', icon: '☀️' }
    ];
}

// Setup Event Listeners
function setupEventListeners() {
    // Business settings form
    const businessForm = document.getElementById('businessSettingsForm');
    if (businessForm) {
        businessForm.addEventListener('submit', handleBusinessSettings);
    }
    
    // Appointment form
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
    
    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
}

// Show Section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update menu
    const menuItems = document.querySelectorAll('.admin-menu a');
    menuItems.forEach(item => item.classList.remove('active'));
    
    const activeMenuItem = document.querySelector(`.admin-menu a[href="#${sectionId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    currentSection = sectionId;
    
    // Load section-specific data
    loadSectionData(sectionId);
}

// Load Section Data
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'appointments':
            loadAppointments();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'services':
            loadServices();
            break;
        case 'products':
            loadProducts();
            break;
        case 'customers':
            loadCustomers();
            break;
    }
}

// Load Dashboard Data
function loadDashboardData() {
    updateDashboardStats();
    loadRecentActivities();
}

// Update Dashboard Statistics
function updateDashboardStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(stats => {
            const statsElements = {
                appointments: document.querySelector('.stat-card:nth-child(1) .stat-number'),
                contacts: document.querySelector('.stat-card:nth-child(2) .stat-number'),
                services: document.querySelector('.stat-card:nth-child(3) .stat-number'),
                customers: document.querySelector('.stat-card:nth-child(4) .stat-number')
            };
            
            if (statsElements.appointments) statsElements.appointments.textContent = stats.totalAppointments;
            if (statsElements.contacts) statsElements.contacts.textContent = stats.totalContacts;
            if (statsElements.services) statsElements.services.textContent = stats.totalServices;
            if (statsElements.customers) statsElements.customers.textContent = stats.totalCustomers;
        })
        .catch(error => {
            console.error('Error loading stats:', error);
            // Fallback to local data
            const statsElements = {
                appointments: document.querySelector('.stat-card:nth-child(1) .stat-number'),
                contacts: document.querySelector('.stat-card:nth-child(2) .stat-number'),
                services: document.querySelector('.stat-card:nth-child(3) .stat-number'),
                customers: document.querySelector('.stat-card:nth-child(4) .stat-number')
            };
            
            if (statsElements.appointments) statsElements.appointments.textContent = appointments.length;
            if (statsElements.contacts) statsElements.contacts.textContent = contacts.length;
            if (statsElements.services) statsElements.services.textContent = services.length;
            if (statsElements.customers) statsElements.customers.textContent = customers.length;
        });
}

// Load Recent Activities
function loadRecentActivities() {
    const activities = [
        { type: 'appointment', title: 'New Appointment', description: 'John Doe scheduled Electrical Service', time: '2 hours ago' },
        { type: 'contact', title: 'New Contact Message', description: 'Jane Smith inquired about Solar Installation', time: '4 hours ago' },
        { type: 'service', title: 'Service Completed', description: 'Electrical repair for Customer #123', time: '1 day ago' }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                <div class="activity-details">
                    <strong>${activity.title}</strong>
                    <p>${activity.description}</p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `).join('');
    }
}

// Get Activity Icon
function getActivityIcon(type) {
    const icons = {
        appointment: 'calendar-check',
        contact: 'envelope',
        service: 'wrench'
    };
    return icons[type] || 'info-circle';
}

// Load Appointments
function loadAppointments() {
    fetch('/api/appointments')
        .then(response => response.json())
        .then(data => {
            appointments = data;
            const tbody = document.getElementById('appointmentsTableBody');
            if (tbody) {
                tbody.innerHTML = appointments.map(appointment => `
                    <tr>
                        <td>#${appointment.id.toString().padStart(3, '0')}</td>
                        <td>${appointment.customerName || appointment.name}</td>
                        <td>${appointment.service}</td>
                        <td>${appointment.date}</td>
                        <td>${appointment.time}</td>
                        <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editAppointment(${appointment.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${appointment.id})">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Error loading appointments:', error);
            // Fallback to sample data if API fails
            const tbody = document.getElementById('appointmentsTableBody');
            if (tbody) {
                tbody.innerHTML = appointments.map(appointment => `
                    <tr>
                        <td>#${appointment.id.toString().padStart(3, '0')}</td>
                        <td>${appointment.customerName || appointment.name}</td>
                        <td>${appointment.service}</td>
                        <td>${appointment.date}</td>
                        <td>${appointment.time}</td>
                        <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editAppointment(${appointment.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${appointment.id})">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
        });
}

// Load Contacts
function loadContacts() {
    fetch('/api/contacts')
        .then(response => response.json())
        .then(data => {
            contacts = data;
            const tbody = document.getElementById('contactsTableBody');
            if (tbody) {
                tbody.innerHTML = contacts.map(contact => `
                    <tr>
                        <td>#${contact.id.toString().padStart(3, '0')}</td>
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phone}</td>
                        <td>${contact.service}</td>
                        <td>${contact.message.substring(0, 50)}...</td>
                        <td>${contact.date}</td>
                        <td><span class="status-badge ${contact.status}">${contact.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="viewContact(${contact.id})">View</button>
                            <button class="btn btn-sm btn-success" onclick="replyContact(${contact.id})">Reply</button>
                        </td>
                    </tr>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Error loading contacts:', error);
            // Fallback to sample data if API fails
            const tbody = document.getElementById('contactsTableBody');
            if (tbody) {
                tbody.innerHTML = contacts.map(contact => `
                    <tr>
                        <td>#${contact.id.toString().padStart(3, '0')}</td>
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phone}</td>
                        <td>${contact.service}</td>
                        <td>${contact.message.substring(0, 50)}...</td>
                        <td>${contact.date}</td>
                        <td><span class="status-badge ${contact.status}">${contact.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="viewContact(${contact.id})">View</button>
                            <button class="btn btn-sm btn-success" onclick="replyContact(${contact.id})">Reply</button>
                        </td>
                    </tr>
                `).join('');
            }
        });
}

// Load Services
function loadServices() {
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-item">
                <div class="service-info">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <span class="service-price">Starting at $${service.price}</span>
                </div>
                <div class="service-actions">
                    <button class="btn btn-sm btn-primary" onclick="editService(${service.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

// Load Products
function loadProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid) {
                productsGrid.innerHTML = products.map(product => `
                    <div class="product-item">
                        <div class="product-image-container">
                            ${product.image ? 
                                `<img src="${product.image}" alt="${product.name}">` : 
                                `<span class="product-icon">${product.icon}</span>`
                            }
                        </div>
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <span class="product-category">${product.category}</span>
                            <span class="product-price">GHS ${product.price.toFixed(2)}</span>
                            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                        </div>
                    </div>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            // Fallback to sample data if API fails
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid) {
                productsGrid.innerHTML = products.map(product => `
                    <div class="product-item">
                        <div class="product-image-container">
                            ${product.image ? 
                                `<img src="${product.image}" alt="${product.name}">` : 
                                `<span class="product-icon">${product.icon}</span>`
                            }
                        </div>
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <span class="product-category">${product.category}</span>
                            <span class="product-price">GHS ${product.price.toFixed(2)}</span>
                            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                        </div>
                    </div>
                `).join('');
            }
        });
}

// Load Customers
function loadCustomers() {
    const tbody = document.getElementById('customersTableBody');
    if (tbody) {
        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>#${customer.id.toString().padStart(3, '0')}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.totalServices}</td>
                <td>${customer.lastService}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewCustomer(${customer.id})">View</button>
                    <button class="btn btn-sm btn-success" onclick="editCustomer(${customer.id})">Edit</button>
                </td>
            </tr>
        `).join('');
    }
}

// Modal Functions
function openAppointmentModal() {
    document.getElementById('appointmentModal').style.display = 'block';
}

function openProductModal() {
    document.getElementById('productModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle Appointment Submit
async function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointment = {
        id: appointments.length + 1,
        customerName: formData.get('customerName') || document.getElementById('modalCustomerName').value,
        email: formData.get('customerEmail') || document.getElementById('modalCustomerEmail').value,
        phone: formData.get('customerPhone') || document.getElementById('modalCustomerPhone').value,
        service: formData.get('service') || document.getElementById('modalService').value,
        date: formData.get('date') || document.getElementById('modalDate').value,
        time: formData.get('time') || document.getElementById('modalTime').value,
        status: formData.get('status') || document.getElementById('modalStatus').value,
        notes: formData.get('notes') || document.getElementById('modalNotes').value
    };
    
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointment)
        });
        
        if (response.ok) {
            appointments.push(appointment);
            loadAppointments();
            updateDashboardStats();
            closeModal('appointmentModal');
            showNotification('Appointment added successfully!', 'success');
            e.target.reset();
        } else {
            throw new Error('Failed to add appointment');
        }
    } catch (error) {
        console.error('Error adding appointment:', error);
        showNotification('Failed to add appointment. Please try again.', 'error');
    }
}

// Handle Product Submit
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const imageFile = document.getElementById('productImage').files[0];
    
    // Handle image upload
    let imageUrl = null;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }
    
    const product = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: formData.get('productName') || document.getElementById('productName').value,
        category: formData.get('productCategory') || document.getElementById('productCategory').value,
        description: formData.get('productDescription') || document.getElementById('productDescription').value,
        price: parseFloat(formData.get('productPrice') || document.getElementById('productPrice').value),
        badge: formData.get('productBadge') || document.getElementById('productBadge').value,
        icon: formData.get('productIcon') || document.getElementById('productIcon').value,
        image: imageUrl
    };
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        });
        
        if (response.ok) {
            products.push(product);
            loadProducts();
            updateDashboardStats();
            closeModal('productModal');
            showNotification('Product added successfully!', 'success');
            e.target.reset();
            removeImage();
        } else {
            throw new Error('Failed to add product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Failed to add product. Please try again.', 'error');
    }
}

// Upload Image Function
async function uploadImage(file) {
    // Upload to server
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.imageUrl;
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Upload error:', error);
        // Fallback to base64 for demo
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// Preview Image Function
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Remove Image Function
function removeImage() {
    document.getElementById('productImage').value = '';
    document.getElementById('previewImg').src = '';
    document.getElementById('imagePreview').style.display = 'none';
}

// Handle Business Settings
async function handleBusinessSettings(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const settings = {
        businessName: formData.get('businessName'),
        businessPhone: formData.get('businessPhone'),
        businessEmail: formData.get('businessEmail'),
        businessAddress: formData.get('businessAddress')
    };
    
    try {
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings)
        });
        
        if (response.ok) {
            showNotification('Settings saved successfully!', 'success');
        } else {
            throw new Error('Failed to save settings');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Failed to save settings. Please try again.', 'error');
    }
}

// CRUD Operations
function editAppointment(id) {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
        // Populate modal with appointment data
        document.getElementById('modalCustomerName').value = appointment.customerName;
        document.getElementById('modalCustomerEmail').value = appointment.email;
        document.getElementById('modalCustomerPhone').value = appointment.phone;
        document.getElementById('modalService').value = appointment.service;
        document.getElementById('modalDate').value = appointment.date;
        document.getElementById('modalTime').value = appointment.time;
        document.getElementById('modalStatus').value = appointment.status;
        document.getElementById('modalNotes').value = appointment.notes || '';
        
        openAppointmentModal();
    }
}

async function deleteAppointment(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        try {
            const response = await fetch(`/api/appointments/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                appointments = appointments.filter(a => a.id !== id);
                loadAppointments();
                updateDashboardStats();
                showNotification('Appointment deleted successfully!', 'success');
            } else {
                throw new Error('Failed to delete appointment');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            showNotification('Failed to delete appointment. Please try again.', 'error');
        }
    }
}

function viewContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        alert(`Contact Details:\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nService: ${contact.service}\nMessage: ${contact.message}\nDate: ${contact.date}`);
    }
}

function replyContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        // Mark as replied
        contact.status = 'replied';
        loadContacts();
        
        // Open email client
        window.location.href = `mailto:${contact.email}?subject=Re: Your inquiry about ${contact.service}&body=Dear ${contact.name},\n\nThank you for your inquiry. We have received your message and will get back to you shortly.\n\nBest regards,\nUltimate Joy Home`;
    }
}

function editService(id) {
    const service = services.find(s => s.id === id);
    if (service) {
        const newName = prompt('Service Name:', service.name);
        const newDescription = prompt('Service Description:', service.description);
        const newPrice = prompt('Service Price:', service.price);
        
        if (newName && newDescription && newPrice) {
            service.name = newName;
            service.description = newDescription;
            service.price = parseFloat(newPrice);
            loadServices();
            showNotification('Service updated successfully!', 'success');
        }
    }
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        services = services.filter(s => s.id !== id);
        loadServices();
        updateDashboardStats();
        showNotification('Service deleted successfully!', 'success');
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productBadge').value = product.badge || '';
        document.getElementById('productIcon').value = product.icon || '⚡';
        
        // Handle image preview for existing product
        if (product.image) {
            document.getElementById('previewImg').src = product.image;
            document.getElementById('imagePreview').style.display = 'block';
        } else {
            removeImage();
        }
        
        openProductModal();
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        loadProducts();
        updateDashboardStats();
        showNotification('Product deleted successfully!', 'success');
    }
}

function viewCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        alert(`Customer Details:\n\nName: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nTotal Services: ${customer.totalServices}\nLast Service: ${customer.lastService}`);
    }
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        const newName = prompt('Customer Name:', customer.name);
        const newEmail = prompt('Customer Email:', customer.email);
        const newPhone = prompt('Customer Phone:', customer.phone);
        
        if (newName && newEmail && newPhone) {
            customer.name = newName;
            customer.email = newEmail;
            customer.phone = newPhone;
            loadCustomers();
            showNotification('Customer updated successfully!', 'success');
        }
    }
}

// Filter Functions
function filterAppointments() {
    const searchTerm = document.getElementById('appointmentSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filtered = appointments.filter(appointment => {
        const matchesSearch = appointment.customerName.toLowerCase().includes(searchTerm) ||
                            appointment.service.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || appointment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('appointmentsTableBody');
    if (tbody) {
        tbody.innerHTML = filtered.map(appointment => `
            <tr>
                <td>#${appointment.id.toString().padStart(3, '0')}</td>
                <td>${appointment.customerName}</td>
                <td>${appointment.service}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editAppointment(${appointment.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${appointment.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

function filterContacts() {
    const searchTerm = document.getElementById('contactSearch').value.toLowerCase();
    const statusFilter = document.getElementById('contactStatusFilter').value;
    
    const filtered = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchTerm) ||
                            contact.email.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || contact.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const tbody = document.getElementById('contactsTableBody');
    if (tbody) {
        tbody.innerHTML = filtered.map(contact => `
            <tr>
                <td>#${contact.id.toString().padStart(3, '0')}</td>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>${contact.service}</td>
                <td>${contact.message.substring(0, 50)}...</td>
                <td>${contact.date}</td>
                <td><span class="status-badge ${contact.status}">${contact.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewContact(${contact.id})">View</button>
                    <button class="btn btn-sm btn-success" onclick="replyContact(${contact.id})">Reply</button>
                </td>
            </tr>
        `).join('');
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('productCategoryFilter').value;
    
    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = filtered.map(product => `
            <div class="product-item">
                <div class="product-image-container">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}">` : 
                        `<span class="product-icon">${product.icon}</span>`
                    }
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="product-category">${product.category}</span>
                    <span class="product-price">GHS ${product.price.toFixed(2)}</span>
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

function filterCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    
    const filtered = customers.filter(customer => {
        return customer.name.toLowerCase().includes(searchTerm) ||
               customer.email.toLowerCase().includes(searchTerm);
    });
    
    const tbody = document.getElementById('customersTableBody');
    if (tbody) {
        tbody.innerHTML = filtered.map(customer => `
            <tr>
                <td>#${customer.id.toString().padStart(3, '0')}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.totalServices}</td>
                <td>${customer.lastService}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewCustomer(${customer.id})">View</button>
                    <button class="btn btn-sm btn-success" onclick="editCustomer(${customer.id})">Edit</button>
                </td>
            </tr>
        `).join('');
    }
}

// Export Functions
function exportData() {
    const data = {
        appointments: appointments,
        contacts: contacts,
        customers: customers,
        services: services
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mrj-electrical-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Data exported successfully!', 'success');
}

function exportContacts() {
    const csvContent = contacts.map(contact => 
        `${contact.name},${contact.email},${contact.phone},${contact.service},${contact.date}`
    ).join('\n');
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Contacts exported successfully!', 'success');
}

function exportCustomers() {
    const csvContent = customers.map(customer => 
        `${customer.name},${customer.email},${customer.phone},${customer.totalServices},${customer.lastService}`
    ).join('\n');
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Customers exported successfully!', 'success');
}

function generateReport() {
    const report = {
        generatedDate: new Date().toISOString(),
        summary: {
            totalAppointments: appointments.length,
            totalContacts: contacts.length,
            totalCustomers: customers.length,
            totalServices: services.length
        },
        appointmentsByStatus: {
            pending: appointments.filter(a => a.status === 'pending').length,
            confirmed: appointments.filter(a => a.status === 'confirmed').length,
            completed: appointments.filter(a => a.status === 'completed').length,
            cancelled: appointments.filter(a => a.status === 'cancelled').length
        },
        contactsByStatus: {
            new: contacts.filter(c => c.status === 'new').length,
            read: contacts.filter(c => c.status === 'read').length,
            replied: contacts.filter(c => c.status === 'replied').length
        }
    };
    
    const reportStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(reportStr);
    
    const exportFileDefaultName = `mrj-electrical-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Report generated successfully!', 'success');
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    
    // Insert at the top of the admin content
    const adminContent = document.querySelector('.admin-content');
    if (adminContent) {
        adminContent.insertBefore(notification, adminContent.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminUser');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminUser');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
