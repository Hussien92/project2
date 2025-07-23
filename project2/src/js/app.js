// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Select all relevant DOM elements
    const sections = document.querySelectorAll('section'); // All section elements
    const navbarList = document.getElementById('navbar__list'); // Navigation menu container
    const commentForm = document.getElementById('comment-form'); // Comment form
    const commentsDisplay = document.getElementById('comments-display'); // Where comments will be displayed
    const errorMessage = document.getElementById('error-message'); // Error message container

    /**
     * Builds the navigation menu dynamically based on page sections
     */
    function buildNav() {
        // Loop through each section to create corresponding nav items
        sections.forEach(section => {
            // Skip the comments section for navigation
            if (section.id !== 'comments-section') {
                // Create list item and anchor elements
                const li = document.createElement('li');
                const a = document.createElement('a');
                
                // Set anchor text from data-nav attribute and add class
                a.textContent = section.dataset.nav;
                a.classList.add('menu__link');
                a.href = `#${section.id}`;
                
                // Add click event listener for smooth scrolling
                a.addEventListener('click', function(e) {
                    e.preventDefault(); // Prevent default anchor behavior
                    scrollToSection(section.id); // Scroll to section
                    setActiveSection(section.id); // Highlight active section
                });
                
                // Append anchor to list item, and list item to nav
                li.appendChild(a);
                navbarList.appendChild(li);
            }
        });
    }

    /**
     * Smoothly scrolls to a specified section
     * @param {string} sectionId - The ID of the section to scroll to
     */
    function scrollToSection(sectionId) {
        document.getElementById(sectionId).scrollIntoView({
            behavior: 'smooth' // Enables smooth scrolling animation
        });
    }

    /**
     * Sets the active section and highlights corresponding nav link
     * @param {string} sectionId - The ID of the active section
     */
    function setActiveSection(sectionId) {
        // Remove active class from all sections
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to current section if it exists
        document.getElementById(sectionId)?.classList.add('active');
        
        // Update active state in navigation
        document.querySelectorAll('.menu__link').forEach(link => {
            link.classList.remove('active-link');
            // Add active class to the link matching current section
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active-link');
            }
        });
    }

    /**
     * Handles comment form submission
     * @param {Event} e - The submit event
     */
    function handleCommentSubmit(e) {
        e.preventDefault(); // Prevent form from submitting normally
        
        // Get and trim form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const commentText = document.getElementById('comment').value.trim();
        
        // Validate form inputs
        if (!name || !email || !commentText) {
            return showError('All fields are required');
        }
        
        if (!email.includes('@')) {
            return showError('Please enter a valid email address');
        }
        
        // Clear any existing errors
        errorMessage.textContent = '';
        errorMessage.classList.remove('visible');
        
        // Display the new comment
        displayComment(name, email, commentText);
        
        // Reset the form
        commentForm.reset();
    }

    /**
     * Creates and displays a new comment
     * @param {string} name - Commenter's name
     * @param {string} email - Commenter's email
     * @param {string} comment - The comment text
     */
    function displayComment(name, email, comment) {
        // Create comment container div
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        
        // Create HTML structure for the comment
        commentDiv.innerHTML = `
            <p class="comment-name">Name: ${name}</p>
            <p class="comment-email">Email: ${email}</p>
            <p class="comment-text">${comment}</p>
        `;
        
        // Add the comment to the display area
        commentsDisplay.appendChild(commentDiv);
    }

    /**
     * Displays an error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('visible'); // Make error message visible
    }

    /**
     * Sets up Intersection Observer to detect which section is currently visible
     */
    function setupIntersectionObserver() {
        // Create observer with callback that runs when sections intersect
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // When a section becomes visible, set it as active
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            threshold: 0.6 // Trigger when 60% of section is visible
        });

        // Observe all sections
        sections.forEach(section => observer.observe(section));
    }

    /**
     * Initializes the application
     */
    function init() {
        buildNav(); // Build the navigation
        setupIntersectionObserver(); // Set up section observer
        if (sections.length > 0) setActiveSection(sections[0].id); // Set first section as active
        commentForm.addEventListener('submit', handleCommentSubmit); // Add form submit handler
    }

    // Start the application
    init();
});