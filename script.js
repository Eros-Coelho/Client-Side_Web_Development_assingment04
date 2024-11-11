document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const usernameInput = document.getElementById('username');
    const introductionSection = document.getElementById('introduction');
    const quizSection = document.getElementById('quiz');
    const feedbackSection = document.getElementById('feedback');
    const questionContainer = document.getElementById('question-container');
    const feedbackMessage = document.getElementById('feedback-message');

    let currentQuestionIndex = 0;
    let score = 0;
    let username = '';
    let questions = [];

    const questionBank = [
        { type: 'radio', question: "Where was Marie Curie born?", options: ["France", "Switzerland", "Poland", "Czech Republic"], answer: "Poland" },
        { type: 'radio', question: "How far is the Sun from Earth?", options: ["13 light-minutes", "10,000 KM", "8 light-minutes", "15,000 KM"], answer: "8 light-minutes" },
        { type: 'text', question: "Who created the Atomic Bomb?", answer: ["Oppenheimer"] },
        { type: 'radio', question: "Which of the 4 Fundamental Forces of Nature is the strongest?", options: ["Strong Force", "Electromagnetic Force" , "Gravity" , "Weak Force"], answer: ["Strong Force"] },
        { type: 'image', question: "Which of these atomic models was thought by Rutherford?", images: ["images/thomson.webp", "images/rutherford.jpeg", "images/bohr.jpg", "images/schrodinger.webp"], answer: "images/rutherford.jpeg" },
    ];

    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', showNextQuestion);

    function startQuiz() {
        username = usernameInput.value.trim();
        if (!username) {
            alert("Please enter your name.");
            return;
        }
        introductionSection.classList.add('hidden');
        quizSection.classList.remove('hidden');
        questions = getRandomQuestions(questionBank, 5);
        currentQuestionIndex = 0;
        score = 0;
        showNextQuestion();
    }

    function showNextQuestion() {
        if (currentQuestionIndex > 0) {
            checkAnswer();
        }
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions[currentQuestionIndex]);
            currentQuestionIndex++;
        } else {
            showFeedback();
        }
    }

    function displayQuestion(question) {
        questionContainer.innerHTML = '';
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `<h3>Question ${currentQuestionIndex + 1}</h3>
                                     <p>${question.question}</p>`;
        switch (question.type) {
            case 'radio':
                question.options.forEach(option => {
                    questionElement.innerHTML += `<input type="radio" name="answer" value="${option}"> ${option}<br>`;
                });
                break;
            case 'text':
                questionElement.innerHTML += `<input type="text" id="text-answer">`;
                break;
            case 'image':
                question.images.forEach(image => {
                    questionElement.innerHTML += `<img src="${image}" class="image-option" data-answer="${image}" style="width: 100px; cursor: pointer;">`;
                });
                break;
        }
        questionContainer.appendChild(questionElement);

        // Add event listeners to image options
        const imageOptions = document.querySelectorAll('.image-option');
        imageOptions.forEach(img => {
            img.addEventListener('click', function () {
                imageOptions.forEach(img => img.classList.remove('selected'));
                img.classList.add('selected');
            });
        });

        nextBtn.classList.remove('hidden');
    }

    function checkAnswer() {
        const currentQuestion = questions[currentQuestionIndex - 1];
        let userAnswer = '';
        switch (currentQuestion.type) {
            case 'radio':
                const selectedOption = document.querySelector('input[name="answer"]:checked');
                if (selectedOption) {
                    userAnswer = selectedOption.value.toLowerCase(); // Change: Ensures case-insensitive comparison
                }
                break;
            case 'text':
                userAnswer = document.getElementById('text-answer').value.trim().toLowerCase(); // Change: Ensures consistent case handling
                break;
            case 'image':
                const selectedImage = document.querySelector('.image-option.selected');
                if (selectedImage) {
                    userAnswer = selectedImage.dataset.answer.toLowerCase(); // Change: Case-insensitive for image answers
                }
                break;
        }

        // Ensure an answer was selected
        if (!userAnswer) {
            alert("Please select or enter an answer.");
            currentQuestionIndex--; // Change: Prevent advancing if no answer is selected
            return;
        }

        // Answer checking logic
        if (Array.isArray(currentQuestion.answer)) {
            if (currentQuestion.answer.some(answer => answer.toLowerCase() === userAnswer)) { // Change: Enhanced array answer check
                score++;
            }
        } else {
            if (currentQuestion.answer.toLowerCase() === userAnswer) { // Change: Ensures case-insensitivity for non-array answers
                score++;
            }
        }
    }

    function showFeedback() {
        quizSection.classList.add('hidden');
        feedbackSection.classList.remove('hidden');
        const scorePercentage = (score / questions.length) * 100;
        feedbackMessage.textContent = `Well done, ${username}. You got ${scorePercentage}% correct.`;
    }

    function getRandomQuestions(questions, num) {
        const shuffled = questions.slice().sort(() => 0.5 - Math.random()); // Change: Avoids modifying original array
        return shuffled.slice(0, Math.min(num, questions.length)); // Change: Ensures no out-of-bounds slicing
    }
});
