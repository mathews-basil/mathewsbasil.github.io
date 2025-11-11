// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Project Filtering (initialized after projects are loaded)
// Moved to initializeProjectFiltering() function

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
    '.project-card, .skill-category, .achievement-card, .service-card, .contact-item'
);

animateElements.forEach(el => {
    observer.observe(el);
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Form Submission Handler moved below (now uses API)

// Typing Animation for Hero Section (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.project-card, .achievement-card, .skill-category');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize reveal animation
const reveals = document.querySelectorAll('.project-card, .achievement-card, .skill-category');
reveals.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Run once on load

// Skill Item Hover Effect
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) scale(1)';
    });
});

// Dynamic Year in Footer
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
}

// Add loading animation (optional)
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// API Base URL
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:5000/api' 
    : '/api';

// Fetch and render projects
async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();
        
        if (projects.length === 0) {
            initializeSeeMoreButton(); // Initialize for static projects
            return; // Keep default projects if none in database
        }

        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';
        
        projects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });

        // Re-initialize project filtering
        initializeProjectFiltering();
        // Initialize see more button
        initializeSeeMoreButton();
    } catch (error) {
        console.error('Error fetching projects:', error);
        // Keep default projects if API fails
        initializeSeeMoreButton(); // Initialize for static projects
    }
}

// Create project card element
function createProjectCard(project, index = 0) {
    const card = document.createElement('div');
    // Hide projects beyond the first 3
    const shouldHide = index >= 3;
    card.className = `project-card${shouldHide ? ' project-hidden' : ''}`;
    card.setAttribute('data-category', project.category);
    
    const iconMap = {
        web: 'fas fa-laptop-code',
        mobile: 'fas fa-mobile-alt',
        api: 'fas fa-server',
        other: 'fas fa-code'
    };

    const icon = iconMap[project.category] || 'fas fa-laptop-code';
    
    const imageUrl = project.imageUrl || `images/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const hasImage = project.imageUrl;
    
    card.innerHTML = `
        <div class="project-image">
            <div class="project-overlay">
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>` : ''}
                ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
            </div>
            ${hasImage ? `
                <img src="${project.imageUrl}" alt="${project.title}" onerror="this.style.display='none';" loading="lazy">
            ` : ''}
            <div class="image-placeholder">
                <i class="${icon}"></i>
            </div>
        </div>
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Fetch and render skills
async function fetchSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills`);
        const skills = await response.json();
        
        if (skills.length === 0) {
            return; // Keep default skills if none in database
        }

        const skillsContainer = document.querySelector('.skills-container');
        if (!skillsContainer) return;

        // Group skills by category
        const skillsByCategory = {
            frontend: [],
            backend: [],
            tools: []
        };

        skills.forEach(skill => {
            if (skillsByCategory[skill.category]) {
                skillsByCategory[skill.category].push(skill);
            }
        });

        // Category mapping
        const categoryInfo = {
            frontend: { title: 'Frontend', icon: 'fas fa-code' },
            backend: { title: 'Backend', icon: 'fas fa-server' },
            tools: { title: 'Tools & Others', icon: 'fas fa-tools' }
        };

        skillsContainer.innerHTML = '';
        
        Object.keys(categoryInfo).forEach(category => {
            if (skillsByCategory[category].length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';
                
                const info = categoryInfo[category];
                categoryDiv.innerHTML = `
                    <h3 class="category-title">
                        <i class="${info.icon}"></i>
                        ${info.title}
                    </h3>
                    <div class="skill-items">
                        ${skillsByCategory[category].map(skill => `
                            <div class="skill-item">
                                <i class="${skill.icon || 'fas fa-code'}"></i>
                                <span>${skill.name}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                skillsContainer.appendChild(categoryDiv);
            }
        });
    } catch (error) {
        console.error('Error fetching skills:', error);
        // Keep default skills if API fails
    }
}

