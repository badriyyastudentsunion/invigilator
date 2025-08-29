// Leader App Variables (prefixed to avoid conflicts)
let leaderCurrentTeamId = null;
let leaderCurrentSection = 'participants';
let leaderCurrentParticipantFilter = 'all';
let leaderCurrentProgramTypeFilter = 'all';
let leaderCurrentProgramZoneFilter = 'all';
let leaderCurrentStatusSort = 'programs';
let leaderCurrentTeamName = '';
let leaderAllParticipants = [];
let leaderAllCompetitions = [];
let leaderAllCategories = [];
let leaderAllAssignments = [];
let leaderAllGroupEntries = [];

// SVG Icons for leader
const leaderIcons = {
    users: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"></path></svg>`,
    clipboard: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>`,
    chart: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`,
    plus: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`,
    x: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
    filter: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path></svg>`,
    check: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
};

async function renderLeaderApp(teamId) {
    leaderCurrentTeamId = teamId;
    await loadLeaderData();
    
    const root = document.getElementById('leader-app');
    root.innerHTML = `
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <div class="bg-white border-b">
                <div class="px-4 py-4">
                    <h1 class="text-lg font-semibold text-gray-900">Dashboard</h1>
                    <p class="text-sm text-gray-600">${leaderCurrentTeamName}</p>
                </div>
            </div>

            <!-- Navigation -->
            <div class="bg-white border-b">
                <nav class="flex">
                    <button id="leader-tab-participants" class="leader-tab-button flex-1 py-3 px-4 text-sm border-b-2 border-blue-500 text-blue-600">
                        <div class="flex items-center justify-center space-x-2">
                            ${leaderIcons.users}
                            <span>Participants</span>
                        </div>
                    </button>
                    <button id="leader-tab-programs" class="leader-tab-button flex-1 py-3 px-4 text-sm border-b-2 border-transparent text-gray-500">
                        <div class="flex items-center justify-center space-x-2">
                            ${leaderIcons.clipboard}
                            <span>Programs</span>
                        </div>
                    </button>
                    <button id="leader-tab-status" class="leader-tab-button flex-1 py-3 px-4 text-sm border-b-2 border-transparent text-gray-500">
                        <div class="flex items-center justify-center space-x-2">
                            ${leaderIcons.chart}
                            <span>Status</span>
                        </div>
                    </button>
                </nav>
            </div>

            <!-- Content -->
            <div id="leader-content" class="p-4"></div>
        </div>

        <!-- Alert Modal -->
        <div id="leaderAlertModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg w-full max-w-sm">
                    <div class="p-4">
                        <div id="leaderAlertContent" class="text-center">
                            <div id="leaderAlertIcon" class="mx-auto mb-3"></div>
                            <p id="leaderAlertMessage" class="text-gray-700"></p>
                        </div>
                    </div>
                    <div class="p-4 border-t flex justify-end space-x-2">
                        <button id="leaderAlertCancel" class="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50 hidden">Cancel</button>
                        <button id="leaderAlertConfirm" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">OK</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Assignment Modal -->
        <div id="leaderAssignModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
                    <div class="p-4 border-b">
                        <h3 class="font-medium">Assign Participants</h3>
                    </div>
                    <div id="leaderModalContent" class="p-4"></div>
                    <div class="p-4 border-t flex justify-end space-x-2">
                        <button onclick="closeLeaderAssignModal()" class="px-4 py-2 text-gray-600 border rounded">Cancel</button>
                        <button id="leaderSaveAssignment" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('leader-tab-participants').addEventListener('click', () => switchLeaderSection('participants'));
    document.getElementById('leader-tab-programs').addEventListener('click', () => switchLeaderSection('programs'));
    document.getElementById('leader-tab-status').addEventListener('click', () => switchLeaderSection('status'));

    switchLeaderSection('participants');
}

async function loadLeaderData() {
    try {
        // Load team name
        const { data: team } = await db.from('teams').select('name').eq('id', leaderCurrentTeamId).single();
        leaderCurrentTeamName = team?.name || 'Unknown Team';

        // Load categories
        const { data: categories } = await db.from('categories').select('*').order('name');
        leaderAllCategories = categories || [];

        // Load team participants
        const { data: participants } = await db.from('participants')
            .select(`id, name, category_id, categories!inner(id, name)`)
            .eq('team_id', leaderCurrentTeamId);
        leaderAllParticipants = participants || [];

        // Load competitions
        const { data: competitions } = await db.from('competitions')
            .select(`id, name, max_participants_per_team, is_stage, is_group, group_type, is_mix_zone, category_id, categories!inner(id, name)`);
        leaderAllCompetitions = competitions || [];

        // Load current assignments
        const { data: assignments } = await db.from('assignments')
            .select(`id, participant_id, competition_id, participants!inner(id, name, team_id), competitions!inner(id, name, is_stage, category_id, categories!inner(name))`)
            .eq('participants.team_id', leaderCurrentTeamId);
        leaderAllAssignments = assignments || [];

        // Load group entries
        const { data: groupEntries } = await db.from('group_entries')
            .select(`id, competition_id, team_id, representative_name, group_size, competitions!inner(id, name)`)
            .eq('team_id', leaderCurrentTeamId);
        leaderAllGroupEntries = groupEntries || [];

    } catch (error) {
        console.error('Error loading leader data:', error);
        showLeaderAlert('Error loading data. Please refresh.', 'error');
    }
}

function switchLeaderSection(section) {
    leaderCurrentSection = section;
    
    document.querySelectorAll('.leader-tab-button').forEach(tab => {
        tab.classList.remove('border-blue-500', 'text-blue-600');
        tab.classList.add('border-transparent', 'text-gray-500');
    });
    
    const activeTab = document.getElementById(`leader-tab-${section}`);
    activeTab.classList.remove('border-transparent', 'text-gray-500');
    activeTab.classList.add('border-blue-500', 'text-blue-600');

    switch(section) {
        case 'participants': renderLeaderParticipantsSection(); break;
        case 'programs': renderLeaderProgramsSection(); break;
        case 'status': renderLeaderStatusSection(); break;
    }
}

// Section 1: Participants (exclude MIX ZONE from filter)
function renderLeaderParticipantsSection() {
    const content = document.getElementById('leader-content');
    
    // Filter buttons (excluding MIX ZONE)
    const regularZones = leaderAllCategories.filter(cat => cat.name !== 'MIX ZONE');
    const filterButtons = ['all', ...regularZones.map(cat => cat.name)].map(filter => {
        const isActive = leaderCurrentParticipantFilter === filter;
        const count = filter === 'all' ? leaderAllParticipants.length : 
                     leaderAllParticipants.filter(p => p.categories.name === filter).length;
        
        return `
            <button onclick="setLeaderParticipantFilter('${filter}')" 
                    class="px-3 py-2 rounded text-sm ${isActive ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border'}">
                ${filter === 'all' ? 'All' : filter} (${count})
            </button>
        `;
    }).join('');

    const filteredParticipants = leaderCurrentParticipantFilter === 'all' ? 
        leaderAllParticipants : 
        leaderAllParticipants.filter(p => p.categories.name === leaderCurrentParticipantFilter);

    const participantsByCategory = {};
    leaderAllCategories.forEach(cat => {
        participantsByCategory[cat.name] = filteredParticipants.filter(p => p.category_id === cat.id);
    });

    let html = `
        <div class="space-y-4">
            <div class="bg-white rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-3">
                    ${leaderIcons.filter}
                    <span class="text-sm font-medium">Filter</span>
                </div>
                <div class="flex flex-wrap gap-2">${filterButtons}</div>
            </div>
    `;
    
    Object.entries(participantsByCategory).forEach(([categoryName, participants]) => {
        if (leaderCurrentParticipantFilter !== 'all' && leaderCurrentParticipantFilter !== categoryName) return;
        
        html += `
            <div class="bg-white rounded-lg">
                <div class="px-4 py-3 border-b bg-gray-50">
                    <div class="flex justify-between items-center">
                        <h3 class="font-medium">${categoryName}</h3>
                        <span class="text-sm text-gray-500">${participants.length}</span>
                    </div>
                </div>
                <div class="p-4">
        `;

        if (participants.length === 0) {
            html += '<p class="text-center text-gray-500 py-4">No participants</p>';
        } else {
            participants.forEach(participant => {
                const participantAssignments = leaderAllAssignments.filter(a => a.participant_id === participant.id);
                const regularPrograms = participantAssignments.filter(a => a.competitions.categories.name !== 'MIX ZONE');
                const mixZonePrograms = participantAssignments.filter(a => a.competitions.categories.name === 'MIX ZONE');
                const stagePrograms = regularPrograms.filter(a => a.competitions.is_stage);
                const nonStagePrograms = regularPrograms.filter(a => !a.competitions.is_stage);
                
                html += `
                    <div class="border-b last:border-b-0 py-3">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h4 class="font-medium">${participant.name}</h4>
                                <div class="flex space-x-4 mt-2 text-xs">
                                    <span class="text-red-600">Stage: ${stagePrograms.length}/3</span>
                                    <span class="text-green-600">Non-Stage: ${nonStagePrograms.length}/5</span>
                                    <span class="text-purple-600">MIX: ${mixZonePrograms.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div></div>';
    });

    html += '</div>';
    content.innerHTML = html;
}

