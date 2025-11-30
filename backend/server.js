require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const artistPhoneNumber = process.env.ARTIST_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Admin credentials (in production, use a database)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('admin123', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../assets/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'portfolio-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets/uploads', express.static(uploadsDir));

// Serve frontend files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '..')));

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Jays Tattoos Notification Service' });
});

// ==================== ADMIN AUTH ENDPOINTS ====================

// Admin login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Username and password required' 
            });
        }

        // Check credentials
        if (username !== ADMIN_USERNAME) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token: token,
            expiresIn: '24h'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed',
            details: error.message
        });
    }
});

// Verify token
app.get('/api/admin/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// ==================== IMAGE UPLOAD ENDPOINTS ====================

// Upload portfolio image
app.post('/api/admin/upload', authenticateToken, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No image file provided' 
            });
        }

        const imageUrl = `/assets/uploads/${req.file.filename}`;

        res.json({
            success: true,
            filename: req.file.filename,
            url: imageUrl,
            size: req.file.size,
            uploadedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Upload failed',
            details: error.message
        });
    }
});

// Get all uploaded images
app.get('/api/admin/images', authenticateToken, (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir);
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => {
                const stats = fs.statSync(path.join(uploadsDir, file));
                return {
                    filename: file,
                    url: `/assets/uploads/${file}`,
                    size: stats.size,
                    uploadedAt: stats.birthtime
                };
            })
            .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        res.json({
            success: true,
            images: images,
            count: images.length
        });

    } catch (error) {
        console.error('Error listing images:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list images',
            details: error.message
        });
    }
});

// Delete image
app.delete('/api/admin/images/:filename', authenticateToken, (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadsDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ 
                success: false, 
                error: 'Image not found' 
            });
        }

        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: 'Image deleted successfully',
            filename: filename
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete image',
            details: error.message
        });
    }
});

// Notification endpoint
app.post('/api/notify', async (req, res) => {
    try {
        const { intent, payload, timestamp } = req.body;

        if (!intent || !payload) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: intent and payload' 
            });
        }

        // Format the SMS message based on intent
        let message = '';
        const time = new Date(timestamp).toLocaleString('en-US', { 
            dateStyle: 'short', 
            timeStyle: 'short' 
        });

        switch (intent) {
            case 'schedule':
                message = `🆕 NEW APPOINTMENT\n\n` +
                         `Name: ${payload.name || 'N/A'}\n` +
                         `Date: ${payload.date || 'N/A'}\n` +
                         `Time: ${payload.time || 'N/A'}\n` +
                         `Contact: ${payload.contact || 'N/A'}\n\n` +
                         `Requested: ${time}`;
                break;

            case 'change':
                message = `🔄 APPOINTMENT CHANGED\n\n` +
                         `Name: ${payload.name || 'N/A'}\n` +
                         `New Date: ${payload.date || 'N/A'}\n` +
                         `New Time: ${payload.time || 'N/A'}\n` +
                         `Contact: ${payload.contact || 'N/A'}\n\n` +
                         `Changed: ${time}`;
                break;

            case 'cancel':
                message = `❌ APPOINTMENT CANCELED\n\n` +
                         `Name: ${payload.name || 'N/A'}\n` +
                         `Date: ${payload.date || 'N/A'}\n` +
                         `Notes: ${payload.notes || 'None'}\n\n` +
                         `Canceled: ${time}`;
                break;

            default:
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid intent. Must be: schedule, change, or cancel' 
                });
        }

        // Send SMS via Twilio
        const smsResult = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: artistPhoneNumber
        });

        console.log(`SMS sent successfully. SID: ${smsResult.sid}`);
        console.log(`Intent: ${intent}`, payload);

        res.json({
            success: true,
            messageSid: smsResult.sid,
            intent: intent,
            sentAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error sending notification:', error);
        
        res.status(500).json({
            success: false,
            error: 'Failed to send notification',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Jays Tattoos Notification Service running on port ${PORT}`);
    console.log(`📱 SMS notifications will be sent to: ${artistPhoneNumber || 'NOT CONFIGURED'}\n`);
    
    if (!accountSid || !authToken || !twilioPhoneNumber || !artistPhoneNumber) {
        console.warn('⚠️  WARNING: Twilio credentials not fully configured!');
        console.warn('   Please check your .env file.\n');
    }
});
