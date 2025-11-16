// Signup form handler
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');
const technicalFields = document.getElementById('technicalFields');
const nonTechnicalFields = document.getElementById('nonTechnicalFields');

// Show/hide fields based on user type
document.querySelectorAll('input[name="userType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'technical') {
      technicalFields.style.display = 'block';
      nonTechnicalFields.style.display = 'none';
    } else {
      technicalFields.style.display = 'none';
      nonTechnicalFields.style.display = 'block';
    }
  });
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(signupForm);
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    university: formData.get('university'),
    country: formData.get('country'),
    userType: formData.get('userType'),
    bio: formData.get('bio'),
    skills: formData.get('skills'),
    projectIdea: formData.get('projectIdea'),
    equityOffered: formData.get('equityOffered'),
    timeline: formData.get('timeline')
  };

  try {
    const response = await fetch('/api/signup', {
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
