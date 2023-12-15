// Import the Firebase products that you want to use
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBiL3yqWlj6sa_hiZjfMSIX0OW5A270jk",
    authDomain: "education-game-quiz.firebaseapp.com",
    databaseURL: "https://education-game-quiz-default-rtdb.firebaseio.com/",
    projectId: "education-game-quiz",
    storageBucket: "education-game-quiz.appspot.com",
    messagingSenderId: "795703378603",
    appId: "1:795703378603:web:61b719d3be3fe796ff2dee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Console log to confirm Firebase initialization
console.log(app.name ? 'Firebase Mode Activated!' : 'Firebase not working :(');

function writeUserData(userId, name, mathTypeSelected, level, correctAnswers, incorrectAnswers, sessionDateTime, duration, questionsAttempted) {
    const userRef = ref(database, 'users/' + userId);
    set(userRef, {
        name: name,
        mathTypeSelected: mathTypeSelected,
        level: level,
        correctAnswers: correctAnswers,
        incorrectAnswers: incorrectAnswers,
        sessionDateTime: sessionDateTime,
        duration: duration,
        questionsAttempted: questionsAttempted
    }).then(() => {
        console.log('User data saved successfully');
    }).catch((error) => {
        console.error('Error writing user data:', error);
    });
}


function readUserData(userId) {
    const userRef = ref(database, 'users/' + userId);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        console.log('User data:', data);
    }, (error) => {
        console.error('Error reading user data:', error);
    });
}





let currentAnswer = 0;
let correctAnswers = 0;
let questionCount = 0;
let currentMathType;
let currentLevel;
let currentUser;


function setName() {
    console.log('setName function called');

    var selectedName = document.getElementById('nameSelect').value;
    console.log('Selected name:', selectedName);  // This should log the selected option's value

    

    // Check if the elements are correctly selected
    if (selectedName && nameButton) {
        nameButton.textContent = selectedName;

        // Correct usage of Firebase modular version for getting data
        const db = getDatabase();
        const userRef = ref(db, 'users/' + selectedName);

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                currentUser = snapshot.val();
                console.log('Existing user:', currentUser);
                // Update the game with existing user data
            } else {
                // Correct usage of Firebase modular version for setting data
                set(userRef, { name: selectedName, correctAnswers: 0, questionCount: 0 }).then(() => {
                    console.log('New user created:', selectedName);
                }).catch((error) => {
                    console.error('Error creating new user:', error);
                });

                // Assuming you want to use this in your app after creating a user
                currentUser = { name: selectedName, correctAnswers: 0, questionCount: 0 };
            }
        }).catch((error) => {
            console.error('Error accessing user data:', error);
        });
    } else {
        console.error('setName: One or more elements not found');
    }
}




function selectMathType(mathType) {
    currentMathType = mathType;
    let mathTypeText = '';

    switch(mathType) {
        case '+':
            mathTypeText = 'חיבור';
            break;
        case '-':
            mathTypeText = 'חיסור';
            break;
        case '×':
            mathTypeText = 'כפל';
            break;
        case '÷':
            mathTypeText = 'חילוק';
            break;
        // Add more cases as needed
    }
    
    // Update display only when a choice is made
    document.getElementById('mathTypeDisplay').textContent = mathTypeText;
                                                       
}

function selectLevel(level) {
    currentLevel = level;
    document.getElementById('levelDisplay').textContent = `${level}`;
}

function startGame() {
    // Check if math type and level are selected
   
    if (!currentMathType || !currentLevel) {
            alert("Please select both a math type and a level.");
            return;
    }
    
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('startButton').style.display = 'none'; // Hide the start button
    
    questionCount = 0;
    correctAnswers = 0;
    generateProblem();

}

function generateProblem() {
    let range;
    let maxNumber, minNumber;

    switch (currentLevel) {
        case '1-10':
            minNumber = 1;
            maxNumber = 10;
            break;
        case '1-30':
            minNumber = 1;
            maxNumber = 30;
            break;
        case '50-100':
            minNumber = 50;
            maxNumber = 100;
            break;
        default:
            alert("Invalid level. Please select a valid level.");
            return;
    }

    let num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    let num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    switch (currentMathType) {
        case '+':
            currentAnswer = num1 + num2;
            document.getElementById('flashcard').textContent = `${num1} + ${num2}`;
            break;
        case '-':
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            currentAnswer = num1 - num2;
            document.getElementById('flashcard').textContent = `${num1} - ${num2}`;
            break;
        case '×':
            currentAnswer = num1 * num2;
            document.getElementById('flashcard').textContent = `${num1} × ${num2}`;
            break;
        case '÷':
            let product = num1 * num2;
            currentAnswer = num1;
            document.getElementById('flashcard').textContent = `${product} ÷ ${num2}`;
            break;
        // Add more cases as needed
    }

    questionCount++;
    if (questionCount > 10) {
        endGame();
    }


    document.getElementById('userAnswer').focus();

}

function submitAnswer() {
    let userAnswerInput = document.getElementById('userAnswer');
    let feedbackMessageDiv = document.getElementById('feedbackMessage');
    let userAnswer = parseInt(userAnswerInput.value);

    if (userAnswer === currentAnswer) {
        correctAnswers++;
        generateProblem();

        // Trigger confetti for correct answer
        triggerConfetti();

      
    } else {
        // Incorrect answer
        //feedbackMessageDiv.textContent = 'נסה שוב'; // Display 'Try again' message    

    }

    // Clear the input field and update correct answers count
    userAnswerInput.value = '';
    document.getElementById('correctAnswersCount').textContent = `מספר תשובות נכונות: ${correctAnswers}`;
}



function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}


function goBack() {
    document.getElementById('selectionScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('startButton').style.display = 'block'; // Show the start button again
    // Clear the selections when going back or starting a new session
    document.getElementById('mathTypeDisplay').textContent = '';
    document.getElementById('levelDisplay').textContent = '';
    // Reset game state if needed
}
    
    


function endGame() {
    if (confirm("להמשיך לשחק?")) {
        questionCount = 1;
        correctAnswers = 0;
        document.getElementById('correctAnswersCount').textContent = `מספר תשובות נכונות: ${correctAnswers}`;
        generateProblem();
    } else {
        goBack();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Listener for the name selection dropdown
    document.getElementById('nameSelect').addEventListener('change', setName);

    // Listeners for math type selection
    document.querySelectorAll('.math-symbol').forEach(symbol => {
        symbol.addEventListener('click', (event) => {
            selectMathType(event.target.textContent);
        });
    });

    // Listeners for level selection buttons
    document.querySelectorAll('.btn-level-group button').forEach(button => {
        button.addEventListener('click', (event) => {
            selectLevel(event.target.textContent);
        });
    });

    // Listener for the start game button
    document.getElementById('startButton').addEventListener('click', startGame);

    // Listener for the submit answer button
    document.querySelector('.submit-button').addEventListener('click', submitAnswer);

    // Listener for the go back link
    document.getElementById('goBack').addEventListener('click', goBack);
});