function setLeaderParticipantFilter(filter) {
    leaderCurrentParticipantFilter = filter;
    renderLeaderParticipantsSection();
}

// Section 2: Program assignment organized by Stage/Non-Stage
function renderLeaderProgramsSection() {
    const content = document.getElementById('leader-content');
    
    // Type filter buttons
    const typeButtons = ['all', 'stage', 'non-stage'].map(type => {
        const isActive = leaderCurrentProgramTypeFilter === type;
        return `
            <button onclick="setLeaderProgramTypeFilter('${type}')" 
                    class="px-3 py-2 rounded text-sm ${isActive ? 'bg-blue-500 text-white' : 'bg-white border text-gray-600'}">
                ${type === 'all' ? 'All' : type === 'stage' ? 'Stage' : 'Non-Stage'}
            </button>
        `;
    }).join('');

    // Zone filter buttons
    const zoneButtons = ['all', ...leaderAllCategories.map(cat => cat.name)].map(zone => {
        const isActive = leaderCurrentProgramZoneFilter === zone;
        return `
            <button onclick="setLeaderProgramZoneFilter('${zone}')" 
                    class="px-3 py-2 rounded text-sm ${isActive ? 'bg-green-500 text-white' : 'bg-white border text-gray-600'}">
                ${zone === 'all' ? 'All Zones' : zone}
            </button>
        `;
    }).join('');

    let html = `
        <div class="space-y-4">
            <div class="bg-white rounded-lg p-4">
                <div class="space-y-3">
                    <div>
                        <div class="flex items-center space-x-2 mb-2">
                            ${leaderIcons.filter}
                            <span class="text-sm font-medium">Type</span>
                        </div>
                        <div class="flex flex-wrap gap-2">${typeButtons}</div>
                    </div>
                    <div>
                        <div class="flex items-center space-x-2 mb-2">
                            ${leaderIcons.filter}
                            <span class="text-sm font-medium">Zone</span>
                        </div>
                        <div class="flex flex-wrap gap-2">${zoneButtons}</div>
                    </div>
                </div>
            </div>
    `;

    // Organize competitions by category
    const categoryOrder = ['A ZONE', 'B ZONE', 'C ZONE', 'D ZONE', 'MIX ZONE'];
    
    categoryOrder.forEach(categoryName => {
        const category = leaderAllCategories.find(cat => cat.name === categoryName);
        if (!category) return;

        let categoryCompetitions = leaderAllCompetitions.filter(c => c.category_id === category.id);
        
        // Apply filters
        if (leaderCurrentProgramTypeFilter === 'stage') {
            categoryCompetitions = categoryCompetitions.filter(c => c.is_stage);
        } else if (leaderCurrentProgramTypeFilter === 'non-stage') {
            categoryCompetitions = categoryCompetitions.filter(c => !c.is_stage);
        }
        
        if (leaderCurrentProgramZoneFilter !== 'all') {
            if (leaderCurrentProgramZoneFilter !== categoryName) {
                categoryCompetitions = [];
            }
        }

        if (categoryCompetitions.length === 0) return;

        html += `
            <div class="bg-white rounded-lg">
                <div class="px-4 py-3 border-b bg-gray-50">
                    <h3 class="font-medium">${categoryName}</h3>
                </div>
                <div class="p-4 space-y-3">
        `;

        categoryCompetitions.forEach(competition => {
            const currentAssignments = leaderAllAssignments.filter(a => a.competition_id === competition.id);
            const currentGroupEntries = leaderAllGroupEntries.filter(g => g.competition_id === competition.id);
            const totalRegistered = competition.is_group ? currentGroupEntries.length : currentAssignments.length;
            const isMixZone = categoryName === 'MIX ZONE';

            html += `
                <div class="border rounded p-3">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex-1">
                            <h4 class="font-medium">${competition.name}</h4>
                            <div class="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                                <span class="px-2 py-1 rounded ${competition.is_stage ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                                    ${competition.is_stage ? 'Stage' : 'Non-Stage'}
                                </span>
                                <span>${competition.is_group ? 'Group' : 'Individual'}</span>
                                ${!isMixZone ? `<span>${totalRegistered}/${competition.max_participants_per_team}</span>` : `<span>${totalRegistered} (∞)</span>`}
                            </div>
                        </div>
                        <button onclick="openLeaderAssignModal('${competition.id}')" 
                                class="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                            ${leaderIcons.plus}
                            <span>Add</span>
                        </button>
                    </div>
                    
                    <div class="mt-3">
                        ${competition.is_group ? 
                            renderLeaderGroupEntries(competition.id, currentGroupEntries) :
                            renderLeaderIndividualAssignments(competition.id, currentAssignments)
                        }
                    </div>
                </div>
            `;
        });

        html += '</div></div>';
    });

    html += '</div>';

    content.innerHTML = html;
}

