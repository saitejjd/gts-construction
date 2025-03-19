// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const projectForm = document.getElementById('projectForm');

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    setupProjectForm();
});

// Load Messages from API
async function loadMessages() {
    try {
        const response = await fetch('/api/contact');
        const messages = await response.json();
        
        messagesContainer.innerHTML = messages.map(msg => `
            <div class="col-md-6 mb-4">
                <div class="card message-card">
                    <div class="card-body">
                        <h5 class="card-title">${msg.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${msg.email}</h6>
                        <p class="card-text">${msg.message}</p>
                        <small class="text-muted">
                            ${new Date(msg.date).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Failed to load messages. Please try again later.</p>
            </div>
        `;
    }
}

// Project Form Handling
function setupProjectForm() {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: e.target.name.value,
            location: e.target.location.value,
            completionDate: e.target.completionDate.value,
            image: e.target.image.value
        };

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            showAdminAlert(result.success ? 'success' : 'danger', result.message);
            if(result.success) {
                e.target.reset();
                loadMessages(); // Refresh messages if needed
            }
        } catch (error) {
            showAdminAlert('danger', 'Error adding project');
        }
    });
}

// Show Admin Alert
function showAdminAlert(type, text) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alert.innerHTML = `
        ${text}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.prepend(alert);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Sidebar Toggle for Mobile
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}