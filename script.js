// Load current player data from localStorage (set during login)
let currentPlayer = JSON.parse(localStorage.getItem('currentUser')) || {
  name: "Guest",
  balance: 0,
  points: 0
};

// Rank system configuration - load from localStorage or use default
let rankSystem = JSON.parse(localStorage.getItem('rankSystem')) || [
  { name: "Bronze", points: 0, class: "bronze", perks: "No special perks" },
  { name: "Silver", points: 500, class: "silver", perks: "Ability to provide input on game rules" },
  { name: "Gold", points: 1000, class: "gold", perks: "Input on game and server rules" },
  { name: "Diamond", points: 1500, class: "diamond", perks: "All previous privileges, Ability to issue temporary bans" },
  { name: "Mythic", points: 2000, class: "mythic", perks: "All previous privileges, Eligible for prize raffles" },
  { name: "Champion", points: 2500, class: "champion", perks: "Highest rank with all benefits" }
];

let tournamentWinners = [
  { rank: 1, player: "Player1", tournament: "Fortnite Cup", prize: 1000 },
  { rank: 2, player: "Player2", tournament: "Fortnite Cup", prize: 500 },
  { rank: 3, player: "Player3", tournament: "Fortnite Cup", prize: 250 },
  { rank: 4, player: "Player6", tournament: "Fortnite Cup", prize: 100 },
  { rank: 5, player: "Player7", tournament: "Fortnite Cup", prize: 50 },
  { rank: 1, player: "Player4", tournament: "COD Tournament", prize: 1500 },
  { rank: 2, player: "Player1", tournament: "COD Tournament", prize: 750 },
  { rank: 3, player: "Player5", tournament: "COD Tournament", prize: 300 },
  { rank: 4, player: "Player8", tournament: "COD Tournament", prize: 150 },
  { rank: 5, player: "Player9", tournament: "COD Tournament", prize: 75 },
  { rank: 6, player: "Player10", tournament: "COD Tournament", prize: 50 },
  { rank: 7, player: "Player2", tournament: "COD Tournament", prize: 25 },
  { rank: 8, player: "Player3", tournament: "COD Tournament", prize: 20 },
  { rank: 9, player: "Player7", tournament: "COD Tournament", prize: 15 },
  { rank: 10, player: "Player6", tournament: "COD Tournament", prize: 10 },
];

// Initialize all players with zero balance
let topPlayers = [
  { rank: 1, player: "Player1", balance: 0 },
  { rank: 2, player: "Player4", balance: 0 },
  { rank: 3, player: "Player2", balance: 0 },
  { rank: 4, player: "Player5", balance: 0 },
  { rank: 5, player: "Player3", balance: 0 },
];

// DOM Elements - initialized after DOMContentLoaded
let playerNameElement;
let playerBalanceElement;
let fortniteWinnersTableElement;
let codWinnersTableElement;
let topPlayersTableElement;
let storeModal;
let editModal;
let emailSettingsModal;
let openStoreBtn;
let editFortniteWinnersBtn;
let editCodWinnersBtn;
let editTopPlayersBtn;
let editModalTitle;
let editFormContainer;
let closeButtons;

