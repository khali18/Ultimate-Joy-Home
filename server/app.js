// Mr. J Electrical and Electronics - Backend Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Data storage paths
const dataPath = path.join(__dirname, '../data');
const appointmentsFile = path.join(dataPath, 'appointments.json');
const contactsFile = path.join(dataPath, 'contacts.json');
const customersFile = path.join(dataPath, 'customers.json');
const servicesFile = path.join(dataPath, 'services.json');
const productsFile = path.join(dataPath, 'products.json');
const settingsFile = path.join(dataPath, 'settings.json');

// Ensure data directory exists
fs.ensureDirSync(dataPath);

// Initialize data files if they don't exist
function initializeDataFiles() {
    const defaultData = {
        appointments: [],
        contacts: [],
        customers: [],
        services: [
            {
                id: 1,
                name: 'Electrical Services',
                description: 'Complete electrical solutions for residential and commercial properties including wiring, panel upgrades, and troubleshooting.',
                price: 1500,
                icon: '⚡',
                category: 'electrical'
            },
            {
                id: 2,
                name: 'Electronics Repair',
                description: 'Professional repair services for all electronic devices including TVs, computers, and home appliances.',
                price: 750,
                icon: '🔧',
                category: 'electronics'
            },
            {
                id: 3,
                name: 'Solar Systems',
                description: 'Design, installation, and maintenance of solar panel systems for energy-efficient solutions.',
                price: 25000,
                icon: '☀️',
                category: 'solar'
            },
            {
                id: 4,
                name: 'Solar Repair',
                description: 'Expert repair and maintenance services for existing solar systems to ensure optimal performance.',
                price: 2000,
                icon: '🔋',
                category: 'solar'
            },
            {
                id: 5,
                name: 'Emergency Services',
                description: '24/7 emergency electrical and solar services for urgent repairs and system failures.',
                price: 3000,
                icon: '🚨',
                category: 'emergency'
            },
            {
                id: 6,
                name: 'Consultation',
                description: 'Professional consultation for energy efficiency, system design, and technology upgrades.',
                price: 1000,
                icon: '💡',
                category: 'consultation'
            }
        ],
        products: [
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
        ],
        settings: {
            businessName: 'Ultimate Joy Home',
            businessPhone: '+233 54 655 109',
            businessEmail: 'info@ultimatejoyhome.com',
            businessAddress: 'Tamale, Northern Region, Ghana',
            businessHours: {
                monday: '8:00 AM - 6:00 PM',
                tuesday: '8:00 AM - 6:00 PM',
                wednesday: '8:00 AM - 6:00 PM',
                thursday: '8:00 AM - 6:00 PM',
                friday: '8:00 AM - 6:00 PM',
                saturday: '9:00 AM - 4:00 PM',
                sunday: 'Closed'
            }
        }
    };

    Object.keys(defaultData).forEach(key => {
        const filePath = path.join(dataPath, `${key}.json`);
        if (!fs.existsSync(filePath)) {
            fs.writeJsonSync(filePath, defaultData[key], { spaces: 2 });
        }
    });
}

