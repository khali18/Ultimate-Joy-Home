# Ultimate Joy Home - Electrical & Electronics Website

A comprehensive, professional website for Ultimate Joy Home, featuring electrical services, electronics repair, and solar system solutions. This full-stack application includes a public-facing website, admin panel, and backend API.

## 🚀 Features

### Frontend Website
- **Modern, Professional Design** - Clean, responsive layout with smooth animations
- **Service Showcase** - Detailed presentation of all electrical, electronics, and solar services
- **Contact Forms** - User-friendly contact and appointment booking forms
- **Mobile Responsive** - Optimized for all devices and screen sizes
- **Interactive Elements** - Smooth scrolling, hover effects, and micro-interactions
- **SEO Optimized** - Proper meta tags and semantic HTML structure

### Admin Panel
- **Dashboard Analytics** - Real-time statistics and overview
- **Appointment Management** - Create, edit, and manage customer appointments
- **Contact Management** - View and respond to customer inquiries
- **Customer Database** - Maintain customer records and service history
- **Service Management** - Update service offerings and pricing
- **Data Export** - Export data in JSON and CSV formats
- **Settings Configuration** - Manage business information and settings

### Backend API
- **RESTful API** - Clean, well-documented API endpoints
- **Data Persistence** - JSON-based data storage
- **CRUD Operations** - Complete Create, Read, Update, Delete functionality
- **Error Handling** - Comprehensive error handling and validation
- **CORS Support** - Cross-origin resource sharing enabled

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Data Storage**: JSON files (easily upgradeable to database)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome
- **Animations**: CSS transitions and keyframe animations

## 📁 Project Structure

```
mrj-electrical/
├── public/                 # Frontend website
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── main.js        # Frontend JavaScript
│   ├── images/            # Image assets
│   └── index.html         # Main website
├── admin/                 # Admin panel
│   ├── css/
│   │   └── admin.css      # Admin panel styles
│   ├── js/
│   │   └── admin.js       # Admin panel JavaScript
│   └── index.html         # Admin panel interface
├── server/                # Backend server
│   └── app.js            # Express.js server
├── data/                 # Data storage
│   ├── appointments.json
│   ├── contacts.json
│   ├── customers.json
│   ├── services.json
│   └── settings.json
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   # Navigate to the project directory
   cd mrj-electrical
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Access the application**
   - Main website: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - API endpoints: http://localhost:3000/api

## 📋 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-restart

## 🔧 Configuration

### Server Configuration
The server runs on port 3000 by default. You can change this by:
- Setting the `PORT` environment variable: `PORT=8080 npm start`
- Modifying the PORT constant in `server/app.js`

### Business Settings
Business information can be updated through:
1. The admin panel (Settings section)
2. Directly editing `data/settings.json`

Default business settings include:
- Business name, phone, email
- Business address
- Operating hours

## 📊 API Endpoints

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Contacts
- `GET /api/contacts` - Get all contact messages
- `POST /api/contact` - Submit contact form
- `PUT /api/contacts/:id` - Update contact status
- `DELETE /api/contacts/:id` - Delete contact

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create/update customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Settings
- `GET /api/settings` - Get business settings
- `PUT /api/settings` - Update business settings

### Statistics
- `GET /api/stats` - Get dashboard statistics

## 🎨 Customization

### Branding
Update the following files to customize branding:
- `public/css/style.css` - Modify CSS variables for colors and fonts
- `data/settings.json` - Update business information
- `public/index.html` - Update meta tags and content

### Services
Edit `data/services.json` to:
- Add/remove services
- Update descriptions and pricing
- Modify service categories

### Styling
The CSS uses CSS variables for easy customization:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #f59e0b;
    --dark-color: #1f2937;
    --light-color: #f9fafb;
    /* ... more variables */
}
```

## 🔒 Security Considerations

This implementation uses JSON file storage for simplicity. For production deployment, consider:

1. **Database Integration** - Replace JSON storage with a proper database (MongoDB, PostgreSQL, etc.)
2. **Authentication** - Implement proper user authentication for admin access
3. **Input Validation** - Add server-side validation for all inputs
4. **Rate Limiting** - Implement API rate limiting
5. **HTTPS** - Use HTTPS in production
6. **Environment Variables** - Store sensitive data in environment variables

## 📱 Mobile Responsiveness

The website is fully responsive and includes:
- Mobile-first design approach
- Touch-friendly interface elements
- Optimized navigation for mobile devices
- Responsive grid layouts
- Flexible typography and spacing

## 🚀 Deployment

### Local Deployment
```bash
npm install
npm start
```

### Production Deployment
1. Install dependencies: `npm install --production`
2. Set environment variables as needed
3. Start the server: `npm start`
4. Consider using a process manager like PM2 for production

### Docker Deployment (Optional)
Create a `Dockerfile` for containerized deployment:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support regarding this website:
- Email: info@ultimatejoyhome.com
- Phone: +233 54 655 109

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

Potential future improvements:
- Real database integration (MongoDB/PostgreSQL)
- User authentication system
- Email notification system
- Online payment integration
- Customer portal
- Service scheduling calendar
- Inventory management
- Employee management system
- Advanced reporting and analytics
- Mobile app development
- Multi-language support

---

**Mr. J Electrical and Electronics** - Professional Electrical & Solar Solutions Since 2008
