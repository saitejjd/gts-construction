// main.js - Updated Version
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Components
    initSmoothScroll();
    initNavbarScroll();
    initContactForm();
    initDarkMode();
    loadProjects();
    initPageTransitions();
  });
  
  // ===== Project Loading =====
  async function loadProjects() {
    const loader = createLoader();
    const container = document.getElementById('projectsContainer');
    
    try {
        if (!container) throw new Error('Projects container not found');
        
        container.prepend(loader);
        const response = await fetch('http://localhost:5000/api/projects'); // Updated to port 5000
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const { data: projects } = await response.json();
        container.innerHTML = projects.map(createProjectCard).join('');
        
    } catch (error) {
        console.error('Project loading failed:', error);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger">
                    Failed to load projects. ${error.message}
                </div>
            </div>
        `;
    } finally {
        loader.remove();
    }
  }
  
  function createProjectCard(project) {
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="project-card animate-on-scroll">
                <img src="${project.image || '/assets/images/placeholder.jpg'}" 
                     alt="${project.name || 'Construction project'}" 
                     class="project-image lazy-load"
                     loading="lazy">
                <div class="project-overlay">
                    <h3>${project.name || 'Project Title'}</h3>
                    <p>${project.location || 'Location not specified'}</p>
                    <small>
                        ${project.completionDate ? 
                            new Date(project.completionDate).toLocaleDateString() : 
                            'Completion date unavailable'}
                    </small>
                </div>
            </div>
        </div>
    `;
  }
  
  // ===== Contact Form Handling =====
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        };

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST', // Use POST method
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Submission failed');
            alert('Message sent successfully!');
            e.target.reset(); // Clear the form after successful submission

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message');
        }
    });
}
  
  // ===== Helper Functions =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, this.href);
            }
        });
    });
  }
  
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
  
    let lastScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
            navbar.style.backgroundColor = currentScroll > lastScroll ? 
                'rgba(0, 0, 0, 0.95)' : 
                'rgba(0, 0, 0, 0.9)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }
        
        lastScroll = currentScroll;
    }, 100));
  }
  
  function showMessage(type, text) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${text}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.getElementById('formMessage') || document.body;
    container.prepend(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
  }
  
  function createLoader() {
    const loader = document.createElement('div');
    loader.className = 'text-center py-4';
    loader.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';
    return loader;
  }
  
  function sanitizeInput(input) {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
  }
  
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
  }
  
  // ===== Dark Mode Initialization =====
  function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (!darkModeToggle) return;
  
    // Load saved preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) document.body.classList.add('dark-mode');
  
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
  }
  
  // ===== Page Transitions =====
  function initPageTransitions() {
    document.body.classList.add('page-transition');
    window.addEventListener('beforeunload', () => {
        document.body.classList.add('page-exit');
    });
  }