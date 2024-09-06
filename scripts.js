const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const API_KEY = "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"; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className, isLoading = false) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    
    let chatContent;
    if (className === "incoming") {
        chatContent = isLoading 
            ? `<span class="loader"></span>` 
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    } else {
        chatContent = `<p></p>`;
    }
    
    chatLi.innerHTML = chatContent;
    if (!isLoading) {
        chatLi.querySelector("p").textContent = message;
    }
    
    return chatLi;
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const loaderElement = chatElement.querySelector(".loader");
    const messageElement = document.createElement("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "ft:gpt-3.5-turbo-1106:personal::A4NqgVG8",
            messages: [
                {
                    role: "system",
                    content: "You are a 'Chat AI'.You are an AI assistant which can give answers related to it's trained data and natural disasters phenomenally. You answer professionally and precisely and gives answer to asked question only."
                },
                { role: "user", content: userMessage }
            ],
            temperature: 0.4,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0.1,
            presence_penalty: 0
        })
    }


    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
        loaderElement.replaceWith(messageElement);
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
        loaderElement.replaceWith(messageElement); 
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); 
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display loader while waiting for the response
        const incomingChatLi = createChatLi("", "incoming", true);
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

function setQuery(query) {
    document.getElementById('user-query').value = query;
}

document.querySelector('.chatbot-toggler').addEventListener('click', () => {
    document.querySelector('.chatbot').classList.toggle('active');
});

document.querySelector('.close-btn').addEventListener('click', () => {
    document.querySelector('.chatbot').classList.remove('active');
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
