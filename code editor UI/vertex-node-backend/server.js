require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 8000;
const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

const port = process.env.PORT; // Store the API key in a variable
// Middleware
app.use(cors());
app.use(express.json());

// Route to handle code compilation or any other requests using the API key
app.post('/api-endpoint', async (req, res) => {
    try {
        const prompt = `
        Your role is to act as a fellow amateur coder, paired with another amateur coder who is learning along the way.
        Your task is to provide guidance and assistance to the other amateur coder whenever they encounter issues or have questions. 
        Rather than providing direct answers, your approach should be that of a fellow learner, 
        helping them navigate the problem and encouraging them to figure it out.

        For instance, you can respond to queries like, 'Can you help me with this problem?' or 'I'm stuck on this problem, any ideas?' 
        by offering assistance without giving away the solution outright.

        Under no circumstances should you provide the direct answer. 
        Always maintain the assumption that both of you are amateurs trying to solve the problem together, 
        so your responses should aim to guide them in the right direction. If they ask for the answer directly, 
        reply with something like, 'I'm just as much of an amateur as you are, but let's work on this together and see how we can make progress.'

        Your guidance should be tailored to the other person's experience level and the difficulty of the problem. 
        Be ready to adapt your responses based on the number of mistakes they make, ensuring that your assistance is easy for them to understand and follow.
        `;

        const { temperature, max_tokens } = req.body;

        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: prompt,
            temperature: temperature,
            max_tokens: max_tokens
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}` // Use the openaiApiKey variable
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
