// Announcer App Variables
let announcerCurrentUser = null;
let announcerAssignedCompetitions = [];
let announcerCurrentCompetition = null;
let announcerCurrentSection = 'competitions';
let announcerAnnouncedCompetitions = new Set();

// SVG Icons for Announcer Interface
const announcerIcons = {
    competitions: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>`,
    announce: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>`,
    results: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`,
    trophy: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`
};

async function renderAnnouncerApp() {
    try {
        announcerCurrentUser = getUser();
        if (!announcerCurrentUser || announcerCurrentUser.role !== 'announcer') {
            showAlert('Access denied. Announcer credentials required.', 'error');
            return;
        }

        await loadAnnouncerData();
        
        const root = document.getElementById('announcer-app');
        root.innerHTML = `
            <div class="max-w-7xl mx-auto p-6">
                <!-- Header -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">Announcer Panel</h1>
                            <p class="text-gray-600">Welcome, ${announcerCurrentUser.username}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            ${announcerIcons.announce}
                            <span class="text-sm font-medium text-gray-600">${announcerAssignedCompetitions.length} Competitions Assigned</span>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="bg-white rounded-lg shadow-sm mb-6 p-4">
                    <div class="flex space-x-4">
                        ${renderAnnouncerNavItem('competitions', 'My Competitions', announcerIcons.competitions)}
                        ${renderAnnouncerNavItem('announced', 'Announced Results', announcerIcons.results)}
                    </div>
                </nav>

                <!-- Content -->
                <div id="announcerContent">
                    ${renderAnnouncerContent()}
                </div>
            </div>

            <!-- Announcer Modal -->
            <div id="announcerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                <div class="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div id="announcerModalContent"></div>
                </div>
            </div>
        `;

        console.log('Announcer app rendered successfully');
        
    } catch (error) {
        console.error('Error rendering announcer app:', error);
        showAlert('Failed to load announcer interface: ' + error.message, 'error');
    }
}

async function loadAnnouncerData() {
    try {
        const { data: assignments, error } = await window.db
            .from('announcer_assignments')
            .select(`
                *,
                competitions!inner(
                    *,
                    categories(name),
                    stages(name)
                )
            `)
            .eq('announcer_id', announcerCurrentUser.id);

        if (error) throw error;
        announcerAssignedCompetitions = assignments || [];

        // Load announced competitions
        const { data: announced } = await window.db
            .from('announcements')
            .select('competition_id')
            .eq('announcer_id', announcerCurrentUser.id);
        
        if (announced) {
            announcerAnnouncedCompetitions = new Set(announced.map(a => a.competition_id));
        }

    } catch (error) {
        console.error('Error loading announcer data:', error);
        throw error;
    }
}