function setLeaderProgramTypeFilter(type) {
    leaderCurrentProgramTypeFilter = type;
    renderLeaderProgramsSection();
}

function setLeaderProgramZoneFilter(zone) {
    leaderCurrentProgramZoneFilter = zone;
    renderLeaderProgramsSection();
}

// Section 3: Status with zone-based sorting
function renderLeaderStatusSection() {
    const content = document.getElementById('leader-content');
    
    const sortButtons = [
        { key: 'programs', label: 'Programs' },
        { key: 'participants', label: 'Participants' }
    ].map(sort => {
        const isActive = leaderCurrentStatusSort === sort.key;
        return `
            <button onclick="setLeaderStatusSort('${sort.key}')" 
                    class="px-3 py-2 rounded text-sm ${isActive ? 'bg-blue-500 text-white' : 'bg-white border text-gray-600'}">
                ${sort.label}
            </button>
        `;
    }).join('');

    let html = `
        <div class="space-y-4">
            <div class="bg-white rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-3">
                    ${leaderIcons.filter}
                    <span class="text-sm font-medium">View</span>
                </div>
                <div class="flex gap-2">${sortButtons}</div>
            </div>
    `;

    if (leaderCurrentStatusSort === 'programs') {
        html += renderLeaderProgramsStatusView();
    } else {
        html += renderLeaderParticipantsStatusView();
    }

    html += '</div>';
    content.innerHTML = html;
}

