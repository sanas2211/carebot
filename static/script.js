const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const clearBtn = document.getElementById("clear-history-btn");

// Load saved chat history
chatBox.innerHTML = localStorage.getItem("chatHistory") || "";
toggleClearBtn();
scrollToBottom();

// Add message to chat
function addMsg(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  saveChat();
  scrollToBottom();
  toggleClearBtn();
}

// Smooth scroll to bottom
function scrollToBottom() {
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
}

// Save chat state
function saveChat() {
  localStorage.setItem("chatHistory", chatBox.innerHTML);
}

// Handle form submission
chatForm.onsubmit = async (e) => {
  e.preventDefault();
  const msg = userInput.value.trim();
  if (!msg) return;

  addMsg("user", msg);
  userInput.value = "";
  addMsg("bot", "💬 Typing...");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    const data = await res.json();
    chatBox.lastChild.remove(); // remove "Typing..."
    addMsg("bot", data.response);
  } catch (err) {
    chatBox.lastChild.remove(); // remove "Typing..."
    addMsg("bot", "⚠️ Couldn't connect to the server.");
  }
};

// Clear chat history
clearBtn.onclick = () => {
  chatBox.innerHTML = "";
  localStorage.removeItem("chatHistory");
  toggleClearBtn();
};

// Show/hide clear button
function toggleClearBtn() {
  clearBtn.style.display = chatBox.innerHTML.trim() ? "block" : "none";
}
