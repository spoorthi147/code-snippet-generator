const historyList = document.getElementById("history-list");
let history = [];

async function generateCode() {
    const promptBox = document.getElementById("prompt");
    const prompt = promptBox.value.trim();
    const output = document.getElementById("output");

    if (!prompt) return;

    output.textContent = "Generating...";

    addToHistory(prompt);

    const response = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    output.textContent = data.code;
}

/* -------- HISTORY HANDLING -------- */

function addToHistory(prompt) {
    // Remove if already exists
    history = history.filter(item => item !== prompt);

    // Add to top
    history.unshift(prompt);

    // Limit history size (optional, professional touch)
    if (history.length > 10) {
        history.pop();
    }

    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.length > 40 ? item.slice(0, 40) + "…" : item;
        li.title = item;

        li.onclick = () => {
            document.getElementById("prompt").value = item;
        };

        historyList.appendChild(li);
    });

    if (history.length === 0) {
        historyList.innerHTML = `<li class="hint">Your prompts appear here</li>`;
    }
}

/* -------- COPY BUTTON -------- */

function copyCode() {
    const output = document.getElementById("output");
    navigator.clipboard.writeText(output.textContent);

    const icon = document.querySelector(".copy-btn i");
    icon.className = "fa-solid fa-check";

    setTimeout(() => {
        icon.className = "fa-regular fa-copy";
    }, 1200);
}