// Function to initialize DOM elements - with null checks
function initializeElements() {
  playerNameElement = document.getElementById('player-name') || { textContent: '' };
  playerBalanceElement = document.getElementById('player-balance') || { textContent: '' };
  fortniteWinnersTableElement = document.getElementById('fortnite-winners-table');
  codWinnersTableElement = document.getElementById('cod-winners-table');
  topPlayersTableElement = document.getElementById('top-players-table');
  storeModal = document.getElementById('store-modal');
  editModal = document.getElementById('edit-modal');
  emailSettingsModal = document.getElementById('email-settings-modal');
  openStoreBtn = document.getElementById('open-store');
  editFortniteWinnersBtn = document.getElementById('edit-fortnite-winners');
  editCodWinnersBtn = document.getElementById('edit-cod-winners');
  editTopPlayersBtn = document.getElementById('edit-top-players');
  editModalTitle = document.getElementById('edit-modal-title');
  editFormContainer = document.getElementById('edit-form-container');
  closeButtons = document.querySelectorAll('.close');
  
  // Debug which elements are missing
  console.log('DOM Elements initialized. Missing elements:');
  if (!playerNameElement) console.log('Missing: player-name');
  if (!playerBalanceElement) console.log('Missing: player-balance');
  if (!fortniteWinnersTableElement) console.log('Missing: fortnite-winners-table');
  if (!codWinnersTableElement) console.log('Missing: cod-winners-table');
  if (!topPlayersTableElement) console.log('Missing: top-players-table');
  if (!storeModal) console.log('Missing: store-modal');
  if (!editModal) console.log('Missing: edit-modal');
  if (!emailSettingsModal) console.log('Missing: email-settings-modal');
  if (!openStoreBtn) console.log('Missing: open-store');
  if (!editFortniteWinnersBtn) console.log('Missing: edit-fortnite-winners');
  if (!editCodWinnersBtn) console.log('Missing: edit-cod-winners');
  if (!editTopPlayersBtn) console.log('Missing: edit-top-players');
  if (!editModalTitle) console.log('Missing: edit-modal-title');
  if (!editFormContainer) console.log('Missing: edit-form-container');
}

// Email settings
let emailSettings = {
  publicKey: localStorage.getItem('emailjs-public-key') || '',
  serviceId: localStorage.getItem('emailjs-service-id') || '',
  templateId: localStorage.getItem('emailjs-template-id') || ''
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements first
  initializeElements();

  // Now proceed with other initialization
  updateTopPlayers();
  updatePlayerInfo();
  loadLeaderboards();
  setupEventListeners();

  // Display welcome message
  console.log("Welcome to My Awesome Website!");
});

// Update player information
function updatePlayerInfo() {
  playerNameElement.textContent = currentPlayer.name;
  playerBalanceElement.textContent = currentPlayer.balance;
  updatePlayerRank();
}

// Calculate and update player rank
function updatePlayerRank() {
  // Find player's rank based on points
  let currentRank = rankSystem[0]; // Default to first rank
  let nextRankIndex = 1;
  
  for (let i = 0; i < rankSystem.length; i++) {
    if (currentPlayer.points >= rankSystem[i].points) {
      currentRank = rankSystem[i];
      nextRankIndex = i + 1;
    }
  }
  
  let nextRank = nextRankIndex < rankSystem.length ? rankSystem[nextRankIndex] : currentRank;

  // Update DOM elements - with null checks
  const currentRankNameElement = document.getElementById('current-rank-name');
  const rankBadgeElement = document.getElementById('rank-badge');
  const playerPointsElement = document.getElementById('player-points');
  const nextRankPointsElement = document.getElementById('next-rank-points');
  const rankProgressElement = document.getElementById('rank-progress');
  const headerBadgeElement = document.getElementById('player-rank-display');

  if (currentRankNameElement) currentRankNameElement.textContent = currentRank.name;

  // Update badge class to always be bronze
  if (rankBadgeElement) {
    rankBadgeElement.className = `player-rank-badge badge-${currentRank.class}`;
    rankBadgeElement.textContent = currentRank.name;
  }

  // Update header badge to always be bronze
  if (headerBadgeElement) {
    headerBadgeElement.className = `player-rank-badge badge-${currentRank.class}`;
    headerBadgeElement.textContent = currentRank.name;
  }

  // Show player points (even though rank will remain bronze)
  if (playerPointsElement) playerPointsElement.textContent = currentPlayer.points;
  if (nextRankPointsElement) nextRankPointsElement.textContent = nextRank.points;

  // Set progress bar to 0% since everyone stays at Bronze
  if (rankProgressElement) rankProgressElement.style.width = '0%';
}

