const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files like HTML, CSS, JS

const WORDS_FILE = "./words.json"; // Ensure this path is correct

// Get the list of words
app.get("/words", (req, res) => {
    fs.readFile(WORDS_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading words data");
        }
        res.send(JSON.parse(data));
    });
});

// Add a new word (admin functionality)
app.post("/addWord", (req, res) => {
    const { word } = req.body;
    if (!word) {
        return res.status(400).send("Word is required");
    }

    fs.readFile(WORDS_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading words data");
        }

        let words = JSON.parse(data);
        words.push({ word, upvotes: 0, downvotes: 0 });

        fs.writeFile(WORDS_FILE, JSON.stringify(words), (err) => {
            if (err) {
                return res.status(500).send("Error saving word");
            }
            res.send({ message: "Word added successfully", words });
        });
    });
});

// Vote on a word (upvote or downvote)
app.post("/vote", (req, res) => {
    const { word, voteType } = req.body; // voteType can be 'upvote' or 'downvote'

    fs.readFile(WORDS_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading words data");
        }

        let words = JSON.parse(data);
        let wordItem = words.find((w) => w.word === word);
        if (wordItem) {
            if (voteType === "upvote") {
                wordItem.upvotes++;
            } else if (voteType === "downvote") {
                wordItem.downvotes++;
            }

            fs.writeFile(WORDS_FILE, JSON.stringify(words), (err) => {
                if (err) {
                    return res.status(500).send("Error saving vote");
                }
                res.send({ message: "Vote recorded", words });
            });
        } else {
            res.status(404).send("Word not found");
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
