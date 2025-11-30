# 🎨 Jays Tattoos Business Website

A modern, full-featured tattoo business website with appointment booking, SMS notifications, and admin panel for portfolio management.

![Tattoo Website](assets/jays-hero-background.jpg)

## ✨ Features

### Public Website
- 📱 Responsive design (mobile, tablet, desktop)
- 🖼️ Portfolio gallery with 28 professional tattoo images
- 📅 Appointment booking system
- 📧 SMS notifications via Twilio
- 🎨 Modern UI with smooth animations
- 🌙 Professional dark theme

### Admin Panel
- 🔐 Secure JWT authentication
- 📸 Image upload system (drag & drop)
- 🗂️ Portfolio management (upload, view, delete)
- 🎯 Real-time preview
- 🔒 Password hashing with bcrypt

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript
- Responsive Design

**Backend:**
- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcrypt.js
- Multer (file uploads)
- Twilio API (SMS)

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Twilio account (for SMS notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/jays-tattoos.git
   cd jays-tattoos
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ARTIST_PHONE_NUMBER=+15134413711
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=$2a$10$N9qo8uLOickgx2ZMRZoMye3DmJbNZPjyHBmP5nqK6bvLtLEPxDl4G
   JWT_SECRET=your-secret-key
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Access the website**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin.html

## 🔑 Default Admin Credentials

- **Username:** `admin`
- **Password:** `password`

⚠️ **Change these immediately after first login!**

## 📸 Screenshots

### Main Website
- Hero section with booking CTA
- Portfolio gallery (28 tattoo images)
- About section
- Contact form

### Admin Panel
- Secure login
- Image upload with preview
- Portfolio management
- Delete images

## 🌐 Deployment

### Free Deployment (Render)

1. Push code to GitHub
2. Sign up at [Render](https://render.com)
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
jays-tattoos/
├── index.html          # Main website
├── admin.html          # Admin panel
├── styles.css          # Styles
├── script.js           # JavaScript
├── assets/             # Images (28 portfolio images)
├── backend/
│   ├── server.js       # Express server
│   ├── package.json    # Dependencies
│   ├── .env           # Environment variables (not in repo)
│   └── generate-hash.js # Password hash generator
└── README.md
```

## 🔐 Security Features

- JWT token authentication
- Bcrypt password hashing (10 rounds)
- File upload validation (type & size)
- Environment variable configuration
- CORS protection
- Input sanitization

## 📋 API Endpoints

### Public
- `GET /` - Main website
- `GET /admin.html` - Admin panel
- `POST /api/appointments` - Book appointment (sends SMS)
- `GET /health` - Health check

### Admin (Authentication Required)
- `POST /api/admin/login` - Login
- `GET /api/admin/verify` - Verify token
- `POST /api/admin/upload` - Upload image
- `GET /api/admin/images` - List images
- `DELETE /api/admin/images/:filename` - Delete image

## 🤝 Contributing

This is a personal portfolio project, but feel free to:
- Report bugs
- Suggest features
- Fork for your own use

## 📄 License

MIT License - feel free to use this for your own projects!

## 👤 Author

**cdycl**
- GitHub: [@cdycl](https://github.com/cdycl)
- Email: cdycl@gmail.com

## 🙏 Acknowledgments

- Twilio for SMS API
- All the amazing tattoo artists whose work inspired this design
- Open source community

## 📝 TODO

- [ ] Add Cloudinary integration for persistent image storage
- [ ] Implement rate limiting
- [ ] Add image compression
- [ ] Create customer dashboard
- [ ] Add email notifications
- [ ] Multi-admin support
- [ ] Analytics dashboard

---

Built with ❤️ for Jays Tattoos Studio
