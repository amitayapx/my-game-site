
// Load current player data from localStorage
let currentPlayer = JSON.parse(localStorage.getItem('currentUser')) || {
  name: "Guest",
  email: "guest@example.com",
  balance: 0,
  points: 0,
  avatar: "fas fa-user-circle"
};

// Achievements data
let playerAchievements = [
  { id: 1, name: "First Login", description: "Login to the platform for the first time", icon: "fas fa-door-open", unlocked: true },
  { id: 2, name: "Tournament Winner", description: "Win your first tournament", icon: "fas fa-trophy", unlocked: false },
  { id: 3, name: "Big Spender", description: "Spend 5000 coins in the store", icon: "fas fa-shopping-cart", unlocked: false },
  { id: 4, name: "Tournament Veteran", description: "Participate in 5 tournaments", icon: "fas fa-medal", unlocked: false },
  { id: 5, name: "Coin Collector", description: "Earn 10000 coins", icon: "fas fa-coins", unlocked: false }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements
  initializeProfileElements();
  
  // Load player data
  loadPlayerProfile();
  loadPlayerTournaments();
  loadPlayerAchievements();
  
  // Set up event listeners
  setupProfileEventListeners();
});

// Initialize profile page elements
function initializeProfileElements() {
  // Update player info in header
  document.getElementById('player-name').textContent = currentPlayer.name;
  document.getElementById('player-balance').textContent = currentPlayer.balance;
  
  // Other elements specific to profile page
  const storeModal = document.getElementById('store-modal');
  const editProfileModal = document.getElementById('edit-profile-modal');
  const emailSettingsModal = document.getElementById('email-settings-modal');
  const closeButtons = document.querySelectorAll('.close');
  
  // Close buttons for modals
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      storeModal.style.display = 'none';
      editProfileModal.style.display = 'none';
      emailSettingsModal.style.display = 'none';
    });
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === storeModal) {
      storeModal.style.display = 'none';
    }
    if (event.target === editProfileModal) {
      editProfileModal.style.display = 'none';
    }
    if (event.target === emailSettingsModal) {
      emailSettingsModal.style.display = 'none';
    }
  });
}

// Load player profile data
function loadPlayerProfile() {
  document.getElementById('profile-username').textContent = currentPlayer.name;
  document.getElementById('profile-email').textContent = currentPlayer.email || 'No email set';
  document.getElementById('profile-balance').textContent = currentPlayer.balance;
  document.getElementById('profile-points').textContent = currentPlayer.points;
  
  // Count tournaments (this would normally be loaded from server)
  const tournamentCount = Math.floor(Math.random() * 5); // Mock data
  document.getElementById('profile-tournaments').textContent = tournamentCount;
  
  // Update avatar if set
  if (currentPlayer.avatar) {
    const avatarElement = document.querySelector('.profile-avatar i');
    avatarElement.className = currentPlayer.avatar;
  }
}

// Load player tournaments
function loadPlayerTournaments() {
  const tournamentsContainer = document.getElementById('player-tournaments');
  
  // In a real app, this would filter from the main tournaments array
  // For now, let's create some mock data
  const mockTournaments = [];
  
  if (mockTournaments.length === 0) {
    // Show empty message
    return;
  }
  
  // Clear container
  tournamentsContainer.innerHTML = '';
  
  // Add each tournament
  mockTournaments.forEach(tournament => {
    const tournamentElement = document.createElement('div');
    tournamentElement.className = 'tournament-card';
    tournamentElement.innerHTML = `
      <h3>${tournament.name}</h3>
      <p class="date">Date: ${new Date(tournament.date).toLocaleString()}</p>
      <p class="description">${tournament.description}</p>
      <p>Status: <span class="status ${tournament.status.toLowerCase()}">${tournament.status}</span></p>
    `;
    
    tournamentsContainer.appendChild(tournamentElement);
  });
}

// Load player achievements
function loadPlayerAchievements() {
  const achievementsContainer = document.getElementById('player-achievements');
  
  // Clear empty message
  achievementsContainer.innerHTML = '';
  
  // Add each achievement
  playerAchievements.forEach(achievement => {
    const achievementElement = document.createElement('div');
    achievementElement.className = `achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`;
    achievementElement.innerHTML = `
      <div class="achievement-icon">
        <i class="${achievement.icon}"></i>
      </div>
      <div class="achievement-info">
        <h3>${achievement.name}</h3>
        <p>${achievement.description}</p>
      </div>
    `;
    
    achievementsContainer.appendChild(achievementElement);
  });
}

// Set up event listeners for profile page
function setupProfileEventListeners() {
  // Home button
  document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });
  
  // Store button
  document.getElementById('open-store').addEventListener('click', () => {
    document.getElementById('store-modal').style.display = 'block';
  });
  
  // Edit profile button
  document.getElementById('edit-profile-btn').addEventListener('click', () => {
    // Populate form with current values
    document.getElementById('edit-username').value = currentPlayer.name;
    document.getElementById('edit-email').value = currentPlayer.email || '';
    document.getElementById('edit-avatar').value = currentPlayer.avatar || 'fas fa-user-circle';
    
    document.getElementById('edit-profile-modal').style.display = 'block';
  });
  
  // Save profile changes
  document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newUsername = document.getElementById('edit-username').value;
    const newAvatar = document.getElementById('edit-avatar').value;
    
    // Update current player
    currentPlayer.name = newUsername;
    currentPlayer.avatar = newAvatar;
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentPlayer));
    
    // Update UI
    loadPlayerProfile();
    document.getElementById('player-name').textContent = newUsername;
    
    // Close modal
    document.getElementById('edit-profile-modal').style.display = 'none';
  });
  
  // Settings buttons
  document.getElementById('change-password-btn').addEventListener('click', () => {
    alert('Password change functionality coming soon!');
  });
  
  document.getElementById('notification-settings-btn').addEventListener('click', () => {
    alert('Notification settings coming soon!');
  });
  
  document.getElementById('delete-account-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion is currently disabled.');
    }
  });
}
