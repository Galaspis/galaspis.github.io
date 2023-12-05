let currentAnswer = 0;
let correctAnswers = 0;
let questionCount = 0;
let currentMathType;
let currentLevel;

function setName() {
    var selectedName = document.getElementById('nameSelect').value;
    // Assuming 'nav-button' is the class of the button you want to update
    var nameButton = document.querySelector('.nav-button');
    if (selectedName) {
        nameButton.textContent = selectedName;
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

    questionCount = 0;
    correctAnswers = 0;
    generateProblem();


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
        case '1-50':
            minNumber = 1;
            maxNumber = 50;
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