function renderLeaderProgramsStatusView() {
    let html = '';
    
    leaderAllCategories.forEach(category => {
        const categoryCompetitions = leaderAllCompetitions.filter(c => c.category_id === category.id);
        if (categoryCompetitions.length === 0) return;

        html += `
            <div class="bg-white rounded-lg">
                <div class="px-4 py-3 border-b bg-gray-50">
                    <h4 class="font-medium">${category.name}</h4>
                </div>
                <div class="p-4 space-y-3">
        `;

        categoryCompetitions.forEach(competition => {
            const assignments = leaderAllAssignments.filter(a => a.competition_id === competition.id);
            const groupEntries = leaderAllGroupEntries.filter(g => g.competition_id === competition.id);
            
            const totalRegistered = competition.is_group ? groupEntries.length : assignments.length;
            const maxAllowed = competition.max_participants_per_team;
            const isMixZone = category.name === 'MIX ZONE';

            html += `
                <div class="border rounded p-3">
                    <div class="flex justify-between items-center mb-2">
                        <h5 class="font-medium">${competition.name}</h5>
                        <span class="text-sm text-gray-500">
                            ${isMixZone ? `${totalRegistered}` : `${totalRegistered}/${maxAllowed}`}
                        </span>
                    </div>
                    <div class="text-sm">
                        ${competition.is_group ? 
                            renderLeaderStatusGroupEntries(competition.id, groupEntries) :
                            renderLeaderStatusAssignments(competition.id, assignments)
                        }
                    </div>
                </div>
            `;
        });

        html += '</div></div>';
    });

    return html;
}