// Add tournament points to player but maintain bronze rank
function addTournamentPoints(points) {
  currentPlayer.points += points;
  // updatePlayerRank will always set to bronze regardless of points
  updatePlayerRank();
}

// Load leaderboard data and update rank tiers
function loadLeaderboards() {
  // Clear existing data - only if elements exist
  if (fortniteWinnersTableElement) fortniteWinnersTableElement.innerHTML = '';
  if (codWinnersTableElement) codWinnersTableElement.innerHTML = '';
  if (topPlayersTableElement) topPlayersTableElement.innerHTML = '';
  
  // Update rank tiers display
  updateRankTiersDisplay();

  // Filter tournaments by type
  const fortniteWinners = tournamentWinners.filter(winner => winner.tournament === "Fortnite Cup");
  const codWinners = tournamentWinners.filter(winner => winner.tournament === "COD Tournament");

  // Load Fortnite tournament winners - only if element exists
  if (fortniteWinnersTableElement) {
    fortniteWinners.forEach(winner => {
      const row = document.createElement('tr');
      if (winner.rank <= 3) {
        row.classList.add(`rank-${winner.rank}`);
      }

      row.innerHTML = `
        <td>${winner.rank}</td>
        <td>${winner.player}</td>
        <td>${winner.prize} <i class="fas fa-coins"></i></td>
      `;

      fortniteWinnersTableElement.appendChild(row);
    });
  }

  // Load COD tournament winners - only if element exists
  if (codWinnersTableElement) {
    codWinners.forEach(winner => {
      const row = document.createElement('tr');
      if (winner.rank <= 3) {
        row.classList.add(`rank-${winner.rank}`);
      }

      row.innerHTML = `
        <td>${winner.rank}</td>
        <td>${winner.player}</td>
        <td>${winner.prize} <i class="fas fa-coins"></i></td>
      `;

      codWinnersTableElement.appendChild(row);
    });
  }

  // Load top players - only if element exists
  if (topPlayersTableElement) {
    topPlayers.forEach(player => {
      const row = document.createElement('tr');
      if (player.rank <= 3) {
        row.classList.add(`rank-${player.rank}`);
      }

      row.innerHTML = `
        <td>${player.rank}</td>
        <td>${player.player}</td>
        <td>${player.balance} <i class="fas fa-coins"></i></td>
      `;

      topPlayersTableElement.appendChild(row);
    });
  }
}

