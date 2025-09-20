// Judge App Variables
let judgeCurrentUser = null;
let judgeAssignedCompetitions = [];
let judgeCurrentCompetition = null;
let judgeParticipants = [];
let judgeGroupEntries = [];
let judgeCurrentResults = {};
let judgeCurrentSection = 'competitions';

// SVG Icons for Judge Interface
const judgeIcons = {
    competitions: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>`,
    participants: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v1a6 6 0 01-3-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
    save: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
    results: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`,
    back: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"></path></svg>`,
    calculator: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`,
    search: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`,
    filter: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path></svg>`
};

// Updated points calculation functions
function calculateCommonPoints(percentage) {
    if (percentage >= 90) return 6; // A+
    if (percentage >= 70) return 5; // A
    if (percentage >= 60) return 3; // B
    if (percentage >= 50) return 1; // C
    return 0; // F
}

function calculatePositionPoints(position, isGroup, groupSize = 1) {
    if (position > 3) return 0;
    
    if (isGroup) {
        const groupPointsMap = {
            2: {1: 7, 2: 5, 3: 3},
            3: {1: 10, 2: 7, 3: 4},
            4: {1: 15, 2: 10, 3: 5},
            5: {1: 15, 2: 10, 3: 5}
        };
        
        const size = Math.min(Math.max(groupSize, 2), 5);
        return groupPointsMap[size][position] || 0;
    } else {
        const individualPoints = {1: 5, 2: 3, 3: 1};
        return individualPoints[position] || 0;
    }
}

function calculateTotalPoints(percentage, position, isGroup, groupSize = 1) {
    const commonPoints = calculateCommonPoints(percentage);
    const positionPoints = calculatePositionPoints(position, isGroup, groupSize);
    return commonPoints + positionPoints;
}

async function renderJudgeApp() {
    try {
        judgeCurrentUser = getUser();
        if (!judgeCurrentUser || judgeCurrentUser.role !== 'judge') {
            showAlert('Access denied. Judge credentials required.', 'error');
            return;
        }

        await loadJudgeData();
        
        const root = document.getElementById('judge-app');
        root.innerHTML = `
            <div class="max-w-7xl mx-auto p-6">
                <!-- Header -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">Judge Panel</h1>
                            <p class="text-gray-600">Welcome, ${judgeCurrentUser.username}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-600">${judgeAssignedCompetitions.length} Competitions Assigned</span>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="bg-white rounded-lg shadow-sm mb-6 p-4">
                    <div class="flex space-x-4">
                        ${renderJudgeNavItem('competitions', 'My Competitions', judgeIcons.competitions)}
                        ${renderJudgeNavItem('results', 'My Results', judgeIcons.results)}
                    </div>
                </nav>

                <!-- Content -->
                <div id="judgeContent">
                    ${renderJudgeContent()}
                </div>
            </div>

            <!-- Judge Modal -->
            <div id="judgeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                <div class="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div id="judgeModalContent"></div>
                </div>
            </div>
        `;

        console.log('Judge app rendered successfully');
        
    } catch (error) {
        console.error('Error rendering judge app:', error);
        showAlert('Failed to load judge interface: ' + error.message, 'error');
    }
}

async function loadJudgeData() {
    try {
        const { data: assignments, error } = await window.db
            .from('judge_assignments')
            .select(`
                *,
                competitions!inner(
                    *,
                    categories(name),
                    stages(name)
                )
            `)
            .eq('judge_id', judgeCurrentUser.id);

        if (error) throw error;
        judgeAssignedCompetitions = assignments || [];

    } catch (error) {
        console.error('Error loading judge data:', error);
        throw error;
    }
}

function renderJudgeNavItem(section, label, icon) {
    const isActive = judgeCurrentSection === section;
    return `
        <button 
            onclick="switchJudgeSection('${section}')"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
            }">
            ${icon}
            <span>${label}</span>
        </button>
    `;
}

function switchJudgeSection(section) {
    judgeCurrentSection = section;
    document.getElementById('judgeContent').innerHTML = renderJudgeContent();
}

function renderJudgeContent() {
    if (judgeCurrentSection === 'competitions') {
        return renderJudgeCompetitions();
    } else if (judgeCurrentSection === 'results') {
        return renderJudgeResults();
    }
    return renderJudgeCompetitions();
}

function renderJudgeResults() {
    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Judged Competitions</h2>
                        <p class="text-gray-600">Click on a competition to view detailed results</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Category Filter -->
                        <select id="categoryFilter" onchange="filterJudgeResults()" class="px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="">All Categories</option>
                            <option value="A ZONE">A ZONE</option>
                            <option value="B ZONE">B ZONE</option>
                            <option value="C ZONE">C ZONE</option>
                            <option value="D ZONE">D ZONE</option>
                            <option value="MIX ZONE">MIX ZONE</option>
                        </select>
                        
                        <!-- Search -->
                        <div class="relative">
                            <input type="text" id="searchResults" onkeyup="filterJudgeResults()" 
                                   placeholder="Search competitions..." 
                                   class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                ${judgeIcons.search}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="resultsContainer" class="p-6">
                ${renderJudgeResultsList()}
            </div>
        </div>
    `;
}

