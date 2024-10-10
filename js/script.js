const guessedLetters = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuesses = document.querySelector(".remaining-guesses");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

//starting word 
let word = "";
const guessedLettersArray = [];
let remainingGuessesCount = 8;

//ASYNC function
async function getWord() {
  try {
    const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    //Log out the response to make sure it's being fetched
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const words = await response.text();
    console.log("Fetched words:", words);    //Log out the fetched words

    //Split the text by new lines to get an array of words
    const wordArray = words.split("\n"); 
    console.log("Word array:" , wordArray);

    //Choose random word from array
    const randomWord = wordArray[Math.floor(Math.random() * wordArray.length)].trim().toUpperCase(); 
    word = randomWord;

    //start game with fetched word
    startGame(word);
    } catch (error) {
        console.error("Error fetching the word list:", error);
    }
}

//Start game with fetched word
function startGame(selectedWord) {
    console.log("This is the game starting with the word:", selectedWord);
    initializeGame();
}

//Initialize the game and display the placeholder and remaining guesses
function initializeGame () {
    guessedLettersArray.length = 0;
    guessedLetters.innerText = "";
    placeholder(word); 
    remainingGuessesCount = 8;           //reset remaining guesses count
    letterInput.disabled = false;        //Enable input field
    remainingGuessesSpan.innerText = remainingGuessesCount;
    playAgainButton.classList.add("hide"); 
    guessLetterButton.disabled = false; 
    letterInput.value = "";
    message.innerText = "";
}

//a placeholder for letters chosen for word's
const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
        console.log(letter);
        placeholderLetters.push("●");
    }
    wordInProgress.innerText = placeholderLetters.join("");
};

//Call get word to fetch the word
 getWord();

//Event listener for guessing letter
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
    //clear input field after guess
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
        message.innerText = `You already guessed the letter ${letter}. Try another one!`;
        console.log(`Duplicate guess: ${letter}`);
    } else {
        guessedLettersArray.push(letter); 
        console.log(`Guessed letters array: ${guessedLettersArray}`);
        guessedLetters.innerText += letter + " ";  //Display guessed letters
        updateWordInProgress();                    //Update word display
        countRemainingGuesses(letter);
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
        message.innerText = "Congratulations! You guessed the word!"; 
        console.log("Player won the game");
        guessLetterButton.disabled = true; 
        playAgainButton.style.display = "block";
    }
}

//Function to count remaining guesses
function countRemainingGuesses(letter) {
    //if letter guessed is not in word, decrease the remaining guesses
    if (!word.includes(letter)) {
        remainingGuessesCount -= 1;
        message.innerText = `Wrong guess! You have ${remainingGuessesCount} guesses remaining.`;
    }

    //update remaining guesses display
    remainingGuessesSpan.innerText = `${remainingGuessesCount}`;

    //If remaining guesses reach zero end the game
    if (remainingGuessesCount === 0) {
        message.innerText = `Game over! The word was ${word}.`;
        guessLetterButton.disabled = true; 
        playAgainButton.style.display = "block";  //show the play againg button
    }
}

//Reset and restart the game when "Play Again is clicked"
playAgainButton.addEventListener("click", function () {
    getWord();     //Fetch a new word to start the game again
});