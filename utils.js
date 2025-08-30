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
    const header = document.getElementById('mainHeader');
    const headerTitle = document.getElementById('headerTitle');
    
    if (user) {
        // Show header and logout button
        header.classList.remove('hidden');
        document.getElementById('btn-logout').classList.remove('hidden');
        hide(document.getElementById('auth'));
        
        if (user.role === 'admin') {
            // Show full header with Exuberanza text for admin
            headerTitle.innerHTML = '<h1 class="text-lg font-bold text-gray-800">Exuberanza</h1>';
            show(document.getElementById('admin-app'));
            if (typeof renderAdminApp === 'function') {
                renderAdminApp().catch(error => {
                    console.error('Failed to render admin app:', error);
                    showAlert('Failed to load admin interface', 'error');
                    logout();
                });
            }
        } else if (user.role === 'leader') {
            // Show full header with Exuberanza text for leader
            headerTitle.innerHTML = '<h1 class="text-lg font-bold text-gray-800">Exuberanza</h1>';
            show(document.getElementById('leader-app'));
            if (typeof renderLeaderApp === 'function') {
                renderLeaderApp(user.team_id).catch(error => {
                    console.error('Failed to render leader app:', error);
                    showAlert('Failed to load leader interface', 'error');
                    logout();
                });
            }
        } else if (user.role === 'invigilator') {
            // Hide Exuberanza text for invigilator, show only stage name
            headerTitle.innerHTML = `
                <div>
                    <h1 class="text-lg font-bold text-gray-800">${user.name}</h1>
                    <p class="text-xs text-gray-500">Competition Management</p>
                </div>
            `;
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
        // Hide header on login page
        header.classList.add('hidden');
        show(document.getElementById('auth'));
    }
}

// Logout functionality
function logout() {
    clearUser();
    
    // Hide header and logout button
    document.getElementById('mainHeader').classList.add('hidden');
    document.getElementById('btn-logout').classList.add('hidden');
    
    // Hide all app sections
    hide(document.getElementById('admin-app'));
    hide(document.getElementById('leader-app'));
    hide(document.getElementById('invigilator-app'));
    
    // Show auth section
    show(document.getElementById('auth'));
    
    // Reset forms
    document.getElementById('role').value = 'admin';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Haptic feedback
    if (window.hapticFeedback) window.hapticFeedback('light');
}