// Set up event listeners using a more robust approach
function setupEventListeners() {
  // Use document-level event delegation for all clickable elements
  document.addEventListener('click', function(event) {
    // Store button
    if (event.target.closest('#open-store')) {
      const storeModal = document.getElementById('store-modal');
      if (storeModal) storeModal.style.display = 'block';
    }
    
    // Logout button
    if (event.target.closest('#logout-btn')) {
      // Clear current user data
      localStorage.removeItem('currentUser');
      // Redirect to login page
      window.location.href = 'login.html';
    }
    
    // Edit Fortnite Winners button
    if (event.target.closest('#edit-fortnite-winners')) {
      showEditForm('fortnite');
    }
    
    // Edit COD Winners button
    if (event.target.closest('#edit-cod-winners')) {
      showEditForm('cod');
    }
    
    // Edit Top Players button
    if (event.target.closest('#edit-top-players')) {
      showEditForm('top-players');
    }
    
    // Edit Rank System button
    if (event.target.closest('#edit-rank-system')) {
      showEditForm('rank-system');
    }
    
    // Email settings button
    if (event.target.closest('#email-settings-btn')) {
      const emailSettingsModal = document.getElementById('email-settings-modal');
      const publicKeyInput = document.getElementById('emailjs-public-key');
      const serviceIdInput = document.getElementById('emailjs-service-id');
      const templateIdInput = document.getElementById('emailjs-template-id');
      
      if (publicKeyInput) publicKeyInput.value = emailSettings.publicKey;
      if (serviceIdInput) serviceIdInput.value = emailSettings.serviceId;
      if (templateIdInput) templateIdInput.value = emailSettings.templateId;
      
      if (emailSettingsModal) emailSettingsModal.style.display = 'block';
    }
    
    // Save email settings button
    if (event.target.closest('#save-email-settings')) {
      const emailSettingsModal = document.getElementById('email-settings-modal');
      const publicKeyInput = document.getElementById('emailjs-public-key');
      const serviceIdInput = document.getElementById('emailjs-service-id');
      const templateIdInput = document.getElementById('emailjs-template-id');
      
      if (publicKeyInput) emailSettings.publicKey = publicKeyInput.value;
      if (serviceIdInput) emailSettings.serviceId = serviceIdInput.value;
      if (templateIdInput) emailSettings.templateId = templateIdInput.value;

      // Save to localStorage
      localStorage.setItem('emailjs-public-key', emailSettings.publicKey);
      localStorage.setItem('emailjs-service-id', emailSettings.serviceId);
      localStorage.setItem('emailjs-template-id', emailSettings.templateId);

      // Re-initialize EmailJS
      if (emailSettings.publicKey) {
        emailjs.init(emailSettings.publicKey);
      }

      if (emailSettingsModal) emailSettingsModal.style.display = 'none';
      alert('Email settings saved!');
    }
    
    // Close buttons
    if (event.target.closest('.close')) {
      const storeModal = document.getElementById('store-modal');
      const editModal = document.getElementById('edit-modal');
      const emailSettingsModal = document.getElementById('email-settings-modal');
      
      if (storeModal) storeModal.style.display = 'none';
      if (editModal) editModal.style.display = 'none';
      if (emailSettingsModal) emailSettingsModal.style.display = 'none';
    }
    
    // Buy buttons
    if (event.target.closest('.buy-btn')) {
      handlePurchase(event);
    }
  });

  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    const storeModal = document.getElementById('store-modal');
    const editModal = document.getElementById('edit-modal');
    const emailSettingsModal = document.getElementById('email-settings-modal');
    
    if (event.target === storeModal) {
      storeModal.style.display = 'none';
    }
    if (event.target === editModal) {
      editModal.style.display = 'none';
    }
    if (event.target === emailSettingsModal) {
      emailSettingsModal.style.display = 'none';
    }
  });
}

// Initialize EmailJS with saved settings
document.addEventListener('DOMContentLoaded', function() {
  if (emailSettings.publicKey) {
    emailjs.init(emailSettings.publicKey);
  }
});

// Handle purchase from the store
function handlePurchase(event) {
  // Get the button that was clicked (either the target or its parent)
  const button = event.target.closest('.buy-btn');
  if (!button) return;
  
  const price = parseInt(button.getAttribute('data-price'));
  const item = button.getAttribute('data-item');

  if (currentPlayer.balance >= price) {
    currentPlayer.balance -= price;
    updatePlayerInfo();

    // Save updated player data to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentPlayer));

    // Send email notification about the purchase
    sendPurchaseEmail(currentPlayer.name, item, price);

    // Show purchase confirmation
    alert(`Successfully purchased ${item} for ${price} coins!`);
  } else {
    alert('Not enough coins for this purchase!');
  }
}

// Send email notification about a purchase
function sendPurchaseEmail(playerName, item, price) {
  // Only send if email settings are configured
  if (!emailSettings.serviceId || !emailSettings.templateId || !emailSettings.publicKey) {
    console.log('Email settings not configured');
    alert('Email notification not sent: Please configure your email settings first by clicking the envelope icon in the store.');
    return;
  }

  const templateParams = {
    player_name: playerName,
    item_name: item,
    item_price: price,
    player_balance: currentPlayer.balance
  };

  alert('Sending email notification...');

  emailjs.send(emailSettings.serviceId, emailSettings.templateId, templateParams)
    .then(function(response) {
      console.log('Email sent successfully!', response.status, response.text);
      alert('Email notification sent successfully!');
    }, function(error) {
      console.log('Failed to send email...', error);
      alert('Failed to send email notification. Please check your email settings and try again.');
    });
}

