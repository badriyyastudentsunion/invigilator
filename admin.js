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
            showAlert('Invalid stage credentials', 'error');
            return;
        }

        setUser({ ...data, role: 'invigilator' });
        document.getElementById('btn-logout').classList.remove('hidden');
        hide(document.getElementById('auth'));
        show(document.getElementById('invigilator-app'));

        if (typeof renderInvigilatorApp === 'function') {
            renderInvigilatorApp(data.id, data.name);
        } else {
            showAlert('Invigilator interface not loaded', 'error');
        }
    }
}

/* Admin App Variables */
let currentAdminSection = 'dashboard';
let adminAllTeams = [];
let adminAllCategories = [];
let adminAllCompetitions = [];
let adminAllParticipants = [];
let adminAllUsers = [];
let adminAllStages = [];

// SVG Icons for Admin
const adminIcons = {
    dashboard: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>`,
    teams: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg>`,
    categories: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>`,
    competitions: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    participants: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>`,
    users: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg>`,
    stages: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>`,
    plus: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg>`,
    edit: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>`,
    delete: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`,
    upload: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>`
};

// Format templates for bulk import
const adminFormatTemplates = {
    teams: {
        format: 'name,password',
        example: `Team Alpha,password123
Team Beta,beta456
Team Gamma,gamma789`
    },
    participants: {
        format: 'name,team,category',
        example: `John Smith,Team Alpha,A ZONE
Sarah Jones,Team Alpha,B ZONE
Mike Wilson,Team Beta,A ZONE
Lisa Brown,Team Beta,C ZONE`
    },
    competitions: {
        format: 'name,category,max,is_stage,is_group,group_type,stage',
        example: `Elocution,A ZONE,3,true,false,,Stage 1
Essay Writing,A ZONE,2,false,false,,Stage 2
Debate,B ZONE,4,true,false,,Stage 1
Quiz,C ZONE,5,false,false,,Stage 3
Group Dance,MIX ZONE,8,true,true,group,Stage 2
Tableau,MIX ZONE,6,true,true,group,Stage 1`
    },
    users: {
        format: 'username,password,role,team',
        example: `leader1,pass123,leader,Team Alpha
leader2,pass456,leader,Team Beta
admin2,admin123,admin,`
    },
    stages: {
        format: 'name,password',
        example: `Stage 1,stage123
Stage 2,stage456
Stage 3,stage789`
    }
};

// Chess Number Generator for Admin
function assignAdminChessNumbers() {
    const sortedTeams = [...adminAllTeams].sort((a, b) => a.name.localeCompare(b.name));
    const teamBaseMap = {};
    
    sortedTeams.forEach((team, index) => {
        teamBaseMap[team.id] = (index + 1) * 100;
    });

    const teamCounters = {};
    adminAllParticipants.forEach(participant => {
        if (!teamCounters[participant.team_id]) {
            teamCounters[participant.team_id] = 0;
        }
        teamCounters[participant.team_id]++;
        participant.chess_number = teamBaseMap[participant.team_id] + teamCounters[participant.team_id];
    });
}

async function loadAdminData() {
    try {
        const [teamsRes, categoriesRes, competitionsRes, participantsRes, usersRes, stagesRes] = await Promise.all([
            db.from('teams').select('*').order('name'),
            db.from('categories').select('*').order('name'),
            // Try simpler query first
            db.from('competitions').select(`
                *,
                categories!inner(name),
                stages(name)
            `).order('name'),
            db.from('participants').select('*, teams(name), categories(name)').order('teams(name), name'),
            db.from('users').select('*, teams(name)').order('role, username'),
            db.from('stages').select('*').order('name')
        ]);

        // Log individual responses to debug
        console.log('Competition query result:', competitionsRes);
        
        adminAllTeams = teamsRes.data || [];
        adminAllCategories = categoriesRes.data || [];
        adminAllCompetitions = competitionsRes.data || [];
        adminAllParticipants = participantsRes.data || [];
        adminAllUsers = usersRes.data || [];
        adminAllStages = stagesRes.data || [];

    } catch (error) {
        console.error('Error loading admin data:', error);
        showAlert('Failed to load data', 'error');
    }
}


