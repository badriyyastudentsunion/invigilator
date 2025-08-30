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

// Initialize the app with better error handling
function init() {
    const user = getUser();
    if (user) {
        document.getElementById('btn-logout').classList.remove('hidden');
        hide(document.getElementById('auth'));
        
        if (user.role === 'admin') {
            show(document.getElementById('admin-app'));
            if (typeof renderAdminApp === 'function') {
                renderAdminApp().catch(error => {
                    console.error('Failed to render admin app:', error);
                    showAlert('Failed to load admin interface', 'error');
                    logout();
                });
            }
        } else if (user.role === 'leader') {
            show(document.getElementById('leader-app'));
            if (typeof renderLeaderApp === 'function') {
                renderLeaderApp(user.team_id).catch(error => {
                    console.error('Failed to render leader app:', error);
                    showAlert('Failed to load leader interface', 'error');
                    logout();
                });
            }
        } else if (user.role === 'invigilator') {
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
    show(document.getElementById('auth'));
    
    // Reset forms
    document.getElementById('role').value = 'admin';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Haptic feedback
    if (window.hapticFeedback) window.hapticFeedback('light');
}