// Show edit form for leaderboards and rank system
function showEditForm(type) {
  if (type === 'fortnite') {
    editModalTitle.textContent = 'Edit Fortnite Cup Winners';
    createWinnersEditForm('Fortnite Cup');
  } else if (type === 'cod') {
    editModalTitle.textContent = 'Edit COD Tournament Winners';
    createWinnersEditForm('COD Tournament');
  } else if (type === 'top-players') {
    editModalTitle.textContent = 'Edit Top Players';
    createTopPlayersEditForm();
  } else if (type === 'rank-system') {
    editModalTitle.textContent = 'Edit Rank System';
    createRankSystemEditForm();
  }

  editModal.style.display = 'block';
}

// Create form for editing tournament winners
function createWinnersEditForm(tournamentType) {
  // Get the filtered tournament winners
  const tournamentData = tournamentWinners.filter(winner => winner.tournament === tournamentType);

  let formHTML = `
    <form id="winners-edit-form" class="edit-form">
      <input type="hidden" id="tournament-type" value="${tournamentType}">
      <p>Edit the ${tournamentType} winners and their prizes:</p>

      <div id="tournament-winners-inputs">
  `;

  // Create inputs for ranks 1-10
  for (let i = 1; i <= 10; i++) {
    const winner = tournamentData.find(w => w.rank === i);
    const playerValue = winner ? winner.player : '';
    const prizeValue = winner ? winner.prize : '';

    formHTML += `
      <div class="form-group player-entry">
        <label>Rank ${i}:</label>
        <input type="text" class="player-name" value="${playerValue}" placeholder="Player name">
        <input type="number" class="player-prize" value="${prizeValue}" placeholder="Prize amount">
      </div>
    `;
  }

  formHTML += `
      </div>
      <button type="submit" class="submit-btn">Save Changes</button>
    </form>
  `;

  editFormContainer.innerHTML = formHTML;

  // Handle form submission
  document.getElementById('winners-edit-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const playerEntries = document.querySelectorAll('.player-entry');
    let tournamentName = document.getElementById('tournament-type').value;

    // Remove existing entries for this tournament
    tournamentWinners = tournamentWinners.filter(winner => 
      winner.tournament !== tournamentName);

    // Add new entries for each rank
    playerEntries.forEach((entry, index) => {
      const playerName = entry.querySelector('.player-name').value;
      const playerPrize = parseInt(entry.querySelector('.player-prize').value) || 0;

      if (playerName) {
        tournamentWinners.push({
          rank: index + 1,
          player: playerName,
          tournament: tournamentName,
          prize: playerPrize
        });

        // Award tournament points to the current player if they won first place
        if (index === 0 && playerName === currentPlayer.name) {
          addTournamentPoints(50);
        }
      }
    });

    // Update UI
    loadLeaderboards();
    updateTopPlayers();
    editModal.style.display = 'none';
  });
}

