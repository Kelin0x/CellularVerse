require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// IPFS上传接口
app.post('/api/upload', async (req, res) => {
    try {
        console.log('Received upload request:', req.body);

        if (!req.body || !req.body.aliveCells) {
            throw new Error('Invalid request data');
        }

        const response = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            {
                pinataMetadata: {
                    name: req.body.name || 'Unnamed Pattern',
                },
                pinataContent: req.body
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
                }
            }
        );

        console.log('Upload successful:', response.data);
        res.json({ ipfsHash: response.data.IpfsHash });
    } catch (error) {
        console.error('Upload failed:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data || 'No additional details'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', {
        hasPinataKey: !!process.env.PINATA_API_KEY,
        hasPinataSecret: !!process.env.PINATA_SECRET_KEY
    });
});