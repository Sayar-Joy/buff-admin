const API_URL = "/api/buttons";
const CONFIG_URL = "/api/config";
const AUTH_VERIFY_URL = "/api/auth/verify";

// DOM Elements
const linksList = document.getElementById("linksList");
const apiUrl = document.getElementById("apiUrl");
const appNameInput = document.getElementById("appNameInput");

// Auth token
let authToken = localStorage.getItem("authToken");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  loadAppConfig();
  loadLinks();
});

// Check authentication
async function checkAuth() {
  if (!authToken) {
    window.location.href = "/login.html";
    return;
  }

  try {
    const response = await fetch(AUTH_VERIFY_URL, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json" 
      },
    });

    const result = await response.json();

    if (!result.authenticated) {
      localStorage.removeItem("authToken");
      window.location.href = "/login.html";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/login.html";
  }
}

// Logout function
function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "/login.html";
}

// Load app configuration
async function loadAppConfig() {
  try {
    const response = await fetch(CONFIG_URL);
    const result = await response.json();

    if (result.success) {
      const config = result.data;
      const fullUrl = window.location.origin + "/api/buttons";
      apiUrl.textContent = fullUrl;
      appNameInput.value = config.appName || "My Flutter App";
    }
  } catch (error) {
    console.error("Error loading config:", error);
    apiUrl.textContent = window.location.origin + "/api/buttons";
  }
}

// Save app configuration
async function saveAppConfig() {
  try {
    const response = await fetch(CONFIG_URL, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({
        appName: appNameInput.value,
      }),
    });

    const result = await response.json();
    if (result.success) {
      showToast("App configuration saved!", "success");
    } else {
      showToast("Failed to save configuration", "error");
    }
  } catch (error) {
    console.error("Error saving config:", error);
    showToast("Error saving configuration", "error");
  }
}

// Copy API URL to clipboard
async function copyApiUrl() {
  const url = apiUrl.textContent;
  try {
    await navigator.clipboard.writeText(url);
    showToast("API URL copied to clipboard!", "success");
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast("API URL copied to clipboard!", "success");
  }
}

// Load all links
async function loadLinks() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.success) {
      displayLinks(result.data);
    } else {
      showToast("Failed to load links", "error");
    }
  } catch (error) {
    console.error("Error loading links:", error);
    linksList.innerHTML =
      '<div class="empty-state"><p>Error loading links</p></div>';
    showToast("Error loading links", "error");
  }
}

// Display links in editable cards
function displayLinks(links) {
  if (links.length === 0) {
    linksList.innerHTML =
      '<div class="empty-state"><p>No links configured</p></div>';
    return;
  }

  linksList.innerHTML = links
    .sort((a, b) => a.order - b.order)
    .map(
      (link) => `
        <div class="link-card">
            <div class="link-header">
                <h3>${escapeHtml(link.name)}</h3>
            </div>
            <div class="link-form">
                <div class="form-group">
                    <label>URL:</label>
                    <input 
                        type="text" 
                        id="url-${link._id}" 
                        value="${escapeHtml(link.url)}" 
                        class="link-input"
                        placeholder="Enter URL"
                    />
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <input 
                        type="text" 
                        id="desc-${link._id}" 
                        value="${escapeHtml(link.description || "")}" 
                        class="link-input"
                        placeholder="Enter description"
                    />
                </div>
                <button class="btn btn-primary" onclick="saveLink('${link._id}')">
                    Save Changes
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Save link changes
async function saveLink(id) {
  const urlInput = document.getElementById(`url-${id}`);
  const descInput = document.getElementById(`desc-${id}`);

  const url = urlInput.value.trim();
  const description = descInput.value.trim();

  if (!url) {
    showToast("URL cannot be empty", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, description }),
    });

    const result = await response.json();

    if (result.success) {
      showToast("Link updated successfully!", "success");
      loadLinks();
    } else {
      showToast(result.message || "Failed to update link", "error");
    }
  } catch (error) {
    console.error("Error saving link:", error);
    showToast("Error saving link", "error");
  }
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally accessible
window.editButton = editButton;
window.deleteButton = deleteButton;
saveLink = saveLink;
window.copyApiUrl = copyApiUrl;
window.saveAppConfig = saveAppConfig;
