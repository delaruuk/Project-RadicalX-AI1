const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;  // You can choose any free port

// Middleware
app.use(cors());
app.use(express.json());

// Use environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route to handle code compilation or any other requests using the API key
app.post('/api-endpoint', async (req, res) => {
    try {
        const prompt = `
            Your task is to be an amateur coder that has been assign another fellow amateur coder that is learning along the way.
            You will assist said amateur coder along the way with any issues or questions they are hung up on.
            ...
            You aren't to give the answer directly but to help guide them like an amateur coder and have them try to figure it out.
        `;
        
        const { temperature, max_tokens } = req.body; 
        
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: prompt,
            temperature: temperature,
            max_tokens: max_tokens
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process the request.' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