function renderLeaderParticipantsStatusView() {
    let html = '';
    
    leaderAllCategories.forEach(category => {
        const categoryParticipants = leaderAllParticipants.filter(p => p.category_id === category.id);
        if (categoryParticipants.length === 0) return;

        html += `
            <div class="bg-white rounded-lg">
                <div class="px-4 py-3 border-b bg-gray-50">
                    <h4 class="font-medium">${category.name}</h4>
                </div>
                <div class="p-4 space-y-3">
        `;

        categoryParticipants.forEach(participant => {
            const participantAssignments = leaderAllAssignments.filter(a => a.participant_id === participant.id);
            const allPrograms = participantAssignments.map(a => a.competitions.name);

            html += `
                <div class="border rounded p-3">
                    <h5 class="font-medium mb-2">${participant.name}</h5>
                    <div class="text-sm text-gray-600">
                        ${allPrograms.length > 0 ? 
                            allPrograms.map(program => `<span class="inline-block bg-gray-100 px-2 py-1 rounded mr-1 mb-1">${program}</span>`).join('') :
                            '<span class="text-gray-400">No programs assigned</span>'
                        }
                    </div>
                </div>
            `;
        });

        html += '</div></div>';
    });

    return html;
}

function setLeaderStatusSort(sortType) {
    leaderCurrentStatusSort = sortType;
    renderLeaderStatusSection();
}

// Utility functions
function renderLeaderIndividualAssignments(competitionId, assignments) {
    if (assignments.length === 0) {
        return '<p class="text-center text-gray-500 text-sm py-2">No participants assigned</p>';
    }

    return assignments.map(assignment => `
        <div class="flex justify-between items-center bg-gray-50 px-2 py-1 rounded mb-1">
            <span class="text-sm">${assignment.participants.name}</span>
            <button onclick="removeLeaderAssignment('${assignment.id}')" class="text-red-500 hover:text-red-700">
                ${leaderIcons.x}
            </button>
        </div>
    `).join('');
}

function renderLeaderGroupEntries(competitionId, groupEntries) {
    if (groupEntries.length === 0) {
        return '<p class="text-center text-gray-500 text-sm py-2">No group entries</p>';
    }

    return groupEntries.map(entry => `
        <div class="flex justify-between items-center bg-gray-50 px-2 py-1 rounded mb-1">
            <div>
                <span class="text-sm font-medium">${entry.representative_name}</span>
                <span class="text-xs text-gray-500 ml-2">(${entry.group_size})</span>
            </div>
            <button onclick="removeLeaderGroupEntry('${entry.id}')" class="text-red-500 hover:text-red-700">
                ${leaderIcons.x}
            </button>
        </div>
    `).join('');
}

function renderLeaderStatusAssignments(competitionId, assignments) {
    if (assignments.length === 0) {
        return '<span class="text-gray-400">No participants</span>';
    }
    return assignments.map(a => a.participants.name).join(', ');
}

