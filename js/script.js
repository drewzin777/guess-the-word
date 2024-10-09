const guessedLetters = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuesses = document.querySelector(".remaining-guesses");
const remainingGuessesSpan = document.querySelector(".remaining-span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");
//starting word 
const word = "magnolia".toUpperCase();
const guessedLettersArray = [];

//a placeholder for letters chosen for word's
const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
        console.log(letter);
        placeholderLetters.push("●");
    }
    wordInProgress.innerText = placeholderLetters.join("");
};

placeholder(word);

guessLetterButton.addEventListener("click", function (e) {
    e.preventDefault();

    //empty the text of the message element
    message.innerText = "";
    //get the player's guess from the input field
    const guess = letterInput.value.toUpperCase(); //convert guess

    //call the validation function to check if input is valid
    if (validatePlayerInput(guess)) {
        console.log(`Valid guess: ${guess}`);
        makeGuess(guess);    //call the makeGuess Function after validation
    }
     
    letterInput.value = "";
});

//Validate player input
function validatePlayerInput(input) {
    //check if input is empty, null, or undefined
    if (!input || input.trim() === '') {
        console.log('Input cannot be empty. Please enter a valid letter.');
        message.innerText = 'Input cannot be empty. Please Enter a valid letter.';
        return false; 
    }
    //accept only letters 
    const acceptedLetter = /[a-zA-Z]/;

    //check if the input matches the regular expression (letters only) using match()
    if (input.match(acceptedLetter)) {
        return true; 
    } else {
        console.log('Invalid input. Please enter a valid letter.');
        message.innerText = 'Invalid input. Please enter a valid letter.'; //message to user
        return false; //invalid input
    }
}

function makeGuess(letter) {
    //check if the letter has been guessed
    if (guessedLettersArray.includes(letter)) {
        message.innerText = `You already guessed the leter ${letter}. Try another one!`;
        console.log(`Duplicate guess: ${letter}`);
    } else {
        guessedLettersArray.push(letter); 
        console.log(`Guessed letters array: ${guessedLettersArray}`);
        guessedLetters.innerText += letter + " ";  //Display guessed letters
        updateWordInProgress();                    //Update word display
        checkIfPlayerWon();
    }
}

//function to update the word in progress
function updateWordInProgress() {
    const wordArray = word.split("");
    const revealWord = [];
    for (const letter of wordArray) {
        if (guessedLettersArray.includes(letter)) {
            revealWord.push(letter); 
        } else {
            revealWord.push("●");
        }
    }
    wordInProgress.innerText = revealWord.join("");
}

function checkIfPlayerWon() {
    if (wordInProgress.innerText === word) {
        message.innerText = "Congratulation! You guessed the word!"; 
        console.log("Player won the game");
        guessLetterButton.disabled = true; 
        playAgainButton.style.display = "block";
    }
}