// Supabase configuration
const supabaseUrl = 'https://aivaxrmytffpmkxgemom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdmF4cm15dGZmcG1reGdlbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Mjk2ODEsImV4cCI6MjA3MjAwNTY4MX0.FS4OhSiG4Z5g_lp0NNOlHSBj7DZivsGkFoR-qdqYlGk';
const db = supabase.createClient(supabaseUrl, supabaseKey);

// Enhanced login function with better error handling
async function login() {
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        showAlert('Enter username and password', 'error');
        return;
    }

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
        document.getElementById('btn-logout').classList.remove('hidden');
        updateLogoutButton();
        updateHeader('admin', 'Admin Panel');
        hide(document.getElementById('auth'));
        show(document.getElementById('admin-app'));
        
        if (typeof renderAdminApp === 'function') {
            renderAdminApp();
        }

    } else if (role === 'leader') {
        const { data, error } = await db.from('users')
            .select('id, username, role, team_id')
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
        document.getElementById('btn-logout').classList.remove('hidden');
        updateLogoutButton();
        updateHeader('leader', 'Team Leader');
        hide(document.getElementById('auth'));
        show(document.getElementById('leader-app'));

        if (typeof renderLeaderApp === 'function') {
            renderLeaderApp(data.team_id);
        } else {
            showAlert('Leader interface not loaded', 'error');
        }

    } else if (role === 'invigilator') {
        const { data, error } = await db.from('stages')
            .select('id, name, password')
            .eq('name', username)
            .eq('password', password)
            .limit(1)
            .single();

        if (error || !data) {
            showAlert('Invalid invigilator credentials', 'error');
            return;
        }

        setUser({ ...data, role: 'invigilator' });
        document.getElementById('btn-logout').classList.remove('hidden');
        updateLogoutButton();
        updateHeader('invigilator'); // No title text
        hide(document.getElementById('auth'));
        show(document.getElementById('invigilator-app'));

        if (typeof renderInvigilatorApp === 'function') {
            renderInvigilatorApp(data.id, data.name);
        } else {
            console.error('renderInvigilatorApp function not available');
            showAlert('Invigilator interface not loaded', 'error');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();

    // Add logout event listener
    document.getElementById('btn-logout').addEventListener('click', logout);

    // Add login form event listener
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        // Close admin modals
        const adminModal = document.getElementById('adminModal');
        const adminBulkModal = document.getElementById('adminBulkImportModal');
        const alertModal = document.getElementById('alertModal');

        // Close leader modals
        const leaderModal = document.getElementById('leaderAssignModal');
        const leaderAlertModal = document.getElementById('leaderAlertModal');
        
        // Close invigilator modals
        const qrModal = document.getElementById('qrModal');
        const qrScannerModal = document.getElementById('qrScannerModal');

        if (adminModal && !adminModal.classList.contains('hidden')) {
            if (typeof closeAdminModal === 'function') closeAdminModal();
        }
        if (adminBulkModal && !adminBulkModal.classList.contains('hidden')) {
            if (typeof closeAdminBulkImportModal === 'function') closeAdminBulkImportModal();
        }
        if (alertModal && !alertModal.classList.contains('hidden')) {
            alertModal.classList.add('hidden');
        }
        if (leaderModal && !leaderModal.classList.contains('hidden')) {
            if (typeof closeLeaderAssignModal === 'function') closeLeaderAssignModal();
        }
        if (leaderAlertModal && !leaderAlertModal.classList.contains('hidden')) {
            leaderAlertModal.classList.add('hidden');
        }
        if (qrModal && !qrModal.classList.contains('hidden')) {
            if (typeof closeQRModal === 'function') closeQRModal();
        }
        if (qrScannerModal && !qrScannerModal.classList.contains('hidden')) {
            if (typeof stopDirectScanning === 'function') stopDirectScanning();
        }
    }
});
