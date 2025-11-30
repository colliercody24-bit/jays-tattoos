# Admin Panel Setup Guide

## Prerequisites
- Node.js and npm installed (download from https://nodejs.org/)

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

This will install:
- express (web server)
- twilio (SMS notifications)
- multer (file uploads)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- cors (cross-origin requests)

### 2. Generate Password Hash

Run the helper script to generate a secure password hash:

```bash
node generate-hash.js your-desired-password
```

Example:
```bash
node generate-hash.js MySecurePass123!
```

This will output something like:
```
=== Password Hash Generated ===

Add this to your .env file:

ADMIN_PASSWORD_HASH=$2a$10$xyz...abc
```

### 3. Update .env File

Open `backend/.env` and update these values:

```env
# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$xyz...abc   # Paste the hash from step 2
JWT_SECRET=your-random-secret-minimum-32-characters-long  # Generate a random string
```

**Important Security Notes:**
- Change `ADMIN_USERNAME` to something unique (not "admin")
- Use a strong password (minimum 8 characters with uppercase, lowercase, numbers, symbols)
- Generate a random JWT_SECRET (can use online generator or random string)
- Never commit the .env file to version control

### 4. Create Uploads Directory

The uploads directory will be created automatically, but you can create it manually:

```bash
mkdir -p ../assets/uploads
```

### 5. Start the Backend Server

```bash
node server.js
```

You should see:
```
Server running on port 3000
Twilio credentials: [configured/not configured]
```

### 6. Open Admin Panel

Open `admin.html` in your browser or use a local web server:

```bash
# Option 1: Open directly (may have CORS issues)
# Just double-click admin.html

# Option 2: Use VS Code Live Server extension
# Right-click admin.html → Open with Live Server

# Option 3: Use Python simple server (from project root)
python -m http.server 8000
# Then visit: http://localhost:8000/admin.html
```

### 7. Login

- **URL**: http://localhost:8000/admin.html (or wherever you're serving it)
- **Username**: The value you set in ADMIN_USERNAME
- **Password**: The password you used to generate the hash

## Features

### Upload Images
1. Click "Choose Image"
2. Select an image (JPEG, PNG, GIF, WebP - max 5MB)
3. Preview appears
4. Click "Upload to Gallery"

### Manage Images
- View all uploaded images with details (filename, size, date)
- Delete images with confirmation
- Images are stored in `assets/uploads/`
- Accessible via: http://localhost:3000/assets/uploads/filename.jpg

## API Endpoints

### Authentication
- `POST /api/admin/login` - Login with username/password, returns JWT token
- `GET /api/admin/verify` - Verify JWT token validity

### Image Management (Requires Authentication)
- `POST /api/admin/upload` - Upload image (multipart/form-data with 'image' field)
- `GET /api/admin/images` - List all uploaded images
- `DELETE /api/admin/images/:filename` - Delete specific image

### Example API Usage

**Login:**
```javascript
fetch('http://localhost:3000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'your-password' })
})
```

**Upload Image:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/api/admin/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
})
```

## Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Login failed"
- Check that the backend server is running (`node server.js`)
- Verify ADMIN_USERNAME and password are correct
- Check that the password hash was generated correctly
- Look at server console for error messages

### "Connection error"
- Ensure backend is running on port 3000
- Check firewall settings
- Verify API_URL in admin.html matches your server (default: http://localhost:3000)

### "Upload failed"
- Check file size (max 5MB)
- Verify file type (only JPEG, PNG, GIF, WebP allowed)
- Ensure uploads directory exists and is writable
- Check server logs for specific error

### Images not displaying
- Check that static file serving is working: http://localhost:3000/assets/uploads/
- Verify uploads directory path is correct (../assets/uploads)
- Check file permissions on uploads directory

## Security Best Practices

1. **Change Default Credentials**: Never use default usernames/passwords
2. **Strong Passwords**: Use complex passwords with special characters
3. **Secure JWT_SECRET**: Use a long random string (32+ characters)
4. **HTTPS in Production**: Use SSL/TLS certificates for production
5. **Rate Limiting**: Consider adding rate limiting for login attempts
6. **File Validation**: Only allow image uploads, limit file sizes
7. **Environment Variables**: Never commit .env to git (add to .gitignore)

## Production Deployment

When deploying to production:

1. Use environment variables for all secrets
2. Enable HTTPS/SSL
3. Add rate limiting (e.g., express-rate-limit)
4. Consider using cloud storage (AWS S3, Azure Blob, Google Cloud Storage)
5. Add logging and monitoring
6. Set up automated backups
7. Use a process manager (PM2, systemd)
8. Configure proper CORS policies

## File Structure

```
tattoo_business_site/
├── admin.html              # Admin panel interface
├── assets/
│   └── uploads/           # Uploaded images (auto-created)
└── backend/
    ├── .env               # Environment variables (not in git)
    ├── package.json       # Dependencies
    ├── server.js          # Express server with all endpoints
    └── generate-hash.js   # Password hash generator utility
```

## Next Steps

- [ ] Install dependencies with `npm install`
- [ ] Generate password hash
- [ ] Update .env with credentials
- [ ] Start backend server
- [ ] Open admin panel and login
- [ ] Upload test image
- [ ] Integrate gallery into main website
