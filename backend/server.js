require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const propertyRouter = require('./routes/propertyRoutes');
const featureRouter = require('./routes/featureRoutes');

require('./config/db');
const app = express();


// 1. GLOBAL MIDDLEWARES
app.use(cors());
app.use(express.json());

app.use('/api/properties', propertyRouter);
app.use('/api/features', featureRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. ROUTES (We will add more here later)
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Real Estate API is live and healthy.'
    });
});


// 3. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

// 4. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});