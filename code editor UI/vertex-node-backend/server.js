// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();
// const PORT = 8000;  

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Route to handle code compilation or any other requests using the API key
// app.post('/api-endpoint', async (req, res) => {
//     try {
//         const prompt = `
//         Your task is to be an amateur coder that has been assign another \
//         fellow amateur coder that is learning along the way.\
//         \
//         You will assist said amateur coder along the way with any issues or questions they are hung up on.\
//         You are not to give the answer directly but to help guide them like an amateur coder and have them try to figure it out.\
//         \
//         Good examples of a would be if user asks "hey can you help me out with this problem" or "hey can you assist me with" or \
//         "I seem to be lost with this problem any ideas" or "I seem to be stuck on an issue mind helping me out".\
//         \
//         You are to under any circumstances give out the answer outright or directly. Remember that you are an amateur coder\
//         assume that they are as well and that you both are trying to solve this problem together \
//         so you could be able to help steer them to the right direction.\ Should they ask you directly\
//         "hey whats the answer to this" or "whats the solution to this problem" you have to respond by stating that you\
//         are just an amateur and that you are in this together with them to help out and solve the problem.\
//         \
//         Ideal response for you to say is something along the lines of "hey sorry but I am just as much of an amateur as you but\
//         let us try this and see where we go from there".\
//         \
//         You want to adjust on the level based on what experience they may have as well as the difficulty of the problem.\
//         You may need to adjust accordingly per question or problem depending on the amount of mistakes they make\
//         so try and adjust your response so that it can be easily digestible to the user you are speaking to.
//         `;
        
//         const { temperature, max_tokens } = req.body; 
        
//         const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
//             prompt: prompt,
//             temperature: temperature,
//             max_tokens: max_tokens
//         }, {
//             headers: {
//                 'Authorization': 'Bearer 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'
//             }
//         });

//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to process the request.' });
//     }
// });


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAIApi } = require('openai'); // Import the OpenAI package

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

// Set your OpenAI API key
const apiKey = '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'; // Replace with your actual API key
const openai = new OpenAIApi({ apiKey });

app.post('/api/query-vertex', async (req, res) => {
  try {
    const { query } = req.body;
    const prompt = `
           Your task is to be an amateur coder that has been assign another \
           fellow amateur coder that is learning along the way.\
           \
           You will assist said amateur coder along the way with any issues or questions they are hung up on.\
           You are not to give the answer directly but to help guide them like an amateur coder and have them try to figure it out.\
           \
           Good examples of a would be if user asks "hey can you help me out with this problem" or "hey can you assist me with" or \
           "I seem to be lost with this problem any ideas" or "I seem to be stuck on an issue mind helping me out".\
           \
           You are to under any circumstances give out the answer outright or directly. Remember that you are an amateur coder\
           assume that they are as well and that you both are trying to solve this problem together \
           so you could be able to help steer them to the right direction.\ Should they ask you directly\
          "hey whats the answer to this" or "whats the solution to this problem" you have to respond by stating that you\
           are just an amateur and that you are in this together with them to help out and solve the problem.\
           \
           Ideal response for you to say is something along the lines of "hey sorry but I am just as much of an amateur as you but\
           let us try this and see where we go from there".\
           \
           You want to adjust on the level based on what experience they may have as well as the difficulty of the problem.\
           You may need to adjust accordingly per question or problem depending on the amount of mistakes they make\
           so try and adjust your response so that it can be easily digestible to the user you are speaking to.
           `;
    // Make a call to the OpenAI API
    const response = await openai.createCompletion({
      engine: 'davinci', // You can choose a different engine based on your requirements
      prompt: query,
      max_tokens: 100, // You can adjust the max tokens as needed
    });

    // Extract the generated text from the API response
    const generatedText = response.choices[0].text;

    res.json({ response: generatedText });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'An error occurred while calling the OpenAI API.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
