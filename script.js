const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const API_KEY = "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"; // Get your API key from OpenAI

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userText = userInput.value.trim();
    if (userText === '') return;

    // Display user's message
    appendMessage(userText, 'user-message');
    userInput.value = '';

    // Call the OpenAI API
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userText}]
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();
        const aiText = data.choices[0].message.content;

        // Display AI's response
        appendMessage(aiText, 'ai-message');

    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        appendMessage("Sorry, I'm having trouble connecting right now.", 'ai-message');
    }
}

function appendMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerText = text;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
}
