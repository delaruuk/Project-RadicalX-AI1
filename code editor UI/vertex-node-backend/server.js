const express = require('express');
const cors = require('cors');
const axios = require('axios');

const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 8000;  

// Middleware
app.use(cors());
app.use(express.json());

// Route to handle code compilation or any other requests using the API key
app.post('/api-endpoint', async (req, res) => {
    try {
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
        
        const { temperature, max_tokens } = req.body; 
        
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: prompt,
            temperature: temperature,
            max_tokens: max_tokens
        }, {
            headers: {
                'Authorization': 'Bearer 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'
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process the request.' });
    }
});

app.post('/api/execute-code', (req, res) => {
    // Extract data from request
    const { code, language, input } = req.body;

    switch(language) {
        case 'python':
            exec(`echo "${code}" | python3`, (error, stdout, stderr) => {
                if(error) {
                    console.error(`exec error: ${error}`);
                    return res.status(500).json({ output: 'Error executing Python code.' });
                }
                res.json({ output: stdout });
            });
            break;

        case 'javascript':
            exec(`echo "${code}" | node`, (error, stdout, stderr) => {
                if(error) {
                    console.error(`exec error: ${error}`);
                    return res.status(500).json({ output: 'Error executing JavaScript code.' });
                }
                res.json({ output: stdout });
            });
            break;

        case 'java':
            // Write code to a temp file, compile and execute
            fs.writeFileSync('Temp.java', code);
            exec('javac Temp.java', (compileError) => {
                if(compileError) {
                    console.error(`compile error: ${compileError}`);
                    return res.status(500).json({ output: 'Error compiling Java code.' });
                }
                exec('java Temp', (runError, stdout, stderr) => {
                    if(runError) {
                        console.error(`run error: ${runError}`);
                        return res.status(500).json({ output: 'Error executing Java code.' });
                    }
                    res.json({ output: stdout });
                });
            });
            break;

        default:
            res.status(400).json({ output: 'Unsupported language.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
