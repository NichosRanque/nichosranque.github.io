// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('[INIT] DOM Content Loaded');
    
    // Wait a bit for all scripts to load
    setTimeout(() => {
        console.log('[INIT] Initializing portfolio...');
        // Initialize the portfolio
        initPortfolio();
    }, 100);
});

// Backup initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Still loading, wait for DOMContentLoaded
    console.log('[INIT] Document still loading, waiting for DOMContentLoaded');
} else {
    // DOM already loaded
    console.log('[INIT] Document already loaded, initializing immediately');
    setTimeout(() => {
        initPortfolio();
    }, 100);
}

let currentSectionIndex = 0;
const sections = ['home', 'about', 'arsenal', 'projects', 'experience', 'contact'];

function initPortfolio() {
    console.log('[DEBUG] initPortfolio called');
    
    // Check if portfolioData is loaded
    if (typeof portfolioData === 'undefined') {
        console.error('[ERROR] portfolioData not defined, retrying in 500ms...');
        setTimeout(initPortfolio, 500);
        return;
    }
    
    console.log('[DEBUG] portfolioData loaded successfully');
    
    // Show loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            console.log('[DEBUG] Loading screen hidden');
        }, 500);
    }, 3000);
    
    // Initialize navigation
    initNavigation();
    console.log('[DEBUG] Navigation initialized');
    
    // Initialize scroll detection for single-page layout
    initScrollDetection();
    console.log('[DEBUG] Scroll detection initialized');
    
    // Create scroll indicator
    createScrollIndicator();
    console.log('[DEBUG] Scroll indicator created');
    
    // Load content
    updateMainContent();
    console.log('[DEBUG] Main content loaded');
    
    // Initialize interactive elements
    initInteractiveElements();
    console.log('[DEBUG] Interactive elements initialized');
    
    // Set initial active navigation
    updateActiveNavigation('home');
    console.log('[DEBUG] Navigation set to home');
    
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    console.log('[DEBUG] Smooth scrolling enabled');
}

function initScrollDetection() {
    let ticking = false;
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + 100; // Offset for navigation
        
        // Find which section is currently in view
        let activeSection = 'home';
        
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = window.scrollY + rect.top;
                
                if (scrollPosition >= elementTop) {
                    activeSection = sectionId;
                    currentSectionIndex = sections.indexOf(sectionId);
                }
            }
        });
        
        updateActiveNavigation(activeSection);
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveSection);
            ticking = true;
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', requestTick, { passive: true });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            
            showSection(targetSection);
            
            // Close mobile menu after navigation
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        });
    });
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Toggle body overlay for mobile menu
        document.body.classList.toggle('mobile-menu-open', navMenu.classList.contains('active'));
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    });
}

function showSection(sectionId) {
    console.log(`[DEBUG] Scrolling to section: ${sectionId}`);
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        // Smooth scroll to the target section
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update current section index
        const sectionIndex = sections.indexOf(sectionId);
        if (sectionIndex !== -1) {
            currentSectionIndex = sectionIndex;
        }
        
        // Trigger animations for the section after a delay
        setTimeout(() => {
            triggerSectionAnimations(sectionId);
        }, 500);
    }
}

function updateActiveNavigation(sectionId) {
    // Update navigation highlighting
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Update scroll indicator
    const dots = document.querySelectorAll('.section-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (sections[index] === sectionId) {
            dot.classList.add('active');
        }
    });
}

function triggerSectionAnimations(sectionId) {
    switch(sectionId) {
        case 'skills':
        case 'arsenal':
            animateProgressBars();
            break;
        case 'projects':
            animateProjectCards();
            break;
        case 'experience':
            animateTimeline();
            break;
    }
}

function animateProgressBars() {
    console.log('[DEBUG] animateProgressBars called');
    
    // Reset all progress bars to 0 first
    document.querySelectorAll('.progress-fill').forEach((bar, index) => {
        console.log(`[DEBUG] Resetting progress bar ${index}`);
        bar.style.width = '0%';
        bar.classList.remove('animate');
        bar.style.transition = 'none';
    });
    
    // Force reflow
    document.querySelector('.skills-grid').offsetHeight;
    
    // Animate them with staggered timing
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                console.log(`[DEBUG] Animating progress bar ${index} to ${width}%`);
                bar.style.transition = 'width 2.5s ease-out';
                bar.classList.add('animate');
                bar.style.width = width + '%';
            }, index * 150); // Stagger animation by 150ms per bar
        });
    }, 100); // Wait 100ms before starting animations
}

function animateProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function animateTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 300);
    });
}

function updateMainContent() {
    console.log('[DEBUG] updateMainContent called');
    
    // Check if portfolioData exists
    if (typeof portfolioData === 'undefined') {
        console.error('[ERROR] portfolioData is not defined!');
        return;
    }
    
    console.log('[DEBUG] portfolioData loaded:', portfolioData);
    
    // Force reload the latest data from localStorage
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        try {
            const loadedData = JSON.parse(savedData);
            portfolioData = { ...portfolioData, ...loadedData };
            console.log('[DEBUG] Data reloaded from localStorage, certifications:', portfolioData.certifications.map(c => ({name: c.name, order: c.order})));
        } catch (e) {
            console.error('Error reloading data:', e);
        }
    }
    
    try {
        updateAboutSection();
        console.log('[DEBUG] About section updated');
        
        updateSkillsSection();
        console.log('[DEBUG] Skills section updated');
        
        updateProjectsSection();
        console.log('[DEBUG] Projects section updated');
        
        updateExperienceSection();
        console.log('[DEBUG] Experience section updated');
        
        updateCertificationsSection();
        console.log('[DEBUG] Certifications section updated');
        
        updateHeroSection();
        console.log('[DEBUG] Hero section updated');
        
        updateCommsSection();
        console.log('[DEBUG] Comms section updated');
        
        console.log('[DEBUG] All sections updated successfully');
    } catch (error) {
        console.error('[ERROR] Failed to update sections:', error);
    }
}

function updateHeroSection() {
    const heroTitle = document.querySelector('.glitch');
    const subtitle = document.querySelector('.subtitle');
    
    if (heroTitle) {
        heroTitle.textContent = portfolioData.profile.name.toUpperCase();
        heroTitle.setAttribute('data-text', portfolioData.profile.name.toUpperCase());
    }
    
    if (subtitle) {
        subtitle.textContent = portfolioData.profile.title.toUpperCase();
    }
}

