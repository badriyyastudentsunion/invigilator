// Database connection and global variables
let db = null;
let currentUser = null;

// Initialize Supabase
function initializeSupabase() {
    // Replace these with your actual Supabase credentials
    const SUPABASE_URL = 'https://nxxjjriywohylaybmbkk.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eGpqcml5d29oeWxheWJtYmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTIxODgsImV4cCI6MjA3MzM4ODE4OH0.N9yHU09APsKNZTtFaKCBGtoZGxAIIHil61niNv8aNZ0';
    
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded. Make sure the CDN is included.');
        showAlert('System initialization failed. Please refresh the page.', 'error');
        return false;
    }
    
    try {
        db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.db = db; // Make globally available
        console.log('Supabase initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        showAlert('Database connection failed. Please check your configuration.', 'error');
        return false;
    }
}

// User management functions
function setUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUserInfo();
}

function getUser() {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        try {
            currentUser = JSON.parse(stored);
            return currentUser;
        } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('currentUser');
        }
    }
    return null;
}

function clearUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

function updateUserInfo() {
    const userInfo = document.getElementById('user-info');
    if (userInfo && currentUser) {
        userInfo.textContent = `${currentUser.username} (${currentUser.role})`;
    }
}

// UI utility functions
function show(element) {
    if (element) element.classList.remove('hidden');
}

function hide(element) {
    if (element) element.classList.add('hidden');
}

function updateHeader(role, title) {
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) headerTitle.textContent = title;
    show(document.getElementById('header'));
}

function updateLogoutButton() {
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn && currentUser) {
        show(logoutBtn);
        logoutBtn.onclick = logout;
    }
}

