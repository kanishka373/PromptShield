require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet =require('helmet');
const rateLimit=require('express-rate-limit');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

const scanLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 20,                   // max 20 requests per IP per minute
  message: { message: 'Too many scan requests, please try again in a minute.' }
});

app.use('/api/scan', scanLimiter);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scans', require('./routes/scanRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'PromptShield API Running ✅' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});