// Create form for editing top players
function createTopPlayersEditForm() {
  let formHTML = `
    <form id="top-players-edit-form" class="edit-form">
      <p>Edit the top players and their balances:</p>

      <div id="top-players-inputs">
  `;

  // Add inputs for existing top players
  topPlayers.forEach((player, index) => {
    formHTML += `
      <div class="form-group player-entry">
        <label>Player ${index + 1}:</label>
        <input type="text" class="player-name" value="${player.player}" placeholder="Player name">
        <input type="number" class="player-balance" value="${player.balance}" placeholder="Balance">
      </div>
    `;
  });

  formHTML += `
      </div>

      <button type="button" id="add-player" class="submit-btn">Add Player</button>
      <button type="submit" class="submit-btn">Save Changes</button>
    </form>
  `;

  editFormContainer.innerHTML = formHTML;

  // Add event listeners
  document.getElementById('add-player').addEventListener('click', () => {
    const playerInputs = document.getElementById('top-players-inputs');
    const playerCount = document.querySelectorAll('.player-entry').length;

    const newPlayerHTML = `
      <div class="form-group player-entry">
        <label>Player ${playerCount + 1}:</label>
        <input type="text" class="player-name" placeholder="Player name">
        <input type="number" class="player-balance" placeholder="Balance">
      </div>
    `;

    playerInputs.insertAdjacentHTML('beforeend', newPlayerHTML);
  });

  // Handle form submission

// Update the rank tiers display based on current rankSystem data
function updateRankTiersDisplay() {
  const rankTiersContainer = document.querySelector('.rank-tiers');
  if (!rankTiersContainer) return;
  
  // Clear current tiers
  rankTiersContainer.innerHTML = '';
  
  // Add each rank tier
  rankSystem.forEach(rank => {
    const tierElement = document.createElement('div');
    tierElement.className = `rank-tier ${rank.class}`;
    
    tierElement.innerHTML = `
      <h3>${rank.name}</h3>
      <p class="points">${rank.points} Points</p>
      <div class="perks">
        <p>${rank.perks}</p>
      </div>
    `;
    
    rankTiersContainer.appendChild(tierElement);
  });
}

// Create form for editing rank system
function createRankSystemEditForm() {
  let formHTML = `
    <form id="rank-system-edit-form" class="edit-form">
      <p>Edit the rank system tiers, points required, and perks:</p>
      <div id="rank-tiers-inputs">
  `;

  // Create inputs for each rank
  rankSystem.forEach((rank, index) => {
    formHTML += `
      <div class="form-group rank-tier-entry" data-index="${index}">
        <h3>Rank ${index + 1}</h3>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" class="rank-name" value="${rank.name}" required>
        </div>
        <div class="form-group">
          <label>CSS Class:</label>
          <input type="text" class="rank-class" value="${rank.class}" required>
        </div>
        <div class="form-group">
          <label>Points Required:</label>
          <input type="number" class="rank-points" value="${rank.points}" required min="0">
        </div>
        <div class="form-group">
          <label>Perks:</label>
          <textarea class="rank-perks" rows="3" required>${rank.perks}</textarea>
        </div>
        ${index > 0 ? `<button type="button" class="delete-rank submit-btn">Delete Rank</button>` : ''}
      </div>
    `;
  });

  formHTML += `
      </div>
      <button type="button" id="add-rank" class="submit-btn">Add New Rank</button>
      <button type="submit" class="submit-btn">Save Changes</button>
    </form>
  `;

  editFormContainer.innerHTML = formHTML;

  // Add event listener for adding a new rank
  document.getElementById('add-rank').addEventListener('click', () => {
    const rankInputs = document.getElementById('rank-tiers-inputs');
    const rankCount = document.querySelectorAll('.rank-tier-entry').length;
    
    // Create a class name based on the rank name
    const className = `new-rank-${rankCount}`;
    
    const newRankHTML = `
      <div class="form-group rank-tier-entry" data-index="${rankCount}">
        <h3>Rank ${rankCount + 1}</h3>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" class="rank-name" value="New Rank" required>
        </div>
        <div class="form-group">
          <label>CSS Class:</label>
          <input type="text" class="rank-class" value="${className}" required>
        </div>
        <div class="form-group">
          <label>Points Required:</label>
          <input type="number" class="rank-points" value="${rankCount * 500 + 3000}" required min="0">
        </div>
        <div class="form-group">
          <label>Perks:</label>
          <textarea class="rank-perks" rows="3" required>New rank perks description</textarea>
        </div>
        <button type="button" class="delete-rank submit-btn">Delete Rank</button>
      </div>
    `;
    
    rankInputs.insertAdjacentHTML('beforeend', newRankHTML);
    
    // Add event listener to the new delete button
    const deleteButtons = document.querySelectorAll('.delete-rank');
    const newDeleteButton = deleteButtons[deleteButtons.length - 1];
    
    newDeleteButton.addEventListener('click', function() {
      const rankEntry = this.closest('.rank-tier-entry');
      rankEntry.remove();
    });
  });
  
  // Add event listeners for deleting ranks
  document.querySelectorAll('.delete-rank').forEach(button => {
    button.addEventListener('click', function() {
      const rankEntry = this.closest('.rank-tier-entry');
      rankEntry.remove();
    });
  });

  // Handle form submission
  document.getElementById('rank-system-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const rankEntries = document.querySelectorAll('.rank-tier-entry');
    const newRankSystem = [];
    
    rankEntries.forEach(entry => {
      const name = entry.querySelector('.rank-name').value;
      const cssClass = entry.querySelector('.rank-class').value;
      const points = parseInt(entry.querySelector('.rank-points').value) || 0;
      const perks = entry.querySelector('.rank-perks').value;
      
      newRankSystem.push({
        name: name,
        points: points,
        class: cssClass,
        perks: perks
      });
    });
    
    // Sort by points required
    newRankSystem.sort((a, b) => a.points - b.points);
    
    // Update rank system
    rankSystem = newRankSystem;
    
    // Save to localStorage
    localStorage.setItem('rankSystem', JSON.stringify(rankSystem));
    
    // Update UI
    updateRankTiersDisplay();
    updatePlayerRank();
    
    // Close modal
    editModal.style.display = 'none';
  });
}

  document.getElementById('top-players-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const playerEntries = document.querySelectorAll('.player-entry');
    const newTopPlayers = [];

    playerEntries.forEach((entry, index) => {
      const playerName = entry.querySelector('.player-name').value;
      const playerBalance = parseInt(entry.querySelector('.player-balance').value);

      if (playerName && !isNaN(playerBalance)) {
        newTopPlayers.push({
          rank: index + 1,
          player: playerName,
          balance: playerBalance
        });
      }
    });

    // Sort by balance
    newTopPlayers.sort((a, b) => b.balance - a.balance);

    // Reassign ranks after sorting
    newTopPlayers.forEach((player, index) => {
      player.rank = index + 1;
    });

    // Update player balance if current player is in the list
    const currentPlayerEntry = newTopPlayers.find(p => p.player === currentPlayer.name);
    if (currentPlayerEntry) {
      currentPlayer.balance = currentPlayerEntry.balance;
      updatePlayerInfo();
    }

    // Update top players list
    topPlayers = newTopPlayers;
    loadLeaderboards();
    editModal.style.display = 'none';
  });
}