function renderLeaderStatusGroupEntries(competitionId, groupEntries) {
    if (groupEntries.length === 0) {
        return '<span class="text-gray-400">No groups</span>';
    }
    return groupEntries.map(entry => `${entry.representative_name} (${entry.group_size})`).join(', ');
}

// Custom Alert System for Leader
function showLeaderAlert(message, type = 'info', showCancel = false) {
    return new Promise((resolve) => {
        const modal = document.getElementById('leaderAlertModal');
        const messageEl = document.getElementById('leaderAlertMessage');
        const iconEl = document.getElementById('leaderAlertIcon');
        const confirmBtn = document.getElementById('leaderAlertConfirm');
        const cancelBtn = document.getElementById('leaderAlertCancel');

        messageEl.textContent = message;
        
        const iconColor = type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-500' : 'text-blue-500';
        const iconSvg = type === 'error' ? leaderIcons.x : type === 'success' ? leaderIcons.check : leaderIcons.filter;
        iconEl.innerHTML = `<div class="w-12 h-12 mx-auto ${iconColor}">${iconSvg}</div>`;

        if (showCancel) {
            cancelBtn.classList.remove('hidden');
            cancelBtn.onclick = () => {
                modal.classList.add('hidden');
                resolve(false);
            };
        } else {
            cancelBtn.classList.add('hidden');
        }

        confirmBtn.onclick = () => {
            modal.classList.add('hidden');
            resolve(true);
        };

        modal.classList.remove('hidden');
    });
}

function showLeaderConfirm(message) {
    return showLeaderAlert(message, 'info', true);
}

// Modal functions
let leaderCurrentCompetitionId = null;

async function openLeaderAssignModal(competitionId) {
    leaderCurrentCompetitionId = competitionId;
    const competition = leaderAllCompetitions.find(c => c.id === competitionId);
    const modal = document.getElementById('leaderAssignModal');
    const modalContent = document.getElementById('leaderModalContent');
    
    if (competition.is_group) {
        modalContent.innerHTML = `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium mb-1">Representative Name</label>
                    <input type="text" id="leaderRepresentativeName" class="w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Group Size</label>
                    <input type="number" id="leaderGroupSize" min="2" max="${competition.max_participants_per_team}" class="w-full border rounded px-3 py-2">
                </div>
            </div>
        `;
        document.getElementById('leaderSaveAssignment').onclick = saveLeaderGroupEntry;
    } else {
        let availableParticipants;
        const isMixZone = competition.categories.name === 'MIX ZONE';
        
        if (isMixZone) {
            availableParticipants = leaderAllParticipants.filter(p => 
                ['A ZONE', 'B ZONE', 'C ZONE', 'D ZONE'].includes(p.categories.name) &&
                !leaderAllAssignments.some(a => a.participant_id === p.id && a.competition_id === competitionId)
            );
        } else {
            availableParticipants = leaderAllParticipants.filter(p => 
                p.category_id === competition.category_id &&
                !leaderAllAssignments.some(a => a.participant_id === p.id && a.competition_id === competitionId)
            );
        }
        
        modalContent.innerHTML = `
            <div>
                <label class="block text-sm font-medium mb-2">Select Participants</label>
                <div class="max-h-48 overflow-y-auto border rounded p-2 space-y-1">
                    ${availableParticipants.length === 0 ? 
                        '<p class="text-center text-gray-500 py-4">No available participants</p>' :
                        availableParticipants.map(p => `
                            <label class="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                                <input type="checkbox" value="${p.id}" class="leader-participant-checkbox">
                                <span class="text-sm">${p.name} ${isMixZone ? `(${p.categories.name})` : ''}</span>
                            </label>
                        `).join('')
                    }
                </div>
                ${availableParticipants.length > 0 ? `
                    <div class="mt-2 flex space-x-2">
                        <button type="button" onclick="selectAllLeaderParticipants()" class="text-xs bg-gray-100 px-2 py-1 rounded">All</button>
                        <button type="button" onclick="deselectAllLeaderParticipants()" class="text-xs bg-gray-100 px-2 py-1 rounded">None</button>
                    </div>
                ` : ''}
            </div>
        `;
        document.getElementById('leaderSaveAssignment').onclick = saveLeaderMultipleAssignments;
    }
    
    modal.classList.remove('hidden');
}

