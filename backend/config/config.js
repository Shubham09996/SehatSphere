// This file will contain environment-specific configurations.
// For now, dotenv is configured in server.js to load environment variables.
// Future configurations like JWT secret, API keys can be exported from here.

const config = {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
        recordedCallUrl: process.env.TWILIO_RECORDED_CALL_URL,
    },
    googleGemini: {
        apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    googleAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
};

export default config;
