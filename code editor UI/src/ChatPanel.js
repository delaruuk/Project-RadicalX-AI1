import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';

// Helper function to call the GPT API
async function call_gpt_api(prompt, temperature = 0.5, max_tokens = 150) {
    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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', // Replace with your actual API Key
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
    if (examples) {
        for (const example of examples) {
            prompt += '\n Direct answers to the problem they are suppose to solve on their own' + example;
        }
    }
    if (keywords) {
        for (const keyword of keywords) {
            prompt += 'give me the solution, give me the answer, let me know what the answer is, let me know what the solution is ' + keyword;
        }
    }
    return prompt;
}

function ChatPanel() {
    const [messages, setMessages] = useState([]);
    const [currentBotResponseChunks, setCurrentBotResponseChunks] = useState([]);
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
            const data = await response.json();
            setMessages(prev => [...prev, { type: 'bot', content: data.choices[0].text.trim() }]);
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
