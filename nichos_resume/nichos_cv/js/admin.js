// ===================== ADMIN PANEL FUNCTIONALITY =====================

// Security: Password hash for secure authentication  
const ADMIN_PASSWORD_HASH = '93331b426a3c91d908c63ce9654d15eb09e586e7a0570327f82e67852cb84770';
let isAdminAuthenticated = false;
let sessionTimeout = null;
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
let currentTheme = localStorage.getItem('portfolioTheme') || 'tactical-green';

// Security: Simple SHA-256 hash function
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Security: Session management
function startSession() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        adminLogout();
        showNotification('Session expired for security. Please login again.', 'warning');
    }, SESSION_DURATION);
}

function adminLogout() {
    isAdminAuthenticated = false;
    clearTimeout(sessionTimeout);
    sessionTimeout = null;
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    showNotification('Logged out successfully.', 'info');
}

// Security: Input sanitization
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// ===================== ICON PICKER FUNCTIONALITY =====================

// Common FontAwesome icons for projects
const commonProjectIcons = [
    { class: 'fas fa-chart-bar', name: 'Chart Bar' },
    { class: 'fas fa-chart-line', name: 'Chart Line' },
    { class: 'fas fa-chart-pie', name: 'Pie Chart' },
    { class: 'fas fa-database', name: 'Database' },
    { class: 'fas fa-cogs', name: 'Settings/Automation' },
    { class: 'fas fa-robot', name: 'Robot/AI' },
    { class: 'fas fa-code', name: 'Code' },
    { class: 'fas fa-laptop-code', name: 'Laptop Code' },
    { class: 'fas fa-server', name: 'Server' },
    { class: 'fas fa-cloud', name: 'Cloud' },
    { class: 'fas fa-mobile-alt', name: 'Mobile App' },
    { class: 'fas fa-globe', name: 'Web/Global' },
    { class: 'fas fa-shield-alt', name: 'Security' },
    { class: 'fas fa-lock', name: 'Lock/Security' },
    { class: 'fas fa-key', name: 'Key/Access' },
    { class: 'fas fa-users', name: 'Users/Team' },
    { class: 'fas fa-user-tie', name: 'Business User' },
    { class: 'fas fa-briefcase', name: 'Business' },
    { class: 'fas fa-handshake', name: 'Partnership' },
    { class: 'fas fa-rocket', name: 'Launch/Growth' },
    { class: 'fas fa-lightbulb', name: 'Innovation' },
    { class: 'fas fa-magic', name: 'Magic/Enhancement' },
    { class: 'fas fa-tools', name: 'Tools/Utility' },
    { class: 'fas fa-wrench', name: 'Configuration' },
    { class: 'fas fa-tachometer-alt', name: 'Dashboard' },
    { class: 'fas fa-search', name: 'Search/Analysis' },
    { class: 'fas fa-filter', name: 'Filter/Process' },
    { class: 'fas fa-sync-alt', name: 'Sync/Integration' },
    { class: 'fas fa-download', name: 'Download/Export' },
    { class: 'fas fa-upload', name: 'Upload/Import' },
    { class: 'fas fa-file-excel', name: 'Excel' },
    { class: 'fas fa-file-pdf', name: 'PDF' },
    { class: 'fas fa-table', name: 'Table/Data' },
    { class: 'fab fa-python', name: 'Python' },
    { class: 'fab fa-js-square', name: 'JavaScript' },
    { class: 'fab fa-react', name: 'React' },
    { class: 'fab fa-node-js', name: 'Node.js' },
    { class: 'fab fa-github', name: 'GitHub' },
    { class: 'fab fa-aws', name: 'AWS' },
    { class: 'fab fa-microsoft', name: 'Microsoft' }
];

function createIconPicker(currentIcon = '', fieldId = '') {
    return `
        <div class="icon-picker-container">
            <div class="icon-preview">
                <i class="${currentIcon}" id="${fieldId}-preview"></i>
                <span id="${fieldId}-class">${currentIcon}</span>
            </div>
            <select id="${fieldId}" onchange="updateIconPreview('${fieldId}')">
                <option value="">Select an icon...</option>
                ${commonProjectIcons.map(icon => `
                    <option value="${icon.class}" ${currentIcon === icon.class ? 'selected' : ''}>
                        ${icon.name}
                    </option>
                `).join('')}
            </select>
        </div>
    `;
}

function updateIconPreview(fieldId) {
    const select = document.getElementById(fieldId);
    const preview = document.getElementById(`${fieldId}-preview`);
    const classDisplay = document.getElementById(`${fieldId}-class`);
    
    if (select && preview && classDisplay) {
        const selectedIcon = select.value;
        preview.className = selectedIcon;
        classDisplay.textContent = selectedIcon;
    }
}

// ===================== DRAG AND DROP FUNCTIONALITY =====================

let draggedElement = null;
let draggedIndex = null;
let draggedType = null;
let targetDropIndex = null;

// Initialize drag and drop for sortable lists
function initializeDragAndDrop() {
    console.log('[DEBUG] Initializing drag and drop event listeners');
    
    // Remove existing listeners first to avoid duplicates
    document.removeEventListener('dragstart', handleDragStart);
    document.removeEventListener('dragover', handleDragOver);
    document.removeEventListener('drop', handleDrop);
    document.removeEventListener('dragend', handleDragEnd);
    
    // Add fresh event listeners
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragend', handleDragEnd);
    
    console.log('[DEBUG] Drag and drop event listeners initialized');
}

function handleDragStart(e) {
    console.log('[DEBUG] handleDragStart called', e.target);
    
    if (!e.target.classList.contains('sortable-item')) {
        console.log('[DEBUG] Target is not sortable-item, ignoring');
        return;
    }
    
    draggedElement = e.target;
    draggedIndex = parseInt(e.target.dataset.index);
    draggedType = e.target.dataset.type;
    
    console.log(`[DEBUG] Drag started: ${e.target.dataset.name || 'Unknown'} from index ${draggedIndex} type ${draggedType}`);
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragOver(e) {
    if (!draggedElement) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const dropTarget = e.target.closest('.sortable-item');
    if (dropTarget && dropTarget !== draggedElement) {
        const container = dropTarget.parentNode;
        const allItems = Array.from(container.querySelectorAll('.sortable-item'));
        
        // Store the target index for use in handleDrop
        targetDropIndex = allItems.indexOf(dropTarget);
        
        console.log(`[DEBUG] Drag over target: ${dropTarget.dataset.name} at index ${targetDropIndex}`);
        
        // Visual feedback - move the element in DOM for preview
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
        }
    }
}

function handleDrop(e) {
    console.log('[DEBUG] handleDrop called');
    
    if (!draggedElement) {
        console.log('[DEBUG] No draggedElement, exiting');
        return;
    }
    
    e.preventDefault();
    
    // Use the stored target index from dragover
    const newIndex = targetDropIndex;
    
    console.log(`[DEBUG] Drop detected: ${draggedElement.dataset.name || 'Unknown'} from ${draggedIndex} to position ${newIndex}`);
    
    // Only reorder if indexes are different and valid
    if (newIndex !== null && newIndex !== draggedIndex && newIndex >= 0) {
        console.log('[DEBUG] Calling reorderItemsAfterDrop');
        reorderItemsAfterDrop(draggedType, draggedIndex, newIndex);
    } else {
        console.log('[DEBUG] Same index, null target, or invalid index - not reordering');
    }
    
    // Clean up
    handleDragEnd(e);
}

function handleDragEnd(e) {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
    }
    draggedElement = null;
    draggedIndex = null;
    draggedType = null;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function reorderItemsAfterDrop(type, fromIndex, toIndex) {
    console.log(`[DEBUG] Reordering ${type}: from ${fromIndex} to ${toIndex}`);
    
    // Use the same logic as moveItem but for any distance
    let items;
    
    switch(type) {
        case 'certifications':
            items = portfolioData.certifications;
            break;
        case 'achievements':
            items = portfolioData.achievements;
            break;
        case 'projects':
            items = portfolioData.projects;
            break;
        case 'experience':
            items = portfolioData.experience;
            break;
    }
    
    // Sort items by order first to get correct sequence (same as moveItem)
    items.sort((a, b) => (a.order || 999) - (b.order || 999));
    
    console.log(`[DEBUG] Sorted items before reorder:`, items.map(item => ({name: item.name || item.title, order: item.order})));
    
    if (fromIndex === toIndex) {
        console.log('[DEBUG] Same position, no reorder needed');
        return;
    }
    
    // Get the item being moved
    const movedItem = items[fromIndex];
    if (!movedItem) {
        console.error('[DEBUG] Could not find item at fromIndex:', fromIndex);
        return;
    }
    
    // Calculate new order value based on position
    let newOrder;
    
    if (toIndex === 0) {
        // Moving to first position
        newOrder = items[0].order - 1;
    } else if (toIndex >= items.length - 1) {
        // Moving to last position
        newOrder = items[items.length - 1].order + 1;
    } else {
        // Moving between items - use average of surrounding orders
        const prevOrder = items[toIndex - 1].order;
        const nextOrder = items[toIndex].order;
        newOrder = (prevOrder + nextOrder) / 2;
    }
    
    // Set the new order
    movedItem.order = newOrder;
    
    console.log(`[DEBUG] Set ${movedItem.name || movedItem.title} order to ${newOrder}`);
    
    // Now call the same save method as moveItem (including ensureOrderIntegrity)
    saveDataAndUpdate();
    
    // Force refresh the current section
    setTimeout(() => {
        refreshCurrentSection();
    }, 100);
    
    showNotification(`Item reordered successfully!`, 'success');
}

