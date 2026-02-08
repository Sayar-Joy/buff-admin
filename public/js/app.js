const API_URL = '/api/buttons';
const CONFIG_URL = '/api/config';

// DOM Elements
const buttonForm = document.getElementById('buttonForm');
const buttonsList = document.getElementById('buttonsList');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const buttonCount = document.getElementById('buttonCount');
const apiUrl = document.getElementById('apiUrl');
const appNameInput = document.getElementById('appNameInput');

// Form inputs
const buttonId = document.getElementById('buttonId');
const buttonName = document.getElementById('buttonName');
const buttonUrl = document.getElementById('buttonUrl');
const buttonIcon = document.getElementById('buttonIcon');
const buttonDescription = document.getElementById('buttonDescription');
const buttonOrder = document.getElementById('buttonOrder');
const buttonActive = document.getElementById('buttonActive');

// State
let isEditing = false;
let currentEditId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAppConfig();
    loadButtons();
    setupEventListeners();
});

// Load app configuration
async function loadAppConfig() {
    try {
        const response = await fetch(CONFIG_URL);
        const result = await response.json();
        
        if (result.success) {
            const config = result.data;
            const fullUrl = window.location.origin + '/api/buttons';
            apiUrl.textContent = fullUrl;
            appNameInput.value = config.appName || 'My Flutter App';
        }
    } catch (error) {
        console.error('Error loading config:', error);
        apiUrl.textContent = window.location.origin + '/api/buttons';
    }
}

// Save app configuration
async function saveAppConfig() {
    try {
        const response = await fetch(CONFIG_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                appName: appNameInput.value
            })
        });

        const result = await response.json();
        if (result.success) {
            showToast('App configuration saved!', 'success');
        } else {
            showToast('Failed to save configuration', 'error');
        }
    } catch (error) {
        console.error('Error saving config:', error);
        showToast('Error saving configuration', 'error');
    }
}

// Copy API URL to clipboard
async function copyApiUrl() {
    const url = apiUrl.textContent;
    try {
        await navigator.clipboard.writeText(url);
        showToast('API URL copied to clipboard!', 'success');
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('API URL copied to clipboard!', 'success');
    }
}

// Setup event listeners
function setupEventListeners() {
    buttonForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);
}

// Load all buttons
async function loadButtons() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result.success) {
            displayButtons(result.data);
            buttonCount.textContent = result.data.length;
        } else {
            showToast('Failed to load buttons', 'error');
        }
    } catch (error) {
        console.error('Error loading buttons:', error);
        buttonsList.innerHTML = '<div class="empty-state"><p>Error loading buttons</p></div>';
        showToast('Error loading buttons', 'error');
    }
}

// Display buttons in the list
function displayButtons(buttons) {
    if (buttons.length === 0) {
        buttonsList.innerHTML = '<div class="empty-state"><p>No buttons yet. Create your first button!</p></div>';
        return;
    }

    buttonsList.innerHTML = buttons.map(button => `
        <div class="button-card ${button.isActive ? '' : 'inactive'}">
            <div class="button-header">
                <div class="button-info">
                    <h3>${escapeHtml(button.name)}</h3>
                    <a href="${escapeHtml(button.url)}" class="button-url" target="_blank" rel="noopener">
                        ${escapeHtml(button.url)}
                    </a>
                    ${button.description ? `<p style="margin-top: 8px; color: #666; font-size: 14px;">${escapeHtml(button.description)}</p>` : ''}
                </div>
                <div class="button-actions">
                    <button class="btn btn-edit" onclick="editButton('${button._id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteButton('${button._id}')">Delete</button>
                </div>
            </div>
            <div class="button-meta">
                ${button.icon ? `<span>📱 Icon: ${escapeHtml(button.icon)}</span>` : ''}
                <span>🔢 Order: ${button.order}</span>
                <span class="badge ${button.isActive ? 'badge-active' : 'badge-inactive'}">
                    ${button.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
        </div>
    `).join('');
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const data = {
        name: buttonName.value.trim(),
        url: buttonUrl.value.trim(),
        icon: buttonIcon.value.trim(),
        description: buttonDescription.value.trim(),
        order: parseInt(buttonOrder.value),
        isActive: buttonActive.checked
    };

    try {
        let response;
        if (isEditing) {
            response = await fetch(`${API_URL}/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();

        if (result.success) {
            showToast(isEditing ? 'Button updated successfully!' : 'Button created successfully!', 'success');
            resetForm();
            loadButtons();
        } else {
            showToast(result.message || 'Operation failed', 'error');
        }
    } catch (error) {
        console.error('Error saving button:', error);
        showToast('Error saving button', 'error');
    }
}

// Edit button
async function editButton(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (result.success) {
            const button = result.data;
            
            // Populate form
            buttonId.value = button._id;
            buttonName.value = button.name;
            buttonUrl.value = button.url;
            buttonIcon.value = button.icon || '';
            buttonDescription.value = button.description || '';
            buttonOrder.value = button.order;
            buttonActive.checked = button.isActive;

            // Update UI
            isEditing = true;
            currentEditId = id;
            formTitle.textContent = 'Edit Button';
            submitBtn.textContent = 'Update Button';
            cancelBtn.style.display = 'inline-block';

            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showToast('Failed to load button data', 'error');
        }
    } catch (error) {
        console.error('Error loading button:', error);
        showToast('Error loading button', 'error');
    }
window.copyApiUrl = copyApiUrl;
window.saveAppConfig = saveAppConfig;
}

// Delete button
async function deleteButton(id) {
    if (!confirm('Are you sure you want to delete this button?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Button deleted successfully!', 'success');
            loadButtons();
        } else {
            showToast(result.message || 'Failed to delete button', 'error');
        }
    } catch (error) {
        console.error('Error deleting button:', error);
        showToast('Error deleting button', 'error');
    }
}

// Reset form
function resetForm() {
    buttonForm.reset();
    buttonId.value = '';
    isEditing = false;
    currentEditId = null;
    formTitle.textContent = 'Add New Button';
    submitBtn.textContent = 'Add Button';
    cancelBtn.style.display = 'none';
    buttonActive.checked = true;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally accessible
window.editButton = editButton;
window.deleteButton = deleteButton;
