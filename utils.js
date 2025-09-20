// DOM manipulation helpers
function hide(element) {
    if (element) element.classList.add('hidden');
}

function show(element) {
    if (element) element.classList.remove('hidden');
}

// User management with better persistence
let festivalCurrentUser = null; // Changed variable name to avoid conflicts

function setUser(user) {
    festivalCurrentUser = user;
    localStorage.setItem('festivalUser', JSON.stringify(user));
    localStorage.setItem('festivalUserTimestamp', Date.now().toString());
}

function getUser() {
    if (!festivalCurrentUser) {
        const stored = localStorage.getItem('festivalUser');
        const timestamp = localStorage.getItem('festivalUserTimestamp');
        if (stored && timestamp) {
            // Check if session is less than 8 hours old
            const sessionAge = Date.now() - parseInt(timestamp);
            if (sessionAge < 8 * 60 * 60 * 1000) { // 8 hours
                festivalCurrentUser = JSON.parse(stored);
            } else {
                clearUser();
            }
        }
    }
    return festivalCurrentUser;
}

function clearUser() {
    festivalCurrentUser = null;
    localStorage.removeItem('festivalUser');
    localStorage.removeItem('festivalUserTimestamp');
}

// Header management
function updateHeader(role, title = '') {
    const header = document.getElementById('main-header');
    const headerTitle = document.getElementById('header-title');
    
    if (role === 'invigilator') {
        // Show header but without title text for invigilator
        header.classList.remove('hidden');
        headerTitle.textContent = '';
    } else if (role === 'admin' || role === 'leader' || role === 'judge') {
        // Show header with title for admin, leader, and judge
        header.classList.remove('hidden');
        headerTitle.textContent = title || (
            role === 'admin' ? 'Admin Panel' : 
            role === 'leader' ? 'Team Leader' : 
            role === 'judge' ? 'Judge Panel' : ''
        );
    } else {
        // Hide header for login
        header.classList.add('hidden');
    }
}

// Update logout button with icon
function updateLogoutButton() {
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
        `;
    }
}

// Initialize the app with better error handling
function init() {
    const user = getUser();
    if (user) {
        document.getElementById('btn-logout').classList.remove('hidden');
        updateLogoutButton();
        hide(document.getElementById('auth'));
        
        if (user.role === 'admin') {
            updateHeader('admin', 'Admin Panel');
            show(document.getElementById('admin-app'));
            if (typeof renderAdminApp === 'function') {
                renderAdminApp().catch(error => {
                    console.error('Failed to render admin app:', error);
                    showAlert('Failed to load admin interface', 'error');
                    logout();
                });
            }
        } else if (user.role === 'leader') {
            updateHeader('leader', 'Team Leader');
            show(document.getElementById('leader-app'));
            if (typeof renderLeaderApp === 'function') {
                renderLeaderApp(user.team_id).catch(error => {
                    console.error('Failed to render leader app:', error);
                    showAlert('Failed to load leader interface', 'error');
                    logout();
                });
            }
        } else if (user.role === 'invigilator') {
            updateHeader('invigilator'); // No title text for invigilator
            show(document.getElementById('invigilator-app'));
            if (typeof renderInvigilatorApp === 'function') {
                renderInvigilatorApp(user.id, user.name).catch(error => {
                    console.error('Failed to render invigilator app:', error);
                    showAlert('Failed to load invigilator interface', 'error');
                    logout();
                });
            } else {
                console.error('renderInvigilatorApp function not found');
                showAlert('Invigilator interface not loaded', 'error');
            }
        } else if (user.role === 'judge') {
            updateHeader('judge', 'Judge Panel');
            show(document.getElementById('judge-app'));
            if (typeof renderJudgeApp === 'function') {
                renderJudgeApp().catch(error => {
                    console.error('Failed to render judge app:', error);
                    showAlert('Failed to load judge interface', 'error');
                    logout();
                });
            } else {
                console.error('renderJudgeApp function not found');
                showAlert('Judge interface not loaded', 'error');
            }
        }
    } else {
        updateHeader('login'); // Hide header for login
        show(document.getElementById('auth'));
    }
}

// Logout functionality
function logout() {
    clearUser();
    document.getElementById('btn-logout').classList.add('hidden');
    hide(document.getElementById('admin-app'));
    hide(document.getElementById('leader-app'));
    hide(document.getElementById('invigilator-app'));
    hide(document.getElementById('judge-app'));
    // Hide header and show auth
    updateHeader('login');
    show(document.getElementById('auth'));
    // Reset forms
    document.getElementById('role').value = 'admin';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    // Haptic feedback
    if (window.hapticFeedback) window.hapticFeedback('light');
}

// Alert function for global use
function showAlert(message, type = 'info') {
    const modal = document.getElementById('alertModal');
    if (!modal) return;
    
    const icon = document.getElementById('alertIcon');
    const title = document.getElementById('alertTitle');
    const msg = document.getElementById('alertMessage');

    const icons = {
        success: '<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
        error: '<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
        info: '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };

    const titles = {
        success: 'Success',
        error: 'Error',
        info: 'Information'
    };

    if (icon) icon.innerHTML = icons[type] || icons.info;
    if (title) title.textContent = titles[type] || titles.info;
    if (msg) msg.textContent = message;

    modal.classList.remove('hidden');
    const okButton = document.getElementById('alertOk');
    if (okButton) {
        okButton.onclick = () => modal.classList.add('hidden');
    }
}
