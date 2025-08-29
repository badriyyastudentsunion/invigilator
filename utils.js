// DOM manipulation helpers
function hide(element) {
    if (element) element.classList.add('hidden');
}

function show(element) {
    if (element) element.classList.remove('hidden');
}

// User management
let currentUser = null;

function setUser(user) {
    currentUser = user;
    localStorage.setItem('festivalUser', JSON.stringify(user));
}

function getUser() {
    if (!currentUser) {
        const stored = localStorage.getItem('festivalUser');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    }
    return currentUser;
}

function clearUser() {
    currentUser = null;
    localStorage.removeItem('festivalUser');
}

// Initialize the app
function init() {
    const user = getUser();
    if (user) {
        document.getElementById('btn-logout').classList.remove('hidden');
        hide(document.getElementById('auth'));
        
        if (user.role === 'admin') {
            show(document.getElementById('admin-app'));
            if (typeof renderAdminApp === 'function') {
                renderAdminApp();
            }
        } else if (user.role === 'leader') {
            show(document.getElementById('leader-app'));
            if (typeof renderLeaderApp === 'function') {
                renderLeaderApp(user.team_id);
            }
        } else if (user.role === 'invigilator') {
            show(document.getElementById('invigilator-app'));
            if (typeof renderInvigilatorApp === 'function') {
                renderInvigilatorApp(user.stage_id);
            }
        }
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
}