function updateAboutSection() {
    const profileInfo = document.getElementById('profile-info');
    const achievements = document.getElementById('achievements');
    
    if (profileInfo) {
        profileInfo.innerHTML = `
            <div class="profile-container">
                <div class="profile-picture-section">
                    <div class="profile-rank">
                        <div class="rank-stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="rank-title">BSIT STUDENT</span>
                    </div>
                    <div class="profile-picture">
                        <img src="nic.jpg" alt="Nichos Ranque - Student Portfolio" />
                        <div class="picture-border"></div>
                    </div>
                </div>
                <div class="profile-details">
                    <div class="profile-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span><strong>Location:</strong> ${portfolioData.profile.location}</span>
                    </div>
                    <div class="profile-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span><strong>Experience:</strong> ${portfolioData.profile.experience}</span>
                    </div>
                    <div class="profile-item">
                        <i class="fas fa-envelope"></i>
                        <span><strong>Email:</strong> ${portfolioData.profile.email}</span>
                    </div>
                    <div class="profile-item">
                        <i class="fab fa-linkedin"></i>
                        <span><strong>LinkedIn:</strong> <a href="https://${portfolioData.profile.linkedin}" target="_blank" class="profile-linkedin-link">${portfolioData.profile.linkedin}</a></span>
                    </div>
                </div>
            </div>
            <div class="profile-summary">
                <h4>Mission Brief</h4>
                <p>${portfolioData.profile.summary}</p>
                <div class="profile-note">
                    *Please review <a href="https://${portfolioData.profile.linkedin}" target="_blank">LinkedIn</a> profile for better project documentation*
                </div>
            </div>
        `;
    }
    
    if (achievements) {
        // Sort achievements by order before displaying
        const sortedAchievements = portfolioData.achievements
            .slice()
            .sort((a, b) => (a.order || 999) - (b.order || 999));
            
        achievements.innerHTML = sortedAchievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-content">
                    <h5>${achievement.title}</h5>
                    <p>${achievement.description}</p>
                    <span class="achievement-metric">${achievement.metric}</span>
                </div>
            </div>
        `).join('');
    }
}

function updateSkillsSection() {
    console.log('[DEBUG] updateSkillsSection called');
    const skillsGrid = document.getElementById('skills-grid');
    
    if (!skillsGrid) {
        console.error('[ERROR] skills-grid element not found!');
        return;
    }
    
    if (!portfolioData.skills) {
        console.error('[ERROR] portfolioData.skills not found!');
        return;
    }
    
    console.log('[DEBUG] Updating skills, found', portfolioData.skills.length, 'skill categories');
    
    try {
        skillsGrid.innerHTML = portfolioData.skills.map((skillCategory, categoryIndex) => {
            console.log(`[DEBUG] Processing skill category ${categoryIndex}:`, skillCategory.category);
            return `
                <div class="skill-card">
                    <div class="skill-header">
                        <i class="${skillCategory.icon}"></i>
                        <h3>${skillCategory.category}</h3>
                    </div>
                    <div class="skills-list">
                        ${skillCategory.items.map((skill, skillIndex) => {
                            console.log(`[DEBUG] Processing skill ${skillIndex}:`, skill.name, skill.level);
                            return `
                                <div class="skill-progress">
                                    <div class="skill-name">
                                        <span>${skill.name}</span>
                                        <span>${skill.level}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" data-width="${skill.level}"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
        console.log('[DEBUG] Skills section HTML updated successfully');
        
        // Trigger animation after content is loaded
        setTimeout(() => {
            animateProgressBars();
        }, 500);
        
    } catch (error) {
        console.error('[ERROR] Failed to update skills section:', error);
    }
}

function updateProjectsSection() {
    console.log('[DEBUG] updateProjectsSection called');
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) {
        console.error('[ERROR] projects-grid element not found!');
        return;
    }
    
    if (!portfolioData.projects) {
        console.error('[ERROR] portfolioData.projects not found!');
        return;
    }
    
    console.log('[DEBUG] Updating projects, found', portfolioData.projects.length, 'projects');
    
    try {
        // Sort projects by order before displaying
        const sortedProjects = portfolioData.projects
            .slice()
            .sort((a, b) => (a.order || 999) - (b.order || 999));
            
        projectsGrid.innerHTML = sortedProjects.map((project, index) => {
            console.log(`[DEBUG] Processing project ${index}:`, project.title);
            return `
                <div class="project-card" data-category="${project.category}">
                    <div class="project-image">
                        <i class="${project.image}"></i>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        <div class="project-impact">
                            <strong>Impact:</strong> ${project.impact}
                        </div>
                        <div class="project-links">
                            ${project.links.map(link => `
                                <a href="${link.url}" class="project-link" target="_blank">
                                    <i class="fas fa-${link.type === 'github' ? 'code-branch' : link.type === 'demo' ? 'eye' : 'book'}"></i>
                                    ${link.label}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        console.log('[DEBUG] Projects section HTML updated successfully');
        
    } catch (error) {
        console.error('[ERROR] Failed to update projects section:', error);
    }
    
    // Initialize project filtering
    initProjectFiltering();
}

function updateExperienceSection() {
    console.log('[DEBUG] updateExperienceSection called');
    const experienceTimeline = document.getElementById('experience-timeline');
    
    if (!experienceTimeline) {
        console.error('[ERROR] experience-timeline element not found!');
        return;
    }
    
    if (!portfolioData.experience) {
        console.error('[ERROR] portfolioData.experience not found!');
        return;
    }
    
    console.log('[DEBUG] Updating experience, found', portfolioData.experience.length, 'experience items');
    
    try {
        // Sort experience by order before displaying
        const sortedExperience = portfolioData.experience
            .slice()
            .sort((a, b) => (a.order || 999) - (b.order || 999));
            
        experienceTimeline.innerHTML = sortedExperience.map((exp, index) => {
            console.log(`[DEBUG] Processing experience ${index}:`, exp.company);
            return `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h3 class="company-name">${exp.company}</h3>
                        <h4 class="job-title">${exp.position}</h4>
                        <p class="job-period">${exp.period}</p>
                        <div class="job-description">
                            ${exp.description.map(desc => `<p>• ${desc}</p>`).join('')}
                        </div>
                        <div class="job-technologies">
                            ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        console.log('[DEBUG] Experience section HTML updated successfully');
        
    } catch (error) {
        console.error('[ERROR] Failed to update experience section:', error);
    }
}

function getCertificationIcon(certName) {
    // Use consistent shield icon for all certifications
    return 'fas fa-certificate';
}

function updateCertificationsSection() {
    const certificationsContent = document.getElementById('certifications-content');
    
    if (certificationsContent && portfolioData.certifications) {
        // Sort certifications by order before displaying
        const sortedCertifications = portfolioData.certifications
            .slice()
            .sort((a, b) => (a.order || 999) - (b.order || 999));
            
        certificationsContent.innerHTML = sortedCertifications.map(cert => `
            <div class="certification-card">
                <div class="cert-icon">
                    <i class="${getCertificationIcon(cert.name)}"></i>
                </div>
                <div class="cert-content">
                    <h3 class="cert-name">${cert.name}</h3>
                    <p class="cert-provider">
                        <i class="fas fa-building"></i> ${cert.provider}
                    </p>
                    <div class="cert-status">
                        <span class="status-badge status-${cert.status.toLowerCase().replace(/\s+/g, '-')}">${cert.status}</span>
                        ${cert.date ? `<span class="cert-date"><i class="fas fa-calendar"></i> ${cert.date}</span>` : ''}
                    </div>
                    ${cert.url ? `
                        <div class="cert-actions">
                            <a href="${cert.url}" target="_blank" class="cert-link">
                                <i class="fas fa-external-link-alt"></i> View Certificate
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

function updateCommsSection() {
    console.log('[DEBUG] updateCommsSection called');
    
    // Update GitHub link if element exists
    const githubCard = document.querySelector('.github-card');
    if (githubCard && portfolioData.profile.github) {
        let githubUrl = portfolioData.profile.github;
        let displayText = portfolioData.profile.github;
        
        // Handle any existing encoded characters
        try {
            if (githubUrl.includes('%') || githubUrl.includes('&#x2F;')) {
                githubUrl = githubUrl.replace(/&#x2F;/g, '/');
                displayText = displayText.replace(/&#x2F;/g, '/');
                if (githubUrl.includes('%')) {
                    githubUrl = decodeURIComponent(githubUrl);
                    displayText = decodeURIComponent(displayText);
                }
            }
        } catch (e) {
            console.warn('URL decoding failed, using original:', e);
        }
        
        // Ensure proper URL format for href
        if (!githubUrl.startsWith('http://') && !githubUrl.startsWith('https://')) {
            githubUrl = 'https://' + githubUrl;
        }
        
        // Clean display text (remove protocol for display)
        displayText = displayText.replace(/^https?:\/\//, '');
        
        githubCard.href = githubUrl;
        githubCard.textContent = displayText;
        console.log('[DEBUG] Updated GitHub URL:', githubUrl, 'Display:', displayText);
    }
    
    // Update LinkedIn link if element exists
    const linkedinCard = document.querySelector('.linkedin-card');
    if (linkedinCard && portfolioData.profile.linkedin) {
        let linkedinUrl = portfolioData.profile.linkedin;
        let displayText = portfolioData.profile.linkedin;
        
        console.log('[DEBUG] Original LinkedIn URL:', linkedinUrl);
        
        // Handle any existing encoded characters (for backward compatibility)
        try {
            if (linkedinUrl.includes('%') || linkedinUrl.includes('&#x2F;')) {
                linkedinUrl = linkedinUrl.replace(/&#x2F;/g, '/');
                displayText = displayText.replace(/&#x2F;/g, '/');
                if (linkedinUrl.includes('%')) {
                    linkedinUrl = decodeURIComponent(linkedinUrl);
                    displayText = decodeURIComponent(displayText);
                }
                console.log('[DEBUG] After decoding:', linkedinUrl);
            }
        } catch (e) {
            console.warn('[DEBUG] URL decoding failed, using original:', e);
        }
        
        // Ensure proper URL format for href
        if (!linkedinUrl.startsWith('http://') && !linkedinUrl.startsWith('https://')) {
            linkedinUrl = 'https://' + linkedinUrl;
        }
        
        // Clean display text (remove protocol for display)
        displayText = displayText.replace(/^https?:\/\//, '');
        
        console.log('[DEBUG] Final LinkedIn URL:', linkedinUrl);
        console.log('[DEBUG] Final display text:', displayText);
        
        linkedinCard.href = linkedinUrl;
        linkedinCard.textContent = displayText;
        console.log('[DEBUG] LinkedIn card updated successfully');
    }
}

function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initInteractiveElements() {
    // Hero action buttons
    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            showSection(target);
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message transmitted successfully! Awaiting response...', 'success');
            contactForm.reset();
        });
    }
    
    // Initialize progress bar animations when arsenal section is visible
    const arsenalSection = document.getElementById('arsenal');
    if (arsenalSection) {
        console.log('[DEBUG] Setting up arsenal section observer');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                console.log(`[DEBUG] Arsenal section intersection: ${entry.isIntersecting}`);
                if (entry.isIntersecting) {
                    console.log('[DEBUG] Arsenal section is visible, starting progress bar animation');
                    setTimeout(() => {
                        animateProgressBars();
                    }, 200);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(arsenalSection);
    } else {
        console.log('[DEBUG] Arsenal section not found');
    }
    
    // Also trigger animation on page load if arsenal is already visible
    setTimeout(() => {
        const arsenalRect = arsenalSection?.getBoundingClientRect();
        if (arsenalRect && arsenalRect.top < window.innerHeight && arsenalRect.bottom > 0) {
            console.log('[DEBUG] Arsenal section already visible on page load');
            animateProgressBars();
        }
    }, 1000);
    
    // Tactical effects
    initTacticalEffects();
}

function initTacticalEffects() {
    
    // Create contact at random position
    function createContact() {
        console.log(`🔍 createContact() called - Current contacts: ${contacts.length}/${MAX_CONTACTS}`);
        
        if (contacts.length >= MAX_CONTACTS) {
            console.log(`⚠️ Maximum contacts reached (${MAX_CONTACTS}). Cannot create new contact.`);
            return null;
        }
        
        // Random angle (0° = top, clockwise to match CSS)
        const angle = Math.random() * 360;
        
        // Random distance from center (20% to 40% of radar radius)
        const distance = 15 + Math.random() * 25;
        
        // Convert polar coordinates to screen position
        // Note: CSS coordinate system has 0° at top, clockwise
        const radians = (angle * Math.PI) / 180;
        const x = 50 + distance * Math.sin(radians); // sin for x because 0° is at top
        const y = 50 - distance * Math.cos(radians); // -cos for y because 0° is at top
        
        const contact = {
            id: `radar_${dotCounter++}`,
            x: x,
            y: y,
            angle: angle, // Store in CSS coordinate system (0° = top)
            revealed: false,
            element: null,
            createdAt: performance.now()
        };
        
        // Create completely invisible dot
        const dot = document.createElement('div');
        dot.className = 'radar-dot radar-hidden';
        dot.id = contact.id;
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.position = 'absolute';
        dot.style.opacity = '0';
        dot.style.visibility = 'hidden';
        dot.style.transform = 'translate(-50%, -50%) scale(0)';
        
        radarContainer.appendChild(dot);
        contact.element = dot;
        contacts.push(contact);
        
        console.log(`✅ Contact created: ${contact.id} at ${angle.toFixed(1)}° (${x.toFixed(1)}%, ${y.toFixed(1)}%) - Total: ${contacts.length}`);
        return contact;
    }
    
    // Reveal contact when swept
    function revealContact(contact) {
        if (contact.revealed) return;
        
        console.log(`🎯 RADAR CONTACT DETECTED! ${contact.id} at ${contact.angle.toFixed(1)}°`);
        
        contact.revealed = true;
        contact.revealedAt = performance.now();
        
        // Make fully visible with dramatic effect
        contact.element.style.visibility = 'visible';
        contact.element.style.opacity = '1';
        contact.element.style.transform = 'translate(-50%, -50%) scale(1.2)';
        contact.element.className = 'radar-dot radar-revealed';
        
        // Add pulsing effect
        setTimeout(() => {
            if (contact.element) {
                contact.element.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }, 200);
        
        // Auto-fade after 6 seconds
        setTimeout(() => {
            if (contact.element && contact.revealed) {
                fadeOutContact(contact);
            }
        }, 6000);
    }
    
    // Fade out contact
    function fadeOutContact(contact) {
        if (!contact.element) return;
        
        console.log(`📡 Contact ${contact.id} fading out`);
        
        contact.element.style.opacity = '0';
        contact.element.style.transform = 'translate(-50%, -50%) scale(0.3)';
        contact.element.className = 'radar-dot radar-fading';
        
        setTimeout(() => {
            removeContact(contact.id);
        }, 1000);
    }
    
    // Remove contact completely
    function removeContact(contactId) {
        const index = contacts.findIndex(c => c.id === contactId);
        if (index === -1) return;
        
        const contact = contacts[index];
        if (contact.element && contact.element.parentNode) {
            contact.element.parentNode.removeChild(contact.element);
        }
        
        contacts.splice(index, 1);
        console.log(`�️ Contact ${contactId} removed`);
    }
    
    // Check for contact detection
    function updateRadarDetection() {
        const sweepAngle = getCurrentSweepAngle();
        
        // Debug output every 3 seconds
        const debugInterval = 3000;
        if (Math.floor(performance.now() / debugInterval) !== Math.floor((performance.now() - 16) / debugInterval)) {
            const hiddenContacts = contacts.filter(c => !c.revealed).length;
            console.log(`🔄 Sweep: ${sweepAngle.toFixed(1)}° | Contacts: ${contacts.length} total, ${hiddenContacts} hidden`);
        }
        
        // Check each unrevealed contact
        contacts.forEach(contact => {
            if (!contact.revealed) {
                // Calculate shortest angular distance
                let angleDiff = Math.abs(contact.angle - sweepAngle);
                if (angleDiff > 180) {
                    angleDiff = 360 - angleDiff;
                }
                
                // Detect if sweep beam is over contact
                if (angleDiff <= BEAM_WIDTH / 2) {
                    revealContact(contact);
                }
            }
        });
        
        requestAnimationFrame(updateRadarDetection);
    }
    
    // Manual contact placement on click
    radarContainer.addEventListener('click', (e) => {
        if (contacts.length >= MAX_CONTACTS) {
            console.log('⚠️ Maximum contacts reached');
            return;
        }
        
        const rect = radarContainer.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Check if click is within radar circle
        const centerX = 50, centerY = 50;
        const distance = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);
        
        if (distance <= 45) {
            // Calculate angle in CSS coordinate system (0° = top, clockwise)
            let clickAngle = Math.atan2(clickX - centerX, centerY - clickY) * 180 / Math.PI;
            if (clickAngle < 0) clickAngle += 360;
            
            const contact = {
                id: `manual_${dotCounter++}`,
                x: clickX,
                y: clickY,
                angle: clickAngle,
                revealed: false,
                element: null,
                createdAt: performance.now()
            };
            
            const dot = document.createElement('div');
            dot.className = 'radar-dot radar-hidden';
            dot.id = contact.id;
            dot.style.left = `${clickX}%`;
            dot.style.top = `${clickY}%`;
            dot.style.position = 'absolute';
            dot.style.opacity = '0';
            dot.style.visibility = 'hidden';
            dot.style.transform = 'translate(-50%, -50%) scale(0)';
            
            radarContainer.appendChild(dot);
            contact.element = dot;
            contacts.push(contact);
            
            console.log(`👆 Manual contact placed: ${contact.id} at ${clickAngle.toFixed(1)}°`);
        }
    });
    
    // Initialize radar system
    function startRadarSystem() {
        console.log('🚢 RADAR SYSTEM ONLINE');
        console.log('📡 Beginning contact detection...');
        
        // Synchronize with CSS animation
        initializeAnimationSync();
        
        // Create initial contacts after a short delay
        setTimeout(() => {
            console.log(`🎯 Creating initial contacts...`);
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    createContact();
                    console.log(`✅ Initial contact ${i + 1}/2 created`);
                }, i * 800);
            }
        }, 1000);
        
        // Start detection loop
        setTimeout(() => {
            updateRadarDetection();
        }, 1500);
        
        // System status monitor
        setInterval(() => {
            const hiddenContacts = contacts.filter(c => !c.revealed).length;
            const revealedContacts = contacts.filter(c => c.revealed).length;
            const sweepAngle = getCurrentSweepAngle();
            
            console.log(`📊 RADAR STATUS: Sweep=${sweepAngle.toFixed(1)}° | Total=${contacts.length} | Hidden=${hiddenContacts} | Revealed=${revealedContacts} | Max=${MAX_CONTACTS}`);
            
            // List all contacts
            if (contacts.length > 0) {
                contacts.forEach(c => {
                    const age = ((performance.now() - c.createdAt) / 1000).toFixed(1);
                    console.log(`  📍 ${c.id}: ${c.revealed ? '🔴 VISIBLE' : '⚫ HIDDEN'} at ${c.angle.toFixed(1)}° (age: ${age}s)`);
                });
            }
        }, 5000); // Every 5 seconds
        
        // Periodically add new contacts with enhanced logging
        const contactGenerationInterval = setInterval(() => {
            const currentTime = new Date().toLocaleTimeString();
            const randomChance = Math.random();
            console.log(`🎲 Contact generation check at ${currentTime}: Random=${randomChance.toFixed(3)}, Contacts=${contacts.length}/${MAX_CONTACTS}`);
            
            if (randomChance < 0.7 && contacts.length < MAX_CONTACTS) {
                console.log(`🎯 Triggering automatic contact creation...`);
                const newContact = createContact();
                if (newContact) {
                    console.log(`✅ Automatic contact successfully created: ${newContact.id}`);
                } else {
                    console.log(`❌ Failed to create automatic contact`);
                }
            } else {
                if (contacts.length >= MAX_CONTACTS) {
                    console.log(`⏸️ Skipping contact creation - Maximum contacts reached`);
                } else {
                    console.log(`⏸️ Skipping contact creation - Random chance not met (needed < 0.7)`);
                }
            }
        }, 3000); // Every 3 seconds
        
        // Enhanced contact cleanup system
        setInterval(() => {
            const now = performance.now();
            const beforeCleanup = contacts.length;
            
            const oldContacts = contacts.filter(c => !c.revealed && (now - c.createdAt) > 20000);
            console.log(`🧹 Cleanup check: Found ${oldContacts.length} old contacts to remove`);
            
            oldContacts.forEach(c => {
                console.log(`🗑️ Removing old undetected contact: ${c.id} (age: ${((now - c.createdAt) / 1000).toFixed(1)}s)`);
                removeContact(c.id);
            });
            
            const afterCleanup = contacts.length;
            if (beforeCleanup !== afterCleanup) {
                console.log(`📊 Cleanup complete: ${beforeCleanup} → ${afterCleanup} contacts`);
            }
        }, 8000); // Every 8 seconds
    }
    
    // Initialize after brief delay
    setTimeout(startRadarSystem, 500);
}

function initTacticalEffects() {
    // Add glitch effect to random elements occasionally
    setInterval(() => {
        const glitchElements = document.querySelectorAll('.hero-title, .section-header h2');
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        
        if (randomElement && Math.random() < 0.3) {
            randomElement.style.animation = 'none';
            setTimeout(() => {
                randomElement.style.animation = 'glitch 0.5s ease-in-out';
            }, 50);
        }
    }, 10000);
    
    // Add typing effect to hero subtitle
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        typeWriter(subtitle, subtitle.textContent, 100);
    }
}

function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 2000); // Start after loading
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

// Observe elements for animations
document.querySelectorAll('.project-card, .timeline-item, .skill-card').forEach(el => {
    observer.observe(el);
});

// Add CSS for single-page scroll layout
const additionalStyles = `
    html {
        scroll-behavior: smooth;
    }
    
    .nav-menu a.active {
        color: var(--primary-color) !important;
        background: rgba(0, 255, 157, 0.1);
        border-radius: 5px;
    }
    
    .scroll-indicator {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .scroll-indicator .section-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .scroll-indicator .section-dot.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        box-shadow: 0 0 10px var(--primary-color);
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: var(--bg-primary);
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .profile-details {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .profile-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--text-secondary);
    }
    
    .profile-item i {
        color: var(--primary-color);
        width: 20px;
    }
    
    .profile-summary {
        margin-top: 2rem;
    }
    
    .profile-summary h4 {
        color: var(--primary-color);
        font-family: var(--font-primary);
        margin-bottom: 1rem;
    }
    
    .achievement-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--bg-tertiary);
        border-radius: 10px;
        border-left: 3px solid var(--primary-color);
    }
    
    .achievement-icon {
        color: var(--primary-color);
        font-size: 1.5rem;
        margin-top: 0.5rem;
    }
    
    .achievement-content h5 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .achievement-content p {
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
        line-height: 1.4;
    }
    
    .achievement-metric {
        color: var(--accent-color);
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .project-impact {
        margin-bottom: 1rem;
        color: var(--text-secondary);
    }
    
    .project-impact strong {
        color: var(--primary-color);
    }
    
    .job-technologies {
        margin-top: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .project-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .timeline-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .project-card.visible,
    .timeline-item.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background: var(--bg-secondary);
            flex-direction: column;
            padding: 2rem;
            border-top: 1px solid var(--border-color);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .scroll-indicator {
            bottom: 20px;
            right: 20px;
        }
    }
`;

// Show notification function
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add scroll indicator
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    
    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'section-dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            showSection(section);
        });
        
        indicator.appendChild(dot);
    });
    
    document.body.appendChild(indicator);
}

// Inject additional styles
const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);

// Debug function to check portfolio status
window.debugPortfolio = function() {
    console.log('=== PORTFOLIO DEBUG INFO ===');
    console.log('portfolioData defined:', typeof portfolioData !== 'undefined');
    console.log('skills-grid element:', document.getElementById('skills-grid'));
    console.log('projects-grid element:', document.getElementById('projects-grid'));
    console.log('experience-timeline element:', document.getElementById('experience-timeline'));
    
    if (typeof portfolioData !== 'undefined') {
        console.log('Skills count:', portfolioData.skills?.length || 0);
        console.log('Projects count:', portfolioData.projects?.length || 0);
        console.log('Experience count:', portfolioData.experience?.length || 0);
        console.log('Sample skill:', portfolioData.skills?.[0]);
        console.log('Sample project:', portfolioData.projects?.[0]);
    }
    
    // Check if elements have content
    const skillsGrid = document.getElementById('skills-grid');
    const projectsGrid = document.getElementById('projects-grid');
    const experienceTimeline = document.getElementById('experience-timeline');
    
    console.log('Skills HTML length:', skillsGrid?.innerHTML?.length || 0);
    console.log('Projects HTML length:', projectsGrid?.innerHTML?.length || 0);
    console.log('Experience HTML length:', experienceTimeline?.innerHTML?.length || 0);
    
    console.log('=== END DEBUG INFO ===');
};

// Force refresh all sections
window.forceRefreshSections = function() {
    console.log('[FORCE] Refreshing all sections...');
    try {
        updateMainContent();
        console.log('[FORCE] All sections refreshed successfully');
        
        // Trigger animations
        setTimeout(() => {
            animateProgressBars();
        }, 1000);
        
    } catch (error) {
        console.error('[FORCE] Error refreshing sections:', error);
    }
};

// Test specific sections
window.testProjectsSection = function() {
    console.log('[TEST] Testing projects section...');
    const projectsGrid = document.getElementById('projects-grid');
    console.log('[TEST] Projects grid element:', projectsGrid);
    console.log('[TEST] Portfolio data projects:', portfolioData.projects);
    
    if (projectsGrid && portfolioData.projects) {
        updateProjectsSection();
        console.log('[TEST] Projects section updated, HTML length:', projectsGrid.innerHTML.length);
    } else {
        console.error('[TEST] Missing projects grid or data');
    }
};

window.testExperienceSection = function() {
    console.log('[TEST] Testing experience section...');
    const experienceTimeline = document.getElementById('experience-timeline');
    console.log('[TEST] Experience timeline element:', experienceTimeline);
    console.log('[TEST] Portfolio data experience:', portfolioData.experience);
    
    if (experienceTimeline && portfolioData.experience) {
        updateExperienceSection();
        console.log('[TEST] Experience section updated, HTML length:', experienceTimeline.innerHTML.length);
    } else {
        console.error('[TEST] Missing experience timeline or data');
    }
};

// Auto-run debug after page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('[AUTO-DEBUG] Running portfolio debug...');
        window.debugPortfolio();
        
        // If sections are empty, try force refresh
        const projectsGrid = document.getElementById('projects-grid');
        const experienceTimeline = document.getElementById('experience-timeline');
        
        if (!projectsGrid?.innerHTML || projectsGrid.innerHTML.length < 100 || 
            !experienceTimeline?.innerHTML || experienceTimeline.innerHTML.length < 100) {
            console.log('[AUTO-DEBUG] Sections appear empty, forcing refresh...');
            window.forceRefreshSections();
        }
    }, 5000);
});
