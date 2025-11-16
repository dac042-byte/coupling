// Theme management
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const root = document.documentElement;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
updateThemeButton(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
  if (themeText) {
    if (theme === 'dark') {
      themeText.textContent = '☀️ Light Mode';
    } else {
      themeText.textContent = '🌙 Dark Mode';
    }
  }
}
