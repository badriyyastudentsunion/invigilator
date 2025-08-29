// Supabase configuration
const supabaseUrl = 'https://aivaxrmytffpmkxgemom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdmF4cm15dGZmcG1reGdlbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Mjk2ODEsImV4cCI6MjA3MjAwNTY4MX0.FS4OhSiG4Z5g_lp0NNOlHSBj7DZivsGkFoR-qdqYlGk';
const db = supabase.createClient(supabaseUrl, supabaseKey);

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
        const competitionStartModal = document.getElementById('competitionStartModal');
        
        // Close leader modals
        const leaderModal = document.getElementById('leaderAssignModal');
        const leaderAlertModal = document.getElementById('leaderAlertModal');
        
        if (adminModal && !adminModal.classList.contains('hidden')) {
            closeAdminModal();
        }
        if (adminBulkModal && !adminBulkModal.classList.contains('hidden')) {
            closeAdminBulkImportModal();
        }
        if (alertModal && !alertModal.classList.contains('hidden')) {
            alertModal.classList.add('hidden');
        }
        if (competitionStartModal && !competitionStartModal.classList.contains('hidden')) {
            closeCompetitionStartModal();
        }
        if (leaderModal && !leaderModal.classList.contains('hidden')) {
            closeLeaderAssignModal();
        }
        if (leaderAlertModal && !leaderAlertModal.classList.contains('hidden')) {
            leaderAlertModal.classList.add('hidden');
        }
    }
});

// Login function
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
        hide(document.getElementById('auth'));
        show(document.getElementById('admin-app'));
        renderAdminApp();
        
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
        hide(document.getElementById('auth'));
        show(document.getElementById('leader-app'));
        renderLeaderApp(data.team_id);
        
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
        
        setUser({ id: data.id, username: data.name, role: 'invigilator', stage_id: data.id });
        document.getElementById('btn-logout').classList.remove('hidden');
        hide(document.getElementById('auth'));
        show(document.getElementById('invigilator-app'));
        renderInvigilatorApp(data.id);
    }
}

// Alert function
function showAlert(message, type = 'info') {
    const alertContent = document.getElementById('alertContent');
    const alertModal = document.getElementById('alertModal');
    
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-800';
    if (type === 'error') {
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
    } else if (type === 'success') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
    }
    
    alertContent.innerHTML = `<div class="p-3 rounded ${bgColor} ${textColor}">${message}</div>`;
    alertModal.classList.remove('hidden');
}

// Competition start modal functions
function closeCompetitionStartModal() {
    document.getElementById('competitionStartModal').classList.add('hidden');
}
