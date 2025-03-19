// DOM Elements
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const projectsContainer = document.getElementById('projectsContainer');

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    setupContactForm();
    setupSmoothScroll();
});

// Load Projects from API
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const { data: projects } = await response.json();
        
        projectsContainer.innerHTML = projects.map(project => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 gts-card">
                    <img src="${project.image}" class="card-img-top project-img" alt="${project.name}">
                    <div class="card-body">
                        <h5 class="card-title">${project.name}</h5>
                        <p class="card-text">${project.location}</p>
                        <small class="text-muted">
                            Completed: ${new Date(project.completionDate).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Failed to load projects. Please try again later.</p>
            </div>
        `;
    }
}

// Contact Form Handling
function setupContactForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            showMessage(result.success ? 'success' : 'danger', result.message);
            if(result.success) e.target.reset();
        } catch (error) {
            showMessage('danger', 'Message failed to send. Please try again.');
        }
    });
}

// Show Alert Message
function showMessage(type, text) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alert.innerHTML = `
        ${text}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    formMessage.appendChild(alert);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Smooth Scroll Setup
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});