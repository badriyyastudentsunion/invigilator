/* Admin App Variables */
let currentAdminSection = 'dashboard';
let adminAllTeams = [];
let adminAllCategories = [];
let adminAllCompetitions = [];
let adminAllParticipants = [];
let adminAllUsers = [];
let adminAllStages = [];
let adminAllJudges = [];
let adminAllAnnouncers = [];
let adminAllJudgeAssignments = [];
let adminAllAnnouncerAssignments = [];
let adminAllResults = [];
let adminAllGroupResults = [];
let adminAllCompetitionSessions = [];
let adminAllAnnouncements = [];

// SVG Icons for Admin
const adminIcons = {
    dashboard: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm0 0V9a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"></path></svg>`,
    teams: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`,
    categories: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>`,
    competitions: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>`,
    participants: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v1a6 6 0 01-3-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
    users: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`,
    stages: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3z"></path></svg>`,
    judges: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`,
    announcers: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>`,
    results: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`,
    trophy: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`,
    plus: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`,
    edit: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>`,
    delete: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`,
    upload: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>`,
    assign: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
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
        format: 'name,category,max,is_stage,is_group,stage',
        example: `Elocution,A ZONE,3,true,false,Stage 1
Essay Writing,A ZONE,2,false,false,
Debate,B ZONE,4,true,false,Stage 1
Quiz,C ZONE,5,false,false,
Group Dance,MIX ZONE,8,true,true,Stage 2
Tableau,MIX ZONE,6,true,true,Stage 1`
    },
    users: {
        format: 'username,password,role,team',
        example: `leader1,pass123,leader,Team Alpha
leader2,pass456,leader,Team Beta
admin2,admin123,admin,`
    },
    judges: {
        format: 'username,password',
        example: `judge1,judge123
judge2,judge456
judge3,judge789`
    },
    announcers: {
        format: 'username,password',
        example: `announcer1,ann123
announcer2,ann456
announcer3,ann789`
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
        const [
            teamsRes, categoriesRes, competitionsRes, participantsRes, 
            usersRes, stagesRes, judgeAssignRes, announcerAssignRes,
            resultsRes, groupResultsRes, sessionsRes, announcementsRes
        ] = await Promise.all([
            window.db.from('teams').select('*').order('name'),
            window.db.from('categories').select('*').order('name'),
            window.db.from('competitions').select(`
                *,
                categories!inner(name),
                stages(name)
            `).order('name'),
            window.db.from('participants').select('*, teams(name), categories(name)').order('teams(name), name'),
            window.db.from('users').select('*, teams(name)').order('role, username'),
            window.db.from('stages').select('*').order('name'),
            window.db.from('judge_assignments').select(`
                *,
                users!inner(username),
                competitions!inner(name, categories(name))
            `),
            window.db.from('announcer_assignments').select(`
                *,
                users!inner(username),
                competitions!inner(name, categories(name))
            `),
            window.db.from('competition_results').select(`
                *,
                participants(name, teams(name)),
                competitions(name, is_stage, is_group, categories(name)),
                users(username)
            `).order('marks', { ascending: false }),
            window.db.from('group_results').select(`
                *,
                teams(name),
                competitions(name, is_stage, is_group, categories(name)),
                users(username)
            `).order('marks', { ascending: false }),
            window.db.from('competition_sessions').select('*'),
            window.db.from('announcements').select('*')
        ]);

        adminAllTeams = teamsRes.data || [];
        adminAllCategories = categoriesRes.data || [];
        adminAllCompetitions = competitionsRes.data || [];
        adminAllParticipants = participantsRes.data || [];
        adminAllUsers = usersRes.data || [];
        adminAllStages = stagesRes.data || [];
        adminAllJudges = adminAllUsers.filter(u => u.role === 'judge');
        adminAllAnnouncers = adminAllUsers.filter(u => u.role === 'announcer');
        adminAllJudgeAssignments = judgeAssignRes.data || [];
        adminAllAnnouncerAssignments = announcerAssignRes.data || [];
        adminAllResults = resultsRes.data || [];
        adminAllGroupResults = groupResultsRes.data || [];
        adminAllCompetitionSessions = sessionsRes.data || [];
        adminAllAnnouncements = announcementsRes.data || [];

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
        <div class="max-w-7xl mx-auto p-6">
            <!-- Left Navigation -->
            <div class="flex gap-6">
                <nav class="w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
                    <h3 class="font-medium text-gray-900 mb-4">Admin Panel</h3>
                    <div class="space-y-2">
                        ${renderAdminNavItem('dashboard', 'Dashboard', adminIcons.dashboard)}
                        ${renderAdminNavItem('teams', 'Teams', adminIcons.teams)}
                        ${renderAdminNavItem('categories', 'Categories', adminIcons.categories)}
                        ${renderAdminNavItem('competitions', 'Competitions', adminIcons.competitions)}
                        ${renderAdminNavItem('participants', 'Participants', adminIcons.participants)}
                        ${renderAdminNavItem('users', 'Users', adminIcons.users)}
                        ${renderAdminNavItem('judges', 'Judges', adminIcons.judges)}
                        ${renderAdminNavItem('announcers', 'Announcers', adminIcons.announcers)}
                        ${renderAdminNavItem('stages', 'Stages', adminIcons.stages)}
                        ${renderAdminNavItem('results', 'Results', adminIcons.results)}
                    </div>
                </nav>

                <!-- Main Content -->
                <div class="flex-1">
                    ${renderAdminMainContent()}
                </div>
            </div>
        </div>

        <!-- Admin Modals -->
        <div id="adminModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div id="adminModalContent"></div>
            </div>
        </div>

        <div id="adminBulkImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div id="adminBulkImportContent"></div>
            </div>
        </div>

        <div id="adminAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div id="adminAssignContent"></div>
            </div>
        </div>
    `;
}

function renderAdminNavItem(section, label, icon) {
    const isActive = currentAdminSection === section;
    return `
        <button 
            onclick="switchAdminSection('${section}')"
            class="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
            }">
            ${icon}
            <span>${label}</span>
        </button>
    `;
}

function renderAdminMainContent() {
    if (currentAdminSection === 'dashboard') {
        return renderAdminDashboard();
    } else if (currentAdminSection === 'teams') {
        return renderAdminTeams();
    } else if (currentAdminSection === 'categories') {
        return renderAdminCategories();
    } else if (currentAdminSection === 'competitions') {
        return renderAdminCompetitions();
    } else if (currentAdminSection === 'participants') {
        return renderAdminParticipants();
    } else if (currentAdminSection === 'users') {
        return renderAdminUsers();
    } else if (currentAdminSection === 'judges') {
        return renderAdminJudges();
    } else if (currentAdminSection === 'announcers') {
        return renderAdminAnnouncers();
    } else if (currentAdminSection === 'stages') {
        return renderAdminStages();
    } else if (currentAdminSection === 'results') {
        return renderAdminResults();
    } else {
        return renderAdminDashboard();
    }
}

function renderAdminDashboard() {
    const totalTeams = adminAllTeams.length;
    const totalParticipants = adminAllParticipants.length;
    const totalCompetitions = adminAllCompetitions.length;
    const totalUsers = adminAllUsers.length;
    const totalStages = adminAllStages.length;
    const totalJudges = adminAllJudges.length;
    const totalAnnouncers = adminAllAnnouncers.length;
    
    // Calculate competition statuses
    const invigilatorCompleted = [...new Set(adminAllCompetitionSessions.map(s => s.competition_id))].length;
    const invigilatorNotCompleted = totalCompetitions - invigilatorCompleted;
    
    const judgementCompleted = [...new Set([...adminAllResults.map(r => r.competition_id), ...adminAllGroupResults.map(r => r.competition_id)])].length;
    const judgementNotCompleted = totalCompetitions - judgementCompleted;
    
    const announcedCompetitions = [...new Set(adminAllAnnouncements.map(a => a.competition_id))].length;
    const nonAnnounced = totalCompetitions - announcedCompetitions;

    return `
        <div class="space-y-6">
            <!-- Main Statistics -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Festival Dashboard</h2>
                <p class="text-gray-600 mb-6">Complete overview of festival management</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-blue-50 rounded-lg p-4">
                        <div class="flex items-center">
                            ${adminIcons.teams}
                            <div class="ml-3">
                                <p class="text-sm font-medium text-blue-600">Total Teams</p>
                                <p class="text-2xl font-bold text-blue-900">${totalTeams}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 rounded-lg p-4">
                        <div class="flex items-center">
                            ${adminIcons.participants}
                            <div class="ml-3">
                                <p class="text-sm font-medium text-green-600">Total Participants</p>
                                <p class="text-2xl font-bold text-green-900">${totalParticipants}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-purple-50 rounded-lg p-4">
                        <div class="flex items-center">
                            ${adminIcons.competitions}
                            <div class="ml-3">
                                <p class="text-sm font-medium text-purple-600">Total Competitions</p>
                                <p class="text-2xl font-bold text-purple-900">${totalCompetitions}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-indigo-50 rounded-lg p-4">
                        <div class="flex items-center">
                            ${adminIcons.judges}
                            <div class="ml-3">
                                <p class="text-sm font-medium text-indigo-600">Total Judges</p>
                                <p class="text-2xl font-bold text-indigo-900">${totalJudges}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Competition Status Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Invigilator Status -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Invigilator Status</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Completed</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ${invigilatorCompleted}
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Not Completed</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ${invigilatorNotCompleted}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Judgement Status -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Judgement Status</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Completed</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ${judgementCompleted}
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Not Completed</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ${judgementNotCompleted}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Announcer Status -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Announcer Status</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Announced</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ${announcedCompetitions}
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Not Announced</span>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ${nonAnnounced}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Manual Chess Number Entry -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Manual Chess Number Entry</h3>
                <div class="flex items-end space-x-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select Participant</label>
                        <select id="participantSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Select a participant...</option>
                            ${adminAllParticipants.map(participant => `
                                <option value="${participant.id}">${participant.name} (${participant.teams?.name || 'No Team'})</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Chess Number</label>
                        <input type="number" id="chessNumberInput" placeholder="101" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button onclick="assignManualChessNumber()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Assign
                    </button>
                </div>
            </div>

            <!-- Team Points Status -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Team Points Status (Based on Announced Results)</h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Points</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${calculateTeamPointsStatus().map((team, index) => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                            index === 1 ? 'bg-gray-100 text-gray-800' :
                                            index === 2 ? 'bg-orange-100 text-orange-800' :
                                            'bg-blue-100 text-blue-800'
                                        }">
                                            ${index + 1}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${team.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-lg font-bold text-green-600">${team.totalPoints}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-600">${team.participants}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function calculateTeamPointsStatus() {
    const teamScoreMap = new Map();
    
    // Initialize teams
    adminAllTeams.forEach(team => {
        teamScoreMap.set(team.id, {
            id: team.id,
            name: team.name,
            totalPoints: 0,
            participants: adminAllParticipants.filter(p => p.team_id === team.id).length
        });
    });
    
    // Add individual competition points (only from announced competitions)
    const announcedCompetitionIds = new Set(adminAllAnnouncements.map(a => a.competition_id));
    
    adminAllResults.forEach(result => {
        if (result.team_id && teamScoreMap.has(result.team_id) && announcedCompetitionIds.has(result.competition_id)) {
            const team = teamScoreMap.get(result.team_id);
            team.totalPoints += result.points || 0;
        }
    });
    
    // Add group competition points (only from announced competitions)
    adminAllGroupResults.forEach(result => {
        if (result.team_id && teamScoreMap.has(result.team_id) && announcedCompetitionIds.has(result.competition_id)) {
            const team = teamScoreMap.get(result.team_id);
            team.totalPoints += result.points || 0;
        }
    });
    
    return Array.from(teamScoreMap.values())
        .sort((a, b) => b.totalPoints - a.totalPoints);
}

function renderAdminTeams() {
    const teams = adminAllTeams;
    const headers = ['Name', 'Password', 'Participants', 'Actions'];
    
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Manage Teams</h2>
                        <p class="text-gray-600">Festival teams participating in competitions</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="openAdminBulkImport('teams')" class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            ${adminIcons.upload}
                            <span>Bulk Import</span>
                        </button>
                        <button onclick="openAdminModal('team', 'add')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${adminIcons.plus}
                            <span>Add Team</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${teams.length === 0 ? `
                            <tr>
                                <td colspan="${headers.length}" class="px-6 py-8 text-center text-gray-500">
                                    <div class="text-gray-400 mb-2">${adminIcons.teams}</div>
                                    No teams created yet
                                </td>
                            </tr>
                        ` : teams.map(team => {
                            const participantCount = adminAllParticipants.filter(p => p.team_id === team.id).length;
                            return `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${team.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600">${team.password}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-600">${participantCount}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <button onclick="openAdminModal('team', 'edit', '${team.id}')" class="text-yellow-600 hover:bg-yellow-50 p-1 rounded">
                                                ${adminIcons.edit}
                                            </button>
                                            <button onclick="deleteAdminItem('teams', '${team.id}')" class="text-red-600 hover:bg-red-50 p-1 rounded">
                                                ${adminIcons.delete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminCategories() {
    const categories = adminAllCategories;
    const headers = ['Category Name', 'Competitions', 'Actions'];
    
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Manage Categories</h2>
                        <p class="text-gray-600">Categories are restricted to A–D and MIX ZONE</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="openAdminModal('category', 'add')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${adminIcons.plus}
                            <span>Add Category</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${categories.map(category => {
                            const competitionCount = adminAllCompetitions.filter(c => c.category_id === category.id).length;
                            return `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${category.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-600">${competitionCount} competitions</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <button onclick="openAdminModal('category', 'edit', '${category.id}')" class="text-yellow-600 hover:bg-yellow-50 p-1 rounded">
                                                ${adminIcons.edit}
                                            </button>
                                            <button onclick="deleteAdminItem('categories', '${category.id}')" class="text-red-600 hover:bg-red-50 p-1 rounded">
                                                ${adminIcons.delete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminCompetitions() {
    const competitions = adminAllCompetitions;
    const headers = ['Competition Name', 'Category', 'Type', 'Stage', 'Judge', 'Announcer', 'Actions'];
    
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Manage Competitions</h2>
                        <p class="text-gray-600">Assign stages, judges, and announcers to competitions</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="openAdminBulkImport('competitions')" class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            ${adminIcons.upload}
                            <span>Bulk Import</span>
                        </button>
                        <button onclick="openAdminModal('competition', 'add')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${adminIcons.plus}
                            <span>Add Competition</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${competitions.map(competition => {
                            const judge = adminAllJudgeAssignments.find(a => a.competition_id === competition.id);
                            const announcer = adminAllAnnouncerAssignments.find(a => a.competition_id === competition.id);
                            
                            return `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${competition.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-600">${competition.categories?.name || 'N/A'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-wrap gap-1">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${competition.is_stage ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                                                ${competition.is_stage ? 'Stage' : 'Non-Stage'}
                                            </span>
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${competition.is_group ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">
                                                ${competition.is_group ? 'Group' : 'Individual'}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${competition.stages?.name ? `
                                            <span class="text-gray-900">${competition.stages.name}</span>
                                        ` : `
                                            <button onclick="openAssignModal('stage', '${competition.id}')" 
                                                    class="text-blue-600 hover:text-blue-800 text-sm">
                                                Assign Stage
                                            </button>
                                        `}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${judge ? `
                                            <span class="text-gray-900">${judge.users?.username}</span>
                                        ` : `
                                            <button onclick="openAssignModal('judge', '${competition.id}')" 
                                                    class="text-blue-600 hover:text-blue-800 text-sm">
                                                Assign Judge
                                            </button>
                                        `}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        ${announcer ? `
                                            <span class="text-gray-900">${announcer.users?.username}</span>
                                        ` : `
                                            <button onclick="openAssignModal('announcer', '${competition.id}')" 
                                                    class="text-blue-600 hover:text-blue-800 text-sm">
                                                Assign Announcer
                                            </button>
                                        `}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <button onclick="openAdminModal('competition', 'edit', '${competition.id}')" class="text-yellow-600 hover:bg-yellow-50 p-1 rounded">
                                                ${adminIcons.edit}
                                            </button>
                                            <button onclick="deleteAdminItem('competitions', '${competition.id}')" class="text-red-600 hover:bg-red-50 p-1 rounded">
                                                ${adminIcons.delete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminParticipants() {
    const participants = adminAllParticipants;
    const headers = ['Chess #', 'Name', 'Team', 'Category', 'Actions'];
    
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Manage Participants</h2>
                        <p class="text-gray-600">Columns: team, name, category, chess_number</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="openAdminBulkImport('participants')" class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            ${adminIcons.upload}
                            <span>Bulk Import</span>
                        </button>
                        <button onclick="openAdminModal('participant', 'add')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${adminIcons.plus}
                            <span>Add Participant</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${participants.map(participant => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">${participant.chess_number || 'N/A'}</td>
                                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${participant.name}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${participant.teams?.name || 'N/A'}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${participant.categories?.name || 'N/A'}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button onclick="openAdminModal('participant', 'edit', '${participant.id}')" class="text-yellow-600 hover:bg-yellow-50 p-1 rounded">
                                            ${adminIcons.edit}
                                        </button>
                                        <button onclick="deleteAdminItem('participants', '${participant.id}')" class="text-red-600 hover:bg-red-50 p-1 rounded">
                                            ${adminIcons.delete}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminUsers() {
    const users = adminAllUsers.filter(u => u.role !== 'judge' && u.role !== 'announcer');
    const headers = ['Username', 'Role', 'Team', 'Actions'];
    
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Manage System Users</h2>
                        <p class="text-gray-600">System users (admins and leaders)</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="openAdminBulkImport('users')" class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            ${adminIcons.upload}
                            <span>Bulk Import</span>
                        </button>
                        <button onclick="openAdminModal('user', 'add')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${adminIcons.plus}
                            <span>Add User</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${users.map(user => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${user.username}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                        user.role === 'leader' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }">
                                        ${user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${user.teams?.name || 'N/A'}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button onclick="openAdminModal('user', 'edit', '${user.id}')" class="text-yellow-600 hover:bg-yellow-50 p-1 rounded">
                                            ${adminIcons.edit}
                                        </button>
                                        <button onclick="deleteAdminItem('users', '${user.id}')" class="text-red-600 hover:bg-red-50 p-1 rounded">
                                            ${adminIcons.delete}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminJudges() {
    const judges = adminAllJudges;
    const headers = ['Username', 'Assigned Competitions', 'Actions'];
    
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Manage Judges</h2>
                        <p class="text-gray-600">Judges evaluate competition performances</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="openAdminBulkImport('judges')" class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            ${adminIcons.upload}
                            <span>Bulk Import</span>
                        </button>
                        <button onclick="openAdminModal('judge', 'add')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${adminIcons.plus}
                            <span>Add Judge</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${judges.length === 0 ? `
                            <tr>
                                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                                    <div class="text-gray-400 mb-2">${adminIcons.judges}</div>
                                    No judges created yet
                                </td>
                            </tr>
                        ` : judges.map(judge => {
                            const assignments = adminAllJudgeAssignments.filter(a => a.judge_id === judge.id);
                            return `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${judge.username}</td>
                                    <td class="px-6 py-4">
                                        ${assignments.length > 0 ? `
                                            <div class="space-y-1">
                                                ${assignments.map(a => `
                                                    <div class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                                        ${a.competitions?.name || 'Unknown'} (${a.competitions?.categories?.name || 'Unknown'})
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : `
                                            <span class="text-gray-400 text-sm">No assignments</span>
                                        `}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <button onclick="openJudgeAssignModal('${judge.id}', '${judge.username}')" class="inline-flex items-center px-3 py-1 border border-blue-300 text-blue-700 bg-blue-50 rounded text-sm hover:bg-blue-100">
                                                ${adminIcons.assign}
                                                <span class="ml-1">Assign</span>
                                            </button>
                                            <button onclick="openAdminModal('judge', 'edit', '${judge.id}')" class="text-yellow-600 hover:bg-yellow-50 p-1 rounded">
                                                ${adminIcons.edit}
                                            </button>
                                            <button onclick="deleteAdminItem('users', '${judge.id}')" class="text-red-600 hover:bg-red-50 p-1 rounded">
                                                ${adminIcons.delete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminAnnouncers() {
    const announcers = adminAllAnnouncers;
    const headers = ['Username', 'Assigned Competitions', 'Actions'];
    
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Manage Announcers</h2>
                        <p class="text-gray-600">Announcers announce competition results</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="openAdminBulkImport('announcers')" class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            ${adminIcons.upload}
                            <span>Bulk Import</span>
                        </button>
                        <button onclick="openAdminModal('announcer', 'add')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${adminIcons.plus}
                            <span>Add Announcer</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${announcers.length === 0 ? `
                            <tr>
                                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                                    <div class="text-gray-400 mb-2">${adminIcons.announcers}</div>
                                    No announcers created yet
                                </td>
                            </tr>
                        ` : announcers.map(announcer => {
                            const assignments = adminAllAnnouncerAssignments.filter(a => a.announcer_id === announcer.id);
                            return `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${announcer.username}</td>
                                    <td class="px-6 py-4">
                                        ${assignments.length > 0 ? `
                                            <div class="space-y-1">
                                                ${assignments.map(a => `
                                                    <div class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                                        ${a.competitions?.name || 'Unknown'}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : `
                                            <span class="text-gray-400 text-sm">No assignments</span>
                                        `}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <button onclick="openAnnouncerAssignModal('${announcer.id}', '${announcer.username}')" class="inline-flex items-center px-3 py-1 border border-purple-300 text-purple-700 bg-purple-50 rounded text-sm hover:bg-purple-100">
                                                ${adminIcons.assign}
                                                <span class="ml-1">Assign</span>
                                            </button>
                                            <button onclick="openAdminModal('announcer', 'edit', '${announcer.id}')" class="text-yellow-600 hover:bg-yellow-50 p-1 rounded">
                                                ${adminIcons.edit}
                                            </button>
                                            <button onclick="deleteAdminItem('users', '${announcer.id}')" class="text-red-600 hover:bg-red-50 p-1 rounded">
                                                ${adminIcons.delete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminStages() {
    const stages = adminAllStages;
    const headers = ['Stage Name', 'Password', 'Competitions', 'Actions'];
    
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Manage Competition Stages</h2>
                        <p class="text-gray-600">Manage competition stages for invigilators</p>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="openAdminBulkImport('stages')" class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            ${adminIcons.upload}
                            <span>Bulk Import</span>
                        </button>
                        <button onclick="openAdminModal('stage', 'add')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${adminIcons.plus}
                            <span>Add Stage</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            ${headers.map(header => `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${stages.map(stage => {
                            const competitionCount = adminAllCompetitions.filter(c => c.stage_id === stage.id).length;
                            return `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${stage.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600">${stage.password}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-gray-600">${competitionCount} competitions</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex space-x-2">
                                            <button onclick="openAdminModal('stage', 'edit', '${stage.id}')" class="text-yellow-600 hover:bg-yellow-50 p-1 rounded">
                                                ${adminIcons.edit}
                                            </button>
                                            <button onclick="deleteAdminItem('stages', '${stage.id}')" class="text-red-600 hover:bg-red-50 p-1 rounded">
                                                ${adminIcons.delete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminResults() {
    // Calculate team scores and individual achievers
    const teamScores = calculateTeamScores();
    const kalaprathipa = calculateKalaprathipa(); // Top individual in stage competitions
    const sargaprathipa = calculateSargaprathipa(); // Top individual in non-stage competitions
    
    return `
        <div class="space-y-6">
            <!-- Overall Results -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold text-gray-900">Festival Results</h2>
                    <p class="text-gray-600">Competition results and team rankings</p>
                </div>
                
                <!-- Special Achievers -->
                <div class="p-6 border-b bg-gradient-to-r from-yellow-50 to-orange-50">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Special Achievers</h3>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                            <h4 class="font-medium text-yellow-600 mb-2 flex items-center">
                                ${adminIcons.trophy}
                                <span class="ml-2">🏆 Kalaprathipa</span>
                            </h4>
                            <p class="text-sm text-gray-600 mb-2">Top individual achiever in stage competitions</p>
                            ${kalaprathipa ? `
                                <div class="font-medium text-gray-900">${kalaprathipa.name}</div>
                                <div class="text-sm text-gray-600">${kalaprathipa.team} • ${kalaprathipa.points} points</div>
                            ` : `
                                <div class="text-gray-500 italic">No results available</div>
                            `}
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                            <h4 class="font-medium text-green-600 mb-2 flex items-center">
                                ${adminIcons.trophy}
                                <span class="ml-2">🌟 Sargaprathipa</span>
                            </h4>
                            <p class="text-sm text-gray-600 mb-2">Top individual achiever in non-stage competitions</p>
                            ${sargaprathipa ? `
                                <div class="font-medium text-gray-900">${sargaprathipa.name}</div>
                                <div class="text-sm text-gray-600">${sargaprathipa.team} • ${sargaprathipa.points} points</div>
                            ` : `
                                <div class="text-gray-500 italic">No results available</div>
                            `}
                        </div>
                    </div>
                </div>
                
                <!-- Team Rankings -->
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Team Rankings</h3>
                    <div class="space-y-3">
                        ${teamScores.map((team, index) => `
                            <div class="flex items-center justify-between p-4 rounded-lg ${
                                index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                                index === 1 ? 'bg-gray-50 border border-gray-200' :
                                index === 2 ? 'bg-orange-50 border border-orange-200' :
                                'bg-white border border-gray-100'
                            }">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                            index === 1 ? 'bg-gray-100 text-gray-800' :
                                            index === 2 ? 'bg-orange-100 text-orange-800' :
                                            'bg-blue-100 text-blue-800'
                                        }">
                                            ${index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900">${team.name}</div>
                                        <div class="text-sm text-gray-600">${team.participants} participants</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-gray-900">${team.totalPoints}</div>
                                    <div class="text-sm text-gray-600">points</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Competition Results -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-6 border-b">
                    <h3 class="text-lg font-semibold text-gray-900">Competition Results</h3>
                    <p class="text-gray-600">Individual competition results</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competition</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${adminAllResults.length === 0 ? `
                                <tr>
                                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                        No competition results available yet
                                    </td>
                                </tr>
                            ` : adminAllResults.slice(0, 50).map(result => `
                                <tr>
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">${result.competitions?.name || 'N/A'}</div>
                                        <div class="text-sm text-gray-600">${result.competitions?.categories?.name || 'N/A'}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900">${result.participants?.name || 'N/A'}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="text-gray-900">${result.participants?.teams?.name || 'N/A'}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            result.marks >= 90 ? 'bg-green-100 text-green-800' :
                                            result.marks >= 70 ? 'bg-blue-100 text-blue-800' :
                                            result.marks >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }">
                                            ${result.marks}/100
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            result.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                                            result.position === 2 ? 'bg-gray-100 text-gray-800' :
                                            result.position === 3 ? 'bg-orange-100 text-orange-800' :
                                            'bg-blue-100 text-blue-800'
                                        }">
                                            ${result.position ? `${result.position}${getOrdinalSuffix(result.position)}` : 'N/A'}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="font-medium text-gray-900">${result.points || 0}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ${adminAllResults.length > 50 ? `
                    <div class="p-4 border-t bg-gray-50 text-center text-gray-600">
                        Showing first 50 results of ${adminAllResults.length} total
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Helper functions for results calculation
function calculateTeamScores() {
    const teamScoreMap = new Map();
    
    // Initialize teams
    adminAllTeams.forEach(team => {
        teamScoreMap.set(team.id, {
            id: team.id,
            name: team.name,
            totalPoints: 0,
            participants: adminAllParticipants.filter(p => p.team_id === team.id).length
        });
    });
    
    // Add individual competition points
    adminAllResults.forEach(result => {
        if (result.team_id && teamScoreMap.has(result.team_id)) {
            const team = teamScoreMap.get(result.team_id);
            team.totalPoints += result.points || 0;
        }
    });
    
    // Add group competition points
    adminAllGroupResults.forEach(result => {
        if (result.team_id && teamScoreMap.has(result.team_id)) {
            const team = teamScoreMap.get(result.team_id);
            team.totalPoints += result.points || 0;
        }
    });
    
    return Array.from(teamScoreMap.values())
        .sort((a, b) => b.totalPoints - a.totalPoints);
}

function calculateKalaprathipa() {
    // Find top individual achiever in stage competitions (excluding group competitions)
    const stageResults = adminAllResults.filter(result => 
        result.competitions?.is_stage && !result.competitions?.is_group
    );
    
    const participantPoints = new Map();
    
    stageResults.forEach(result => {
        const participantId = result.participant_id;
        if (!participantPoints.has(participantId)) {
            participantPoints.set(participantId, {
                participant: result.participants,
                totalPoints: 0
            });
        }
        participantPoints.get(participantId).totalPoints += result.points || 0;
    });
    
    const topParticipant = Array.from(participantPoints.values())
        .sort((a, b) => b.totalPoints - a.totalPoints)[0];
    
    if (!topParticipant) return null;
    
    return {
        name: topParticipant.participant?.name,
        team: topParticipant.participant?.teams?.name,
        points: topParticipant.totalPoints
    };
}

function calculateSargaprathipa() {
    // Find top individual achiever in non-stage competitions (excluding group competitions)
    const nonStageResults = adminAllResults.filter(result => 
        !result.competitions?.is_stage && !result.competitions?.is_group
    );
    
    const participantPoints = new Map();
    
    nonStageResults.forEach(result => {
        const participantId = result.participant_id;
        if (!participantPoints.has(participantId)) {
            participantPoints.set(participantId, {
                participant: result.participants,
                totalPoints: 0
            });
        }
        participantPoints.get(participantId).totalPoints += result.points || 0;
    });
    
    const topParticipant = Array.from(participantPoints.values())
        .sort((a, b) => b.totalPoints - a.totalPoints)[0];
    
    if (!topParticipant) return null;
    
    return {
        name: topParticipant.participant?.name,
        team: topParticipant.participant?.teams?.name,
        points: topParticipant.totalPoints
    };
}

function getOrdinalSuffix(num) {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
}

// Switch admin section function
function switchAdminSection(section) {
    currentAdminSection = section;
    renderAdminApp();
}

// Manual chess number assignment
async function assignManualChessNumber() {
    const participantId = document.getElementById('participantSelect').value;
    const chessNumber = document.getElementById('chessNumberInput').value;
    
    if (!participantId || !chessNumber) {
        showAlert('Please select a participant and enter chess number', 'error');
        return;
    }
    
    try {
        const { error } = await window.db.from('participants')
            .update({ chess_number: parseInt(chessNumber) })
            .eq('id', participantId);
        
        if (error) throw error;
        
        showAlert('Chess number assigned successfully', 'success');
        document.getElementById('participantSelect').value = '';
        document.getElementById('chessNumberInput').value = '';
        
        await loadAdminData();
        
    } catch (error) {
        showAlert('Failed to assign chess number', 'error');
    }
}

// Assignment modal functions
function openAssignModal(type, competitionId) {
    const modal = document.getElementById('adminAssignModal');
    const content = document.getElementById('adminAssignContent');
    
    const competition = adminAllCompetitions.find(c => c.id === competitionId);
    
    let options = [];
    let currentAssignment = null;
    
    if (type === 'stage') {
        options = adminAllStages;
        currentAssignment = competition?.stage_id;
    } else if (type === 'judge') {
        options = adminAllJudges;
        currentAssignment = adminAllJudgeAssignments.find(a => a.competition_id === competitionId)?.judge_id;
    } else if (type === 'announcer') {
        options = adminAllAnnouncers;
        currentAssignment = adminAllAnnouncerAssignments.find(a => a.competition_id === competitionId)?.announcer_id;
    }
    
    content.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">Assign ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <button onclick="closeAssignModal()" class="text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <div class="mb-4">
            <p class="text-gray-600">Competition: <strong>${competition?.name}</strong></p>
        </div>
        
        <form onsubmit="saveAssignment(event, '${type}', '${competitionId}')" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Select ${type.charAt(0).toUpperCase() + type.slice(1)}</label>
                <select name="assignmentId" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Choose ${type}...</option>
                    ${options.map(option => `
                        <option value="${option.id}" ${option.id === currentAssignment ? 'selected' : ''}>
                            ${option.username || option.name}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div class="flex gap-3 pt-4">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                    Assign ${type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
                <button type="button" onclick="closeAssignModal()" 
                        class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                    Cancel
                </button>
            </div>
        </form>
    `;
    
    modal.classList.remove('hidden');
}

async function saveAssignment(event, type, competitionId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const assignmentId = formData.get('assignmentId');
    
    try {
        if (type === 'stage') {
            const { error } = await window.db.from('competitions')
                .update({ stage_id: assignmentId })
                .eq('id', competitionId);
            if (error) throw error;
        } else if (type === 'judge') {
            const { error } = await window.db.from('judge_assignments')
                .upsert({
                    judge_id: assignmentId,
                    competition_id: competitionId
                });
            if (error) throw error;
        } else if (type === 'announcer') {
            const { error } = await window.db.from('announcer_assignments')
                .upsert({
                    announcer_id: assignmentId,
                    competition_id: competitionId
                });
            if (error) throw error;
        }
        
        showAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} assigned successfully`, 'success');
        closeAssignModal();
        await loadAdminData();
        renderAdminApp();
        
    } catch (error) {
        console.error(`Error assigning ${type}:`, error);
        showAlert(`Failed to assign ${type}`, 'error');
    }
}

function closeAssignModal() {
    document.getElementById('adminAssignModal').classList.add('hidden');
}

// Judge assignment modal functions
function openJudgeAssignModal(judgeId, judgeName) {
    const availableCompetitions = adminAllCompetitions.filter(comp => 
        !adminAllJudgeAssignments.some(assign => 
            assign.judge_id === judgeId && assign.competition_id === comp.id
        )
    );
    
    const assignedCompetitions = adminAllJudgeAssignments.filter(assign => 
        assign.judge_id === judgeId
    );
    
    document.getElementById('adminAssignContent').innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-lg font-medium text-gray-900">Assign Competitions</h3>
                <p class="text-gray-600">Judge: ${judgeName}</p>
            </div>
            <button onclick="closeAssignModal()" class="text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <!-- Assigned Competitions -->
        <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Currently Assigned (${assignedCompetitions.length})</h4>
            ${assignedCompetitions.length === 0 ? `
                <p class="text-gray-500 italic">No competitions assigned yet</p>
            ` : `
                <div class="space-y-2 max-h-32 overflow-y-auto">
                    ${assignedCompetitions.map(assign => {
                        const competition = adminAllCompetitions.find(c => c.id === assign.competition_id);
                        return `
                            <div class="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <span class="text-sm">${competition?.name || 'Unknown'} (${competition?.categories?.name || 'Unknown'})</span>
                                <button onclick="removeJudgeAssignment('${assign.id}')" class="text-red-600 hover:text-red-800">×</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </div>
        
        <!-- Available Competitions -->
        <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Available Competitions (${availableCompetitions.length})</h4>
            ${availableCompetitions.length === 0 ? `
                <p class="text-gray-500 italic">All competitions have been assigned</p>
            ` : `
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${availableCompetitions.map(competition => `
                        <div class="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                            <div>
                                <span class="font-medium">${competition.name}</span>
                                <span class="text-sm text-gray-600 ml-2">(${competition.categories?.name || 'Unknown'})</span>
                                ${competition.is_stage ? '<span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Stage</span>' : ''}
                                ${competition.is_group ? '<span class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Group</span>' : ''}
                            </div>
                            <button onclick="assignJudgeToCompetition('${judgeId}', '${competition.id}')" class="text-blue-600 hover:text-blue-800">+</button>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
        
        <div class="flex justify-end">
            <button onclick="closeAssignModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                Done
            </button>
        </div>
    `;
    
    document.getElementById('adminAssignModal').classList.remove('hidden');
}

async function assignJudgeToCompetition(judgeId, competitionId) {
    try {
        const { error } = await window.db.from('judge_assignments').insert({
            judge_id: judgeId,
            competition_id: competitionId
        });
        
        if (error) throw error;
        
        showAlert('Competition assigned successfully', 'success');
        await loadAdminData();
        
        // Refresh the modal
        const judge = adminAllJudges.find(j => j.id === judgeId);
        if (judge) {
            openJudgeAssignModal(judgeId, judge.username);
        }
        
    } catch (error) {
        console.error('Error assigning competition:', error);
        showAlert('Failed to assign competition', 'error');
    }
}

async function removeJudgeAssignment(assignmentId) {
    try {
        const { error } = await window.db.from('judge_assignments').delete().eq('id', assignmentId);
        
        if (error) throw error;
        
        showAlert('Assignment removed successfully', 'success');
        await loadAdminData();
        
        // Refresh modal if still open
        const modal = document.getElementById('adminAssignModal');
        if (!modal.classList.contains('hidden')) {
            // Find the judge from the current assignment being removed
            const assignment = adminAllJudgeAssignments.find(a => a.id === assignmentId);
            if (assignment) {
                const judge = adminAllJudges.find(j => j.id === assignment.judge_id);
                if (judge) {
                    openJudgeAssignModal(judge.id, judge.username);
                }
            }
        }
        
    } catch (error) {
        console.error('Error removing assignment:', error);
        showAlert('Failed to remove assignment', 'error');
    }
}

// Announcer assignment modal functions
function openAnnouncerAssignModal(announcerId, announcerName) {
    const availableCompetitions = adminAllCompetitions.filter(comp => 
        !adminAllAnnouncerAssignments.some(assign => 
            assign.announcer_id === announcerId && assign.competition_id === comp.id
        )
    );
    
    const assignedCompetitions = adminAllAnnouncerAssignments.filter(assign => 
        assign.announcer_id === announcerId
    );
    
    document.getElementById('adminAssignContent').innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-lg font-medium text-gray-900">Assign Competitions</h3>
                <p class="text-gray-600">Announcer: ${announcerName}</p>
            </div>
            <button onclick="closeAssignModal()" class="text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <!-- Assigned Competitions -->
        <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Currently Assigned (${assignedCompetitions.length})</h4>
            ${assignedCompetitions.length === 0 ? `
                <p class="text-gray-500 italic">No competitions assigned yet</p>
            ` : `
                <div class="space-y-2 max-h-32 overflow-y-auto">
                    ${assignedCompetitions.map(assign => {
                        const competition = adminAllCompetitions.find(c => c.id === assign.competition_id);
                        return `
                            <div class="flex items-center justify-between p-2 bg-purple-50 rounded">
                                <span class="text-sm">${competition?.name || 'Unknown'}</span>
                                <button onclick="removeAnnouncerAssignment('${assign.id}')" class="text-red-600 hover:text-red-800">×</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </div>
        
        <!-- Available Competitions -->
        <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Available Competitions (${availableCompetitions.length})</h4>
            ${availableCompetitions.length === 0 ? `
                <p class="text-gray-500 italic">All competitions have been assigned</p>
            ` : `
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${availableCompetitions.map(competition => `
                        <div class="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                            <div>
                                <span class="font-medium">${competition.name}</span>
                                <span class="text-sm text-gray-600 ml-2">(${competition.categories?.name || 'Unknown'})</span>
                            </div>
                            <button onclick="assignAnnouncerToCompetition('${announcerId}', '${competition.id}')" class="text-blue-600 hover:text-blue-800">+</button>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
        
        <div class="flex justify-end">
            <button onclick="closeAssignModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                Done
            </button>
        </div>
    `;
    
    document.getElementById('adminAssignModal').classList.remove('hidden');
}

async function assignAnnouncerToCompetition(announcerId, competitionId) {
    try {
        const { error } = await window.db.from('announcer_assignments').insert({
            announcer_id: announcerId,
            competition_id: competitionId
        });
        
        if (error) throw error;
        
        showAlert('Competition assigned successfully', 'success');
        await loadAdminData();
        
        // Refresh the modal
        const announcer = adminAllAnnouncers.find(a => a.id === announcerId);
        if (announcer) {
            openAnnouncerAssignModal(announcerId, announcer.username);
        }
        
    } catch (error) {
        console.error('Error assigning competition:', error);
        showAlert('Failed to assign competition', 'error');
    }
}

async function removeAnnouncerAssignment(assignmentId) {
    try {
        const { error } = await window.db.from('announcer_assignments').delete().eq('id', assignmentId);
        
        if (error) throw error;
        
        showAlert('Assignment removed successfully', 'success');
        await loadAdminData();
        
        // Refresh modal if still open
        const modal = document.getElementById('adminAssignModal');
        if (!modal.classList.contains('hidden')) {
            const assignment = adminAllAnnouncerAssignments.find(a => a.id === assignmentId);
            if (assignment) {
                const announcer = adminAllAnnouncers.find(a => a.id === assignment.announcer_id);
                if (announcer) {
                    openAnnouncerAssignModal(announcer.id, announcer.username);
                }
            }
        }
        
    } catch (error) {
        console.error('Error removing assignment:', error);
        showAlert('Failed to remove assignment', 'error');
    }
}

// Modal functions
function openAdminModal(type, action, itemId = null) {
    const modal = document.getElementById('adminModal');
    const content = document.getElementById('adminModalContent');
    
    const isEdit = action === 'edit' && itemId;
    const title = isEdit ? `Edit ${type}` : `Add ${type}`;
    
    let item = null;
    if (isEdit) {
        const itemArrayMap = {
            'team': adminAllTeams,
            'category': adminAllCategories,
            'competition': adminAllCompetitions,
            'participant': adminAllParticipants,
            'user': adminAllUsers,
            'judge': adminAllJudges,
            'announcer': adminAllAnnouncers,
            'stage': adminAllStages
        };
        item = itemArrayMap[type]?.find(i => i.id === itemId);
    }
    
    content.innerHTML = renderAdminModalForm(type, item, isEdit);
    modal.classList.remove('hidden');
}

function renderAdminModalForm(type, item, isEdit) {
    const formId = `adminForm${type}`;
    
    if (type === 'team') {
        return `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-medium text-gray-900">${isEdit ? 'Edit' : 'Add'} Team</h3>
                <button onclick="closeAdminModal()" class="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form id="${formId}" onsubmit="submitAdminForm(event, 'team', '${item?.id || ''}')" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                    <input type="text" name="name" value="${item?.name || ''}" required 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="text" name="password" value="${item?.password || ''}" required 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                        ${isEdit ? 'Update' : 'Create'} Team
                    </button>
                    <button type="button" onclick="closeAdminModal()" 
                            class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </form>
        `;
    } else if (type === 'category') {
        return `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-medium text-gray-900">${isEdit ? 'Edit' : 'Add'} Category</h3>
                <button onclick="closeAdminModal()" class="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form id="${formId}" onsubmit="submitAdminForm(event, 'category', '${item?.id || ''}')" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                    <select name="name" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Category</option>
                        <option value="A ZONE" ${item?.name === 'A ZONE' ? 'selected' : ''}>A ZONE</option>
                        <option value="B ZONE" ${item?.name === 'B ZONE' ? 'selected' : ''}>B ZONE</option>
                        <option value="C ZONE" ${item?.name === 'C ZONE' ? 'selected' : ''}>C ZONE</option>
                        <option value="D ZONE" ${item?.name === 'D ZONE' ? 'selected' : ''}>D ZONE</option>
                        <option value="MIX ZONE" ${item?.name === 'MIX ZONE' ? 'selected' : ''}>MIX ZONE</option>
                    </select>
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                        ${isEdit ? 'Update' : 'Create'} Category
                    </button>
                    <button type="button" onclick="closeAdminModal()" 
                            class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </form>
        `;
    } else if (type === 'stage') {
        return `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-medium text-gray-900">${isEdit ? 'Edit' : 'Add'} Stage</h3>
                <button onclick="closeAdminModal()" class="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form id="${formId}" onsubmit="submitAdminForm(event, 'stage', '${item?.id || ''}')" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Stage Name</label>
                    <input type="text" name="name" value="${item?.name || ''}" required 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="text" name="password" value="${item?.password || ''}" required 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                        ${isEdit ? 'Update' : 'Create'} Stage
                    </button>
                    <button type="button" onclick="closeAdminModal()" 
                            class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </form>
        `;
    } else if (type === 'judge' || type === 'announcer') {
        return `
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-medium text-gray-900">${isEdit ? 'Edit' : 'Add'} ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <button onclick="closeAdminModal()" class="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form id="${formId}" onsubmit="submitAdminForm(event, '${type}', '${item?.id || ''}')" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input type="text" name="username" value="${item?.username || ''}" required 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" name="password" value="${item?.password || ''}" ${!isEdit ? 'required' : ''} 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    ${isEdit ? '<p class="text-sm text-gray-500">Leave blank to keep current password</p>' : ''}
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                        ${isEdit ? 'Update' : 'Create'} ${type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                    <button type="button" onclick="closeAdminModal()" 
                            class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </form>
        `;
    }
    
    // Default form for other types
    return `<div class="p-6">Form for ${type} not implemented yet</div>`;
}

async function submitAdminForm(event, type, itemId = '') {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Handle special cases
    if (type === 'judge') {
        data.role = 'judge';
        if (itemId && !data.password) {
            delete data.password; // Don't update password if not provided
        }
    } else if (type === 'announcer') {
        data.role = 'announcer';
        if (itemId && !data.password) {
            delete data.password; // Don't update password if not provided
        }
    }
    
    try {
        let tableName = (type === 'judge' || type === 'announcer') ? 'users' : `${type}s`;
        let result;
        
        if (itemId) {
            // Update existing item
            result = await window.db.from(tableName).update(data).eq('id', itemId);
        } else {
            // Create new item
            result = await window.db.from(tableName).insert(data);
        }
        
        if (result.error) throw result.error;
        
        showAlert(`${type} ${itemId ? 'updated' : 'created'} successfully!`, 'success');
        closeAdminModal();
        await loadAdminData();
        renderAdminApp();
        
    } catch (error) {
        console.error(`Error ${itemId ? 'updating' : 'creating'} ${type}:`, error);
        showAlert(`Failed to ${itemId ? 'update' : 'create'} ${type}`, 'error');
    }
}

function openAdminBulkImport(type) {
    const modal = document.getElementById('adminBulkImportModal');
    const content = document.getElementById('adminBulkImportContent');
    const template = adminFormatTemplates[type];
    
    content.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">Bulk Import ${type}</h3>
            <button onclick="closeAdminBulkImportModal()" class="text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <div class="mb-6">
            <h4 class="font-medium text-gray-700 mb-2">Format: ${template.format}</h4>
            <div class="bg-gray-100 p-4 rounded-lg border">
                <pre class="text-sm text-gray-800">${template.example}</pre>
            </div>
        </div>
        
        <form onsubmit="submitBulkImport(event, '${type}')" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Paste CSV Data</label>
                <textarea name="csvData" rows="10" required 
                          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          placeholder="${template.example}"></textarea>
            </div>
            
            <div class="flex gap-3">
                <button type="submit" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
                    Import ${type}
                </button>
                <button type="button" onclick="closeAdminBulkImportModal()" 
                        class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                    Cancel
                </button>
            </div>
        </form>
    `;
    
    modal.classList.remove('hidden');
}

function closeAdminBulkImportModal() {
    document.getElementById('adminBulkImportModal').classList.add('hidden');
}

async function submitBulkImport(event, type) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const csvData = formData.get('csvData').trim();
    
    if (!csvData) {
        showAlert('Please provide CSV data', 'error');
        return;
    }
    
    try {
        const lines = csvData.split('\n').filter(line => line.trim());
        const items = [];
        
        for (const line of lines) {
            const values = line.split(',').map(v => v.trim());
            
            if (type === 'teams') {
                items.push({ name: values[0], password: values[1] });
            } else if (type === 'judges') {
                items.push({ username: values[0], password: values[1], role: 'judge' });
            } else if (type === 'announcers') {
                items.push({ username: values[0], password: values[1], role: 'announcer' });
            } else if (type === 'stages') {
                items.push({ name: values[0], password: values[1] });
            }
            // Add more cases as needed...
        }
        
        let tableName = (type === 'judges' || type === 'announcers') ? 'users' : type;
        const { error } = await window.db.from(tableName).insert(items);
        if (error) throw error;
        
        showAlert(`${items.length} ${type} imported successfully!`, 'success');
        closeAdminBulkImportModal();
        await loadAdminData();
        renderAdminApp();
        
    } catch (error) {
        console.error(`Error importing ${type}:`, error);
        showAlert(`Failed to import ${type}`, 'error');
    }
}

async function deleteAdminItem(tableName, itemId) {
    if (!confirm(`Are you sure you want to delete this ${tableName.slice(0, -1)}?`)) return;
    
    try {
        const { error } = await window.db.from(tableName).delete().eq('id', itemId);
        if (error) throw error;
        
        showAlert(`${tableName.slice(0, -1)} deleted successfully`, 'success');
        await loadAdminData();
        renderAdminApp();
        
    } catch (error) {
        console.error(`Error deleting ${tableName}:`, error);
        showAlert(`Failed to delete ${tableName.slice(0, -1)}`, 'error');
    }
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

// Make functions globally available
window.renderAdminApp = renderAdminApp;
window.switchAdminSection = switchAdminSection;
window.assignManualChessNumber = assignManualChessNumber;
window.openAssignModal = openAssignModal;
window.saveAssignment = saveAssignment;
window.closeAssignModal = closeAssignModal;
window.openJudgeAssignModal = openJudgeAssignModal;
window.assignJudgeToCompetition = assignJudgeToCompetition;
window.removeJudgeAssignment = removeJudgeAssignment;
window.openAnnouncerAssignModal = open
// Continuing from the previous admin.js file...

window.openAnnouncerAssignModal = openAnnouncerAssignModal;
window.assignAnnouncerToCompetition = assignAnnouncerToCompetition;
window.removeAnnouncerAssignment = removeAnnouncerAssignment;
window.closeAdminModal = closeAdminModal;
window.openAdminModal = openAdminModal;
window.submitAdminForm = submitAdminForm;
window.openAdminBulkImport = openAdminBulkImport;
window.closeAdminBulkImportModal = closeAdminBulkImportModal;
window.submitBulkImport = submitBulkImport;
window.deleteAdminItem = deleteAdminItem;
window.loadAdminData = loadAdminData;

// Additional helper functions for complete functionality

// Helper function to get current user
function getCurrentUser() {
    return getUser();
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Helper function to get status badge class
function getStatusBadgeClass(status) {
    switch(status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'in-progress': return 'bg-blue-100 text-blue-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Function to export data as CSV
function exportDataAsCSV(data, filename) {
    if (!data || data.length === 0) {
        showAlert('No data to export', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Function to generate competition report
async function generateCompetitionReport(competitionId) {
    try {
        const competition = adminAllCompetitions.find(c => c.id === competitionId);
        if (!competition) {
            showAlert('Competition not found', 'error');
            return;
        }
        
        // Get all results for this competition
        const tableName = competition.is_group ? 'group_results' : 'competition_results';
        const { data: results, error } = await window.db
            .from(tableName)
            .select(`
                *,
                ${competition.is_group ? 'teams(name)' : 'participants(name, teams(name))'}
            `)
            .eq('competition_id', competitionId)
            .order('position', { ascending: true });
            
        if (error) throw error;
        
        if (!results || results.length === 0) {
            showAlert('No results found for this competition', 'info');
            return;
        }
        
        // Format data for export
        const reportData = results.map(result => ({
            position: result.position,
            name: competition.is_group ? 'Group Entry' : result.participants?.name || 'N/A',
            team: competition.is_group ? result.teams?.name : result.participants?.teams?.name || 'N/A',
            marks: result.marks,
            points: result.points,
            competition: competition.name,
            category: competition.categories?.name || 'N/A'
        }));
        
        exportDataAsCSV(reportData, `${competition.name.replace(/\s+/g, '_')}_results.csv`);
        showAlert('Report generated successfully', 'success');
        
    } catch (error) {
        console.error('Error generating report:', error);
        showAlert('Failed to generate report', 'error');
    }
}

// Function to generate overall festival report
async function generateFestivalReport() {
    try {
        const teamScores = calculateTeamScores();
        const reportData = teamScores.map((team, index) => ({
            rank: index + 1,
            team_name: team.name,
            total_points: team.totalPoints,
            participants: team.participants
        }));
        
        exportDataAsCSV(reportData, `festival_team_rankings_${new Date().getFullYear()}.csv`);
        showAlert('Festival report generated successfully', 'success');
        
    } catch (error) {
        console.error('Error generating festival report:', error);
        showAlert('Failed to generate festival report', 'error');
    }
}

// Function to backup all data
async function backupAllData() {
    try {
        const backupData = {
            teams: adminAllTeams,
            categories: adminAllCategories,
            competitions: adminAllCompetitions,
            participants: adminAllParticipants,
            users: adminAllUsers.map(user => ({ ...user, password: '[HIDDEN]' })), // Hide passwords
            stages: adminAllStages,
            judge_assignments: adminAllJudgeAssignments,
            announcer_assignments: adminAllAnnouncerAssignments,
            competition_results: adminAllResults,
            group_results: adminAllGroupResults,
            competition_sessions: adminAllCompetitionSessions,
            announcements: adminAllAnnouncements,
            backup_date: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `festival_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showAlert('Data backup created successfully', 'success');
        
    } catch (error) {
        console.error('Error creating backup:', error);
        showAlert('Failed to create backup', 'error');
    }
}

// Function to reset all data (with confirmation)
async function resetAllData() {
    const confirmation1 = confirm('⚠️ WARNING: This will DELETE ALL festival data permanently. Are you absolutely sure?');
    if (!confirmation1) return;
    
    const confirmation2 = confirm('This action CANNOT be undone. Type "DELETE ALL DATA" in the next prompt to confirm.');
    if (!confirmation2) return;
    
    const finalConfirmation = prompt('Type "DELETE ALL DATA" exactly to confirm:');
    if (finalConfirmation !== 'DELETE ALL DATA') {
        showAlert('Reset cancelled - confirmation text did not match', 'info');
        return;
    }
    
    try {
        // Delete in reverse dependency order
        await Promise.all([
            window.db.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('competition_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('group_results').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('competition_results').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('announcer_assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('judge_assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('group_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        ]);
        
        await Promise.all([
            window.db.from('competitions').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('participants').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('users').delete().neq('id', getCurrentUser().id), // Keep current admin
            window.db.from('stages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        ]);
        
        await Promise.all([
            window.db.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            window.db.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        ]);
        
        showAlert('All data has been reset successfully', 'success');
        await loadAdminData();
        renderAdminApp();
        
    } catch (error) {
        console.error('Error resetting data:', error);
        showAlert('Failed to reset data: ' + error.message, 'error');
    }
}

// Function to send system notifications
function sendSystemNotification(message, type = 'info') {
    // Check if browser supports notifications
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Festival Management System', {
            body: message,
            icon: '/favicon.ico'
        });
    } else {
        showAlert(message, type);
    }
}

// Function to request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showAlert('Notifications enabled successfully', 'success');
            }
        });
    }
}

// Function to get system statistics
function getSystemStatistics() {
    return {
        overview: {
            total_teams: adminAllTeams.length,
            total_participants: adminAllParticipants.length,
            total_competitions: adminAllCompetitions.length,
            total_users: adminAllUsers.length,
            total_judges: adminAllJudges.length,
            total_announcers: adminAllAnnouncers.length,
            total_stages: adminAllStages.length
        },
        progress: {
            invigilator_completed: [...new Set(adminAllCompetitionSessions.map(s => s.competition_id))].length,
            judgement_completed: [...new Set([...adminAllResults.map(r => r.competition_id), ...adminAllGroupResults.map(r => r.competition_id)])].length,
            announced_competitions: [...new Set(adminAllAnnouncements.map(a => a.competition_id))].length
        },
        participation: {
            average_participants_per_team: adminAllTeams.length > 0 ? Math.round(adminAllParticipants.length / adminAllTeams.length) : 0,
            competitions_per_category: adminAllCategories.map(cat => ({
                category: cat.name,
                count: adminAllCompetitions.filter(comp => comp.category_id === cat.id).length
            }))
        }
    };
}

// Enhanced search functionality
function searchAcrossAllData(searchTerm) {
    const results = {
        teams: adminAllTeams.filter(item => 
            item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        participants: adminAllParticipants.filter(item => 
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.teams?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        competitions: adminAllCompetitions.filter(item => 
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        users: adminAllUsers.filter(item => 
            item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.role?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    };
    
    return results;
}

// Function to validate system integrity
async function validateSystemIntegrity() {
    const issues = [];
    
    try {
        // Check for participants without teams
        const participantsWithoutTeams = adminAllParticipants.filter(p => !p.team_id);
        if (participantsWithoutTeams.length > 0) {
            issues.push(`${participantsWithoutTeams.length} participants have no team assigned`);
        }
        
        // Check for competitions without categories
        const competitionsWithoutCategories = adminAllCompetitions.filter(c => !c.category_id);
        if (competitionsWithoutCategories.length > 0) {
            issues.push(`${competitionsWithoutCategories.length} competitions have no category assigned`);
        }
        
        // Check for stage competitions without stages
        const stageCompetitionsWithoutStages = adminAllCompetitions.filter(c => c.is_stage && !c.stage_id);
        if (stageCompetitionsWithoutStages.length > 0) {
            issues.push(`${stageCompetitionsWithoutStages.length} stage competitions have no stage assigned`);
        }
        
        // Check for competitions without judges
        const competitionsWithoutJudges = adminAllCompetitions.filter(c => 
            !adminAllJudgeAssignments.some(ja => ja.competition_id === c.id)
        );
        if (competitionsWithoutJudges.length > 0) {
            issues.push(`${competitionsWithoutJudges.length} competitions have no judge assigned`);
        }
        
        // Check for duplicate chess numbers
        const chessNumbers = adminAllParticipants.map(p => p.chess_number).filter(Boolean);
        const duplicateChessNumbers = chessNumbers.filter((num, index) => chessNumbers.indexOf(num) !== index);
        if (duplicateChessNumbers.length > 0) {
            issues.push(`${duplicateChessNumbers.length} duplicate chess numbers found`);
        }
        
        if (issues.length === 0) {
            showAlert('✅ System integrity check passed - no issues found', 'success');
        } else {
            const issuesList = issues.map(issue => `• ${issue}`).join('\n');
            showAlert(`⚠️ System integrity issues found:\n\n${issuesList}`, 'warning');
        }
        
        return { isValid: issues.length === 0, issues };
        
    } catch (error) {
        console.error('Error validating system integrity:', error);
        showAlert('Failed to validate system integrity', 'error');
        return { isValid: false, issues: ['Validation failed due to system error'] };
    }
}

// Auto-save functionality
let autoSaveInterval;
function startAutoSave() {
    // Auto-save every 5 minutes
    autoSaveInterval = setInterval(async () => {
        try {
            // Create automatic backup
            await backupAllData();
            console.log('Auto-save completed at', new Date().toISOString());
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }, 5 * 60 * 1000); // 5 minutes
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// Initialize admin panel
async function initializeAdminPanel() {
    try {
        // Load initial data
        await loadAdminData();
        
        // Render the admin interface
        await renderAdminApp();
        
        // Request notification permission
        requestNotificationPermission();
        
        // Start auto-save
        startAutoSave();
        
        // Log successful initialization
        console.log('Admin panel initialized successfully');
        sendSystemNotification('Admin panel loaded successfully', 'success');
        
    } catch (error) {
        console.error('Failed to initialize admin panel:', error);
        showAlert('Failed to initialize admin panel: ' + error.message, 'error');
    }
}

// Export additional functions to window
window.generateCompetitionReport = generateCompetitionReport;
window.generateFestivalReport = generateFestivalReport;
window.backupAllData = backupAllData;
window.resetAllData = resetAllData;
window.sendSystemNotification = sendSystemNotification;
window.requestNotificationPermission = requestNotificationPermission;
window.getSystemStatistics = getSystemStatistics;
window.searchAcrossAllData = searchAcrossAllData;
window.validateSystemIntegrity = validateSystemIntegrity;
window.initializeAdminPanel = initializeAdminPanel;
window.startAutoSave = startAutoSave;
window.stopAutoSave = stopAutoSave;
window.exportDataAsCSV = exportDataAsCSV;

// Cleanup function for when admin panel is closed
window.addEventListener('beforeunload', () => {
    stopAutoSave();
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize admin panel if user is admin
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.role === 'admin') {
        initializeAdminPanel();
    }
});

// Console helper for debugging
window.adminDebug = {
    data: () => ({
        teams: adminAllTeams,
        categories: adminAllCategories,
        competitions: adminAllCompetitions,
        participants: adminAllParticipants,
        users: adminAllUsers,
        judges: adminAllJudges,
        announcers: adminAllAnnouncers,
        stages: adminAllStages,
        judgeAssignments: adminAllJudgeAssignments,
        announcerAssignments: adminAllAnnouncerAssignments,
        results: adminAllResults,
        groupResults: adminAllGroupResults,
        sessions: adminAllCompetitionSessions,
        announcements: adminAllAnnouncements
    }),
    stats: getSystemStatistics,
    validate: validateSystemIntegrity,
    search: searchAcrossAllData
};

console.log('Admin panel loaded. Use window.adminDebug for debugging.');