// Helper functions
function readDataFile(filename) {
    try {
        return fs.readJsonSync(path.join(dataPath, filename));
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

function writeDataFile(filename, data) {
    try {
        fs.writeJsonSync(path.join(dataPath, filename), data, { spaces: 2 });
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

// API Routes

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ 
            success: true, 
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Default credentials (in production, use proper authentication)
        const validCredentials = [
            { username: 'admin', password: 'admin123' },
            { username: 'mrj', password: 'electrical2024' },
            { username: 'tamale', password: 'ghana2024' }
        ];
        
        const user = validCredentials.find(cred => 
            cred.username === username && cred.password === password
        );
        
        if (user) {
            res.json({ 
                success: true, 
                user: { username: user.username },
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed' 
        });
    }
});

// Get all products
app.get('/api/products', (req, res) => {
    try {
        const products = readDataFile('products.json');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Create new product
app.post('/api/products', (req, res) => {
    try {
        const products = readDataFile('products.json');
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            ...req.body,
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        
        if (writeDataFile('products.json', products)) {
            res.status(201).json(newProduct);
        } else {
            res.status(500).json({ error: 'Failed to save product' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
app.put('/api/products/:id', (req, res) => {
    try {
        const products = readDataFile('products.json');
        const productId = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        products[productIndex] = { ...products[productIndex], ...req.body };
        
        if (writeDataFile('products.json', products)) {
            res.json(products[productIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update product' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    try {
        const products = readDataFile('products.json');
        const productId = parseInt(req.params.id);
        const filteredProducts = products.filter(p => p.id !== productId);
        
        if (products.length === filteredProducts.length) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        if (writeDataFile('products.json', filteredProducts)) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Get all services
app.get('/api/services', (req, res) => {
    try {
        const services = readDataFile('services.json');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
    try {
        const appointments = readDataFile('appointments.json');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
    try {
        console.log('Received appointment request:', req.body);
        const appointments = readDataFile('appointments.json');
        const newAppointment = {
            id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        
        console.log('New appointment created:', newAppointment);
        
        appointments.push(newAppointment);
        
        if (writeDataFile('appointments.json', appointments)) {
            console.log('Appointment saved successfully');
            res.status(201).json(newAppointment);
        } else {
            console.error('Failed to save appointment');
            res.status(500).json({ error: 'Failed to save appointment' });
        }
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
    try {
        const appointments = readDataFile('appointments.json');
        const appointmentId = parseInt(req.params.id);
        const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
        
        if (appointmentIndex === -1) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...req.body };
        
        if (writeDataFile('appointments.json', appointments)) {
            res.json(appointments[appointmentIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update appointment' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
    try {
        const appointments = readDataFile('appointments.json');
        const appointmentId = parseInt(req.params.id);
        const filteredAppointments = appointments.filter(a => a.id !== appointmentId);
        
        if (appointments.length === filteredAppointments.length) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        if (writeDataFile('appointments.json', filteredAppointments)) {
            res.json({ message: 'Appointment deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete appointment' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

// Get all contacts
app.get('/api/contacts', (req, res) => {
    try {
        const contacts = readDataFile('contacts.json');
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Create new contact
app.post('/api/contact', (req, res) => {
    try {
        const contacts = readDataFile('contacts.json');
        const newContact = {
            id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'new'
        };
        
        contacts.push(newContact);
        
        if (writeDataFile('contacts.json', contacts)) {
            res.status(201).json(newContact);
        } else {
            res.status(500).json({ error: 'Failed to save contact' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

// Update contact
app.put('/api/contacts/:id', (req, res) => {
    try {
        const contacts = readDataFile('contacts.json');
        const contactId = parseInt(req.params.id);
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        
        if (contactIndex === -1) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        contacts[contactIndex] = { ...contacts[contactIndex], ...req.body };
        
        if (writeDataFile('contacts.json', contacts)) {
            res.json(contacts[contactIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update contact' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// Delete contact
app.delete('/api/contacts/:id', (req, res) => {
    try {
        const contacts = readDataFile('contacts.json');
        const contactId = parseInt(req.params.id);
        const filteredContacts = contacts.filter(c => c.id !== contactId);
        
        if (contacts.length === filteredContacts.length) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        if (writeDataFile('contacts.json', filteredContacts)) {
            res.json({ message: 'Contact deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete contact' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// Get all customers
app.get('/api/customers', (req, res) => {
    try {
        const customers = readDataFile('customers.json');
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// Create new customer
app.post('/api/customers', (req, res) => {
    try {
        const customers = readDataFile('customers.json');
        const existingCustomer = customers.find(c => c.email === req.body.email);
        
        if (existingCustomer) {
            // Update existing customer
            const customerIndex = customers.findIndex(c => c.email === req.body.email);
            customers[customerIndex] = { 
                ...customers[customerIndex], 
                ...req.body,
                lastService: new Date().toISOString().split('T')[0],
                totalServices: (customers[customerIndex].totalServices || 0) + 1
            };
        } else {
            // Create new customer
            const newCustomer = {
                id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
                ...req.body,
                createdAt: new Date().toISOString(),
                totalServices: 1,
                lastService: new Date().toISOString().split('T')[0]
            };
            customers.push(newCustomer);
        }
        
        if (writeDataFile('customers.json', customers)) {
            res.status(201).json(customers.find(c => c.email === req.body.email));
        } else {
            res.status(500).json({ error: 'Failed to save customer' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
    try {
        const customers = readDataFile('customers.json');
        const customerId = parseInt(req.params.id);
        const customerIndex = customers.findIndex(c => c.id === customerId);
        
        if (customerIndex === -1) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        customers[customerIndex] = { ...customers[customerIndex], ...req.body };
        
        if (writeDataFile('customers.json', customers)) {
            res.json(customers[customerIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update customer' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update customer' });
    }
});

// Delete customer
app.delete('/api/customers/:id', (req, res) => {
    try {
        const customers = readDataFile('customers.json');
        const customerId = parseInt(req.params.id);
        const filteredCustomers = customers.filter(c => c.id !== customerId);
        
        if (customers.length === filteredCustomers.length) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        if (writeDataFile('customers.json', filteredCustomers)) {
            res.json({ message: 'Customer deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete customer' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
});

// Get settings
app.get('/api/settings', (req, res) => {
    try {
        const settings = readDataFile('settings.json');
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update settings
app.put('/api/settings', (req, res) => {
    try {
        const currentSettings = readDataFile('settings.json');
        const updatedSettings = { ...currentSettings, ...req.body };
        
        if (writeDataFile('settings.json', updatedSettings)) {
            res.json(updatedSettings);
        } else {
            res.status(500).json({ error: 'Failed to update settings' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
    try {
        const appointments = readDataFile('appointments.json');
        const contacts = readDataFile('contacts.json');
        const customers = readDataFile('customers.json');
        const services = readDataFile('services.json');
        const products = readDataFile('products.json');
        
        const stats = {
            totalAppointments: appointments.length,
            totalContacts: contacts.length,
            totalCustomers: customers.length,
            totalServices: services.length,
            totalProducts: products.length,
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
            },
            recentAppointments: appointments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5),
            recentContacts: contacts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Email notification endpoint (placeholder)
app.post('/api/send-email', (req, res) => {
    try {
        // In production, integrate with email service like SendGrid, Nodemailer, etc.
        console.log('Email would be sent:', req.body);
        res.json({ message: 'Email notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/index.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Handle server errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize data files and start server
initializeDataFiles();

app.listen(PORT, () => {
    console.log(`Mr. J Electrical server running on port ${PORT}`);
    console.log(`Main website: http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
    console.log(`API endpoints: http://localhost:${PORT}/api`);
});

module.exports = app;
