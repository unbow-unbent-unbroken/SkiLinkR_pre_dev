document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes('index.html') || currentPath === '/') {
        // Fetch and display services for the landing page
        fetchServices();
    } else if (currentPath.includes('login.html')) {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', loginUser);
    } else if (currentPath.includes('profile.html')) {
        // Load profile information
        loadProfile();
    } else if (currentPath.includes('register.html')) {
        const registerForm = document.getElementById('register-form');
        registerForm.addEventListener('submit', registerUser);
    } else if (currentPath.includes('services.html')) {
        fetchServices();
    }
});

function fetchServices() {
    fetch('http://localhost:5000/services')
        .then(response => response.json())
        .then(services => {
            const serviceList = document.getElementById('service-list');
            serviceList.innerHTML = '';
            services.forEach(service => {
                const li = document.createElement('li');
                li.textContent = `${service.title}: $${service.price}`;
                serviceList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching services:', error));
}

function registerUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        event.target.reset();
        window.location.href = 'login.html';
    })
    .catch(error => console.error('Error registering user:', error));
}

function loginUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            localStorage.setItem('userId', data.userId);
            window.location.href = 'profile.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error logging in user:', error));
}

function loadProfile() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    fetch(`http://localhost:5000/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            const profileInfo = document.getElementById('profile-info');
            profileInfo.innerHTML = `
                <p>Username: ${user.username}</p>
                <p>Email: ${user.email}</p>
            `;
        })
        .catch(error => console.error('Error loading profile:', error));
}
