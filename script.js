document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('guestbook-form');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const responseDiv = document.getElementById('response-message');
    const submitButton = document.getElementById('submit-button');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwpW19CxYuIvZ-2AApl3OJaiTTFBF9nhV12oJhtiYLr2iTDQxHhxJ3FlIXFVVY9mYmKXw/exec';

    if (SCRIPT_URL === 'PASTE_YOUR_WEB_APP_URL_HERE') {
        alert('ERROR: Please paste your Google Apps Script Web App URL into script.js');
        submitButton.disabled = true;
        submitButton.textContent = 'Setup Required';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        responseDiv.style.display = 'none';
        responseDiv.className = '';

        const formData = new FormData();
        formData.append('name', nameInput.value);
        formData.append('message', messageInput.value);

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errorDetails = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || JSON.stringify(errorData);
                } catch (parseError) {
                    console.warn("Could not parse error response:", parseError);
                }
                throw new Error(errorDetails);
            }

            const result = await response.json();

            if (result.status === 'success') {
                responseDiv.textContent = result.message || 'Thank you for your lovely message!';
                responseDiv.className = 'success';
                form.reset();
            } else {
                throw new Error(result.message || 'An unknown error occurred on the server.');
            }

        } catch (error) {
            console.error('Submission Error:', error);
            responseDiv.textContent = `An error occurred: ${error.message}. Please try again.`;
            responseDiv.className = 'error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Your Wishes';
            responseDiv.style.display = 'block';
        }
    });
});