// Update top players list based on tournament winnings
function updateTopPlayers() {
  // Get all unique players
  const allPlayers = new Set();

  tournamentWinners.forEach(winner => {
    allPlayers.add(winner.player);
  });

  // Calculate balance for each player
  const playerBalances = {};

  // Initialize all players with zero balance
  allPlayers.forEach(player => {
    playerBalances[player] = 0;
  });

  // Add coins for each tournament placement - only for Player1
  tournamentWinners.forEach(winner => {
    // Make sure player exists in our balances
    if (!playerBalances[winner.player]) {
      playerBalances[winner.player] = 0;
    }

    // Only add prize amount to Player1's balance
    if (winner.player === "Player1") {
      playerBalances[winner.player] += winner.prize;
    }
  });

  // Update current player balance
  if (playerBalances[currentPlayer.name] !== undefined) {
    currentPlayer.balance = playerBalances[currentPlayer.name];
    updatePlayerInfo();
  }

  // Create sorted top players list
  const newTopPlayers = Object.entries(playerBalances)
    .map(([player, balance]) => ({ player, balance }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5) // Keep top 5
    .map((entry, index) => ({
      rank: index + 1,
      player: entry.player,
      balance: entry.balance
    }));

  topPlayers = newTopPlayers;
  loadLeaderboards();
}