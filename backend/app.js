const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const accountRouter = require('./routes/account');
const tmdbRouter = require('./routes/tmdb');
const localRouter = require('./routes/local')

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviesflix')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

//Models

//Routes
app.use('/account', accountRouter);
app.use('/tmdb',tmdbRouter);
app.use('/local',localRouter)

/*
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
}
);
*/
module.exports = app