// Alert system
function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const alertDiv = document.createElement('div');
    const bgColor = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'warning': 'bg-yellow-500',
        'info': 'bg-blue-500'
    }[type] || 'bg-blue-500';

    alertDiv.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg mb-2 max-w-sm animate-fade-in`;
    alertDiv.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="text-sm font-medium">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `;

    container.appendChild(alertDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

// Login function
async function login() {
    if (!db) {
        showAlert('Database not initialized. Please refresh the page.', 'error');
        return;
    }

    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!role || !username || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    try {
        if (role === 'admin') {
            const { data, error } = await db.from('users')
                .select('id, username, role')
                .eq('username', username)
                .eq('password', password)
                .eq('role', 'admin')
                .limit(1)
                .single();

            if (error || !data) {
                showAlert('Invalid admin credentials', 'error');
                return;
            }

            setUser({ ...data });
            updateLogoutButton();
            updateHeader('admin', 'Admin Panel');
            hide(document.getElementById('auth'));
            show(document.getElementById('admin-app'));

            if (typeof renderAdminApp === 'function') {
                await renderAdminApp();
            } else {
                console.error('renderAdminApp function not available');
                showAlert('Admin interface not loaded', 'error');
            }

        } else if (role === 'leader') {
            const { data, error } = await db.from('users')
                .select('id, username, role, team_id, teams(name)')
                .eq('username', username)
                .eq('password', password)
                .eq('role', 'leader')
                .limit(1)
                .single();

            if (error || !data) {
                showAlert('Invalid leader credentials', 'error');
                return;
            }

            setUser({ ...data });
            updateLogoutButton();
            updateHeader('leader', `Team Leader - ${data.teams?.name || 'No Team'}`);
            hide(document.getElementById('auth'));
            show(document.getElementById('leader-app'));

            if (typeof renderLeaderApp === 'function') {
                await renderLeaderApp();
            } else {
                console.error('renderLeaderApp function not available');
                showAlert('Leader interface not loaded', 'error');
            }

        } else if (role === 'judge') {
            const { data, error } = await db.from('users')
                .select('id, username, role')
                .eq('username', username)
                .eq('password', password)
                .eq('role', 'judge')
                .limit(1)
                .single();

            if (error || !data) {
                showAlert('Invalid judge credentials', 'error');
                return;
            }

            setUser({ ...data });
            updateLogoutButton();
            updateHeader('judge', 'Judge Panel');
            hide(document.getElementById('auth'));
            show(document.getElementById('judge-app'));

            if (typeof renderJudgeApp === 'function') {
                await renderJudgeApp();
            } else {
                console.error('renderJudgeApp function not available');
                showAlert('Judge interface not loaded', 'error');
            }

        } else if (role === 'announcer') {
            const { data, error } = await db.from('users')
                .select('id, username, role')
                .eq('username', username)
                .eq('password', password)
                .eq('role', 'announcer')
                .limit(1)
                .single();

            if (error || !data) {
                showAlert('Invalid announcer credentials', 'error');
                return;
            }

            setUser({ ...data });
            updateLogoutButton();
            updateHeader('announcer', 'Announcer Panel');
            hide(document.getElementById('auth'));
            show(document.getElementById('announcer-app'));

            if (typeof renderAnnouncerApp === 'function') {
                await renderAnnouncerApp();
            } else {
                console.error('renderAnnouncerApp function not available');
                showAlert('Announcer interface not loaded', 'error');
            }

        } else if (role === 'invigilator') {
            const { data, error } = await db.from('stages')
                .select('id, name')
                .eq('name', username)
                .eq('password', password)
                .limit(1)
                .single();

            if (error || !data) {
                showAlert('Invalid invigilator credentials', 'error');
                return;
            }

            setUser({ id: data.id, username: data.name, role: 'invigilator' });
            updateLogoutButton();
            updateHeader('invigilator', `Invigilator - ${data.name}`);
            hide(document.getElementById('auth'));
            show(document.getElementById('invigilator-app'));

            if (typeof renderInvigilatorApp === 'function') {
                await renderInvigilatorApp(data.id, data.name);
            } else {
                console.error('renderInvigilatorApp function not available');
                showAlert('Invigilator interface not loaded', 'error');
            }
        }

        showAlert('Login successful', 'success');

    } catch (error) {
        console.error('Login error:', error);
        showAlert('Login failed: ' + (error.message || 'Unknown error'), 'error');
    }
}

// Logout function
function logout() {
    try {
        // Hide all app containers
        const apps = ['admin-app', 'leader-app', 'judge-app', 'announcer-app', 'invigilator-app'];
        apps.forEach(appId => {
            const app = document.getElementById(appId);
            if (app) hide(app);
        });

        // Clear user data
        clearUser();

        // Reset UI
        hide(document.getElementById('header'));
        hide(document.getElementById('btn-logout'));
        show(document.getElementById('auth'));

        // Clear form
        const form = document.getElementById('loginForm');
        if (form) form.reset();

        showAlert('Logged out successfully', 'info');
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Error during logout', 'error');
    }
}

// Check for existing session on page load
async function checkExistingSession() {
    const user = getUser();
    if (user && db) {
        try {
            // Auto-login based on stored user
            switch (user.role) {
                case 'admin':
                    updateHeader('admin', 'Admin Panel');
                    hide(document.getElementById('auth'));
                    show(document.getElementById('admin-app'));
                    if (typeof renderAdminApp === 'function') await renderAdminApp();
                    break;
                case 'leader':
                    updateHeader('leader', `Team Leader - ${user.teams?.name || 'No Team'}`);
                    hide(document.getElementById('auth'));
                    show(document.getElementById('leader-app'));
                    if (typeof renderLeaderApp === 'function') await renderLeaderApp();
                    break;
                case 'judge':
                    updateHeader('judge', 'Judge Panel');
                    hide(document.getElementById('auth'));
                    show(document.getElementById('judge-app'));
                    if (typeof renderJudgeApp === 'function') await renderJudgeApp();
                    break;
                case 'announcer':
                    updateHeader('announcer', 'Announcer Panel');
                    hide(document.getElementById('auth'));
                    show(document.getElementById('announcer-app'));
                    if (typeof renderAnnouncerApp === 'function') await renderAnnouncerApp();
                    break;
                case 'invigilator':
                    updateHeader('invigilator', `Invigilator - ${user.username}`);
                    hide(document.getElementById('auth'));
                    show(document.getElementById('invigilator-app'));
                    if (typeof renderInvigilatorApp === 'function') await renderInvigilatorApp(user.id, user.username);
                    break;
            }
            updateLogoutButton();
        } catch (error) {
            console.error('Error restoring session:', error);
            clearUser();
            show(document.getElementById('auth'));
        }
    }
}

// Haptic feedback for mobile devices
function hapticFeedback(type = 'light') {
    if ('vibrate' in navigator) {
        switch (type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate(50);
                break;
            case 'success':
                navigator.vibrate([10, 50, 10]);
                break;
            case 'error':
                navigator.vibrate([50, 100, 50]);
                break;
        }
    }
}

// Network status monitoring
function monitorNetworkStatus() {
    const updateOnlineStatus = () => {
        if (!navigator.onLine) {
            showAlert('You are offline. Some features may not work properly.', 'warning');
        }
    };

    window.addEventListener('online', () => {
        showAlert('Connection restored', 'success');
    });

    window.addEventListener('offline', updateOnlineStatus);
    
    // Check initial status
    if (!navigator.onLine) {
        updateOnlineStatus();
    }
}

// Make functions globally available
window.hapticFeedback = hapticFeedback;
window.showAlert = showAlert;
window.getUser = getUser;
window.setUser = setUser;
window.clearUser = clearUser;
window.show = show;
window.hide = hide;
window.db = null; // Will be set by initializeSupabase

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded - Initializing app...');

    try {
        // Initialize Supabase first
        const supabaseInitialized = initializeSupabase();
        if (!supabaseInitialized) {
            console.error('Failed to initialize Supabase');
            return;
        }

        // Monitor network status
        monitorNetworkStatus();

        // Check for existing session
        await checkExistingSession();

        // Add login form handler
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                login();
            });
        }

        // Initialize service worker for PWA
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }

        console.log('App initialization completed successfully');

    } catch (error) {
        console.error('App initialization error:', error);
        showAlert('Failed to initialize application', 'error');
    } finally {
        // Hide loading screen
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading) hide(loading);
        }, 1000);
    }
});

// Handle app visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && currentUser) {
        // App became visible, check if user is still valid
        checkExistingSession();
    }
});

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .transition-all {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
