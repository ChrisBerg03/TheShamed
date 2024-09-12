let currentUser = null;
let currentRole = null; // Tracks the role (admin/user)

// Fake user validation function
const users = {
    admin: { password: "adminpassword", role: "admin" },
    user: { password: "userpassword", role: "user" },
};

// Fetch the words from the server
async function fetchWords() {
    const response = await fetch("/words");
    const words = await response.json();
    return words;
}

// Render words dynamically
async function renderWords() {
    const words = await fetchWords();
    if (currentRole === "admin") {
        renderWordsAdmin(words);
    }
    renderWordsUser(words);
}

// Render words for admin (with editing options)
function renderWordsAdmin(words) {
    const wordList = document.getElementById("wordList");
    wordList.innerHTML = "";
    words.forEach((word) => {
        const li = document.createElement("li");
        li.className = "word";
        li.innerHTML = `
            <span>${word.word}</span>
            <button onclick="removeWord('${word.word}')">Remove</button>
        `;
        wordList.appendChild(li);
    });
}

// Render words for users (with voting options)
function renderWordsUser(words) {
    const wordListUser = document.getElementById("wordListUser");
    wordListUser.innerHTML = "";
    words.forEach((word) => {
        const li = document.createElement("li");
        li.className = "word";
        li.innerHTML = `
            <span>${word.word} (Upvotes: ${word.upvotes}, Downvotes: ${word.downvotes})</span>
            <button onclick="vote('${word.word}', 'upvote')">Upvote</button>
            <button onclick="vote('${word.word}', 'downvote')">Downvote</button>
        `;
        wordListUser.appendChild(li);
    });
}

// Login function
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if the user exists in the mock users object
    if (users[username] && users[username].password === password) {
        currentUser = username;
        currentRole = users[username].role;

        // Hide the login section
        document.getElementById("loginSection").style.display = "none";

        // Show appropriate sections based on the role
        if (currentRole === "admin") {
            document.getElementById("adminSection").style.display = "block";
        }
        document.getElementById("votingSection").style.display = "block";

        // Render the words
        renderWords();
    } else {
        document.getElementById("loginError").textContent =
            "Invalid login credentials";
    }
}

// Add a word (admin functionality)
async function addWord() {
    const newWord = document.getElementById("newWord").value;
    const response = await fetch("/addWord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: newWord }),
    });
    const result = await response.json();
    renderWords();
}

// Voting functionality (users)
async function vote(word, voteType) {
    await fetch("/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, voteType }),
    });
    renderWords();
}

// Initial render
renderWords();
