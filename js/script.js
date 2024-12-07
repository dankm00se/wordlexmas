const word = "PVRIS"; // The correct word
const maxGuesses = 6;
let currentGuess = "";
let attempts = [];
const delay = 500; // Delay between flipping letters in milliseconds
let dictionary= [];

const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const gift = document.getElementById("gift");

// Get dictionary of words
async function getFile(fileURL){
    let fileContent = await fetch(fileURL);
    fileContent = await  fileContent.text();
    return fileContent;
}

// Initialize the grid
function initGrid() {
    for (let i = 0; i < maxGuesses * word.length; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        grid.appendChild(cell);
    }
}
//document.getElementById("delete").onclick = handleDelete;
//document.getElementById("enter").onclick = handleGuess;


function handleKeyPress(letter) {
    if (currentGuess.length < word.length) {
        currentGuess += letter;
        updateGrid();
    }
}

document.querySelectorAll(".key").forEach((button) => {
    button.addEventListener("click", () => {
        const letter = button.textContent.trim();
        if (letter === "Enter") {
            handleGuess();
        } else if (letter === "Del") {
            handleDelete();
        } else {
            handleKeyPress(letter);
        }
    });
});

function handleDelete() {
    currentGuess = currentGuess.slice(0, -1);
    updateGrid();
}


// Handle a new guess
function handleGuess() {
    if (currentGuess.length !== word.length) {
        setMessage("Not enough letters!");
        return;
    }
    if (!dictionary.includes(currentGuess.toLowerCase())){
        setMessage(currentGuess + " not in word list!");
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
    updateGrid();
    updateKeyboard(result);
}

// Reveal the guess with animations
function revealGuess(result) {
    const startIndex = (attempts.length - 1) * word.length;
    const cells = document.querySelectorAll(".cell");

    result.forEach((status, i) => {
        const cell = cells[startIndex + i];
        const letter = currentGuess[i];
        setTimeout(() => {
            cell.setAttribute("data-letter", letter);
            cell.textContent = letter;
            cell.classList.add("flip");
            
            // Listen for the `animationend` event
            cell.addEventListener("animationend", function onFlipEnd() {
                cell.classList.add(status); // Apply the correct color class
                cell.removeEventListener("animationend", onFlipEnd); // Remove listener to avoid duplicate calls
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
function updateGrid() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
        const row = Math.floor(i / word.length);
        const col = i % word.length;
        cell.textContent = attempts[row]?.[col] || (row === attempts.length ? currentGuess[col] || "" : "");
        cell.className = "cell";
        if (attempts[row]) cell.classList.add(checkGuess(attempts[row])[col]);
    });
}

function updateKeyboard(result) {
    const keys = document.querySelectorAll(".key");
    result.forEach((status, i) => {
        const key = Array.from(keys).find(k => k.textContent === currentGuess[i]);
        if (key) key.classList.add(status);
    });
}



// Passing file url 
getFile('../shuffled_real_wordles.txt').then(content =>{
    // Using split method and passing "\n" as parameter for splitting
    dictionary =  content.trim().split("\n");
    console.log(dictionary);
}).catch(error =>{
    console.log(error);
});

// Initialize the grid and run the test
initGrid();
//setTimeout(testAnimation, 1000);
