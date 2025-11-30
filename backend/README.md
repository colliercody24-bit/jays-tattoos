# Jays Tattoos Backend Notification Service

Backend API for handling appointment notifications via SMS using Twilio.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Get Twilio Credentials

1. Sign up for a free Twilio account at https://www.twilio.com/try-twilio
2. Get your **Account SID** and **Auth Token** from the Twilio Console
3. Get a Twilio phone number (free trial includes one)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+15551234567
   ARTIST_PHONE_NUMBER=+15559876543
   PORT=3000
   ```

### 4. Start the Server

**Development mode (auto-restart on changes):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on http://localhost:3000

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Send Notification
```
POST /api/notify
Content-Type: application/json

{
  "intent": "schedule|change|cancel",
  "payload": {
    "name": "John Doe",
    "date": "December 1, 2025",
    "time": "2:00 PM",
    "contact": "john@example.com",
    "notes": "Optional notes"
  },
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "messageSid": "SMxxxxxxxxxxxxxxxxxxxxx",
  "intent": "schedule",
  "sentAt": "2025-11-26T10:30:15.123Z"
}
```

## SMS Message Format

### New Appointment
```
🆕 NEW APPOINTMENT

Name: John Doe
Date: December 1, 2025
Time: 2:00 PM
Contact: john@example.com

Requested: 11/26/25, 10:30 AM
```

### Changed Appointment
```
🔄 APPOINTMENT CHANGED

Name: John Doe
New Date: December 5, 2025
New Time: 4:00 PM
Contact: john@example.com

Changed: 11/26/25, 10:30 AM
```

### Canceled Appointment
```
❌ APPOINTMENT CANCELED

Name: John Doe
Date: December 1, 2025
Notes: Schedule conflict

Canceled: 11/26/25, 10:30 AM
```

## Deployment Options

### Option 1: Local Network (Testing)
Run on your local machine. Frontend must connect to `http://localhost:3000`

### Option 2: Cloud Hosting (Production)

**Recommended services:**
- **Heroku**: Easy deployment, free tier available
- **Railway**: Modern platform, simple setup
- **Render**: Free tier with auto-deploy from Git
- **AWS/Azure**: More control, requires more setup

**Steps for Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create jays-tattoos-api
git init
git add .
git commit -m "Initial backend"
git push heroku main
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set TWILIO_PHONE_NUMBER=+15551234567
heroku config:set ARTIST_PHONE_NUMBER=+15559876543
```

After deployment, update the frontend `script.js` with your production URL:
```javascript
const NOTIFY_ENDPOINT = 'https://jays-tattoos-api.herokuapp.com/api/notify';
```

## Testing

Test the API using curl:

```bash
curl -X POST http://localhost:3000/api/notify \
  -H "Content-Type: application/json" \
  -d "{\"intent\":\"schedule\",\"payload\":{\"name\":\"Test User\",\"date\":\"Dec 1\",\"time\":\"2pm\",\"contact\":\"test@email.com\"},\"timestamp\":\"2025-11-26T10:00:00Z\"}"
```

## Troubleshooting

**No SMS received?**
- Check Twilio console for error messages
- Verify phone numbers are in E.164 format (+1234567890)
- Ensure trial account has verified the recipient number
- Check server logs for errors

**Server won't start?**
- Verify all dependencies installed (`npm install`)
- Check `.env` file exists and has correct values
- Ensure port 3000 isn't already in use

**CORS errors?**
- Verify frontend domain is allowed in CORS settings
- Check network tab in browser DevTools for errors

## Cost Estimate

**Twilio Pricing (as of 2025):**
- SMS to US/Canada: ~$0.0079 per message
- Phone number rental: ~$1.15/month

**Free tier:** $15.50 credit (enough for ~2000 SMS messages)

For a small tattoo business, monthly costs are typically under $5.