// ===================== ORDERING FUNCTIONALITY =====================

// Generate order options for dropdowns
function generateOrderOptions(sectionType, currentOrder = null) {
    let maxItems = 0;
    
    switch(sectionType) {
        case 'certifications':
            maxItems = portfolioData.certifications.length;
            break;
        case 'achievements':
            maxItems = portfolioData.achievements.length;
            break;
        case 'projects':
            maxItems = portfolioData.projects.length;
            break;
        case 'experience':
            maxItems = portfolioData.experience.length;
            break;
    }
    
    let options = '';
    for (let i = 1; i <= maxItems + 1; i++) {
        const selected = (currentOrder && currentOrder === i) ? 'selected' : '';
        const position = i <= maxItems ? `Position ${i}` : `End (Position ${i})`;
        options += `<option value="${i}" ${selected}>${position}</option>`;
    }
    
    return options;
}

// Reorder items in array based on order property
function reorderItems(items) {
    return items.sort((a, b) => (a.order || 999) - (b.order || 999));
}

// Update order numbers after insertion/deletion
function updateOrderNumbers(sectionType, newOrder, isDelete = false) {
    let items;
    
    switch(sectionType) {
        case 'certifications':
            items = portfolioData.certifications;
            break;
        case 'achievements':
            items = portfolioData.achievements;
            break;
        case 'projects':
            items = portfolioData.projects;
            break;
        case 'experience':
            items = portfolioData.experience;
            break;
    }
    
    if (isDelete) {
        // When deleting, decrease order of items that come after
        items.forEach(item => {
            if (item.order > newOrder) {
                item.order--;
            }
        });
    } else {
        // When inserting, increase order of items at or after the position
        items.forEach(item => {
            if (item.order >= newOrder) {
                item.order++;
            }
        });
    }
}

// Move item up or down in order
function moveItem(sectionType, index, direction) {
    let items;
    
    switch(sectionType) {
        case 'certifications':
            items = portfolioData.certifications;
            break;
        case 'achievements':
            items = portfolioData.achievements;
            break;
        case 'projects':
            items = portfolioData.projects;
            break;
        case 'experience':
            items = portfolioData.experience;
            break;
    }
    
    // Sort items by order first to get correct sequence
    items.sort((a, b) => (a.order || 999) - (b.order || 999));
    
    if (direction === 'up' && index > 0) {
        // Swap with previous item
        const temp = items[index].order;
        items[index].order = items[index - 1].order;
        items[index - 1].order = temp;
    } else if (direction === 'down' && index < items.length - 1) {
        // Swap with next item
        const temp = items[index].order;
        items[index].order = items[index + 1].order;
        items[index + 1].order = temp;
    }
    
    saveDataAndUpdate();
    refreshCurrentSection();
    showNotification(`Item moved ${direction} successfully!`, 'success');
}

// Refresh current admin section
function refreshCurrentSection() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        showAdminTab(tabName);
    }
}

// Update main portfolio display to reflect admin changes
function updateMainPortfolioDisplay() {
    // Trigger the main portfolio sections to refresh
    if (typeof showAllSections === 'function') {
        showAllSections();
    }
    // Also update the Arsenal section if it exists
    if (typeof showArsenalSection === 'function') {
        showArsenalSection();
    }
}

// Authentication function with security improvements
async function adminLogin() {
    const passwordInput = document.getElementById('admin-password');
    const password = passwordInput.value;
    
    // Security: Rate limiting
    if (adminLogin.attempts && adminLogin.attempts >= 3) {
        const now = Date.now();
        if (now - adminLogin.lastAttempt < 300000) { // 5 minutes
            showNotification('Too many failed attempts. Please wait 5 minutes.', 'error');
            return;
        } else {
            adminLogin.attempts = 0; // Reset after cooldown
        }
    }
    
    try {
        const hashedPassword = await hashPassword(password);
        
        if (hashedPassword === ADMIN_PASSWORD_HASH) {
            isAdminAuthenticated = true;
            adminLogin.attempts = 0; // Reset attempts on success
            startSession(); // Start session timer
            
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            showAdminTab('profile');
            showNotification('Authentication successful! Welcome to Admin Control Panel.', 'success');
            passwordInput.value = '';
        } else {
            // Security: Track failed attempts
            adminLogin.attempts = (adminLogin.attempts || 0) + 1;
            adminLogin.lastAttempt = Date.now();
            
            showNotification(`Access denied! Invalid security clearance. (${adminLogin.attempts}/3)`, 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        console.error('Authentication error:', error);
        showNotification('Authentication system error. Please try again.', 'error');
    }
}

// Handle Enter key in password field
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adminLogin();
            }
        });
    }
    
    // Initialize admin tabs
    initializeAdminTabs();
    
    // Apply saved theme
    applyTheme(currentTheme);
});

// Initialize admin tab functionality
function initializeAdminTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showAdminTab(tabName);
        });
    });
    
    // Initialize drag and drop functionality
    initializeDragAndDrop();
}

// Security: Authentication middleware
function requireAuth(callback) {
    return function(...args) {
        if (!isAdminAuthenticated) {
            showNotification('Unauthorized access attempt blocked.', 'error');
            return false;
        }
        // Extend session on any admin activity
        startSession();
        return callback.apply(this, args);
    };
}

// Show admin tab
function showAdminTab(tabName) {
    if (!isAdminAuthenticated) {
        showNotification('Unauthorized access attempt blocked.', 'error');
        return;
    }
    
    // Extend session on activity
    startSession();
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Show corresponding content
    const content = document.getElementById('admin-content');
    
    switch(tabName) {
        case 'profile':
            showProfileTab(content);
            break;
        case 'projects':
            showProjectsTab(content);
            break;
        case 'experience':
            showExperienceTab(content);
            break;
        case 'skills':
            showSkillsTab(content);
            break;
        case 'achievements':
            showAchievementsTab(content);
            break;
        case 'certifications':
            showCertificationsTab(content);
            break;
        case 'themes':
            showThemesTab(content);
            break;
        case 'export':
            showExportTab(content);
            break;
    }
    
    // Re-initialize drag and drop for new content
    setTimeout(() => {
        initializeDragAndDrop();
    }, 100);
}