function selectAllLeaderParticipants() {
    document.querySelectorAll('.leader-participant-checkbox').forEach(cb => cb.checked = true);
}

function deselectAllLeaderParticipants() {
    document.querySelectorAll('.leader-participant-checkbox').forEach(cb => cb.checked = false);
}

function closeLeaderAssignModal() {
    document.getElementById('leaderAssignModal').classList.add('hidden');
    leaderCurrentCompetitionId = null;
}

async function saveLeaderMultipleAssignments() {
    const selectedParticipants = Array.from(document.querySelectorAll('.leader-participant-checkbox:checked')).map(cb => cb.value);

    if (selectedParticipants.length === 0) {
        showLeaderAlert('Please select at least one participant', 'error');
        return;
    }

    try {
        const assignments = selectedParticipants.map(participantId => ({
            participant_id: participantId,
            competition_id: leaderCurrentCompetitionId
        }));

        const { error } = await db.from('assignments').insert(assignments);

        if (error) {
            showLeaderAlert('Error assigning participants: ' + error.message, 'error');
            return;
        }

        closeLeaderAssignModal();
        await loadLeaderData();
        renderLeaderProgramsSection();
        showLeaderAlert(`${selectedParticipants.length} participant(s) assigned successfully!`, 'success');
    } catch (error) {
        showLeaderAlert('Error: ' + error.message, 'error');
    }
}

async function saveLeaderGroupEntry() {
    const representativeName = document.getElementById('leaderRepresentativeName').value.trim();
    const groupSize = parseInt(document.getElementById('leaderGroupSize').value);

    if (!representativeName || !groupSize) {
        showLeaderAlert('Please fill all fields', 'error');
        return;
    }

    try {
        const { error } = await db.from('group_entries').insert({
            competition_id: leaderCurrentCompetitionId,
            team_id: leaderCurrentTeamId,
            representative_name: representativeName,
            group_size: groupSize
        });

        if (error) {
            showLeaderAlert('Error adding group entry: ' + error.message, 'error');
            return;
        }

        closeLeaderAssignModal();
        await loadLeaderData();
        renderLeaderProgramsSection();
        showLeaderAlert('Group entry added successfully!', 'success');
    } catch (error) {
        showLeaderAlert('Error: ' + error.message, 'error');
    }
}

async function removeLeaderAssignment(assignmentId) {
    const confirmed = await showLeaderConfirm('Remove this participant from the program?');
    if (!confirmed) return;

    try {
        const { error } = await db.from('assignments').delete().eq('id', assignmentId);
        if (error) {
            showLeaderAlert('Error removing assignment: ' + error.message, 'error');
            return;
        }

        await loadLeaderData();
        if (leaderCurrentSection === 'programs') renderLeaderProgramsSection();
        if (leaderCurrentSection === 'participants') renderLeaderParticipantsSection();
        if (leaderCurrentSection === 'status') renderLeaderStatusSection();
        showLeaderAlert('Assignment removed successfully!', 'success');
    } catch (error) {
        showLeaderAlert('Error: ' + error.message, 'error');
    }
}

async function removeLeaderGroupEntry(entryId) {
    const confirmed = await showLeaderConfirm('Remove this group entry?');
    if (!confirmed) return;

    try {
        const { error } = await db.from('group_entries').delete().eq('id', entryId);
        if (error) {
            showLeaderAlert('Error removing group entry: ' + error.message, 'error');
            return;
        }

        await loadLeaderData();
        if (leaderCurrentSection === 'programs') renderLeaderProgramsSection();
        if (leaderCurrentSection === 'status') renderLeaderStatusSection();
        showLeaderAlert('Group entry removed successfully!', 'success');
    } catch (error) {
        showLeaderAlert('Error: ' + error.message, 'error');
    }
}
