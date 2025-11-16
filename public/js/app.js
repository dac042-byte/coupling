// Global state
let currentUser = null;
let potentialMatches = [];
let currentMatchIndex = 0;
let allMatches = [];
let currentChatMatchId = null;
let ws = null;

// Initialize app
async function init() {
  try {
    // Get current user
    const response = await fetch('/api/user');
    if (!response.ok) {
      window.location.href = '/signin';
      return;
    }

    currentUser = await response.json();
    updateSidebar();
    updateProfile();
    loadPotentialMatches();
    setupNavigation();
    setupWebSocket();

    // Check which page to load based on URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
      navigateToPage(hash);
    }
  } catch (error) {
    console.error('Init error:', error);
    window.location.href = '/signin';
  }
}

// WebSocket setup
function setupWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${window.location.host}`);

  ws.onopen = () => {
    console.log('WebSocket connected');
    // Authenticate WebSocket connection
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
      ws.send(JSON.stringify({ type: 'auth', token }));
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'new_message') {
      handleNewMessage(data.matchId, data.message);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    // Reconnect after 3 seconds
    setTimeout(setupWebSocket, 3000);
  };
}

// Handle incoming WebSocket messages
function handleNewMessage(matchId, message) {
  // Update matches list with new message
  const matchItem = document.querySelector(`[data-match-id="${matchId}"]`);
  if (matchItem) {
    const lastMessageEl = matchItem.querySelector('.match-info p');
    if (lastMessageEl) {
      lastMessageEl.textContent = message.message;
    }
  }

  // If this is the active chat, append the message
  if (currentChatMatchId === matchId) {
    appendMessage(message);
  }
}

// Update sidebar with user info
function updateSidebar() {
  document.getElementById('sidebarAvatar').src = currentUser.avatar_url;
  document.getElementById('sidebarName').textContent = currentUser.name;
  document.getElementById('sidebarUniversity').textContent = currentUser.university;
}

// Update profile page
function updateProfile() {
  document.getElementById('profileAvatar').src = currentUser.avatar_url;
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileEmail').textContent = currentUser.email;
  document.getElementById('profileUniversity').textContent = currentUser.university;
  document.getElementById('profileCountry').textContent = currentUser.country;
  document.getElementById('profileUserType').textContent =
    currentUser.user_type === 'technical' ? '💻 Technical' : '💡 Non-Technical';

  if (currentUser.bio) {
    document.getElementById('profileBio').textContent = currentUser.bio;
  } else {
    document.getElementById('profileBioSection').style.display = 'none';
  }

  if (currentUser.user_type === 'technical' && currentUser.skills) {
    document.getElementById('profileSkills').textContent = currentUser.skills;
    document.getElementById('profileSkillsSection').style.display = 'block';
  }

  if (currentUser.user_type === 'non-technical') {
    if (currentUser.project_idea) {
      document.getElementById('profileProject').textContent = currentUser.project_idea;
      document.getElementById('profileProjectSection').style.display = 'block';
    }
    if (currentUser.equity_offered) {
      document.getElementById('profileEquity').textContent = currentUser.equity_offered;
      document.getElementById('profileEquitySection').style.display = 'block';
    }
    if (currentUser.timeline) {
      document.getElementById('profileTimeline').textContent = currentUser.timeline;
      document.getElementById('profileTimelineSection').style.display = 'block';
    }
  }
}

// Navigation
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      navigateToPage(page);
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', logout);
}

function navigateToPage(page) {
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

  // Hide all pages
  document.querySelectorAll('.page-content').forEach(p => {
    p.style.display = 'none';
  });

  // Show selected page
  if (page === 'swipe') {
    document.getElementById('swipePage').style.display = 'block';
  } else if (page === 'matches') {
    document.getElementById('matchesPage').style.display = 'block';
    loadMatches();
  } else if (page === 'profile') {
    document.getElementById('profilePage').style.display = 'block';
  }

  window.location.hash = page;
}

async function logout() {
  try {
    await fetch('/api/signout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Swipe functionality
async function loadPotentialMatches() {
  try {
    const response = await fetch('/api/potential-matches');
    potentialMatches = await response.json();
    currentMatchIndex = 0;
    displayCurrentCard();
  } catch (error) {
    console.error('Error loading matches:', error);
  }
}

function displayCurrentCard() {
  const container = document.getElementById('swipeCardContainer');

  if (currentMatchIndex >= potentialMatches.length) {
    container.innerHTML = `
      <div class="no-more-cards">
        <h2>No More Profiles</h2>
        <p>Check back later for new matches!</p>
        <button class="btn btn-primary" onclick="loadPotentialMatches()" style="margin-top: 20px;">
          Refresh
        </button>
      </div>
    `;
    return;
  }

  const user = potentialMatches[currentMatchIndex];
  const skills = user.skills ? user.skills.split(',').map(s => s.trim()) : [];

  container.innerHTML = `
    <div class="swipe-card">
      <div class="card-image">
        <img src="${user.avatar_url}" alt="${user.name}" class="card-avatar">
        <span class="card-type-badge">
          ${user.user_type === 'technical' ? '💻 Technical' : '💡 Idea Maker'}
        </span>
      </div>

      <div class="card-content">
        <h2>${user.name}</h2>
        <p class="location">📍 ${user.university}, ${user.country}</p>

        ${user.bio ? `
          <div class="card-section">
            <h3>About</h3>
            <p>${user.bio}</p>
          </div>
        ` : ''}

        ${user.user_type === 'technical' && user.skills ? `
          <div class="card-section">
            <h3>Skills</h3>
            <div>
              ${skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${user.user_type === 'non-technical' && user.project_idea ? `
          <div class="card-section">
            <h3>Project Idea</h3>
            <p>${user.project_idea}</p>
          </div>
        ` : ''}

        ${user.equity_offered ? `
          <div class="card-section">
            <h3>Offering</h3>
            <p>💰 ${user.equity_offered}</p>
          </div>
        ` : ''}

        ${user.timeline ? `
          <div class="card-section">
            <h3>Timeline</h3>
            <p>⏱️ ${user.timeline}</p>
          </div>
        ` : ''}
      </div>

      <div class="swipe-actions">
        <button class="swipe-btn swipe-btn-pass" onclick="swipe('pass')">✕</button>
        <button class="swipe-btn swipe-btn-like" onclick="swipe('like')">♥</button>
      </div>
    </div>
  `;
}