async function renderAdminApp() {
    await loadAdminData();
    assignAdminChessNumbers();
    
    const root = document.getElementById('admin-app');
    root.innerHTML = `
        <div class="flex h-screen bg-gray-100">
            <!-- Sidebar -->
            <div class="w-64 bg-white shadow-lg">
                <div class="p-6">
                    <h2 class="text-xl font-bold text-gray-800">Admin Panel</h2>
                </div>
                <nav class="mt-6">
                    ${renderAdminNav()}
                </nav>
            </div>
            <!-- Main Content -->
            <div class="flex-1 overflow-auto">
                <div class="p-6">
                    <div id="admin-content">
                        ${renderAdminContent()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAdminNav() {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: adminIcons.dashboard },
        { id: 'teams', label: 'Teams', icon: adminIcons.teams },
        { id: 'categories', label: 'Categories', icon: adminIcons.categories },
        { id: 'competitions', label: 'Competitions', icon: adminIcons.competitions },
        { id: 'participants', label: 'Participants', icon: adminIcons.participants },
        { id: 'users', label: 'Users', icon: adminIcons.users },
        { id: 'stages', label: 'Stages', icon: adminIcons.stages }
    ];

    return navItems.map(item => `
        <button onclick="switchAdminSection('${item.id}')" 
                class="w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${currentAdminSection === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-600'}">
            ${item.icon}
            <span class="ml-3">${item.label}</span>
        </button>
    `).join('');
}

function switchAdminSection(section) {
    currentAdminSection = section;
    document.getElementById('admin-content').innerHTML = renderAdminContent();
}

function renderAdminContent() {
    switch (currentAdminSection) {
        case 'dashboard':
            return renderAdminDashboard();
        case 'teams':
            return renderAdminTeams();
        case 'categories':
            return renderAdminCategories();
        case 'competitions':
            return renderAdminCompetitions();
        case 'participants':
            return renderAdminParticipants();
        case 'users':
            return renderAdminUsers();
        case 'stages':
            return renderAdminStages();
        default:
            return renderAdminDashboard();
    }
}

function renderAdminDashboard() {
    const totalTeams = adminAllTeams.length;
    const totalParticipants = adminAllParticipants.length;
    const totalCompetitions = adminAllCompetitions.length;
    const totalUsers = adminAllUsers.length;
    const totalStages = adminAllStages.length;

    return `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p class="text-gray-600">Overview of festival data</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-blue-100 rounded-lg">
                        ${adminIcons.teams}
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Teams</p>
                        <p class="text-2xl font-bold text-gray-900">${totalTeams}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-green-100 rounded-lg">
                        ${adminIcons.participants}
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Participants</p>
                        <p class="text-2xl font-bold text-gray-900">${totalParticipants}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-purple-100 rounded-lg">
                        ${adminIcons.competitions}
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Competitions</p>
                        <p class="text-2xl font-bold text-gray-900">${totalCompetitions}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-orange-100 rounded-lg">
                        ${adminIcons.users}
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Users</p>
                        <p class="text-2xl font-bold text-gray-900">${totalUsers}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center">
                    <div class="p-2 bg-red-100 rounded-lg">
                        ${adminIcons.stages}
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Stages</p>
                        <p class="text-2xl font-bold text-gray-900">${totalStages}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAdminTeams() {
    const headers = ['Name', 'Participants', 'Leaders', 'Actions'];
    
    let rows = '';
    if (adminAllTeams.length === 0) {
        rows = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No teams</td></tr>';
    } else {
        adminAllTeams.forEach(team => {
            const participantCount = adminAllParticipants.filter(p => p.team_id === team.id).length;
            const leaderCount = adminAllUsers.filter(u => u.team_id === team.id && u.role === 'leader').length;
            
            rows += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900">${team.name}</td>
                    <td class="px-6 py-4 text-gray-500">${participantCount}</td>
                    <td class="px-6 py-4 text-gray-500">${leaderCount}</td>
                    <td class="px-6 py-4">
                        <button onclick="editAdminTeam('${team.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                            ${adminIcons.edit}
                        </button>
                        <button onclick="deleteAdminTeam('${team.id}')" class="text-red-600 hover:text-red-900">
                            ${adminIcons.delete}
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    return `
        <div class="mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Teams</h2>
                    <p class="text-gray-600">Manage festival teams</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="showAdminBulkImport('teams')" class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        ${adminIcons.upload}
                        <span class="ml-2">Bulk Import</span>
                    </button>
                    <button onclick="addAdminTeam()" class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ${adminIcons.plus}
                        <span class="ml-2">Add Team</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function renderAdminStages() {
    const headers = ['Name', 'Password', 'Competitions', 'Actions'];
    
    let rows = '';
    if (adminAllStages.length === 0) {
        rows = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No stages</td></tr>';
    } else {
        adminAllStages.forEach(stage => {
            const competitionCount = adminAllCompetitions.filter(c => c.stage_id === stage.id).length;
            
            rows += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900">${stage.name}</td>
                    <td class="px-6 py-4 text-gray-500">${stage.password}</td>
                    <td class="px-6 py-4 text-gray-500">${competitionCount}</td>
                    <td class="px-6 py-4">
                        <button onclick="editAdminStage('${stage.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                            ${adminIcons.edit}
                        </button>
                        <button onclick="deleteAdminStage('${stage.id}')" class="text-red-600 hover:text-red-900">
                            ${adminIcons.delete}
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    return `
        <div class="mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Stages</h2>
                    <p class="text-gray-600">Manage competition stages for invigilators</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="showAdminBulkImport('stages')" class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        ${adminIcons.upload}
                        <span class="ml-2">Bulk Import</span>
                    </button>
                    <button onclick="addAdminStage()" class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ${adminIcons.plus}
                        <span class="ml-2">Add Stage</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function renderAdminCompetitions() {
    const headers = ['Name', 'Category', 'Type', 'Max Participants', 'Stage', 'Actions'];
    
    let rows = '';
    if (adminAllCompetitions.length === 0) {
        rows = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No competitions</td></tr>';
    } else {
        adminAllCompetitions.forEach(competition => {
            rows += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900">${competition.name}</td>
                    <td class="px-6 py-4 text-gray-500">${competition.categories ? competition.categories.name : 'Unknown'}</td>
                    <td class="px-6 py-4 text-gray-500">
                        ${competition.is_stage ? '🎭 Stage' : '📚 Non-Stage'} 
                        ${competition.is_group ? '👥 Group' : '👤 Individual'}
                    </td>
                    <td class="px-6 py-4 text-gray-500">${competition.max_participants_per_team}</td>
                    <td class="px-6 py-4 text-gray-500">${competition.stages ? competition.stages.name : 'Not Assigned'}</td>
                    <td class="px-6 py-4">
                        <button onclick="editAdminCompetition('${competition.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                            ${adminIcons.edit}
                        </button>
                        <button onclick="deleteAdminCompetition('${competition.id}')" class="text-red-600 hover:text-red-900">
                            ${adminIcons.delete}
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    return `
        <div class="mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Competitions</h2>
                    <p class="text-gray-600">Sorted by: A Zone (Stage → Non-Stage), B Zone (Stage → Non-Stage), etc.</p>
                    <p class="text-sm text-yellow-600">Note: Group competitions are only allowed in MIX ZONE</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="showAdminBulkImport('competitions')" class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        ${adminIcons.upload}
                        <span class="ml-2">Bulk Import</span>
                    </button>
                    <button onclick="addAdminCompetition()" class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ${adminIcons.plus}
                        <span class="ml-2">Add Competition</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function renderAdminCategories() {
    const headers = ['Name', 'Participants', 'Competitions'];
    
    let rows = '';
    adminAllCategories.forEach(category => {
        const participantCount = adminAllParticipants.filter(p => p.category_id === category.id).length;
        const competitionCount = adminAllCompetitions.filter(c => c.category_id === category.id).length;
        
        rows += `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${category.name}</td>
                <td class="px-6 py-4 text-gray-500">${participantCount}</td>
                <td class="px-6 py-4 text-gray-500">${competitionCount}</td>
            </tr>
        `;
    });

    return `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Categories</h2>
            <p class="text-gray-600">Categories are restricted to A–D and MIX ZONE</p>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function renderAdminParticipants() {
    const headers = ['Chess #', 'Name', 'Team', 'Category', 'Actions'];
    
    let rows = '';
    if (adminAllParticipants.length === 0) {
        rows = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No participants</td></tr>';
    } else {
        adminAllParticipants.forEach(participant => {
            rows += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-mono text-gray-900">${participant.chess_number || 'N/A'}</td>
                    <td class="px-6 py-4 font-medium text-gray-900">${participant.name}</td>
                    <td class="px-6 py-4 text-gray-500">${participant.teams ? participant.teams.name : 'No Team'}</td>
                    <td class="px-6 py-4 text-gray-500">${participant.categories ? participant.categories.name : 'No Category'}</td>
                    <td class="px-6 py-4">
                        <button onclick="editAdminParticipant('${participant.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                            ${adminIcons.edit}
                        </button>
                        <button onclick="deleteAdminParticipant('${participant.id}')" class="text-red-600 hover:text-red-900">
                            ${adminIcons.delete}
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    return `
        <div class="mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Participants</h2>
                    <p class="text-gray-600">Columns: team, name, category, chess_number</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="showAdminBulkImport('participants')" class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        ${adminIcons.upload}
                        <span class="ml-2">Bulk Import</span>
                    </button>
                    <button onclick="addAdminParticipant()" class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ${adminIcons.plus}
                        <span class="ml-2">Add Participant</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function renderAdminUsers() {
    const headers = ['Username', 'Role', 'Team', 'Actions'];
    
    let rows = '';
    if (adminAllUsers.length === 0) {
        rows = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No users</td></tr>';
    } else {
        adminAllUsers.forEach(user => {
            rows += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-medium text-gray-900">${user.username}</td>
                    <td class="px-6 py-4 text-gray-500">${user.role}</td>
                    <td class="px-6 py-4 text-gray-500">${user.teams ? user.teams.name : '-'}</td>
                    <td class="px-6 py-4">
                        <button onclick="editAdminUser('${user.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                            ${adminIcons.edit}
                        </button>
                        <button onclick="deleteAdminUser('${user.id}')" class="text-red-600 hover:text-red-900">
                            ${adminIcons.delete}
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    return `
        <div class="mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Users</h2>
                    <p class="text-gray-600">Manage system users</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="showAdminBulkImport('users')" class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        ${adminIcons.upload}
                        <span class="ml-2">Bulk Import</span>
                    </button>
                    <button onclick="addAdminUser()" class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ${adminIcons.plus}
                        <span class="ml-2">Add User</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Team Management Functions
async function addAdminTeam() {
    document.getElementById('adminModalTitle').textContent = 'Add Team';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminTeamForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                <input type="text" id="teamName" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter team name" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="text" id="teamPassword" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter password" required>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Team</button>
            </div>
        </form>
    `;
    
    document.getElementById('adminTeamForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('teamName').value.trim();
        const password = document.getElementById('teamPassword').value.trim();
        
        if (!name || !password) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('teams').insert({ name, password });
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Team name already exists', 'error');
                } else {
                    showAlert('Failed to add team', 'error');
                }
                return;
            }
            
            showAlert('Team added successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to add team', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function editAdminTeam(teamId) {
    const team = adminAllTeams.find(t => t.id === teamId);
    if (!team) return;
    
    document.getElementById('adminModalTitle').textContent = 'Edit Team';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminTeamForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                <input type="text" id="teamName" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value="${team.name}" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="text" id="teamPassword" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value="${team.password}" required>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Update Team</button>
            </div>
        </form>
    `;
    
    document.getElementById('adminTeamForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('teamName').value.trim();
        const password = document.getElementById('teamPassword').value.trim();
        
        if (!name || !password) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('teams')
                .update({ name, password })
                .eq('id', teamId);
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Team name already exists', 'error');
                } else {
                    showAlert('Failed to update team', 'error');
                }
                return;
            }
            
            showAlert('Team updated successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to update team', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function deleteAdminTeam(teamId) {
    if (!confirm('Are you sure you want to delete this team? All related data will also be deleted.')) {
        return;
    }
    
    try {
        const { error } = await db.from('teams').delete().eq('id', teamId);
        
        if (error) {
            showAlert('Failed to delete team', 'error');
            return;
        }
        
        showAlert('Team deleted successfully', 'success');
        renderAdminApp();
    } catch (error) {
        showAlert('Failed to delete team', 'error');
    }
}

// Stage Management Functions
async function addAdminStage() {
    document.getElementById('adminModalTitle').textContent = 'Add Stage';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminStageForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stage Name</label>
                <input type="text" id="stageName" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter stage name" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="text" id="stagePassword" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter password" required>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Stage</button>
            </div>
        </form>
    `;
    
    document.getElementById('adminStageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('stageName').value.trim();
        const password = document.getElementById('stagePassword').value.trim();
        
        if (!name || !password) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('stages').insert({ name, password });
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Stage name already exists', 'error');
                } else {
                    showAlert('Failed to add stage', 'error');
                }
                return;
            }
            
            showAlert('Stage added successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to add stage', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function editAdminStage(stageId) {
    const stage = adminAllStages.find(s => s.id === stageId);
    if (!stage) return;
    
    document.getElementById('adminModalTitle').textContent = 'Edit Stage';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminStageForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stage Name</label>
                <input type="text" id="stageName" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value="${stage.name}" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="text" id="stagePassword" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value="${stage.password}" required>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Update Stage</button>
            </div>
        </form>
    `;
    
    document.getElementById('adminStageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('stageName').value.trim();
        const password = document.getElementById('stagePassword').value.trim();
        
        if (!name || !password) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('stages')
                .update({ name, password })
                .eq('id', stageId);
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Stage name already exists', 'error');
                } else {
                    showAlert('Failed to update stage', 'error');
                }
                return;
            }
            
            showAlert('Stage updated successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to update stage', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function deleteAdminStage(stageId) {
    if (!confirm('Are you sure you want to delete this stage? All competitions assigned to this stage will be unassigned.')) {
        return;
    }
    
    try {
        const { error } = await db.from('stages').delete().eq('id', stageId);
        
        if (error) {
            showAlert('Failed to delete stage', 'error');
            return;
        }
        
        showAlert('Stage deleted successfully', 'success');
        renderAdminApp();
    } catch (error) {
        showAlert('Failed to delete stage', 'error');
    }
}

// Competition Management Functions
async function addAdminCompetition() {
    document.getElementById('adminModalTitle').textContent = 'Add Competition';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminCompetitionForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Competition Name</label>
                <input type="text" id="competitionName" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter competition name" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="competitionCategory" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select category</option>
                    ${adminAllCategories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select id="competitionStage" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                    <option value="">Select stage (optional)</option>
                    ${adminAllStages.map(stage => `<option value="${stage.id}">${stage.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max Participants per Team</label>
                <input type="number" id="competitionMax" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" min="1" max="10" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div class="space-y-3">
                    <div class="flex items-center">
                        <input type="radio" id="stageType" name="competitionType" value="stage" class="mr-2" checked>
                        <label for="stageType" class="text-sm text-gray-700">Stage Program</label>
                    </div>
                    <div class="flex items-center">
                        <input type="radio" id="nonStageType" name="competitionType" value="non-stage" class="mr-2">
                        <label for="nonStageType" class="text-sm text-gray-700">Non-Stage Program</label>
                    </div>
                </div>
            </div>
            <div id="groupOptions" class="hidden">
                <label class="block text-sm font-medium text-gray-700 mb-2">Participation Type</label>
                <div class="space-y-3">
                    <div class="flex items-center">
                        <input type="radio" id="individualType" name="participationType" value="individual" class="mr-2" checked>
                        <label for="individualType" class="text-sm text-gray-700">Individual</label>
                    </div>
                    <div class="flex items-center">
                        <input type="radio" id="groupType" name="participationType" value="group" class="mr-2">
                        <label for="groupType" class="text-sm text-gray-700">Group</label>
                    </div>
                </div>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Competition</button>
            </div>
        </form>
    `;
    
    // Show group options only for MIX ZONE
    document.getElementById('competitionCategory').addEventListener('change', function() {
        const selectedCategory = adminAllCategories.find(cat => cat.id === this.value);
        const groupOptions = document.getElementById('groupOptions');
        
        if (selectedCategory && selectedCategory.name === 'MIX ZONE') {
            groupOptions.classList.remove('hidden');
        } else {
            groupOptions.classList.add('hidden');
            document.getElementById('individualType').checked = true;
        }
    });
    
    document.getElementById('adminCompetitionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('competitionName').value.trim();
        const categoryId = document.getElementById('competitionCategory').value;
        const stageId = document.getElementById('competitionStage').value || null;
        const maxParticipants = parseInt(document.getElementById('competitionMax').value);
        const isStage = document.querySelector('input[name="competitionType"]:checked').value === 'stage';
        const isGroup = document.querySelector('input[name="participationType"]:checked').value === 'group';
        
        if (!name || !categoryId || !maxParticipants) {
            showAlert('Please fill all required fields', 'error');
            return;
        }
        
        const selectedCategory = adminAllCategories.find(cat => cat.id === categoryId);
        
        // Validate group competitions only in MIX ZONE
        if (isGroup && selectedCategory.name !== 'MIX ZONE') {
            showAlert('Group competitions are only allowed in MIX ZONE', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('competitions').insert({
                name,
                category_id: categoryId,
                stage_id: stageId,
                max_participants_per_team: maxParticipants,
                is_stage: isStage,
                is_group: isGroup,
                group_type: isGroup ? 'group' : 'individual'
            });
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Competition already exists in this category', 'error');
                } else {
                    showAlert('Failed to add competition', 'error');
                }
                return;
            }
            
            showAlert('Competition added successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to add competition', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function editAdminCompetition(competitionId) {
    const competition = adminAllCompetitions.find(c => c.id === competitionId);
    if (!competition) return;
    
    document.getElementById('adminModalTitle').textContent = 'Edit Competition';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminCompetitionForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Competition Name</label>
                <input type="text" id="competitionName" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value="${competition.name}" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="competitionCategory" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                    ${adminAllCategories.map(cat => `<option value="${cat.id}" ${cat.id === competition.category_id ? 'selected' : ''}>${cat.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select id="competitionStage" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                    <option value="">Select stage (optional)</option>
                    ${adminAllStages.map(stage => `<option value="${stage.id}" ${stage.id === competition.stage_id ? 'selected' : ''}>${stage.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max Participants per Team</label>
                <input type="number" id="competitionMax" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" min="1" max="10" value="${competition.max_participants_per_team}" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div class="space-y-3">
                    <div class="flex items-center">
                        <input type="radio" id="stageType" name="competitionType" value="stage" class="mr-2" ${competition.is_stage ? 'checked' : ''}>
                        <label for="stageType" class="text-sm text-gray-700">Stage Program</label>
                    </div>
                    <div class="flex items-center">
                        <input type="radio" id="nonStageType" name="competitionType" value="non-stage" class="mr-2" ${!competition.is_stage ? 'checked' : ''}>
                        <label for="nonStageType" class="text-sm text-gray-700">Non-Stage Program</label>
                    </div>
                </div>
            </div>
            <div id="groupOptions" class="${competition.categories && competition.categories.name === 'MIX ZONE' ? '' : 'hidden'}">
                <label class="block text-sm font-medium text-gray-700 mb-2">Participation Type</label>
                <div class="space-y-3">
                    <div class="flex items-center">
                        <input type="radio" id="individualType" name="participationType" value="individual" class="mr-2" ${!competition.is_group ? 'checked' : ''}>
                        <label for="individualType" class="text-sm text-gray-700">Individual</label>
                    </div>
                    <div class="flex items-center">
                        <input type="radio" id="groupType" name="participationType" value="group" class="mr-2" ${competition.is_group ? 'checked' : ''}>
                        <label for="groupType" class="text-sm text-gray-700">Group</label>
                    </div>
                </div>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Update Competition</button>
            </div>
        </form>
    `;
    
    // Show group options only for MIX ZONE
    document.getElementById('competitionCategory').addEventListener('change', function() {
        const selectedCategory = adminAllCategories.find(cat => cat.id === this.value);
        const groupOptions = document.getElementById('groupOptions');
        
        if (selectedCategory && selectedCategory.name === 'MIX ZONE') {
            groupOptions.classList.remove('hidden');
        } else {
            groupOptions.classList.add('hidden');
            document.getElementById('individualType').checked = true;
        }
    });
    
    document.getElementById('adminCompetitionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('competitionName').value.trim();
        const categoryId = document.getElementById('competitionCategory').value;
        const stageId = document.getElementById('competitionStage').value || null;
        const maxParticipants = parseInt(document.getElementById('competitionMax').value);
        const isStage = document.querySelector('input[name="competitionType"]:checked').value === 'stage';
        const isGroup = document.querySelector('input[name="participationType"]:checked').value === 'group';
        
        if (!name || !categoryId || !maxParticipants) {
            showAlert('Please fill all required fields', 'error');
            return;
        }
        
        const selectedCategory = adminAllCategories.find(cat => cat.id === categoryId);
        
        // Validate group competitions only in MIX ZONE
        if (isGroup && selectedCategory.name !== 'MIX ZONE') {
            showAlert('Group competitions are only allowed in MIX ZONE', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('competitions')
                .update({
                    name,
                    category_id: categoryId,
                    stage_id: stageId,
                    max_participants_per_team: maxParticipants,
                    is_stage: isStage,
                    is_group: isGroup,
                    group_type: isGroup ? 'group' : 'individual'
                })
                .eq('id', competitionId);
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Competition already exists in this category', 'error');
                } else {
                    showAlert('Failed to update competition', 'error');
                }
                return;
            }
            
            showAlert('Competition updated successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to update competition', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function deleteAdminCompetition(competitionId) {
    if (!confirm('Are you sure you want to delete this competition? All related assignments will also be deleted.')) {
        return;
    }
    
    try {
        const { error } = await db.from('competitions').delete().eq('id', competitionId);
        
        if (error) {
            showAlert('Failed to delete competition', 'error');
            return;
        }
        
        showAlert('Competition deleted successfully', 'success');
        renderAdminApp();
    } catch (error) {
        showAlert('Failed to delete competition', 'error');
    }
}

// Participant Management Functions
async function addAdminParticipant() {
    document.getElementById('adminModalTitle').textContent = 'Add Participant';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminParticipantForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" id="participantName" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter participant name" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Team</label>
                <select id="participantTeam" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select team</option>
                    ${adminAllTeams.map(team => `<option value="${team.id}">${team.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="participantCategory" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select category</option>
                    ${adminAllCategories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                </select>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Participant</button>
            </div>
        </form>
    `;
    
    document.getElementById('adminParticipantForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('participantName').value.trim();
        const teamId = document.getElementById('participantTeam').value;
        const categoryId = document.getElementById('participantCategory').value;
        
        if (!name || !teamId || !categoryId) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('participants').insert({
                name,
                team_id: teamId,
                category_id: categoryId
            });
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Participant already exists in this team and category', 'error');
                } else {
                    showAlert('Failed to add participant', 'error');
                }
                return;
            }
            
            showAlert('Participant added successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to add participant', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function editAdminParticipant(participantId) {
    const participant = adminAllParticipants.find(p => p.id === participantId);
    if (!participant) return;
    
    document.getElementById('adminModalTitle').textContent = 'Edit Participant';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminParticipantForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" id="participantName" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value="${participant.name}" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Team</label>
                <select id="participantTeam" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                    ${adminAllTeams.map(team => `<option value="${team.id}" ${team.id === participant.team_id ? 'selected' : ''}>${team.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="participantCategory" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                    ${adminAllCategories.map(cat => `<option value="${cat.id}" ${cat.id === participant.category_id ? 'selected' : ''}>${cat.name}</option>`).join('')}
                </select>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Update Participant</button>
            </div>
        </form>
    `;
    
    document.getElementById('adminParticipantForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('participantName').value.trim();
        const teamId = document.getElementById('participantTeam').value;
        const categoryId = document.getElementById('participantCategory').value;
        
        if (!name || !teamId || !categoryId) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('participants')
                .update({
                    name,
                    team_id: teamId,
                    category_id: categoryId
                })
                .eq('id', participantId);
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Participant already exists in this team and category', 'error');
                } else {
                    showAlert('Failed to update participant', 'error');
                }
                return;
            }
            
            showAlert('Participant updated successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to update participant', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function deleteAdminParticipant(participantId) {
    if (!confirm('Are you sure you want to delete this participant? All related assignments will also be deleted.')) {
        return;
    }
    
    try {
        const { error } = await db.from('participants').delete().eq('id', participantId);
        
        if (error) {
            showAlert('Failed to delete participant', 'error');
            return;
        }
        
        showAlert('Participant deleted successfully', 'success');
        renderAdminApp();
    } catch (error) {
        showAlert('Failed to delete participant', 'error');
    }
}

// User Management Functions
async function addAdminUser() {
    document.getElementById('adminModalTitle').textContent = 'Add User';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminUserForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input type="text" id="userUsername" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter username" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="text" id="userPassword" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter password" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select id="userRole" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="leader">Leader</option>
                </select>
            </div>
            <div id="teamSelector" class="hidden">
                <label class="block text-sm font-medium text-gray-700 mb-2">Team</label>
                <select id="userTeam" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                    <option value="">Select team</option>
                    ${adminAllTeams.map(team => `<option value="${team.id}">${team.name}</option>`).join('')}
                </select>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add User</button>
            </div>
        </form>
    `;
    
    document.getElementById('userRole').addEventListener('change', function() {
        const teamSelector = document.getElementById('teamSelector');
        if (this.value === 'leader') {
            teamSelector.classList.remove('hidden');
            document.getElementById('userTeam').required = true;
        } else {
            teamSelector.classList.add('hidden');
            document.getElementById('userTeam').required = false;
        }
    });
    
    document.getElementById('adminUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('userUsername').value.trim();
        const password = document.getElementById('userPassword').value.trim();
        const role = document.getElementById('userRole').value;
        const teamId = document.getElementById('userTeam').value || null;
        
        if (!username || !password || !role) {
            showAlert('Please fill all required fields', 'error');
            return;
        }
        
        if (role === 'leader' && !teamId) {
            showAlert('Please select a team for leader role', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('users').insert({
                username,
                password,
                role,
                team_id: teamId
            });
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Username already exists', 'error');
                } else {
                    showAlert('Failed to add user', 'error');
                }
                return;
            }
            
            showAlert('User added successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to add user', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function editAdminUser(userId) {
    const user = adminAllUsers.find(u => u.id === userId);
    if (!user) return;
    
    document.getElementById('adminModalTitle').textContent = 'Edit User';
    document.getElementById('adminModalContent').innerHTML = `
        <form id="adminUserForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input type="text" id="userUsername" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value="${user.username}" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="text" id="userPassword" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" value="${user.password}" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select id="userRole" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="leader" ${user.role === 'leader' ? 'selected' : ''}>Leader</option>
                </select>
            </div>
            <div id="teamSelector" class="${user.role === 'leader' ? '' : 'hidden'}">
                <label class="block text-sm font-medium text-gray-700 mb-2">Team</label>
                <select id="userTeam" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" ${user.role === 'leader' ? 'required' : ''}>
                    <option value="">Select team</option>
                    ${adminAllTeams.map(team => `<option value="${team.id}" ${team.id === user.team_id ? 'selected' : ''}>${team.name}</option>`).join('')}
                </select>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeAdminModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Update User</button>
            </div>
        </form>
    `;
    
    document.getElementById('userRole').addEventListener('change', function() {
        const teamSelector = document.getElementById('teamSelector');
        if (this.value === 'leader') {
            teamSelector.classList.remove('hidden');
            document.getElementById('userTeam').required = true;
        } else {
            teamSelector.classList.add('hidden');
            document.getElementById('userTeam').required = false;
        }
    });
    
    document.getElementById('adminUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('userUsername').value.trim();
        const password = document.getElementById('userPassword').value.trim();
        const role = document.getElementById('userRole').value;
        const teamId = document.getElementById('userTeam').value || null;
        
        if (!username || !password || !role) {
            showAlert('Please fill all required fields', 'error');
            return;
        }
        
        if (role === 'leader' && !teamId) {
            showAlert('Please select a team for leader role', 'error');
            return;
        }
        
        try {
            const { error } = await db.from('users')
                .update({
                    username,
                    password,
                    role,
                    team_id: teamId
                })
                .eq('id', userId);
            
            if (error) {
                if (error.code === '23505') {
                    showAlert('Username already exists', 'error');
                } else {
                    showAlert('Failed to update user', 'error');
                }
                return;
            }
            
            showAlert('User updated successfully', 'success');
            closeAdminModal();
            renderAdminApp();
        } catch (error) {
            showAlert('Failed to update user', 'error');
        }
    });
    
    document.getElementById('adminModal').classList.remove('hidden');
}

async function deleteAdminUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const { error } = await db.from('users').delete().eq('id', userId);
        
        if (error) {
            showAlert('Failed to delete user', 'error');
            return;
        }
        
        showAlert('User deleted successfully', 'success');
        renderAdminApp();
    } catch (error) {
        showAlert('Failed to delete user', 'error');
    }
}

// Bulk Import Functions
function showAdminBulkImport(type) {
    const template = adminFormatTemplates[type];
    if (!template) return;
    
    document.getElementById('adminBulkImportContent').innerHTML = `
        <div class="space-y-6">
            <div>
                <h4 class="text-lg font-medium text-gray-900 mb-2">Bulk Import ${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                <p class="text-sm text-gray-600">Import multiple ${type} at once using CSV format</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h5 class="font-medium text-gray-900 mb-2">Format: ${template.format}</h5>
                <pre class="text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">${template.example}</pre>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Paste CSV Data</label>
                <textarea id="bulkImportData" class="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Paste your CSV data here..."></textarea>
            </div>
            
            <div class="flex justify-end space-x-3">
                <button onclick="closeAdminBulkImportModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                <button onclick="processBulkImport('${type}')" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Import</button>
            </div>
        </div>
    `;
    
    document.getElementById('adminBulkImportModal').classList.remove('hidden');
}

async function processBulkImport(type) {
    const data = document.getElementById('bulkImportData').value.trim();
    
    if (!data) {
        showAlert('Please paste CSV data', 'error');
        return;
    }
    
    const lines = data.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
        showAlert('No data to import', 'error');
        return;
    }
    
    try {
        let insertData = [];
        
        for (const line of lines) {
            const values = line.split(',').map(v => v.trim());
            
            if (type === 'teams') {
                if (values.length >= 2) {
                    insertData.push({ name: values[0], password: values[1] });
                }
            } else if (type === 'stages') {
                if (values.length >= 2) {
                    insertData.push({ name: values[0], password: values[1] });
                }
            } else if (type === 'participants') {
                if (values.length >= 3) {
                    const team = adminAllTeams.find(t => t.name === values[1]);
                    const category = adminAllCategories.find(c => c.name === values[2]);
                    
                    if (team && category) {
                        insertData.push({
                            name: values[0],
                            team_id: team.id,
                            category_id: category.id
                        });
                    }
                }
            } else if (type === 'competitions') {
                if (values.length >= 6) {
                    const category = adminAllCategories.find(c => c.name === values[1]);
                    const stage = values[6] ? adminAllStages.find(s => s.name === values[6]) : null;
                    
                    if (category) {
                        insertData.push({
                            name: values[0],
                            category_id: category.id,
                            max_participants_per_team: parseInt(values[2]),
                            is_stage: values[3] === 'true',
                            is_group: values[4] === 'true',
                            group_type: values[5] || (values[4] === 'true' ? 'group' : 'individual'),
                            stage_id: stage?.id || null
                        });
                    }
                }
            } else if (type === 'users') {
                if (values.length >= 3) {
                    const team = values[3] ? adminAllTeams.find(t => t.name === values[3]) : null;
                    
                    insertData.push({
                        username: values[0],
                        password: values[1],
                        role: values[2],
                        team_id: team?.id || null
                    });
                }
            }
        }
        
        if (insertData.length === 0) {
            showAlert('No valid data to import', 'error');
            return;
        }
        
        const { error } = await db.from(type).insert(insertData);
        
        if (error) {
            showAlert(`Failed to import ${type}: ${error.message}`, 'error');
            return;
        }
        
        showAlert(`Successfully imported ${insertData.length} ${type}`, 'success');
        closeAdminBulkImportModal();
        renderAdminApp();
        
    } catch (error) {
        showAlert(`Failed to import ${type}`, 'error');
    }
}

// Utility functions
function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

function closeAdminBulkImportModal() {
    document.getElementById('adminBulkImportModal').classList.add('hidden');
}

function showAlert(message, type = 'info') {
    const modal = document.getElementById('alertModal');
    const icon = document.getElementById('alertIcon');
    const title = document.getElementById('alertTitle');
    const messageEl = document.getElementById('alertMessage');
    
    // Set icon and title based on type
    if (type === 'success') {
        icon.innerHTML = `<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
        title.textContent = 'Success';
    } else if (type === 'error') {
        icon.innerHTML = `<svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`;
        title.textContent = 'Error';
    } else {
        icon.innerHTML = `<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>`;
        title.textContent = 'Information';
    }
    
    messageEl.textContent = message;
    modal.classList.remove('hidden');
}
