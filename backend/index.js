const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

function getHighscores() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'highscores.json'), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading highscores:", error);
        return [];
    }
}

function addHighscore(newScore) {
    try {
        const highscores = getHighscores();
        highscores.push(newScore);
        const sortedHighscores = highscores.sort((a, b) => b.score - a.score).slice(0, 5);
        fs.writeFileSync(path.join(__dirname, 'highscores.json'), JSON.stringify(sortedHighscores, null, 2));
    } catch (error) {
        console.error("Error adding highscore:", error);
    }
}

app.get('/', (req, res) => {
    res.send('Välkommen till Sten-Sax-Påse server!');
});

app.get('/highscores', (req, res) => {
    res.json(getHighscores());
});

app.post('/highscores', (req, res) => {
    const newScore = req.body;

    // Validering
    if (typeof newScore.name !== 'string' || typeof newScore.score !== 'number') {
        return res.status(400).json({ status: 'error', message: 'Invalid data format' });
    }

    addHighscore(newScore);
    res.json({ status: 'success' });
});

app.listen(PORT, () => {
    console.log(`Servern kör på http://localhost:${PORT}`);
});
