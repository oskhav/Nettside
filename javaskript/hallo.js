document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("hangman-canvas");
    const ctx = canvas.getContext("2d");

    const words = ["javascript", "hangman", "frontend", "developer"];
    const word = words[Math.floor(Math.random() * words.length)];
    let guessedWord = Array(word.length).fill("_");
    let wrongGuesses = 0;
    const maxWrongGuesses = 10;
    const guessedLetters = new Set();

    const wordDisplay = document.getElementById("word-display");
    const messageDisplay = document.getElementById("message");
    const guessInput = document.getElementById("guess-input");
    const submitButton = document.getElementById("submit-button");

    function updateWordDisplay() {
        wordDisplay.textContent = guessedWord.join(" ");
    }

    function drawHangman(step) {
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;

        if (step === 1) {
            ctx.beginPath();
            ctx.moveTo(20, 230);
            ctx.lineTo(180, 230); // Base
            ctx.stroke();
        } else if (step === 2) {
            ctx.beginPath();
            ctx.moveTo(50, 230);
            ctx.lineTo(50, 20); // Pole
            ctx.stroke();
        } else if (step === 3) {
            ctx.beginPath();
            ctx.moveTo(50, 20);
            ctx.lineTo(150, 20); // Beam
            ctx.stroke();
        } else if (step === 4) {
            ctx.beginPath();
            ctx.moveTo(150, 20);
            ctx.lineTo(150, 50); // Rope
            ctx.stroke();
        } else if (step === 5) {
            ctx.beginPath();
            ctx.arc(150, 70, 20, 0, Math.PI * 2); // Head
            ctx.stroke();
        } else if (step === 6) {
            ctx.beginPath();
            ctx.moveTo(150, 90);
            ctx.lineTo(150, 150); // Body
            ctx.stroke();
        } else if (step === 7) {
            ctx.beginPath();
            ctx.moveTo(150, 100);
            ctx.lineTo(120, 130); // Left arm
            ctx.stroke();
        } else if (step === 8) {
            ctx.beginPath();
            ctx.moveTo(150, 100);
            ctx.lineTo(180, 130); // Right arm
            ctx.stroke();
        } else if (step === 9) {
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.lineTo(120, 190); // Left leg
            ctx.stroke();
        } else if (step === 10) {
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.lineTo(180, 190); // Right leg
            ctx.stroke();
        }
    }

    function activateGameOverEffect() {
        const overlay = document.getElementById("game-over-overlay");
        overlay.style.display = "flex";

        // Spill en dramatisk lyd (valgfritt)
        const audio = new Audio("game-over-sound.mp3"); // Bytt til en faktisk lydfil
        audio.play();
    }

    function checkWin() {
        if (guessedWord.join("") === word) {
            messageDisplay.textContent = "Congratulations! You guessed the word!";
            guessInput.disabled = true;
            submitButton.disabled = true;
        }
    }

    function checkLoss() {
        if (wrongGuesses >= maxWrongGuesses) {
            messageDisplay.textContent = `Game Over! The word was "${word}".`;
            guessInput.disabled = true;
            submitButton.disabled = true;
            activateGameOverEffect();
        }
    }

    submitButton.addEventListener("click", () => {
        const guess = guessInput.value.toLowerCase();
        guessInput.value = "";

        if (!guess || guessedLetters.has(guess)) {
            messageDisplay.textContent = "Please enter a new letter.";
            return;
        }

        guessedLetters.add(guess);

        if (word.includes(guess)) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] === guess) {
                    guessedWord[i] = guess;
                }
            }
            messageDisplay.textContent = "Good guess!";
        } else {
            wrongGuesses++;
            drawHangman(wrongGuesses);
            messageDisplay.textContent = "Wrong guess!";
        }

        updateWordDisplay();
        checkWin();
        checkLoss();
    });

    // Initialize the game
    updateWordDisplay();
});
