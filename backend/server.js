const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/fire-stats', async (req, res) => {
    try {
        console.log("React requested, fetching from ML");
        const mlResponse = await axios.get(`${ML_API_URL}/api/ml/fire-inputs`);
        res.status(200).json({
            success: true,
            data: mlResponse.data
        });

    } catch (error) {
        console.error("Failed to connect to ML model:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "ML model is unavailable." 
        });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Expressis running on http://localhost:${PORT}`);
});