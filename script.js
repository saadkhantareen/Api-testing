const apiURL = 'https://672de365fd89797156442254.mockapi.io/users';
const userList = document.getElementById('user-list');
const userForm = document.getElementById('user-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const userIdInput = document.getElementById('user-id');
const submitButton = document.getElementById('submit-button');
const clearButton = document.getElementById('clear-button');
const searchInput = document.getElementById('search-input');
const notificationArea = document.getElementById('notification');

// Notification function
function showNotification(message, type = 'success') {
    notificationArea.innerHTML = `
        <div class="notification ${type}">
            ${message}
        </div>
    `;
    notificationArea.style.opacity = '1';
    notificationArea.style.transform = 'translateY(0)';

    setTimeout(() => {
        notificationArea.style.opacity = '0';
        notificationArea.style.transform = 'translateY(-20px)';
    }, 3000);
}

// Fetch and display users when page loads
window.addEventListener('DOMContentLoaded', fetchUsers);

// Fetch users
async function fetchUsers() {
    try {
        const response = await fetch(apiURL);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        showNotification('Failed to fetch users', 'error');
    }
}

// Display users with search functionality
function displayUsers(users) {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );

    userList.innerHTML = '';
    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <div class="user-info">
                <strong>${user.name}</strong>
                <small>${user.email}</small>
            </div>
            <div class="user-actions">
                <button class="edit-btn" onclick="editUser('${user.id}', '${user.name}', '${user.email}')">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
            </div>
        `;
        userList.appendChild(userCard);
    });
}

// Add or update user
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = userIdInput.value;
    const name = usernameInput.value;
    const email = emailInput.value;

    if (id) {
        // Update user
        await updateUser(id, { name, email });
        showNotification('User updated successfully');
    } else {
        // Add new user
        await addUser({ name, email });
        showNotification('User added successfully');
    }

    // Reset form and button
    resetForm();
    fetchUsers();
});

// Reset form
function resetForm() {
    userForm.reset();
    userIdInput.value = '';
    submitButton.querySelector('span').textContent = 'Add User';
}

// Clear button functionality
clearButton.addEventListener('click', resetForm);

// Add user
async function addUser(user) {
    try {
        await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    } catch (error) {
        console.error('Error adding user:', error);
        showNotification('Failed to add user', 'error');
    }
}

// Edit user
function editUser(id, name, email) {
    userIdInput.value = id;
    usernameInput.value = name;
    emailInput.value = email;
    submitButton.querySelector('span').textContent = 'Update User';
}

// Update user
async function updateUser(id, user) {
    try {
        await fetch(`${apiURL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    } catch (error) {
        console.error('Error updating user:', error);
        showNotification('Failed to update user', 'error');
    }
}

// Delete user
async function deleteUser(id) {
    try {
        await fetch(`${apiURL}/${id}`, {
            method: 'DELETE'
        });
        fetchUsers();
        showNotification('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Failed to delete user', 'error');
    }
}

// Search functionality
searchInput.addEventListener('input', fetchUsers);