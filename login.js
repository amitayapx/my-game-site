
// Initialize EmailJS if credentials exist in localStorage
document.addEventListener('DOMContentLoaded', function() {
  // Check if EmailJS credentials are saved
  const publicKey = localStorage.getItem('emailjs-public-key');
  if (publicKey) {
    emailjs.init(publicKey);
  }

  // Get DOM elements
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Check if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    // Redirect to main page
    window.location.href = 'index.html';
  }

  // Event listeners for switching between login and register forms
  showRegisterLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
  });

  showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
  });

  // Handle login form submission
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email and password
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
      // Store current user in localStorage (omit password for security)
      const currentUser = {
        name: user.username,
        email: user.email,
        balance: 0,
        points: 0
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Redirect to main page
      window.location.href = 'index.html';
    } else {
      alert('Invalid email or password');
    }
  });

  // Handle register form submission
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validate that passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user with email already exists
    if (users.some(user => user.email === email)) {
      alert('User with this email already exists');
      return;
    }
    
    // Create new user
    const newUser = {
      username,
      email,
      password // In a real app, you should hash this password
    };
    
    // Add user to users array and save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Send email notification about new registration
    sendRegistrationEmail(username, email);
    
    // Store current user in localStorage (omit password for security)
    const currentUser = {
      name: username,
      email: email,
      balance: 0,
      points: 0
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show success message
    alert('Registration successful! You can now log in.');
    
    // Switch to login form
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
  });
});

// Send email notification about a new registration
function sendRegistrationEmail(username, email) {
  // Get email settings from localStorage
  const serviceId = localStorage.getItem('emailjs-service-id');
  const templateId = localStorage.getItem('emailjs-template-id');
  const publicKey = localStorage.getItem('emailjs-public-key');
  
  // Check if email settings are configured
  if (!serviceId || !templateId || !publicKey) {
    console.log('Email settings not configured');
    alert('Email notification could not be sent: Email settings not configured');
    return;
  }
  
  // Prepare template parameters
  const templateParams = {
    player_name: username,
    player_email: email,
    message: 'A new player has registered for your tournament!',
    item_name: 'Registration', // Using existing template variables
    item_price: 'Free',
    player_balance: 0
  };
  
  // Send email
  emailjs.send(serviceId, templateId, templateParams)
    .then(function(response) {
      console.log('Email sent successfully!', response.status, response.text);
    }, function(error) {
      console.log('Failed to send email...', error);
    });
}
