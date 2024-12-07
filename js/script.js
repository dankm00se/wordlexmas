const word = "PVRIS"; // The correct word
const maxGuesses = 6;
let currentGuess = "";
let attempts = [];
const delay = 500; // Delay between flipping letters in milliseconds
let dictionary= [];

const grid = document.getElementById("grid");
const message = document.getElementById("message");

// Initialize the grid
function initGrid() {
    for (let i = 0; i < maxGuesses * word.length; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        grid.appendChild(cell);
    }
}
// Get dictionary of words
async function getFile(fileURL){
    let fileContent = await fetch(fileURL);
    fileContent = await  fileContent.text();
    return fileContent;
}

// Passing file url 
getFile('../shuffled_real_wordles.txt').then(content =>{
    // Using split method and passing "\n" as parameter for splitting
    dictionary =  content.trim().split("\n");
    console.log(dictionary);
}).catch(error =>{
    console.log(error);
});

// Handle a new guess
function handleGuess() {
    if (currentGuess.length !== word.length) {
        setMessage("Not enough letters!");
        return;
    }
    if (!dictionary.includes(currentGuess)){
        setMessage("Not in word list!");
        return;
    }

    let result = checkGuess(currentGuess);
    attempts.push(currentGuess);
    revealGuess(result);

    if (result.every((r) => r === "correct")) {
        setMessage("You guessed it!");
    } else if (attempts.length === maxGuesses) {
        setMessage(`The word was ${word}`);
    }

    currentGuess = "";
}

// Reveal the guess with animations
function revealGuess(result) {
    const startIndex = (attempts.length - 1) * word.length;
    const cells = document.querySelectorAll(".cell");

    result.forEach((status, i) => {
        const cell = cells[startIndex + i];
        setTimeout(() => {
            cell.textContent = currentGuess[i];
            cell.classList.add("flip");
            cell.addEventListener("animationend", () => {
                cell.classList.remove("flip");
                cell.classList.add(status);
            });
        }, i * delay); // Apply delay for each letter
    });
}

// Check the guess
function checkGuess(guess) {
    const result = Array(word.length).fill("absent");
    const wordLetters = word.split("");

    guess.split("").forEach((letter, i) => {
        if (word[i] === letter) {
            result[i] = "correct";
            wordLetters[i] = null;
        } else if (wordLetters.includes(letter)) {
            result[i] = "present";
            wordLetters[wordLetters.indexOf(letter)] = null;
        }
    });

    return result;
}

// Set the message
function setMessage(msg) {
    message.textContent = msg;
}

// Mockup test: Simulate a guess
function testAnimation() {
    currentGuess = "PRVIS";
    handleGuess();
}

// Initialize the grid and run the test
initGrid();
setTimeout(testAnimation, 1000);