// Profile Tab
function showProfileTab(container) {
    container.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-user"></i> Profile & Contact Management</h3>
                    <p>Update your profile information, contact details, and social media links</p>
                </div>
            </div>
            <div class="form-container">
                <h4>Personal Information</h4>
                <form class="admin-form" id="profile-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="profile-name" value="${portfolioData.profile.name}" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-briefcase"></i> Title/Position</label>
                            <input type="text" id="profile-title" value="${portfolioData.profile.title}" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-map-marker-alt"></i> Location</label>
                            <input type="text" id="profile-location" value="${portfolioData.profile.location}" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-clock"></i> Experience</label>
                            <input type="text" id="profile-experience" value="${portfolioData.profile.experience || ''}" placeholder="e.g., 3+ years">
                        </div>
                        <div class="form-group full-width">
                            <label><i class="fas fa-info-circle"></i> Bio/Summary</label>
                            <textarea id="profile-bio" rows="4" required>${portfolioData.profile.summary || portfolioData.profile.bio || ''}</textarea>
                        </div>
                    </div>
                    
                    <h4>Contact Information</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="profile-email" value="${portfolioData.profile.email}" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-phone"></i> Phone (Optional)</label>
                            <input type="tel" id="profile-phone" value="${portfolioData.profile.phone || ''}" placeholder="+1 (555) 123-4567">
                        </div>
                        <div class="form-group">
                            <label><i class="fab fa-linkedin"></i> LinkedIn</label>
                            <input type="text" id="profile-linkedin" value="${portfolioData.profile.linkedin}" placeholder="linkedin.com/in/username or full URL">
                            <small>Enter LinkedIn profile URL or just the path (e.g., linkedin.com/in/username)</small>
                        </div>
                        <div class="form-group">
                            <label><i class="fab fa-github"></i> GitHub</label>
                            <input type="text" id="profile-github" value="${portfolioData.profile.github}" placeholder="github.com/username or full URL">
                            <small>Enter GitHub profile URL or just the path (e.g., github.com/username)</small>
                        </div>
                        <div class="form-group">
                            <label><i class="fab fa-twitter"></i> Twitter (Optional)</label>
                            <input type="text" id="profile-twitter" value="${portfolioData.profile.twitter || ''}" placeholder="twitter.com/username or full URL">
                            <small>Enter Twitter profile URL or just the path</small>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-globe"></i> Website/Portfolio (Optional)</label>
                            <input type="url" id="profile-website" value="${portfolioData.profile.website || ''}" placeholder="https://yourwebsite.com">
                        </div>
                    </div>
                    
                    <h4>Professional Details</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><i class="fas fa-file-pdf"></i> Resume URL (Optional)</label>
                            <input type="url" id="profile-resume" value="${portfolioData.profile.resume || ''}" placeholder="https://drive.google.com/file/...">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-calendar"></i> Available From (Optional)</label>
                            <input type="text" id="profile-availability" value="${portfolioData.profile.availability || ''}" placeholder="e.g., Immediately, March 2024">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-handshake"></i> Work Preference (Optional)</label>
                            <select id="profile-worktype">
                                <option value="">Select Preference</option>
                                <option value="Remote" ${portfolioData.profile.workType === 'Remote' ? 'selected' : ''}>Remote</option>
                                <option value="Hybrid" ${portfolioData.profile.workType === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
                                <option value="On-site" ${portfolioData.profile.workType === 'On-site' ? 'selected' : ''}>On-site</option>
                                <option value="Flexible" ${portfolioData.profile.workType === 'Flexible' ? 'selected' : ''}>Flexible</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-language"></i> Languages (Optional)</label>
                            <input type="text" id="profile-languages" value="${portfolioData.profile.languages || ''}" placeholder="e.g., English (Native), Spanish (Fluent)">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-save"></i> Save Profile & Contact Info
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('profile-form').addEventListener('submit', saveProfile);
}

// Projects Tab
function showProjectsTab(container) {
    container.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-rocket"></i> Projects Management</h3>
                    <p>Add, edit, or remove projects from your portfolio</p>
                </div>
                <button class="btn-add" onclick="showAddProjectForm()">
                    <i class="fas fa-plus"></i> Add Project
                </button>
            </div>
            <div id="add-project-form" style="display: none;"></div>
            <div id="projects-list">${renderProjectsList()}</div>
        </div>
    `;
}

// Experience Tab
function showExperienceTab(container) {
    container.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-medal"></i> Experience Management</h3>
                    <p>Manage your work experience and career history</p>
                </div>
                <button class="btn-add" onclick="showAddExperienceForm()">
                    <i class="fas fa-plus"></i> Add Experience
                </button>
            </div>
            <div id="add-experience-form" style="display: none;"></div>
            <div id="experience-list">${renderExperienceList()}</div>
        </div>
    `;
}

// Skills Tab
function showSkillsTab(container) {
    container.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-cogs"></i> Skills Management</h3>
                    <p>Manage your technical skills and expertise levels</p>
                </div>
                <button class="btn-add" onclick="showAddSkillForm()">
                    <i class="fas fa-plus"></i> Add Skill
                </button>
            </div>
            <div id="add-skill-form" style="display: none;"></div>
            <div id="skills-list">${renderSkillsList()}</div>
        </div>
    `;
}

// Achievements Tab
function showAchievementsTab(container) {
    container.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-trophy"></i> Achievements Management</h3>
                    <p>Manage your achievements and certifications</p>
                </div>
                <button class="btn-add" onclick="showAddAchievementForm()">
                    <i class="fas fa-plus"></i> Add Achievement
                </button>
            </div>
            <div id="add-achievement-form" style="display: none;"></div>
            <div id="achievements-list">${renderAchievementsList()}</div>
        </div>
    `;
}

// Certifications Tab
function showCertificationsTab(container) {
    container.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-certificate"></i> Certifications Management</h3>
                    <p>Manage your professional certifications and training</p>
                </div>
                <button class="btn-add" onclick="showAddCertificationForm()">
                    <i class="fas fa-plus"></i> Add Certification
                </button>
            </div>
            <div id="add-certification-form" style="display: none;"></div>
            <div id="certifications-list">${renderCertificationsList()}</div>
        </div>
    `;
}

// Themes Tab
function showThemesTab(container) {
    const themes = {
        'tactical-green': {
            name: 'Tactical Green',
            description: 'Classic military operations theme',
            preview: { primary: '#00ff88', secondary: '#0a0a0a', accent: '#00d4ff' }
        },
        'stealth-blue': {
            name: 'Stealth Blue',
            description: 'Navy stealth operations theme',
            preview: { primary: '#00d4ff', secondary: '#0c1829', accent: '#ff6b35' }
        },
        'crimson-ops': {
            name: 'Crimson Ops',
            description: 'Special operations red theme',
            preview: { primary: '#ff4757', secondary: '#1a0a0a', accent: '#ffa502' }
        },
        'cyber-purple': {
            name: 'Cyber Purple',
            description: 'Cybersecurity operations theme',
            preview: { primary: '#a55eea', secondary: '#0f0a1a', accent: '#26de81' }
        },
        'matrix-classic': {
            name: 'Matrix Classic',
            description: 'Classic green matrix theme',
            preview: { primary: '#00ff41', secondary: '#000000', accent: '#ffffff' }
        }
    };
    
    container.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-palette"></i> Theme Management</h3>
                    <p>Customize the visual appearance of your portfolio</p>
                </div>
            </div>
            <div class="themes-grid">
                ${Object.entries(themes).map(([key, theme]) => `
                    <div class="theme-card ${currentTheme === key ? 'active' : ''}" onclick="selectTheme('${key}')">
                        <div class="theme-preview" style="background: ${theme.preview.secondary};">
                            <div class="preview-header" style="background: ${theme.preview.primary};">
                                <div class="preview-dot" style="background: ${theme.preview.accent};"></div>
                                <div class="preview-dot" style="background: ${theme.preview.accent};"></div>
                                <div class="preview-dot" style="background: ${theme.preview.accent};"></div>
                            </div>
                            <div class="preview-content">
                                <div class="preview-line" style="background: ${theme.preview.primary}; width: 80%;"></div>
                                <div class="preview-line short" style="background: ${theme.preview.accent}; width: 60%;"></div>
                                <div class="preview-line" style="background: ${theme.preview.primary}; width: 90%;"></div>
                            </div>
                        </div>
                        <h4>${theme.name}</h4>
                        <p>${theme.description}</p>
                        <button class="btn-theme ${currentTheme === key ? 'active' : ''}" onclick="selectTheme('${key}')">
                            ${currentTheme === key ? 'Active' : 'Select'}
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Export/Import Tab
function showExportTab(container) {
    container.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <div>
                    <h3><i class="fas fa-download"></i> Data Management</h3>
                    <p>Export your portfolio data or save changes permanently to data.js</p>
                </div>
            </div>
            <div class="data-management-grid">
                <div class="export-section">
                    <h4><i class="fas fa-download"></i> Export Portfolio Data</h4>
                    <p>Download your complete portfolio data as a JSON file for backup or transfer.</p>
                    <button class="btn-primary" onclick="exportData()">
                        <i class="fas fa-download"></i> Export JSON
                    </button>
                </div>
                
                <div class="save-datajs-section">
                    <h4><i class="fas fa-save"></i> Save to data.js File</h4>
                    <p><strong>Make changes permanent!</strong> Download a new data.js file with all your changes, then replace the original file.</p>
                    <button class="btn-success" onclick="saveToDataFile()">
                        <i class="fas fa-file-code"></i> Generate data.js File
                    </button>
                    <small style="display: block; margin-top: 10px; color: var(--text-secondary);">
                        ℹ️ After downloading, replace the existing /js/data.js file and commit to GitHub
                    </small>
                </div>
                
                <div class="import-section">
                    <h4><i class="fas fa-upload"></i> Import Data</h4>
                    <p>Import portfolio data from a previously exported JSON file.</p>
                    <input type="file" id="import-file" accept=".json" style="display: none;" onchange="importData()">
                    <button class="btn-secondary" onclick="document.getElementById('import-file').click()">
                        <i class="fas fa-upload"></i> Import Portfolio
                    </button>
                </div>
                
                <div class="reset-section">
                    <h4><i class="fas fa-undo"></i> Reset Data</h4>
                    <p>Reset to original data.js file content (removes all admin changes).</p>
                    <button class="btn-warning" onclick="resetToOriginalData()">
                        <i class="fas fa-undo"></i> Reset to Original
                    </button>
                </div>
            </div>
            
            <div class="usage-instructions">
                <h4><i class="fas fa-info-circle"></i> How to Make Changes Permanent</h4>
                <ol>
                    <li><strong>Make your changes</strong> in the admin panel (Profile, Projects, Skills, etc.)</li>
                    <li><strong>Click "Generate data.js File"</strong> to download the updated file</li>
                    <li><strong>Replace</strong> the existing <code>/js/data.js</code> file with the downloaded one</li>
                    <li><strong>Commit and push</strong> the changes to GitHub</li>
                    <li><strong>Your changes are now live!</strong> The portfolio will use the new data permanently</li>
                </ol>
            </div>
        </div>
    `;
}

// Utility Functions
function renderProjectsList() {
    // Sort projects by order before rendering
    const sortedProjects = [...portfolioData.projects].sort((a, b) => (a.order || 999) - (b.order || 999));
    
    return `
        <div class="sortable-list" id="projects-sortable">
            ${sortedProjects.map((project, sortedIndex) => {
                const originalIndex = portfolioData.projects.findIndex(p => p === project);
                return `
                <div class="admin-item sortable-item" draggable="true" data-index="${sortedIndex}" data-type="projects" data-name="${project.title}">
                    <div class="item-header">
                        <div class="item-title">
                            <div class="drag-handle">
                                <i class="fas fa-grip-vertical"></i>
                            </div>
                            <span class="order-badge">#${sortedIndex + 1}</span>
                            <h4><i class="fas fa-rocket"></i> ${project.title}</h4>
                        </div>
                        <div class="item-actions">
                            <div class="order-controls">
                                <button class="btn-order" onclick="moveItem('projects', ${sortedIndex}, 'up')" 
                                        ${sortedIndex === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-up"></i>
                                </button>
                                <button class="btn-order" onclick="moveItem('projects', ${sortedIndex}, 'down')" 
                                        ${sortedIndex === sortedProjects.length - 1 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </div>
                            <button class="btn-edit" onclick="editProject(${originalIndex})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" onclick="deleteProject(${originalIndex})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    <div class="item-content">
                        <p><strong>Category:</strong> <span class="category-tag">${project.category}</span></p>
                        <p><strong>Status:</strong> <span class="status-${project.status}">${project.status}</span></p>
                        <p><strong>Description:</strong> ${project.description}</p>
                        <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
}

function renderExperienceList() {
    // Sort experience by order before rendering
    const sortedExperience = [...portfolioData.experience].sort((a, b) => (a.order || 999) - (b.order || 999));
    
    return `
        <div class="sortable-list" id="experience-sortable">
            ${sortedExperience.map((exp, sortedIndex) => {
                const originalIndex = portfolioData.experience.findIndex(e => e === exp);
                return `
                <div class="admin-item sortable-item" draggable="true" data-index="${sortedIndex}" data-type="experience" data-name="${exp.position} at ${exp.company}">
                    <div class="item-header">
                        <div class="item-title">
                            <div class="drag-handle">
                                <i class="fas fa-grip-vertical"></i>
                            </div>
                            <span class="order-badge">#${sortedIndex + 1}</span>
                            <h4><i class="fas fa-building"></i> ${exp.position} at ${exp.company}</h4>
                        </div>
                        <div class="item-actions">
                            <div class="order-controls">
                                <button class="btn-order" onclick="moveItem('experience', ${sortedIndex}, 'up')" 
                                        ${sortedIndex === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-up"></i>
                                </button>
                                <button class="btn-order" onclick="moveItem('experience', ${sortedIndex}, 'down')" 
                                        ${sortedIndex === sortedExperience.length - 1 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </div>
                            <button class="btn-edit" onclick="editExperience(${originalIndex})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" onclick="deleteExperience(${originalIndex})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    <div class="item-content">
                        <p><strong>Period:</strong> ${exp.period}</p>
                        <p><strong>Location:</strong> ${exp.location}</p>
                        <div class="description-list">
                            <strong>Responsibilities:</strong>
                            <ul>
                                ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                            </ul>
                        </div>
                        <p><strong>Technologies:</strong> ${exp.technologies.join(', ')}</p>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
}

// Experience CRUD Functions
function showAddExperienceForm() {
    const formContainer = document.getElementById('add-experience-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div class="form-container">
            <h4>Add New Experience</h4>
            <form class="admin-form" id="experience-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-building"></i> Company</label>
                        <input type="text" id="experience-company" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-briefcase"></i> Position</label>
                        <input type="text" id="experience-position" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> Period</label>
                        <input type="text" id="experience-period" placeholder="e.g., Jan 2020 - Present" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-map-marker-alt"></i> Location</label>
                        <input type="text" id="experience-location" required>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-tasks"></i> Job Descriptions (one per line)</label>
                        <textarea id="experience-description" rows="5" placeholder="Enter each responsibility on a new line" required></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-code"></i> Technologies (comma-separated)</label>
                        <input type="text" id="experience-technologies" placeholder="e.g., React, Node.js, MongoDB">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Add Experience
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddExperienceForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('experience-form').addEventListener('submit', addNewExperience);
}

function hideAddExperienceForm() {
    document.getElementById('add-experience-form').style.display = 'none';
}

function addNewExperience(e) {
    e.preventDefault();
    
    const newExperience = {
        company: document.getElementById('experience-company').value,
        position: document.getElementById('experience-position').value,
        period: document.getElementById('experience-period').value,
        location: document.getElementById('experience-location').value,
        description: document.getElementById('experience-description').value.split('\n').filter(line => line.trim()),
        technologies: document.getElementById('experience-technologies').value.split(',').map(tech => tech.trim()).filter(tech => tech)
    };
    
    portfolioData.experience.push(newExperience);
    saveDataAndUpdate();
    hideAddExperienceForm();
    refreshExperienceList();
    showNotification('Experience added successfully!', 'success');
}

function editExperience(index) {
    const exp = portfolioData.experience[index];
    const formContainer = document.getElementById('add-experience-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div class="form-container">
            <h4>Edit Experience</h4>
            <form class="admin-form" id="edit-experience-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-building"></i> Company</label>
                        <input type="text" id="edit-experience-company" value="${exp.company}" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-briefcase"></i> Position</label>
                        <input type="text" id="edit-experience-position" value="${exp.position}" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> Period</label>
                        <input type="text" id="edit-experience-period" value="${exp.period}" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-map-marker-alt"></i> Location</label>
                        <input type="text" id="edit-experience-location" value="${exp.location}" required>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-tasks"></i> Job Descriptions (one per line)</label>
                        <textarea id="edit-experience-description" rows="5" required>${exp.description.join('\n')}</textarea>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-code"></i> Technologies (comma-separated)</label>
                        <input type="text" id="edit-experience-technologies" value="${exp.technologies.join(', ')}">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Update Experience
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddExperienceForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('edit-experience-form').addEventListener('submit', (e) => updateExperience(e, index));
}

function updateExperience(e, index) {
    e.preventDefault();
    
    portfolioData.experience[index] = {
        company: document.getElementById('edit-experience-company').value,
        position: document.getElementById('edit-experience-position').value,
        period: document.getElementById('edit-experience-period').value,
        location: document.getElementById('edit-experience-location').value,
        description: document.getElementById('edit-experience-description').value.split('\n').filter(line => line.trim()),
        technologies: document.getElementById('edit-experience-technologies').value.split(',').map(tech => tech.trim()).filter(tech => tech)
    };
    
    saveDataAndUpdate();
    hideAddExperienceForm();
    refreshExperienceList();
    showNotification('Experience updated successfully!', 'success');
}

function deleteExperience(index) {
    if (confirm('Are you sure you want to delete this experience?')) {
        portfolioData.experience.splice(index, 1);
        saveDataAndUpdate();
        refreshExperienceList();
        showNotification('Experience deleted successfully!', 'success');
    }
}

function refreshExperienceList() {
    document.getElementById('experience-list').innerHTML = renderExperienceList();
}

function renderSkillsList() {
    return portfolioData.skills.map((skillCategory, categoryIndex) => `
        <div class="skill-category">
            <div class="category-header">
                <h4><i class="${skillCategory.icon}"></i> ${skillCategory.category}</h4>
                <div class="category-actions">
                    <button class="btn-mini-edit" onclick="editSkillCategory(${categoryIndex})">
                        <i class="fas fa-edit"></i> Edit Category
                    </button>
                    <button class="btn-mini-delete" onclick="deleteSkillCategory(${categoryIndex})">
                        <i class="fas fa-trash"></i> Delete Category
                    </button>
                </div>
            </div>
            <div class="skills-in-category">
                ${skillCategory.items.map((skill, skillIndex) => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${skill.level}%</span>
                        <div class="skill-actions">
                            <button class="btn-mini-edit" onclick="editSkill(${categoryIndex}, ${skillIndex})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-mini-delete" onclick="deleteSkill(${categoryIndex}, ${skillIndex})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
                <button class="btn-add-skill" onclick="showAddSkillToCategory(${categoryIndex})">
                    <i class="fas fa-plus"></i> Add Skill to ${skillCategory.category}
                </button>
            </div>
        </div>
    `).join('');
}

function renderAchievementsList() {
    // Sort achievements by order before rendering
    const sortedAchievements = [...portfolioData.achievements].sort((a, b) => (a.order || 999) - (b.order || 999));
    
    return `
        <div class="sortable-list" id="achievements-sortable">
            ${sortedAchievements.map((achievement, sortedIndex) => {
                const originalIndex = portfolioData.achievements.findIndex(a => a === achievement);
                return `
                <div class="admin-item sortable-item" draggable="true" data-index="${sortedIndex}" data-type="achievements" data-name="${achievement.title}">
                    <div class="item-header">
                        <div class="item-title">
                            <div class="drag-handle">
                                <i class="fas fa-grip-vertical"></i>
                            </div>
                            <span class="order-badge">#${sortedIndex + 1}</span>
                            <h4><i class="${achievement.icon}"></i> ${achievement.title}</h4>
                        </div>
                        <div class="item-actions">
                            <div class="order-controls">
                                <button class="btn-order" onclick="moveItem('achievements', ${sortedIndex}, 'up')" 
                                        ${sortedIndex === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-up"></i>
                                </button>
                                <button class="btn-order" onclick="moveItem('achievements', ${sortedIndex}, 'down')" 
                                        ${sortedIndex === sortedAchievements.length - 1 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </div>
                            <button class="btn-edit" onclick="editAchievement(${originalIndex})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" onclick="deleteAchievement(${originalIndex})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    <div class="item-content">
                        <p><strong>Description:</strong> ${achievement.description}</p>
                        <p><strong>Metric:</strong> ${achievement.metric}</p>
                        <p><strong>Icon:</strong> <i class="${achievement.icon}"></i></p>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
}

// Achievements CRUD Functions
function showAddAchievementForm() {
    const formContainer = document.getElementById('add-achievement-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div class="form-container">
            <h4>Add New Achievement</h4>
            <form class="admin-form" id="achievement-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-trophy"></i> Achievement Title</label>
                        <input type="text" id="achievement-title" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-icons"></i> Icon Class</label>
                        <select id="achievement-icon" required>
                            <option value="">Select Icon</option>
                            <option value="fas fa-trophy">🏆 Trophy</option>
                            <option value="fas fa-medal">🥇 Medal</option>
                            <option value="fas fa-star">⭐ Star</option>
                            <option value="fas fa-award">🏅 Award</option>
                            <option value="fas fa-certificate">📜 Certificate</option>
                            <option value="fas fa-graduation-cap">🎓 Graduation</option>
                            <option value="fas fa-clock">⏰ Time</option>
                            <option value="fas fa-users">👥 Team</option>
                            <option value="fas fa-globe">🌍 Global</option>
                            <option value="fas fa-rocket">🚀 Innovation</option>
                            <option value="fas fa-lightbulb">💡 Ideas</option>
                            <option value="fas fa-chart-line">📈 Growth</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-info-circle"></i> Description</label>
                        <textarea id="achievement-description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-chart-bar"></i> Metric/Impact</label>
                        <input type="text" id="achievement-metric" placeholder="e.g., 100+ Users, 50% Improvement" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Add Achievement
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddAchievementForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('achievement-form').addEventListener('submit', addNewAchievement);
}

function hideAddAchievementForm() {
    document.getElementById('add-achievement-form').style.display = 'none';
}

function addNewAchievement(e) {
    e.preventDefault();
    
    const newAchievement = {
        icon: document.getElementById('achievement-icon').value,
        title: document.getElementById('achievement-title').value,
        description: document.getElementById('achievement-description').value,
        metric: document.getElementById('achievement-metric').value
    };
    
    portfolioData.achievements.push(newAchievement);
    saveDataAndUpdate();
    hideAddAchievementForm();
    refreshAchievementsList();
    showNotification('Achievement added successfully!', 'success');
}

function editAchievement(index) {
    const achievement = portfolioData.achievements[index];
    const formContainer = document.getElementById('add-achievement-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div class="form-container">
            <h4>Edit Achievement</h4>
            <form class="admin-form" id="edit-achievement-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-trophy"></i> Achievement Title</label>
                        <input type="text" id="edit-achievement-title" value="${achievement.title}" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-icons"></i> Icon Class</label>
                        <select id="edit-achievement-icon" required>
                            <option value="">Select Icon</option>
                            <option value="fas fa-trophy" ${achievement.icon === 'fas fa-trophy' ? 'selected' : ''}>🏆 Trophy</option>
                            <option value="fas fa-medal" ${achievement.icon === 'fas fa-medal' ? 'selected' : ''}>🥇 Medal</option>
                            <option value="fas fa-star" ${achievement.icon === 'fas fa-star' ? 'selected' : ''}>⭐ Star</option>
                            <option value="fas fa-award" ${achievement.icon === 'fas fa-award' ? 'selected' : ''}>🏅 Award</option>
                            <option value="fas fa-certificate" ${achievement.icon === 'fas fa-certificate' ? 'selected' : ''}>📜 Certificate</option>
                            <option value="fas fa-graduation-cap" ${achievement.icon === 'fas fa-graduation-cap' ? 'selected' : ''}>🎓 Graduation</option>
                            <option value="fas fa-clock" ${achievement.icon === 'fas fa-clock' ? 'selected' : ''}>⏰ Time</option>
                            <option value="fas fa-users" ${achievement.icon === 'fas fa-users' ? 'selected' : ''}>👥 Team</option>
                            <option value="fas fa-globe" ${achievement.icon === 'fas fa-globe' ? 'selected' : ''}>🌍 Global</option>
                            <option value="fas fa-rocket" ${achievement.icon === 'fas fa-rocket' ? 'selected' : ''}>🚀 Innovation</option>
                            <option value="fas fa-lightbulb" ${achievement.icon === 'fas fa-lightbulb' ? 'selected' : ''}>💡 Ideas</option>
                            <option value="fas fa-chart-line" ${achievement.icon === 'fas fa-chart-line' ? 'selected' : ''}>📈 Growth</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-info-circle"></i> Description</label>
                        <textarea id="edit-achievement-description" rows="3" required>${achievement.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-chart-bar"></i> Metric/Impact</label>
                        <input type="text" id="edit-achievement-metric" value="${achievement.metric}" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Update Achievement
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddAchievementForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('edit-achievement-form').addEventListener('submit', (e) => updateAchievement(e, index));
}

function updateAchievement(e, index) {
    e.preventDefault();
    
    portfolioData.achievements[index] = {
        icon: document.getElementById('edit-achievement-icon').value,
        title: document.getElementById('edit-achievement-title').value,
        description: document.getElementById('edit-achievement-description').value,
        metric: document.getElementById('edit-achievement-metric').value
    };
    
    saveDataAndUpdate();
    hideAddAchievementForm();
    refreshAchievementsList();
    showNotification('Achievement updated successfully!', 'success');
}

function deleteAchievement(index) {
    if (confirm('Are you sure you want to delete this achievement?')) {
        portfolioData.achievements.splice(index, 1);
        saveDataAndUpdate();
        refreshAchievementsList();
        showNotification('Achievement deleted successfully!', 'success');
    }
}

function refreshAchievementsList() {
    document.getElementById('achievements-list').innerHTML = renderAchievementsList();
}

// Certifications Management Functions
function renderCertificationsList() {
    // Sort certifications by order before rendering
    const sortedCertifications = [...portfolioData.certifications].sort((a, b) => (a.order || 999) - (b.order || 999));
    
    return `
        <div class="sortable-list" id="certifications-sortable">
            ${sortedCertifications.map((cert, sortedIndex) => {
                const originalIndex = portfolioData.certifications.findIndex(c => c === cert);
                return `
                <div class="admin-item sortable-item" draggable="true" data-index="${sortedIndex}" data-type="certifications" data-name="${cert.name}">
                    <div class="item-header">
                        <div class="item-title">
                            <div class="drag-handle">
                                <i class="fas fa-grip-vertical"></i>
                            </div>
                            <span class="order-badge">#${sortedIndex + 1}</span>
                            <h4><i class="fas fa-certificate"></i> ${cert.name}</h4>
                        </div>
                        <div class="item-actions">
                            <div class="order-controls">
                                <button class="btn-order" onclick="moveItem('certifications', ${sortedIndex}, 'up')" 
                                        ${sortedIndex === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-up"></i>
                                </button>
                                <button class="btn-order" onclick="moveItem('certifications', ${sortedIndex}, 'down')" 
                                        ${sortedIndex === sortedCertifications.length - 1 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </div>
                            <button class="btn-edit" onclick="editCertification(${originalIndex})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" onclick="deleteCertification(${originalIndex})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    <div class="item-content">
                        <p><strong>Provider:</strong> ${cert.provider}</p>
                        <p><strong>Status:</strong> <span class="status-${cert.status.toLowerCase().replace(' ', '-')}">${cert.status}</span></p>
                        ${cert.date ? `<p><strong>Date:</strong> ${cert.date}</p>` : ''}
                        ${cert.url ? `<p><strong>Link:</strong> <a href="${cert.url}" target="_blank">View Certificate</a></p>` : ''}
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
}

function showAddCertificationForm() {
    const formContainer = document.getElementById('add-certification-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div class="form-container">
            <h4>Add New Certification</h4>
            <form class="admin-form" id="certification-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-certificate"></i> Certification Name</label>
                        <input type="text" id="certification-name" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-building"></i> Provider/Institution</label>
                        <input type="text" id="certification-provider" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-check-circle"></i> Status</label>
                        <select id="certification-status" required>
                            <option value="">Select Status</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Planned">Planned</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-sort-numeric-up"></i> Display Order</label>
                        <select id="certification-order" required>
                            ${generateOrderOptions('certifications')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> Date (Optional)</label>
                        <input type="text" id="certification-date" placeholder="e.g., January 2024">
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-link"></i> Certificate URL (Optional)</label>
                        <input type="url" id="certification-url" placeholder="https://...">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Add Certification
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddCertificationForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('certification-form').addEventListener('submit', addNewCertification);
}

function hideAddCertificationForm() {
    document.getElementById('add-certification-form').style.display = 'none';
}

function addNewCertification(e) {
    e.preventDefault();
    
    const selectedOrder = parseInt(document.getElementById('certification-order').value);
    
    // Update existing orders to make space for new item
    updateOrderNumbers('certifications', selectedOrder);
    
    const newCertification = {
        name: document.getElementById('certification-name').value,
        provider: document.getElementById('certification-provider').value,
        status: document.getElementById('certification-status').value,
        order: selectedOrder
    };
    
    // Add optional fields if provided
    const date = document.getElementById('certification-date').value;
    const url = document.getElementById('certification-url').value;
    
    if (date) newCertification.date = date;
    if (url) newCertification.url = url;
    
    portfolioData.certifications.push(newCertification);
    saveDataAndUpdate();
    hideAddCertificationForm();
    refreshCertificationsList();
    showNotification('Certification added successfully!', 'success');
}

function editCertification(index) {
    const cert = portfolioData.certifications[index];
    const formContainer = document.getElementById('add-certification-form');
    formContainer.style.display = 'block';
    formContainer.innerHTML = `
        <div class="form-container">
            <h4>Edit Certification</h4>
            <form class="admin-form" id="edit-certification-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-certificate"></i> Certification Name</label>
                        <input type="text" id="edit-certification-name" value="${cert.name}" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-building"></i> Provider/Institution</label>
                        <input type="text" id="edit-certification-provider" value="${cert.provider}" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-check-circle"></i> Status</label>
                        <select id="edit-certification-status" required>
                            <option value="">Select Status</option>
                            <option value="Completed" ${cert.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="In Progress" ${cert.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Planned" ${cert.status === 'Planned' ? 'selected' : ''}>Planned</option>
                            <option value="Expired" ${cert.status === 'Expired' ? 'selected' : ''}>Expired</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> Date (Optional)</label>
                        <input type="text" id="edit-certification-date" value="${cert.date || ''}" placeholder="e.g., January 2024">
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-link"></i> Certificate URL (Optional)</label>
                        <input type="url" id="edit-certification-url" value="${cert.url || ''}" placeholder="https://...">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Update Certification
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddCertificationForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('edit-certification-form').addEventListener('submit', (e) => updateCertification(e, index));
}

function updateCertification(e, index) {
    e.preventDefault();
    
    const updatedCertification = {
        name: document.getElementById('edit-certification-name').value,
        provider: document.getElementById('edit-certification-provider').value,
        status: document.getElementById('edit-certification-status').value
    };
    
    // Add optional fields if provided
    const date = document.getElementById('edit-certification-date').value;
    const url = document.getElementById('edit-certification-url').value;
    
    if (date) updatedCertification.date = date;
    if (url) updatedCertification.url = url;
    
    portfolioData.certifications[index] = updatedCertification;
    saveDataAndUpdate();
    hideAddCertificationForm();
    refreshCertificationsList();
    showNotification('Certification updated successfully!', 'success');
}

function deleteCertification(index) {
    if (confirm('Are you sure you want to delete this certification?')) {
        const deletedOrder = portfolioData.certifications[index].order;
        portfolioData.certifications.splice(index, 1);
        
        // Update order numbers for remaining items
        updateOrderNumbers('certifications', deletedOrder, true);
        
        saveDataAndUpdate();
        refreshCertificationsList();
        showNotification('Certification deleted successfully!', 'success');
    }
}

function refreshCertificationsList() {
    document.getElementById('certifications-list').innerHTML = renderCertificationsList();
}

// Theme Management
function selectTheme(themeName) {
    currentTheme = themeName;
    applyTheme(themeName);
    localStorage.setItem('portfolioTheme', themeName);
    showNotification(`Theme changed to ${themeName.replace('-', ' ').toUpperCase()}`, 'success');
    
    // Update theme tab display
    showThemesTab(document.getElementById('admin-content'));
}

function applyTheme(themeName) {
    const root = document.documentElement;
    
    const themes = {
        'tactical-green': {
            'primary-color': '#00ff88',
            'bg-primary': '#0a0a0a',
            'bg-secondary': '#1a1a1a',
            'bg-tertiary': '#2a2a2a',
            'text-primary': '#ffffff',
            'text-secondary': '#cccccc',
            'accent-color': '#00d4ff',
            'border-color': '#333333'
        },
        'stealth-blue': {
            'primary-color': '#00d4ff',
            'bg-primary': '#0c1829',
            'bg-secondary': '#1c2839',
            'bg-tertiary': '#2c3849',
            'text-primary': '#ffffff',
            'text-secondary': '#b8c6db',
            'accent-color': '#ff6b35',
            'border-color': '#3c4859'
        },
        'crimson-ops': {
            'primary-color': '#ff4757',
            'bg-primary': '#1a0a0a',
            'bg-secondary': '#2a1a1a',
            'bg-tertiary': '#3a2a2a',
            'text-primary': '#ffffff',
            'text-secondary': '#ffcccc',
            'accent-color': '#ffa502',
            'border-color': '#4a3a3a'
        },
        'cyber-purple': {
            'primary-color': '#a55eea',
            'bg-primary': '#0f0a1a',
            'bg-secondary': '#1f1a2a',
            'bg-tertiary': '#2f2a3a',
            'text-primary': '#ffffff',
            'text-secondary': '#d1c4e9',
            'accent-color': '#26de81',
            'border-color': '#3f3a4a'
        },
        'matrix-classic': {
            'primary-color': '#00ff41',
            'bg-primary': '#000000',
            'bg-secondary': '#111111',
            'bg-tertiary': '#222222',
            'text-primary': '#00ff41',
            'text-secondary': '#008f11',
            'accent-color': '#ffffff',
            'border-color': '#333333'
        }
    };
    
    const theme = themes[themeName];
    if (theme) {
        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
    }
}

// Save Profile with security improvements
function saveProfile(e) {
    e.preventDefault();
    
    // Security: Check authentication
    if (!isAdminAuthenticated) {
        showNotification('Unauthorized access attempt blocked.', 'error');
        return;
    }
    
    // Security: Extend session on activity
    startSession();
    
    // Security: Sanitize all inputs
    portfolioData.profile.name = sanitizeInput(document.getElementById('profile-name').value);
    portfolioData.profile.title = sanitizeInput(document.getElementById('profile-title').value);
    portfolioData.profile.location = sanitizeInput(document.getElementById('profile-location').value);
    portfolioData.profile.email = sanitizeInput(document.getElementById('profile-email').value);
    
    // Bio/Summary (handle both legacy 'bio' and new 'summary')
    const bioValue = sanitizeInput(document.getElementById('profile-bio').value);
    portfolioData.profile.summary = bioValue;
    portfolioData.profile.bio = bioValue; // Keep for compatibility
    
    // Experience
    const experience = sanitizeInput(document.getElementById('profile-experience').value);
    if (experience) portfolioData.profile.experience = experience;
    
    // Contact Information
    const phone = sanitizeInput(document.getElementById('profile-phone').value);
    if (phone) portfolioData.profile.phone = phone;
    
    const linkedin = document.getElementById('profile-linkedin').value;
    if (linkedin) portfolioData.profile.linkedin = linkedin;
    
    const github = document.getElementById('profile-github').value;
    if (github) portfolioData.profile.github = github;
    
    const twitter = document.getElementById('profile-twitter').value;
    if (twitter) portfolioData.profile.twitter = twitter;
    
    const website = document.getElementById('profile-website').value;
    if (website) portfolioData.profile.website = website;
    
    // Professional Details
    const resume = document.getElementById('profile-resume').value;
    if (resume) portfolioData.profile.resume = resume;
    
    const availability = document.getElementById('profile-availability').value;
    if (availability) portfolioData.profile.availability = availability;
    
    const workType = document.getElementById('profile-worktype').value;
    if (workType) portfolioData.profile.workType = workType;
    
    const languages = document.getElementById('profile-languages').value;
    if (languages) portfolioData.profile.languages = languages;
    
    saveDataAndUpdate();
    showNotification('Profile and contact information updated successfully!', 'success');
}

// Data Management
function exportData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-data.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Portfolio data exported successfully!', 'success');
}

// Save changes directly to data.js file for permanent changes
function saveToDataFile() {
    // Generate the new data.js file content
    const dataJsContent = `// Portfolio Data Structure
let portfolioData = ${JSON.stringify(portfolioData, null, 4)};`;
    
    // Create and download the file
    const dataBlob = new Blob([dataJsContent], {type: 'application/javascript'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.js';
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('data.js file generated! Replace the original file and push to GitHub.', 'success');
}

// Function to generate a complete data.js file with current changes
function generateDataJsFile() {
    // Ensure order integrity before generating file
    ensureOrderIntegrity();
    
    // Generate proper JavaScript file content
    const dataJsContent = `// Portfolio Data Structure
let portfolioData = ${JSON.stringify(portfolioData, null, 4)};`;
    
    return dataJsContent;
}

function importData() {
    const file = document.getElementById('import-file').files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            // Validate data structure
            if (importedData.profile && importedData.projects && importedData.experience) {
                portfolioData = importedData;
                saveData();
                showNotification('Portfolio data imported successfully! Refreshing...', 'success');
                setTimeout(() => location.reload(), 2000);
            } else {
                showNotification('Invalid file format!', 'error');
            }
        } catch (error) {
            showNotification('Error reading file!', 'error');
        }
    };
    reader.readAsText(file);
}

// Reset to original data from data.js file
function resetToOriginalData() {
    if (confirm('This will remove ALL admin changes and reset to the original data.js content. Are you sure?')) {
        // Clear localStorage to force reload from original data.js
        localStorage.removeItem('portfolioData');
        showNotification('Data reset! Refreshing page to load original data...', 'info');
        setTimeout(() => location.reload(), 2000);
    }
}

function initializeAdminData() {
    loadData();
}

// Save data to localStorage
function saveData() {
    console.log('[DEBUG] Saving data to localStorage...');
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    console.log('[DEBUG] Data saved successfully');
}

// Save data directly without order integrity checks (for manual reordering)
function saveDataDirectly() {
    console.log('[DEBUG] Saving data directly to localStorage...');
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    console.log('[DEBUG] Data saved directly');
}

// Enhanced data loading with fallback
function loadData() {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
        try {
            portfolioData = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Initialize data on admin panel load
function initializeAdminData() {
    loadData();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        border: 2px solid ${type === 'success' ? 'var(--primary-color)' : type === 'error' ? '#ff4757' : 'var(--accent-color)'};
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-family: var(--font-secondary);
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================== CRUD OPERATIONS =====================

// Project CRUD Operations
function showAddProjectForm() {
    const container = document.getElementById('add-project-form');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="form-container">
            <h4><i class="fas fa-plus"></i> Add New Project</h4>
            <form class="admin-form" id="add-project-form-content">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-heading"></i> Project Title</label>
                        <input type="text" id="new-project-title" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-tag"></i> Category</label>
                        <select id="new-project-category" required>
                            <option value="bi">BI Operations</option>
                            <option value="automation">Automation</option>
                            <option value="python">Python Ops</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-tasks"></i> Status</label>
                        <select id="new-project-status" required>
                            <option value="completed">Completed</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="planned">Planned</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-image"></i> Icon Class</label>
                        ${createIconPicker('fas fa-rocket', 'new-project-image')}
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-align-left"></i> Description</label>
                        <textarea id="new-project-description" rows="3" required></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-code"></i> Technologies (comma-separated)</label>
                        <input type="text" id="new-project-technologies" placeholder="React, Node.js, MongoDB" required>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-bullseye"></i> Impact</label>
                        <input type="text" id="new-project-impact" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Add Project
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddProjectForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('add-project-form-content').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewProject();
    });
}

function hideAddProjectForm() {
    document.getElementById('add-project-form').style.display = 'none';
}

function addNewProject() {
    const newProject = {
        id: portfolioData.projects.length + 1,
        title: document.getElementById('new-project-title').value,
        description: document.getElementById('new-project-description').value,
        image: document.getElementById('new-project-image').value,
        technologies: document.getElementById('new-project-technologies').value.split(',').map(t => t.trim()),
        category: document.getElementById('new-project-category').value,
        status: document.getElementById('new-project-status').value,
        impact: document.getElementById('new-project-impact').value,
        links: [
            { type: "demo", url: "#", label: "View Demo" }
        ]
    };
    
    portfolioData.projects.push(newProject);
    saveDataAndUpdate();
    hideAddProjectForm();
    showProjectsTab(document.getElementById('admin-content'));
}

function editProject(index) {
    const project = portfolioData.projects[index];
    const container = document.getElementById('add-project-form');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="form-container">
            <h4><i class="fas fa-edit"></i> Edit Project</h4>
            <form class="admin-form" id="edit-project-form-content">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-heading"></i> Project Title</label>
                        <input type="text" id="edit-project-title" value="${project.title}" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-tag"></i> Category</label>
                        <select id="edit-project-category" required>
                            <option value="bi" ${project.category === 'bi' ? 'selected' : ''}>BI Operations</option>
                            <option value="automation" ${project.category === 'automation' ? 'selected' : ''}>Automation</option>
                            <option value="python" ${project.category === 'python' ? 'selected' : ''}>Python Ops</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-tasks"></i> Status</label>
                        <select id="edit-project-status" required>
                            <option value="completed" ${project.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="ongoing" ${project.status === 'ongoing' ? 'selected' : ''}>Ongoing</option>
                            <option value="planned" ${project.status === 'planned' ? 'selected' : ''}>Planned</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-image"></i> Icon Class</label>
                        ${createIconPicker(project.image, 'edit-project-image')}
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-align-left"></i> Description</label>
                        <textarea id="edit-project-description" rows="3" required>${project.description}</textarea>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-code"></i> Technologies (comma-separated)</label>
                        <input type="text" id="edit-project-technologies" value="${project.technologies.join(', ')}" required>
                    </div>
                    <div class="form-group full-width">
                        <label><i class="fas fa-bullseye"></i> Impact</label>
                        <input type="text" id="edit-project-impact" value="${project.impact}" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Update Project
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddProjectForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('edit-project-form-content').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProject(index);
    });
}

function updateProject(index) {
    portfolioData.projects[index] = {
        ...portfolioData.projects[index],
        title: document.getElementById('edit-project-title').value,
        description: document.getElementById('edit-project-description').value,
        image: document.getElementById('edit-project-image').value,
        technologies: document.getElementById('edit-project-technologies').value.split(',').map(t => t.trim()),
        category: document.getElementById('edit-project-category').value,
        status: document.getElementById('edit-project-status').value,
        impact: document.getElementById('edit-project-impact').value
    };
    
    saveDataAndUpdate();
    hideAddProjectForm();
    showProjectsTab(document.getElementById('admin-content'));
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        portfolioData.projects.splice(index, 1);
        saveData();
        showNotification('Project deleted successfully!', 'success');
        showProjectsTab(document.getElementById('admin-content'));
    }
}

// Skills CRUD Operations
function showAddSkillForm() {
    const container = document.getElementById('add-skill-form');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="form-container">
            <h4><i class="fas fa-plus"></i> Add New Skill Category</h4>
            <form class="admin-form" id="add-skill-category-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-layer-group"></i> Category Name</label>
                        <input type="text" id="new-skill-category" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-icons"></i> Icon Class</label>
                        <input type="text" id="new-skill-icon" value="fas fa-cogs" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Add Category
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddSkillForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('add-skill-category-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewSkillCategory();
    });
}

function hideAddSkillForm() {
    document.getElementById('add-skill-form').style.display = 'none';
}

function addNewSkillCategory() {
    const newCategory = {
        category: document.getElementById('new-skill-category').value,
        icon: document.getElementById('new-skill-icon').value,
        items: []
    };
    
    portfolioData.skills.push(newCategory);
    saveData();
    showNotification('Skill category added successfully!', 'success');
    hideAddSkillForm();
    showSkillsTab(document.getElementById('admin-content'));
}

function showAddSkillToCategory(categoryIndex) {
    const category = portfolioData.skills[categoryIndex];
    const container = document.getElementById('add-skill-form');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="form-container">
            <h4><i class="fas fa-plus"></i> Add Skill to ${category.category}</h4>
            <form class="admin-form" id="add-skill-to-category-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-code"></i> Skill Name</label>
                        <input type="text" id="new-skill-name" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-percentage"></i> Skill Level: <span id="skill-level-display">50</span>%</label>
                        <input type="range" id="new-skill-level" min="0" max="100" value="50" class="skill-slider" oninput="updateSkillDisplay('skill-level-display', this.value)" required>
                        <div class="slider-labels">
                            <span>Beginner</span>
                            <span>Expert</span>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Add Skill
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddSkillForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('add-skill-to-category-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addSkillToCategory(categoryIndex);
    });
}

function addSkillToCategory(categoryIndex) {
    const newSkill = {
        name: document.getElementById('new-skill-name').value,
        level: parseInt(document.getElementById('new-skill-level').value)
    };
    
    portfolioData.skills[categoryIndex].items.push(newSkill);
    saveDataAndUpdate();
    hideAddSkillForm();
    showSkillsTab(document.getElementById('admin-content'));
}

function editSkill(categoryIndex, skillIndex) {
    const skill = portfolioData.skills[categoryIndex].items[skillIndex];
    const category = portfolioData.skills[categoryIndex].category;
    
    const container = document.getElementById('add-skill-form');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="form-container">
            <h4><i class="fas fa-edit"></i> Edit Skill in ${category}</h4>
            <form class="admin-form" id="edit-skill-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-code"></i> Skill Name</label>
                        <input type="text" id="edit-skill-name" value="${skill.name}" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-percentage"></i> Skill Level: <span id="edit-skill-level-display">${skill.level}</span>%</label>
                        <input type="range" id="edit-skill-level" value="${skill.level}" min="0" max="100" class="skill-slider" style="--slider-progress: ${skill.level}%" oninput="updateSkillDisplay('edit-skill-level-display', this.value)" required>
                        <div class="slider-labels">
                            <span>Beginner</span>
                            <span>Expert</span>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save"></i> Update Skill
                    </button>
                    <button type="button" class="btn-secondary" onclick="hideAddSkillForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('edit-skill-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateSkill(categoryIndex, skillIndex);
    });
}

function updateSkill(categoryIndex, skillIndex) {
    portfolioData.skills[categoryIndex].items[skillIndex] = {
        name: document.getElementById('edit-skill-name').value,
        level: parseInt(document.getElementById('edit-skill-level').value)
    };
    
    saveDataAndUpdate();
    hideAddSkillForm();
    showSkillsTab(document.getElementById('admin-content'));
}

function deleteSkill(categoryIndex, skillIndex) {
    const skill = portfolioData.skills[categoryIndex].items[skillIndex];
    if (confirm(`Are you sure you want to delete the skill "${skill.name}"?`)) {
        portfolioData.skills[categoryIndex].items.splice(skillIndex, 1);
        saveData();
        showNotification('Skill deleted successfully!', 'success');
        showSkillsTab(document.getElementById('admin-content'));
    }
}

function deleteSkillCategory(categoryIndex) {
    const category = portfolioData.skills[categoryIndex];
    if (confirm(`Are you sure you want to delete the entire "${category.category}" category?`)) {
        portfolioData.skills.splice(categoryIndex, 1);
        saveData();
        showNotification('Skill category deleted successfully!', 'success');
        showSkillsTab(document.getElementById('admin-content'));
    }
}

// Initialize admin data when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminData();
});

// Skill slider update function
function updateSkillDisplay(displayId, value) {
    document.getElementById(displayId).textContent = value;
    
    // Update slider visual progress
    const slider = event.target;
    const progress = (value / 100) * 100;
    slider.style.setProperty('--slider-progress', progress + '%');
    
    // Add visual feedback based on skill level
    const container = slider.closest('.form-group');
    const label = container.querySelector('label');
    
    // Remove existing level classes
    label.classList.remove('skill-beginner', 'skill-intermediate', 'skill-advanced', 'skill-expert');
    
    // Add appropriate level class
    if (value <= 25) {
        label.classList.add('skill-beginner');
    } else if (value <= 50) {
        label.classList.add('skill-intermediate');
    } else if (value <= 75) {
        label.classList.add('skill-advanced');
    } else {
        label.classList.add('skill-expert');
    }
}

// Enhanced save functionality with page update
function saveDataAndUpdate() {
    console.log('[DEBUG] Starting saveDataAndUpdate...');
    console.log('[DEBUG] Current certifications BEFORE ensureOrderIntegrity:', portfolioData.certifications.map(c => ({name: c.name, order: c.order})));
    
    // Ensure all items have proper order numbers BEFORE saving
    ensureOrderIntegrity();
    
    console.log('[DEBUG] After ensureOrderIntegrity, certifications:', portfolioData.certifications.map(c => ({name: c.name, order: c.order})));
    
    // Save to localStorage
    saveData();
    
    console.log('[DEBUG] Data saved to localStorage');
    
    // Verify what was actually saved
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('[DEBUG] Verified saved certifications:', parsed.certifications.map(c => ({name: c.name, order: c.order})));
    }
    
    // Force refresh of all main content sections
    setTimeout(() => {
        if (typeof updateMainContent === 'function') {
            console.log('[DEBUG] Calling updateMainContent...');
            updateMainContent();
        }
        
        // Also directly update certifications section as backup
        if (typeof updateCertificationsSection === 'function') {
            console.log('[DEBUG] Directly calling updateCertificationsSection...');
            updateCertificationsSection();
        }
        
        // Show success notification with option to make permanent
        showSaveNotificationWithOptions();
    }, 200);
}

// Enhanced save notification with option to generate data.js
function showSaveNotificationWithOptions() {
    const notification = document.createElement('div');
    notification.className = 'notification success enhanced-save-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-main">
                <i class="fas fa-check-circle"></i>
                <span>Changes saved locally!</span>
            </div>
            <div class="notification-actions">
                <button class="btn-mini-success" onclick="saveToDataFile(); this.closest('.notification').remove();">
                    <i class="fas fa-file-code"></i> Make Permanent
                </button>
                <button class="btn-mini-secondary" onclick="this.closest('.notification').remove();">
                    <i class="fas fa-times"></i> Dismiss
                </button>
            </div>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 1rem;
        border-radius: 10px;
        border: 2px solid var(--primary-color);
        z-index: 10000;
        font-family: var(--font-secondary);
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        min-width: 320px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds if no action taken
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 10000);
}

// Function to debug current localStorage state
window.debugStorageState = function() {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
        const data = JSON.parse(saved);
        console.log('[DEBUG] Current localStorage certifications:', data.certifications.map(c => ({name: c.name, order: c.order})));
        console.log('[DEBUG] Current memory certifications:', portfolioData.certifications.map(c => ({name: c.name, order: c.order})));
    }
};

// Add enhanced notification styles
const enhancedNotificationStyles = `
<style>
.enhanced-save-notification .notification-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.enhanced-save-notification .notification-main {
    display: flex;
    align-items: center;
    gap: 10px;
}

.enhanced-save-notification .notification-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.btn-mini-success, .btn-mini-secondary {
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;
}

.btn-mini-success {
    background: var(--primary-color);
    color: var(--bg-primary);
}

.btn-mini-success:hover {
    background: #00cc70;
    transform: translateY(-1px);
}

.btn-mini-secondary {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
}

.btn-mini-secondary:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.usage-instructions {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--bg-tertiary);
    border-radius: 10px;
    border-left: 4px solid var(--primary-color);
}

.usage-instructions h4 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.usage-instructions ol {
    margin-left: 1rem;
}

.usage-instructions li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
}

.usage-instructions code {
    background: var(--bg-primary);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--primary-color);
    font-family: 'Courier New', monospace;
}

.data-management-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.data-management-grid > div {
    padding: 1.5rem;
    background: var(--bg-tertiary);
    border-radius: 10px;
    border: 1px solid var(--border-color);
}

.data-management-grid h4 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.btn-success {
    background: var(--primary-color);
    color: var(--bg-primary);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-success:hover {
    background: #00cc70;
    transform: translateY(-2px);
}

.btn-warning {
    background: #ffa502;
    color: var(--bg-primary);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-warning:hover {
    background: #ff8502;
    transform: translateY(-2px);
}
</style>
`;

// Inject styles when admin loads
document.addEventListener('DOMContentLoaded', function() {
    document.head.insertAdjacentHTML('beforeend', enhancedNotificationStyles);
});

// Ensure all items have proper sequential order numbers
function ensureOrderIntegrity() {
    // Fix certifications order
    portfolioData.certifications.sort((a, b) => (a.order || 999) - (b.order || 999));
    portfolioData.certifications.forEach((item, index) => {
        item.order = index + 1;
    });
    
    // Fix achievements order
    portfolioData.achievements.sort((a, b) => (a.order || 999) - (b.order || 999));
    portfolioData.achievements.forEach((item, index) => {
        item.order = index + 1;
    });
    
    // Fix projects order
    portfolioData.projects.sort((a, b) => (a.order || 999) - (b.order || 999));
    portfolioData.projects.forEach((item, index) => {
        item.order = index + 1;
    });
    
    // Fix experience order
    portfolioData.experience.sort((a, b) => (a.order || 999) - (b.order || 999));
    portfolioData.experience.forEach((item, index) => {
        item.order = index + 1;
    });
}
