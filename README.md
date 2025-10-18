# Rentify - Universal Rent Service Platform

A complete MERN stack application that allows users to post and rent any kind of item or property — homes, vehicles, tools, electronics, or event spaces.

## 🚀 Features

- **User Authentication**: Register/Login with JWT
- **Role-based Access**: Admin, Owner (Lister), Renter
- **Category System**: Home, Car, Tool, Electronics, etc.
- **Listing Management**: Add, Edit, Delete, View listings
- **Booking System**: Request, approve/reject bookings
- **Admin Dashboard**: Manage users and listings
- **Responsive UI**: Modern design with TailwindCSS

## 🏗️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image uploads
- **bcryptjs** for password hashing

### Frontend
- **React.js** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form handling
- **Heroicons** for icons

## 📁 Project Structure

```
rentify/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/db.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── categoryModel.js
│   │   ├── listingModel.js
│   │   └── bookingModel.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── listingController.js
│   │   └── bookingController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── listingRoutes.js
│   │   └── bookingRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   └── utils/
│       └── upload.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    ├── src/
    │   ├── index.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CategoryFilter.jsx
    │   │   ├── ListingCard.jsx
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ListingForm.jsx
    │   │   ├── BookingPage.jsx
    │   │   └── AdminPanel.jsx
    │   └── utils/
    │       └── api.js
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   DB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `GET /api/listings/user/my-listings` - Get user's listings

### Bookings
- `POST /api/bookings` - Create booking request
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/admin/all` - Get all bookings (Admin)

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Frontend Deployment (Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## 📝 Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Listings**: Explore available items to rent
3. **Create Listing**: List your items for others to rent
4. **Request Booking**: Send booking requests to item owners
5. **Manage Bookings**: Approve/reject booking requests
6. **Admin Panel**: Manage the platform (Admin users only)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Yakob B** - *Initial work* - https://github.com/Yakob-B

## 🙏 Acknowledgments

- Thanks to all the open-source libraries used in this project
- Inspiration from existing rental platforms