// Fetch and render achievements
async function fetchAchievements() {
    try {
        const response = await fetch(`${API_BASE_URL}/achievements`);
        const achievements = await response.json();
        
        if (achievements.length === 0) {
            return; // Keep default achievements if none in database
        }

        const achievementsGrid = document.querySelector('.achievements-grid');
        if (!achievementsGrid) return;

        achievementsGrid.innerHTML = '';
        
        achievements.forEach(achievement => {
            const achievementCard = document.createElement('div');
            achievementCard.className = 'achievement-card';
            
            achievementCard.innerHTML = `
                <div class="achievement-icon">
                    <i class="${achievement.icon || 'fas fa-trophy'}"></i>
                </div>
                <h3 class="achievement-title">${achievement.title}</h3>
                <p class="achievement-description">${achievement.description}</p>
                <span class="achievement-date">${achievement.date}</span>
            `;
            
            achievementsGrid.appendChild(achievementCard);
        });

        // Re-initialize animations
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            observer.observe(card);
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        // Keep default achievements if API fails
    }
}

// Initialize project filtering (needs to run after projects are loaded)
function initializeProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const matchesFilter = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                const isHidden = card.classList.contains('project-hidden');
                const isShown = card.classList.contains('show');
                
                if (matchesFilter) {
                    // Show card if it's not hidden, or if it's hidden but already shown
                    if (!isHidden || isShown) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease-out';
                    } else {
                        // Keep hidden projects hidden if not expanded
                        card.style.display = 'none';
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize "See More Projects" button
function initializeSeeMoreButton() {
    const seeMoreBtn = document.getElementById('see-more-projects');
    if (!seeMoreBtn) return;

    const hiddenProjects = document.querySelectorAll('.project-card.project-hidden');
    
    // Hide button if there are no hidden projects
    if (hiddenProjects.length === 0) {
        seeMoreBtn.classList.add('hidden');
        return;
    }

    let isExpanded = false;

    seeMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        const btnText = seeMoreBtn.querySelector('.btn-text');
        
        if (isExpanded) {
            // Show all hidden projects
            hiddenProjects.forEach((project, index) => {
                setTimeout(() => {
                    project.classList.add('show');
                }, index * 100); // Stagger animation
            });
            
            btnText.textContent = 'Show Less Projects';
            seeMoreBtn.classList.add('expanded');
            
            // Smooth scroll to show more projects
            setTimeout(() => {
                seeMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        } else {
            // Hide projects beyond first 3
            hiddenProjects.forEach(project => {
                project.classList.remove('show');
            });
            
            btnText.textContent = 'See More Projects';
            seeMoreBtn.classList.remove('expanded');
        }
    });
}

// Formspree Configuration
const FORMPREE_ENDPOINT = 'xkgppawd'; // Replace with your Formspree form ID
const USE_FORMPREE = true; // Set to false to use MongoDB backend instead

// Update contact form submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    // Set Formspree endpoint if using Formspree
    if (USE_FORMPREE && FORMPREE_ENDPOINT !== 'YOUR_FORM_ID') {
        contactForm.action = `https://formspree.io/f/${FORMPREE_ENDPOINT}`;
    }
    
    contactForm.addEventListener('submit', async (e) => {
        // If using Formspree, allow default form submission for free tier
        // or use AJAX for paid tier
        if (USE_FORMPREE && FORMPREE_ENDPOINT !== 'YOUR_FORM_ID') {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Get form values
            const formData = new FormData(contactForm);
            
            // Validation
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const message = formData.get('message')?.trim();
            
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon!`);
                    contactForm.reset();
                } else {
                    const result = await response.json();
                    throw new Error(result.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('Sorry, there was an error sending your message. Please try again later or contact me directly via email.');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        } else {
            // MongoDB backend submission (existing code)
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Get form values
            const formData = {
                name: contactForm.querySelector('input[name="name"]').value.trim(),
                email: contactForm.querySelector('input[name="email"]').value.trim(),
                message: contactForm.querySelector('textarea[name="message"]').value.trim()
            };

            // Validation
            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert(`Thank you, ${formData.name}! Your message has been received. I'll get back to you soon!`);
                    contactForm.reset();
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('Sorry, there was an error sending your message. Please try again later or contact me directly via email.');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
}

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize see more button for static projects first
    initializeSeeMoreButton();
    
    await Promise.all([
        fetchProjects(),
        fetchSkills(),
        fetchAchievements()
    ]);
});

// Console message
console.log('%c👋 Hello! Welcome to my portfolio.', 'color: #0066ff; font-size: 20px; font-weight: bold;');
console.log('%cFeel free to explore the code and reach out if you have any questions!', 'color: #9ca3af; font-size: 14px;');