function renderAnnouncerNavItem(section, label, icon) {
    const isActive = announcerCurrentSection === section;
    return `
        <button 
            onclick="switchAnnouncerSection('${section}')"
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

function switchAnnouncerSection(section) {
    announcerCurrentSection = section;
    document.getElementById('announcerContent').innerHTML = renderAnnouncerContent();
}

function renderAnnouncerContent() {
    if (announcerCurrentSection === 'competitions') {
        return renderAnnouncerCompetitions();
    } else if (announcerCurrentSection === 'announced') {
        return renderAnnouncedCompetitions();
    }
    return renderAnnouncerCompetitions();
}

function renderAnnouncerCompetitions() {
    if (announcerAssignedCompetitions.length === 0) {
        return `
            <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    ${announcerIcons.competitions}
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
                <p class="text-gray-600">Click on a competition to announce its results</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                ${announcerAssignedCompetitions.map(assignment => {
                    const competition = assignment.competitions;
                    const isAnnounced = announcerAnnouncedCompetitions.has(competition.id);
                    
                    return `
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${isAnnounced ? 'bg-green-50 border-green-200' : ''}"
                             onclick="viewCompetitionResults('${competition.id}')">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900">${competition.name}</h3>
                                    <p class="text-sm text-gray-600">${competition.categories?.name || 'Unknown Category'}</p>
                                </div>
                                <div class="w-10 h-10 ${isAnnounced ? 'bg-green-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center">
                                    ${isAnnounced ? announcerIcons.trophy : announcerIcons.competitions}
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
                                
                                <div class="text-center">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        isAnnounced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }">
                                        ${isAnnounced ? '✓ Announced' : 'Pending Announcement'}
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

function renderAnnouncedCompetitions() {
    const announcedList = announcerAssignedCompetitions.filter(assignment => 
        announcerAnnouncedCompetitions.has(assignment.competitions.id)
    );

    return `
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b">
                <h2 class="text-xl font-bold text-gray-900">Announced Competitions</h2>
                <p class="text-gray-600">Competitions that have been announced</p>
            </div>
            
            <div class="p-6">
                ${announcedList.length === 0 ? `
                    <div class="text-center py-8">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${announcerIcons.results}
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No Announced Competitions</h3>
                        <p class="text-gray-500">You haven't announced any competition results yet.</p>
                    </div>
                ` : `
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${announcedList.map(assignment => {
                            const competition = assignment.competitions;
                            return `
                                <div class="border border-green-200 rounded-lg p-4 bg-green-50">
                                    <div class="flex items-start justify-between mb-3">
                                        <div class="flex-1">
                                            <h3 class="font-semibold text-gray-900">${competition.name}</h3>
                                            <p class="text-sm text-gray-600">${competition.categories?.name}</p>
                                        </div>
                                        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            ${announcerIcons.trophy}
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            ✓ Results Announced
                                        </span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
}

async function viewCompetitionResults(competitionId) {
    try {
        const competition = announcerAssignedCompetitions.find(a => a.competitions.id === competitionId).competitions;
        
        // Load results for this competition
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
        
        showAnnouncerResultsModal(competition, results || []);
        
    } catch (error) {
        console.error('Error loading competition results:', error);
        showAlert('Failed to load results', 'error');
    }
}

function showAnnouncerResultsModal(competition, results) {
    const modal = document.getElementById('announcerModal');
    const content = document.getElementById('announcerModalContent');
    const isAnnounced = announcerAnnouncedCompetitions.has(competition.id);
    
    content.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="text-xl font-medium text-gray-900">${competition.name} - Results</h3>
                    <p class="text-gray-600">${competition.categories?.name} • ${competition.is_group ? 'Group' : 'Individual'} Competition</p>
                </div>
                <button onclick="closeAnnouncerModal()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            
            ${results.length === 0 ? `
                <div class="text-center py-12">
                    <p class="text-gray-500">No results available for this competition yet.</p>
                </div>
            ` : `
                <div class="mb-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 class="text-sm font-medium text-blue-800">Competition Results</h4>
                        <p class="text-sm text-blue-700">Final standings with points calculated using the new scoring system</p>
                    </div>
                </div>
                
                <div class="overflow-x-auto mb-6">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">${competition.is_group ? 'Group' : 'Participant'}</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Points</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${results.map(result => {
                                const grade = calculateGrade(result.marks);
                                return `
                                    <tr class="${result.position <= 3 ? 'bg-yellow-50' : ''}">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                result.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                result.position === 2 ? 'bg-gray-100 text-gray-800' :
                                                result.position === 3 ? 'bg-orange-100 text-orange-800' :
                                                'bg-blue-100 text-blue-800'
                                            }">
                                                ${result.position}${getOrdinalSuffix(result.position)}
                                                ${result.position === 1 ? ' 🥇' : result.position === 2 ? ' 🥈' : result.position === 3 ? ' 🥉' : ''}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="font-medium text-gray-900">
                                                ${competition.is_group ? 'Group Entry' : result.participants?.name || 'Unknown'}
                                            </div>
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
                                            <span class="font-bold text-green-600 text-lg">${result.points}</span>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                ${!isAnnounced ? `
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div class="flex">
                            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                            <div>
                                <h4 class="text-sm font-medium text-yellow-800">Ready to Announce</h4>
                                <p class="text-sm text-yellow-700 mt-1">Click the button below to officially announce these results.</p>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div class="flex">
                            <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            <div>
                                <h4 class="text-sm font-medium text-green-800">Results Announced</h4>
                                <p class="text-sm text-green-700 mt-1">These results have been officially announced.</p>
                            </div>
                        </div>
                    </div>
                `}
            `}
            
            <div class="flex justify-end space-x-3">
                <button onclick="closeAnnouncerModal()" 
                        class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Close
                </button>
                ${!isAnnounced && results.length > 0 ? `
                    <button onclick="announceResults('${competition.id}')" 
                            class="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        ${announcerIcons.announce}
                        <span class="ml-2">Announce Results</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

async function announceResults(competitionId) {
    try {
        const { error } = await window.db.from('announcements').insert({
            competition_id: competitionId,
            announcer_id: announcerCurrentUser.id,
            announced_at: new Date().toISOString()
        });
        
        if (error) throw error;
        
        announcerAnnouncedCompetitions.add(competitionId);
        showAlert('Results announced successfully!', 'success');
        closeAnnouncerModal();
        
        // Refresh the page to show updated status
        document.getElementById('announcerContent').innerHTML = renderAnnouncerContent();
        
    } catch (error) {
        console.error('Error announcing results:', error);
        showAlert('Failed to announce results', 'error');
    }
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

function getOrdinalSuffix(num) {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
}

function closeAnnouncerModal() {
    document.getElementById('announcerModal').classList.add('hidden');
}

// Make functions globally available
window.renderAnnouncerApp = renderAnnouncerApp;
window.switchAnnouncerSection = switchAnnouncerSection;
window.viewCompetitionResults = viewCompetitionResults;
window.announceResults = announceResults;
window.closeAnnouncerModal = closeAnnouncerModal;
