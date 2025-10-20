document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // REPLACE THIS WITH YOUR KEY
    const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

    const sendMessage = async () => {
        const userText = userInput.value.trim();
        if (userText === '') return;

        // Display user's message
        appendMessage(userText, 'user-message');
        userInput.value = '';

        // Display "typing" indicator
        const typingMessage = appendMessage('...', 'bot-message');

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // You can use other models like gpt-4o
                    messages: [{ role: "user", content: userText }],
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message);
            }

            const data = await response.json();
            const botText = data.choices[0].message.content;

            // Update the "typing" message with the bot's response
            typingMessage.querySelector('p').textContent = botText;
        } catch (error) {
            console.error("Error fetching AI response:", error);
            typingMessage.querySelector('p').textContent = "Sorry, there was an error. Please try again.";
        }
    };

    const appendMessage = (text, className) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        const p = document.createElement('p');
        p.textContent = text;
        messageDiv.appendChild(p);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    };

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
