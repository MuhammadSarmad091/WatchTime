const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviesflix', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

//Models
const User = require('./models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

//Routes
app.use('/account', accountRoutes);

module.exports = app

