// Signin form handler
const signinForm = document.getElementById('signinForm');
const errorMessage = document.getElementById('errorMessage');

signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(signinForm);
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  };

  try {
    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      // Redirect to app
      window.location.href = '/app';
    } else {
      errorMessage.textContent = result.error || 'An error occurred';
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    errorMessage.textContent = 'Network error. Please try again.';
    errorMessage.style.display = 'block';
  }
});
