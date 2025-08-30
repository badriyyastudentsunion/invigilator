// DOM manipulation helpers
function hide(element) {
    if (element) element.classList.add('hidden');
}

function show(element) {
    if (element) element.classList.remove('hidden');
}

// User management with better persistence
let currentUser = null;

function setUser(user) {
    currentUser = user;
    localStorage.setItem('festivalUser', JSON.stringify(user));
    localStorage.setItem('festivalUserTimestamp', Date.now().toString());
}

function getUser() {
    if (!currentUser) {
        const stored = localStorage.getItem('festivalUser');
        const timestamp = localStorage.getItem('festivalUserTimestamp');
        
        if (stored && timestamp) {
            // Check if session is less than 8 hours old
            const sessionAge = Date.now() - parseInt(timestamp);
            if (sessionAge < 8 * 60 * 60 * 1000) { // 8 hours
                currentUser = JSON.parse(stored);
            } else {
                clearUser();
            }
        }
    }
    return currentUser;
}

function clearUser() {
    currentUser = null;
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
    } else if (role === 'admin' || role === 'leader') {
        // Show header with title for admin and leader
        header.classList.remove('hidden');
        headerTitle.textContent = title || (role === 'admin' ? 'Admin Panel' : 'Team Leader');
    } else {
        // Hide header for login
        header.classList.add('hidden');
    }
}

// Initialize the app with better error handling
function init() {
    const user = getUser();
    
    if (user) {
        document.getElementById('btn-logout').classList.remove('hidden');
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
