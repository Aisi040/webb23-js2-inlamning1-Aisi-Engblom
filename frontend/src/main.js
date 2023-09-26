let currentScore = 0;  // Tracks the current score of the player.
let currentPlayerName = '';  // Holds the name of the player.

// Initiates the game by displaying the game area if a name is provided.
function startGame() {
    currentPlayerName = document.getElementById('playerName').value;
    
    if (currentPlayerName) {
        document.getElementById('gameArea').style.display = 'block';
    } else {
        alert('Ange ditt namn för att starta spelet.');
    }
}

window.startGame = startGame;

// Executes a round of the game based on the player's choice.
function playRound(playerChoice) {
    const choices = ['sten', 'sax', 'påse'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];  // Randomly selects computer's choice.
    
    // Display player's and computer's choices.
    document.getElementById('playerChoice').textContent = playerChoice;
    document.getElementById('computerChoice').textContent = computerChoice;

    // Determine the winner of the round.
    if (playerChoice === computerChoice) {
        document.getElementById('winner').textContent = 'Oavgjort!';
    } else if (
        (playerChoice === 'sten' && computerChoice === 'sax') ||
        (playerChoice === 'sax' && computerChoice === 'påse') ||
        (playerChoice === 'påse' && computerChoice === 'sten')
    ) {
        currentScore++;
        document.getElementById('winner').textContent = 'Du vann!';
    } else {
        document.getElementById('winner').textContent = 'Datorn vann!';
        if (currentScore > 0) {
            // Update highscore if a new record is achieved.
            fetch('http://localhost:3000/highscores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: currentPlayerName, score: currentScore })
            }).then(() => {
                currentScore = 0;
                document.getElementById('score').textContent = currentScore;
                GetHighscores();
            });
        }
    }
    document.getElementById('score').textContent = currentScore;
}

window.playRound = playRound;

// Fetches and displays the highscore list from the server.
function GetHighscores() {
    fetch('http://localhost:3000/highscores')
        .then(response => response.json())
        .then(data => {
            const highscoresList = document.getElementById('highscores');
            highscoresList.innerHTML = '';
            data.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `${entry.name}: ${entry.score}`;
                highscoresList.append(li);
            });
        });
}

// Load highscores when the page is loaded.
GetHighscores();
