import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
// Access the OpenAI API key from environment variables
const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

const port = process.env.PORT;

// Helper function to call the GPT API
async function call_gpt_api(prompt, temperature = 0.5, max_tokens = 30) {
    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`, // Use the openaiApiKey variable
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                temperature: temperature,
                max_tokens: max_tokens
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}



// Helper function to enhance the prompts of GPT
function engineer_gpt_prompts(prompt, examples=null, keywords=null) {
    const promptText = "Your role is to act as a fellow amateur coder, paired with another amateur coder who is learning along the way. Your task is to provide guidance and assistance to the other amateur coder whenever they encounter issues or have questions. Rather than providing direct answers, your approach should be that of a fellow learner, helping them navigate the problem and encouraging them to figure it out.";

    const examples = [
      "For instance, you can respond to queries like, 'Can you help me with this problem?' or 'I'm stuck on this problem, any ideas?' by offering assistance without giving away the solution outright. ",
      "Under no circumstances should you provide the direct answer. Always maintain the assumption that both of you are amateurs trying to solve the problem together, so your responses should aim to guide them in the right direction. If they ask for the answer directly, reply with something like, 'I'm just as much of an amateur as you are, but let's work on this together and see how we can make progress.' ",
      "Your guidance should be tailored to the other person's experience level and the difficulty of the problem. Be ready to adapt your responses based on the number of mistakes they make, ensuring that your assistance is easy for them to understand and follow. "
    ];
    
    const prompt = engineer_gpt_prompts(promptText, examples);
    
    console.log(prompt);
}

function ChatPanel() {
    const [messages, setMessages] = useState([]);
    const [currentBotResponseChunks] = useState([]);
    const [isBotTyping, setIsBotTyping] = useState(false);

    const messagesContainerRef = React.useRef(null);

    useEffect(() => {
        messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentBotResponseChunks]);

    const handleUserSubmit = async (query) => {
        setMessages([...messages, { type: 'user', content: query }]);
        setIsBotTyping(true);
    
        try {
            const enhancedPrompt = engineer_gpt_prompts(query);
            const response = await call_gpt_api(enhancedPrompt);
    
            if (response && response.choices && response.choices.length > 0) {
                const responseData = response.choices[0];
                setMessages((prev) => [
                    ...prev,
                    { type: 'bot', content: responseData.text.trim() },
                ]);
            } else {
                console.error('No valid response from the API.');
            }
    
            setIsBotTyping(false);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    
    
    

    return (
        <div className="chat-panel">
        <h4>ReX</h4>
            <MessageList messages={messages} currentBotResponseChunks={currentBotResponseChunks} ref={messagesContainerRef} />
            <InputArea onSubmit={handleUserSubmit} isBotTyping={isBotTyping} />
        </div>
    );
}

export default ChatPanel;



