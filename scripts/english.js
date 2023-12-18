document.addEventListener('DOMContentLoaded', () => {
    let vocabularyData = []; // This will hold the fetched data

    function loadQuestion() {
        // Randomly select a question index
        let currentQuestionIndex = Math.floor(Math.random() * vocabularyData.length);
        const questionData = vocabularyData[currentQuestionIndex];

        // Set the question text to the Hebrew word
        document.getElementById('questionText').textContent = questionData.EnglishWord;

        // Get all options into an array, mixing the correct and incorrect answers
        let options = [
            questionData.HebrewWord, // The correct answer
            questionData.IncorrectOption1,
            questionData.IncorrectOption2,
            questionData.IncorrectOption3
        ];

        // Shuffle the options to make sure they're in random order
        options = shuffleArray(options);

        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = ''; // Clear previous options

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'option-button'; // Use a class that you define in your CSS for styling
            button.onclick = () => checkAnswer(option, questionData.HebrewWord);
            optionsContainer.appendChild(button);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

  // Assuming confetti.js is already included and accessible

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        // Trigger confetti for correct answer
        triggerConfetti();
        // Randomly load next question
        currentQuestionIndex = Math.floor(Math.random() * vocabularyData.length);
        loadQuestion();
    } else {
        // If you want, you can show some visual feedback for incorrect answer here
        // For example: feedbackMessageDiv.textContent = 'Try again';
    }
}

// Confetti function similar to the math game
function triggerConfetti() {
    confetti({
        particleCount: 1000,
        spread: 5000,
        origin: { y: 0.5 }
    });
}

    
    

    // Fetch the vocabulary data from the JSON file
    function fetchVocabularyData() {
        fetch('data/vocabulary1.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('Data loaded is not an array');
                }
                vocabularyData = data;
                loadQuestion(); // Load the first question after fetching data
            })
            .catch(error => {
                console.error("Error fetching vocabulary data:", error);
                alert("Failed to load vocabulary data: " + error.message);
            });
    }

    fetchVocabularyData(); // Fetch data and load the first question
});
