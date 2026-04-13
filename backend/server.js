require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ROUTES
const propertyRouter = require('./routes/propertyRoutes');
const authRoutes = require('./routes/auth.routes');

// DB
require('./config/db');

const app = express();

// ================= MIDDLEWARES =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use('/api/properties', propertyRouter);
app.use('/api/auth', authRoutes);

// ================= HOME ROUTE =================
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Real Estate API is live and healthy.'
    });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});



// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});