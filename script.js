document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CORE FUNCTION TO LOAD DATA AND START THE SITE ---
    async function loadFlashcards() {
        const container = document.getElementById('revision-container');
        
        try {
            // Fetch the JSON file
            const response = await fetch('data.json');
            
            // Check if the file was found (status 200)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parse the JSON content
            const flashcardData = await response.json();
            
            // Build the site components only if data loaded successfully
            generateFlashcards(flashcardData);
            setupFiltering();
            setupToggleButtons();
            
            // Automatically select 'All Subjects' on load
            document.querySelector('.nav-btn[data-filter="all"]').classList.add('active');

        } catch (error) {
            console.error('Error fetching flashcard data:', error);
            // Display a user-friendly error message on the page
            container.innerHTML = '<p style="color: red; padding: 20px; font-weight: bold;">Error loading content. Please check the `data.json` file name, path, and syntax (no comments allowed!).</p>';
        }
    }
    
    // --- 2. GENERATE HTML FROM DATA ---
    function generateFlashcards(data) {
        const container = document.getElementById('revision-container');
        container.innerHTML = ''; // Clear any existing content
        
        data.forEach(item => {
            // Create the HTML structure for one flashcard
            const cardHTML = `
                <div class="flashcard" data-subject="${item.subject}">
                    <span class="subject-tag">${item.subject}</span>
                    <div class="question">
                        <h3>Q: ${item.question}</h3>
                    </div>
                    <div class="answer hidden">
                        <p>A: ${item.answer}</p>
                    </div>
                    <button class="toggle-answer-btn">Show Answer</button>
                </div>
            `;
            // Add the new HTML string to the container
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- 3. SETUP ANSWER TOGGLE LOGIC ---
    // Must be called AFTER generateFlashcards so the buttons exist
    function setupToggleButtons() {
        const buttons = document.querySelectorAll('.toggle-answer-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const flashcard = button.closest('.flashcard');
                const answer = flashcard.querySelector('.answer');
                
                // Toggle the 'hidden' class to show/hide the answer
                answer.classList.toggle('hidden');
                
                // Update button text for user clarity
                if (answer.classList.contains('hidden')) {
                    button.textContent = 'Show Answer';
                } else {
                    button.textContent = 'Hide Answer';
                }
            });
        });
    }

    // --- 4. SETUP SUBJECT FILTERING LOGIC ---
    function setupFiltering() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const filterSubject = event.target.dataset.filter;
                
                // Update 'active' state for styling the current button
                navButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');

                // Select all flashcards to show/hide them
                const flashcards = document.querySelectorAll('.flashcard');

                flashcards.forEach(card => {
                    const cardSubject = card.dataset.subject;

                    // Check if we are filtering for 'all' or if the card matches the subject
                    if (filterSubject === 'all' || cardSubject === filterSubject) {
                        card.style.display = 'block'; // Show the card
                    } else {
                        card.style.display = 'none'; // Hide the card
                    }
                });
            });
        });
    }

    // --- START THE APPLICATION ---
    loadFlashcards();
});