function renderJudgeResultsList() {
    return `
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="judgeResultsGrid">
            ${judgeAssignedCompetitions.map(assignment => {
                const competition = assignment.competitions;
                return `
                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer competition-card"
                         data-category="${competition.categories?.name || ''}"
                         data-name="${competition.name.toLowerCase()}"
                         onclick="viewJudgeCompetitionResults('${competition.id}')">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <h3 class="font-semibold text-gray-900">${competition.name}</h3>
                                <p class="text-sm text-gray-600">${competition.categories?.name || 'Unknown Category'}</p>
                            </div>
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                ${judgeIcons.results}
                            </div>
                        </div>
                        
                        <div class="space-y-2">
                            <div class="flex items-center text-sm text-gray-600">
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    competition.is_stage ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }">
                                    ${competition.is_stage ? 'Stage' : 'Non-Stage'}
                                </span>
                                <span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    competition.is_group ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                                }">
                                    ${competition.is_group ? 'Group' : 'Individual'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function filterJudgeResults() {
    const categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();
    const searchTerm = document.getElementById('searchResults').value.toLowerCase();
    const cards = document.querySelectorAll('.competition-card');
    
    cards.forEach(card => {
        const category = card.getAttribute('data-category').toLowerCase();
        const name = card.getAttribute('data-name');
        
        const categoryMatch = !categoryFilter || category === categoryFilter.toLowerCase();
        const nameMatch = !searchTerm || name.includes(searchTerm);
        
        if (categoryMatch && nameMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function viewJudgeCompetitionResults(competitionId) {
    try {
        const competition = judgeAssignedCompetitions.find(a => a.competitions.id === competitionId).competitions;
        
        // Load results for this competition
        const tableName = competition.is_group ? 'group_results' : 'competition_results';
        const { data: results, error } = await window.db
            .from(tableName)
            .select(`
                *,
                ${competition.is_group ? 'teams(name)' : 'participants(*, teams(name))'}
            `)
            .eq('competition_id', competitionId)
            .eq('judge_id', judgeCurrentUser.id)
            .order('position', { ascending: true });
            
        if (error) throw error;
        
        showJudgeResultsModal(competition, results || []);
        
    } catch (error) {
        console.error('Error loading competition results:', error);
        showAlert('Failed to load results', 'error');
    }
}

function showJudgeResultsModal(competition, results) {
    const modal = document.getElementById('judgeModal');
    const content = document.getElementById('judgeModalContent');
    
    content.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="text-xl font-medium text-gray-900">${competition.name} - Results</h3>
                    <p class="text-gray-600">${competition.categories?.name} • ${competition.is_group ? 'Group' : 'Individual'} Competition</p>
                </div>
                <button onclick="closeJudgeModal()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            
            ${results.length === 0 ? `
                <div class="text-center py-12">
                    <p class="text-gray-500">No results available for this competition.</p>
                </div>
            ` : `
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${results.map(result => {
                                const grade = calculateGrade(result.marks);
                                return `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                result.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                result.position === 2 ? 'bg-gray-100 text-gray-800' :
                                                result.position === 3 ? 'bg-orange-100 text-orange-800' :
                                                'bg-blue-100 text-blue-800'
                                            }">
                                                ${result.position}${getOrdinalSuffix(result.position)}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="font-mono font-bold text-lg text-blue-600">
                                                ${getCodeLetter(result)}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                                            ${competition.is_group ? result.teams?.name : result.participants?.teams?.name || 'No Team'}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="font-medium">${result.marks}/100</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeBadgeClass(grade)}">
                                                ${grade}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="font-bold text-green-600">${result.points}</span>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `}
            
            <div class="flex justify-end mt-6">
                <button onclick="closeJudgeModal()" 
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function getCodeLetter(result) {
    // This should get the code from competition_sessions table
    // For now, generate a placeholder
    return String.fromCharCode(65 + (Math.abs(result.id?.slice(-1).charCodeAt(0) || 0) % 26));
}

function getOrdinalSuffix(num) {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
}

function renderJudgeCompetitions() {
    if (judgeAssignedCompetitions.length === 0) {
        return `
            <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    ${judgeIcons.competitions}
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Competitions Assigned</h3>
                <p class="text-gray-500">You haven't been assigned to any competitions yet.</p>
            </div>
        `;
    }

    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <h2 class="text-xl font-bold text-gray-900">My Assigned Competitions</h2>
                <p class="text-gray-600">Click on a competition to start judging</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                ${judgeAssignedCompetitions.map(assignment => {
                    const competition = assignment.competitions;
                    return `
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                             onclick="openJudgeCompetition('${competition.id}')">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900">${competition.name}</h3>
                                    <p class="text-sm text-gray-600">${competition.categories?.name || 'Unknown Category'}</p>
                                </div>
                                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    ${judgeIcons.competitions}
                                </div>
                            </div>
                            
                            <div class="space-y-2">
                                <div class="flex items-center text-sm text-gray-600">
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        competition.is_stage ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }">
                                        ${competition.is_stage ? 'Stage' : 'Non-Stage'}
                                    </span>
                                    <span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        competition.is_group ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                                    }">
                                        ${competition.is_group ? 'Group' : 'Individual'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

async function openJudgeCompetition(competitionId) {
    try {
        judgeCurrentCompetition = judgeAssignedCompetitions.find(a => a.competitions.id === competitionId).competitions;
        
        if (judgeCurrentCompetition.is_group) {
            await loadGroupEntries(competitionId);
        } else {
            await loadParticipants(competitionId);
        }
        
        await loadExistingResults(competitionId);
        showJudgeCompetitionModal();
        
    } catch (error) {
        console.error('Error opening competition:', error);
        showAlert('Failed to load competition details', 'error');
    }
}

async function loadParticipants(competitionId) {
    try {
        const { data: sessions, error } = await window.db
            .from('competition_sessions')
            .select(`
                *,
                participants!inner(
                    *,
                    teams(name),
                    categories(name)
                )
            `)
            .eq('competition_id', competitionId);

        if (error) throw error;

        judgeParticipants = sessions?.map(session => ({
            ...session.participants,
            session_id: session.id,
            random_code: session.random_code
        })) || [];

    } catch (error) {
        console.error('Error loading participants:', error);
        throw error;
    }
}

async function loadGroupEntries(competitionId) {
    try {
        const { data: entries, error } = await window.db
            .from('group_entries')
            .select(`
                *,
                teams(name)
            `)
            .eq('competition_id', competitionId);

        if (error) throw error;
        judgeGroupEntries = entries || [];

    } catch (error) {
        console.error('Error loading group entries:', error);
        throw error;
    }
}

async function loadExistingResults(competitionId) {
    try {
        const tableName = judgeCurrentCompetition.is_group ? 'group_results' : 'competition_results';
        
        const { data: results, error } = await window.db
            .from(tableName)
            .select('*')
            .eq('competition_id', competitionId)
            .eq('judge_id', judgeCurrentUser.id);

        if (error) throw error;

        judgeCurrentResults = {};
        results?.forEach(result => {
            const key = judgeCurrentCompetition.is_group ? result.team_id : result.participant_id;
            judgeCurrentResults[key] = result;
        });

    } catch (error) {
        console.error('Error loading existing results:', error);
        throw error;
    }
}

function showJudgeCompetitionModal() {
    const modal = document.getElementById('judgeModal');
    const content = document.getElementById('judgeModalContent');
    
    const entries = judgeCurrentCompetition.is_group ? judgeGroupEntries : judgeParticipants;
    
    content.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="text-xl font-medium text-gray-900">${judgeCurrentCompetition.name}</h3>
                    <p class="text-gray-600">${judgeCurrentCompetition.categories?.name} • ${judgeCurrentCompetition.is_group ? 'Group' : 'Individual'} Competition</p>
                </div>
                <button onclick="closeJudgeModal()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            
            ${entries.length === 0 ? `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        ${judgeIcons.participants}
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No ${judgeCurrentCompetition.is_group ? 'Groups' : 'Participants'}</h3>
                    <p class="text-gray-600">No ${judgeCurrentCompetition.is_group ? 'groups have registered' : 'participants have checked in'} for this competition.</p>
                </div>
            ` : `
                <div class="mb-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-center">
                            ${judgeIcons.calculator}
                            <div class="ml-3">
                                <h4 class="text-sm font-medium text-blue-800">New Scoring System</h4>
                                <p class="text-sm text-blue-700">Common Points: A+ (90-100%) = 6pts • A (70-89%) = 5pts • B (60-69%) = 3pts • C (50-59%) = 1pt</p>
                                <p class="text-sm text-blue-700">Position Bonus: Individual (1st: +5, 2nd: +3, 3rd: +1) • Group varies by team size</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                                ${judgeCurrentCompetition.is_group ? '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>' : ''}
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks (%)</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Common Points</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${entries.map(entry => {
                                const key = entry.id;
                                const existingResult = judgeCurrentResults[key];
                                const marks = existingResult?.marks || '';
                                const grade = marks ? calculateGrade(marks) : '';
                                const commonPoints = marks ? calculateCommonPoints(marks) : '';
                                
                                return `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                                                ${judgeCurrentCompetition.is_group ? `G${entry.id.slice(-2).toUpperCase()}` : entry.random_code || `P${entry.id.slice(-2).toUpperCase()}`}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                                            ${entry.teams?.name || 'No Team'}
                                        </td>
                                        ${judgeCurrentCompetition.is_group ? `
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="text-sm text-gray-900">${entry.group_size} members</span>
                                            </td>
                                        ` : ''}
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <input type="number" 
                                                   min="0" 
                                                   max="100" 
                                                   step="1"
                                                   value="${marks}"
                                                   id="marks_${key}"
                                                   onchange="updateJudgeScore('${key}', this.value, ${judgeCurrentCompetition.is_group}, ${entry.group_size || 1})"
                                                   class="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span id="grade_${key}" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeBadgeClass(grade)}">
                                                ${grade}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span id="points_${key}" class="font-medium text-gray-900">${commonPoints}</span>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6 pt-6 border-t">
                    <button onclick="closeJudgeModal()" 
                            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onclick="saveJudgeScores()" 
                            class="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        ${judgeIcons.save}
                        <span class="ml-2">Save Scores</span>
                    </button>
                </div>
            `}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function updateJudgeScore(entryKey, marks, isGroup, groupSize) {
    const marksValue = parseInt(marks) || 0;
    
    if (marksValue < 0 || marksValue > 100) {
        showAlert('Marks must be between 0 and 100', 'error');
        document.getElementById(`marks_${entryKey}`).value = '';
        return;
    }
    
    const grade = calculateGrade(marksValue);
    const commonPoints = calculateCommonPoints(marksValue);
    
    document.getElementById(`grade_${entryKey}`).textContent = grade;
    document.getElementById(`grade_${entryKey}`).className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeBadgeClass(grade)}`;
    document.getElementById(`points_${entryKey}`).textContent = commonPoints;
    
    if (!judgeCurrentResults[entryKey]) {
        judgeCurrentResults[entryKey] = {};
    }
    judgeCurrentResults[entryKey].marks = marksValue;
    judgeCurrentResults[entryKey].grade = grade;
    judgeCurrentResults[entryKey].commonPoints = commonPoints;
    judgeCurrentResults[entryKey].isGroup = isGroup;
    judgeCurrentResults[entryKey].groupSize = groupSize;
}

function calculateGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 70) return 'A';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'F';
}

function getGradeBadgeClass(grade) {
    switch(grade) {
        case 'A+': return 'bg-green-100 text-green-800';
        case 'A': return 'bg-blue-100 text-blue-800';
        case 'B': return 'bg-yellow-100 text-yellow-800';
        case 'C': return 'bg-orange-100 text-orange-800';
        case 'F': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

async function saveJudgeScores() {
    try {
        const tableName = judgeCurrentCompetition.is_group ? 'group_results' : 'competition_results';
        const entries = judgeCurrentCompetition.is_group ? judgeGroupEntries : judgeParticipants;
        
        const resultsToSave = [];
        
        for (const entry of entries) {
            const key = entry.id;
            const result = judgeCurrentResults[key];
            
            if (result && result.marks !== undefined) {
                const resultData = {
                    competition_id: judgeCurrentCompetition.id,
                    judge_id: judgeCurrentUser.id,
                    marks: result.marks,
                    points: result.commonPoints, // Will be updated with position bonus later
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                if (judgeCurrentCompetition.is_group) {
                    resultData.team_id = entry.team_id;
                } else {
                    resultData.participant_id = entry.id;
                    resultData.team_id = entry.team_id;
                }
                
                resultsToSave.push(resultData);
            }
        }
        
        if (resultsToSave.length === 0) {
            showAlert('No scores to save', 'info');
            return;
        }
        
        const { error } = await window.db.from(tableName).upsert(resultsToSave, {
            onConflict: judgeCurrentCompetition.is_group 
                ? 'competition_id,team_id' 
                : 'competition_id,participant_id'
        });
        
        if (error) throw error;
        
        showAlert(`Successfully saved ${resultsToSave.length} scores!`, 'success');
        
        await calculatePositionsAndFinalPoints();
        closeJudgeModal();
        
    } catch (error) {
        console.error('Error saving judge scores:', error);
        showAlert('Failed to save scores: ' + error.message, 'error');
    }
}

async function calculatePositionsAndFinalPoints() {
    try {
        const tableName = judgeCurrentCompetition.is_group ? 'group_results' : 'competition_results';
        
        const { data: allResults, error } = await window.db
            .from(tableName)
            .select('*')
            .eq('competition_id', judgeCurrentCompetition.id)
            .order('marks', { ascending: false });
            
        if (error) throw error;
        
        const updates = [];
        let currentPosition = 1;
        let previousMarks = null;
        let sameMarkCount = 0;
        
        for (let i = 0; i < allResults.length; i++) {
            const result = allResults[i];
            
            if (previousMarks !== null && result.marks !== previousMarks) {
                currentPosition += sameMarkCount;
                sameMarkCount = 1;
            } else {
                sameMarkCount++;
            }
            
            const commonPoints = calculateCommonPoints(result.marks);
            const positionPoints = calculatePositionPoints(
                currentPosition, 
                judgeCurrentCompetition.is_group, 
                judgeCurrentCompetition.is_group ? result.group_size || 1 : 1
            );
            const finalPoints = commonPoints + positionPoints;
            
            updates.push({
                id: result.id,
                position: currentPosition,
                points: finalPoints
            });
            
            previousMarks = result.marks;
        }
        
        for (const update of updates) {
            await window.db
                .from(tableName)
                .update({ 
                    position: update.position, 
                    points: update.points 
                })
                .eq('id', update.id);
        }
        
    } catch (error) {
        console.error('Error calculating positions:', error);
    }
}

function closeJudgeModal() {
    document.getElementById('judgeModal').classList.add('hidden');
    judgeCurrentCompetition = null;
    judgeParticipants = [];
    judgeGroupEntries = [];
    judgeCurrentResults = {};
}

// Make functions globally available
window.renderJudgeApp = renderJudgeApp;
window.switchJudgeSection = switchJudgeSection;
window.openJudgeCompetition = openJudgeCompetition;
window.updateJudgeScore = updateJudgeScore;
window.saveJudgeScores = saveJudgeScores;
window.closeJudgeModal = closeJudgeModal;
window.filterJudgeResults = filterJudgeResults;
window.viewJudgeCompetitionResults = viewJudgeCompetitionResults;
