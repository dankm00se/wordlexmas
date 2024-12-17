const word = "PVRIS"; // The correct word
const maxGuesses = 6;
let currentGuess = "";
let attempts = [];
const delay = 500; // Delay between flipping letters in milliseconds
let dictionary= [];
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
function handleKeyPress(letter) {
    if (currentGuess.length < word.length) {
        currentGuess += letter;
        updateGrid();
    }
}

document.querySelectorAll(".key").forEach((button) => {
    button.addEventListener("click", () => {
        const letter = button.textContent.trim();
        console.log(letter);
        if (letter === "ENTER") {
            handleGuess();
        } else if (letter === "") { //bad way to check what letter it is
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
        handleInvalidGuess();
        setTimeout(() =>{
            hideMessage();
        }, 2500);
        return;
    }
    if (!dictionary.includes(currentGuess.toLowerCase())){
        setMessage(currentGuess + " not in word list!");
        handleInvalidGuess();
        setTimeout(() =>{
            hideMessage();
        }, 2500);
        return;
    }

    let result = checkGuess(currentGuess);
    attempts.push(currentGuess);
    revealGuess(result);
    
    
    setTimeout(()=>{
        
        if (result.every((r) => r === "correct")) {
            setMessage("You guessed it!");
            setTimeout(()=>{
                document.getElementById('gift').classList.add("show");
                document.getElementById('giftmsg').innerText = "Congrats Laila! We're going to PVRIS!";
            }, 2500);
        } else if (attempts.length === maxGuesses) {
            setMessage(`The word was ${word}`);
            setTimeout(()=>{
                document.getElementById('gift').classList.add("show");
                document.getElementById('giftmsg').innerText = "You lost... but you still won because we're going to PVRIS babyyyyyyyy!";
            }, 2500);
        }
    }, 2500);

    setTimeout(() =>{
        updateKeyboard(result);
        currentGuess = "";
    }, 2500);

}

// Reveal the guess with animations
function revealGuess(result) {
    const startIndex = (attempts.length - 1) * word.length;
    const cells = document.querySelectorAll(".cell");

    result.forEach((status, i) => {
        const cell = cells[startIndex + i];
        const letter = currentGuess[i];
        
        setTimeout(() => {
            cell.textContent = letter;
            //cell.style.setProperty("--cell-color", color);
            cell.classList.add("flip");
            cell.classList.add(status);
                       
        }, i * delay); // Apply delay for each letter
    });
}
// Check the guess
function checkGuess(guess) {
    const result = Array(word.length).fill("absent");
    const wordLetters = word.split("");

    // First pass: Mark "correct" letters
    guess.split("").forEach((letter, i) => {
        if (word[i] === letter) {
            result[i] = "correct";
            wordLetters[i] = null; // Mark this letter as used
        }
    });

    // Second pass: Mark "present" letters
    guess.split("").forEach((letter, i) => {
        if (result[i] !== "correct" && wordLetters.includes(letter)) {
            result[i] = "present";
            wordLetters[wordLetters.indexOf(letter)] = null; // Mark this letter as used
        }
    });

    return result;
}

// Set the message
function setMessage(msg) {
    const messageBox = document.getElementById("message");
    messageBox.textContent = msg; // Set the message text
    messageBox.classList.add("show"); // Show the message
}

function hideMessage() {
    const messageBox = document.getElementById("message");
    messageBox.classList.remove("show"); // Hide the message
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
        if (!key) return; // Skip if the key is not found
        
        // Update the key based on priority (correct > present > absent)
        if (result[i] === "correct") {
            key.classList.remove("present", "absent");
            key.classList.add("correct");
        } else if (result[i] === "present" && !key.classList.contains("correct")) {
            key.classList.remove("absent");
            key.classList.add("present");
        } else if (
            result[i] === "absent" &&
            !key.classList.contains("correct") &&
            !key.classList.contains("present")
        ) {
            key.classList.add("absent");
        }
    });
}
function handleInvalidGuess() {
    const rowIndex = attempts.length; // Current row (0-indexed)
    const rowCells = document.querySelectorAll(
        `.cell:nth-child(n + ${rowIndex * word.length + 1}):nth-child(-n + ${
            (rowIndex + 1) * word.length
        })`
    );

    // Add the shake animation class
    rowCells.forEach((cell) => cell.classList.add("row-invalid"));

    // Remove the class after the animation ends
    setTimeout(() => {
        rowCells.forEach((cell) => cell.classList.remove("row-invalid"));
    }, 500); // Match animation duration
}



// Passing file url 
getFile('https://dankm00se.github.io/wordlexmas/data/combined_wordlist.txt').then(content =>{
    // Using split method and passing "\n" as parameter for splitting
    dictionary =  content.trim().split("\n");
}).catch(error =>{
    console.log(error);
});

initGrid();

document.addEventListener("keyup", (event) =>{
    let letter = event.key.toUpperCase();
    //console.log("Keyup fired for key : " + letter);
    if(alphabet.includes(letter)){
        handleKeyPress(letter);
    }
    else if(letter==="ENTER"){
        handleGuess();
    }
    else if(letter==="DELETE" || letter==="BACKSPACE"){
        handleDelete();
    }
    
});