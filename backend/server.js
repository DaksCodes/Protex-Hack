const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/fire-stats', async (req, res) => {
    try {
        console.log("React requested, fetching from ML");
        const mlResponse = await axios.get('http://localhost:8000/api/ml/fire-inputs');
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

app.listen(PORT, () => {
    console.log(`Expressis running on http://localhost:${PORT}`);
});