async function swipe(action) {
  const user = potentialMatches[currentMatchIndex];

  try {
    const response = await fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: user.id,
        action: action
      })
    });

    const result = await response.json();

    if (result.match) {
      showMatchModal(user);
    }

    currentMatchIndex++;
    displayCurrentCard();
  } catch (error) {
    console.error('Swipe error:', error);
  }
}

// Match modal
function showMatchModal(user) {
  const modal = document.getElementById('matchModal');
  document.getElementById('matchedUserName').textContent = user.name;
  document.getElementById('matchAvatar1').src = currentUser.avatar_url;
  document.getElementById('matchAvatar2').src = user.avatar_url;
  modal.style.display = 'flex';
}

function closeMatchModal() {
  document.getElementById('matchModal').style.display = 'none';
}

function goToMatches() {
  closeMatchModal();
  navigateToPage('matches');
}

// Matches and chat
async function loadMatches() {
  try {
    const response = await fetch('/api/matches');
    allMatches = await response.json();
    displayMatches();
  } catch (error) {
    console.error('Error loading matches:', error);
  }
}

function displayMatches() {
  const container = document.getElementById('matchesList');

  if (allMatches.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--text-muted);">
        <p>No matches yet. Keep swiping!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = allMatches.map(match => `
    <div class="match-item" data-match-id="${match.match_id}" onclick="openChat(${match.match_id}, ${match.id})">
      <img src="${match.avatar_url}" alt="${match.name}" class="match-avatar">
      <div class="match-info">
        <h3>${match.name}</h3>
        <p>${match.last_message || 'Start a conversation...'}</p>
      </div>
    </div>
  `).join('');
}

async function openChat(matchId, userId) {
  currentChatMatchId = matchId;

  // Update active match
  document.querySelectorAll('.match-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-match-id="${matchId}"]`)?.classList.add('active');

  // Get match info
  const match = allMatches.find(m => m.match_id === matchId);

  // Update chat header
  document.getElementById('chatAvatar').src = match.avatar_url;
  document.getElementById('chatName').textContent = match.name;
  document.getElementById('chatUniversity').textContent = `${match.university}, ${match.country}`;

  // Show chat container
  document.getElementById('chatEmpty').style.display = 'none';
  document.getElementById('chatActive').style.display = 'flex';

  // Load messages
  await loadMessages(matchId);

  // Setup chat form
  const chatForm = document.getElementById('chatForm');
  chatForm.onsubmit = async (e) => {
    e.preventDefault();
    await sendMessage(matchId);
  };
}

async function loadMessages(matchId) {
  try {
    const response = await fetch(`/api/messages/${matchId}`);
    const messages = await response.json();

    const container = document.getElementById('chatMessages');
    container.innerHTML = '';

    messages.forEach(msg => {
      appendMessage(msg);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

function appendMessage(msg) {
  const container = document.getElementById('chatMessages');
  const isSent = msg.sender_id === currentUser.id;

  const messageEl = document.createElement('div');
  messageEl.className = `message ${isSent ? 'sent' : ''}`;

  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messageEl.innerHTML = `
    <img src="${msg.avatar_url}" alt="${msg.name}" class="message-avatar">
    <div>
      <div class="message-content">${escapeHtml(msg.message)}</div>
      <div class="message-time">${time}</div>
    </div>
  `;

  container.appendChild(messageEl);
  container.scrollTop = container.scrollHeight;
}

async function sendMessage(matchId) {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();

  if (!message) return;

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, message })
    });

    if (response.ok) {
      input.value = '';
      // Message will be added via WebSocket
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally available
window.swipe = swipe;
window.closeMatchModal = closeMatchModal;
window.goToMatches = goToMatches;
window.openChat = openChat;
window.loadPotentialMatches = loadPotentialMatches;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
