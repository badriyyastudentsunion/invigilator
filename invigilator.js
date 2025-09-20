// Invigilator App Variables
let invigilatorCurrentStageId = null;
let invigilatorCurrentStageName = '';
let invigilatorCompetitions = [];
let invigilatorSelectedCompetition = null;
let invigilatorParticipants = [];
let invigilatorReportedParticipants = new Set();
let invigilatorCodeGenerated = false;
let invigilatorParticipantCodes = {};
let invigilatorCodesFinalized = false;
let videoStream = null;
let barcodeDetector = null;
let scanningActive = false;
let lastScannedCode = null;

// Professional SVG Icons
const invigilatorIcons = {
    competitions: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    participants: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 715-5z"></path></svg>`,
    qr: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z"></path></svg>`,
    check: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`,
    scan: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z" clip-rule="evenodd"></path></svg>`,
    letter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path></svg>`,
    proceed: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`,
    back: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>`
};

async function renderInvigilatorApp(stageId, stageName) {
    try {
        console.log('Initializing invigilator app for stage:', stageName);
        
        invigilatorCurrentStageId = stageId;
        invigilatorCurrentStageName = stageName;
        
        // Initialize barcode detector
        await initializeBarcodeDetector();
        
        await loadInvigilatorData();
        
        const root = document.getElementById('invigilator-app');
        if (!root) {
            throw new Error('Invigilator app container not found');
        }
        
        root.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Stage Info Card -->
                <div class="p-4">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-lg font-bold text-gray-900">${invigilatorCurrentStageName}</h2>
                                <p class="text-sm text-gray-600">Competition Management</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="px-4 pb-4">
                    ${renderInvigilatorCompetitions()}
                </div>
            </div>

            <!-- QR Modal -->
            <div id="qrModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 id="qrModalTitle" class="text-lg font-medium text-gray-900"></h3>
                            <button onclick="closeQRModal()" class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div id="qrModalContent"></div>
                    </div>
                </div>
            </div>

            <!-- QR Scanner Modal -->
            <div id="qrScannerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                <div class="bg-white rounded-lg max-w-md w-full mx-4">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-medium text-gray-900">QR Code Scanner</h3>
                            <button onclick="stopDirectScanning()" class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div id="qr-scanner-container"></div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Invigilator app rendered successfully');
        
        // Add haptic feedback
        if (window.hapticFeedback) window.hapticFeedback('light');
        
    } catch (error) {
        console.error('Error rendering invigilator app:', error);
        showAlert('Failed to load invigilator interface: ' + error.message, 'error');
    }
}

async function initializeBarcodeDetector() {
    try {
        if ('BarcodeDetector' in window) {
            const supportedFormats = await BarcodeDetector.getSupportedFormats();
            if (supportedFormats.includes('qr_code')) {
                barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
                console.log('Built-in BarcodeDetector initialized');
            }
        }
    } catch (error) {
        console.error('Error initializing barcode detector:', error);
    }
}

async function loadInvigilatorData() {
    try {
        console.log('Loading competitions for stage:', invigilatorCurrentStageId);
        
        const { data: competitions, error } = await window.db
            .from('competitions')
            .select(`
                *,
                categories(name),
                stages(name)
            `)
            .eq('stage_id', invigilatorCurrentStageId)
            .order('categories(name), name');
            
        if (error) {
            console.error('Error loading competitions:', error);
            throw new Error('Failed to load competitions: ' + error.message);
        }
        
        invigilatorCompetitions = competitions || [];
        console.log(`Loaded ${invigilatorCompetitions.length} competitions`);
        
        // Check for completed competitions
        await checkCompletedCompetitions();
        
    } catch (error) {
        console.error('Error loading invigilator data:', error);
        throw error;
    }
}

async function checkCompletedCompetitions() {
    try {
        const { data: sessions, error } = await window.db
            .from('competition_sessions')
            .select('competition_id')
            .eq('stage_id', invigilatorCurrentStageId);
            
        if (!error && sessions) {
            const completedCompetitionIds = [...new Set(sessions.map(s => s.competition_id))];
            invigilatorCompetitions.forEach(competition => {
                competition.isCompleted = completedCompetitionIds.includes(competition.id);
            });
        }
    } catch (error) {
        console.error('Error checking completed competitions:', error);
    }
}

function renderInvigilatorCompetitions() {
    if (invigilatorCompetitions.length === 0) {
        return `
            <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Competitions Assigned</h3>
                <p class="text-gray-500">No competitions have been assigned to this stage yet.</p>
            </div>
        `;
    }
    
    return `
        <div class="space-y-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Competitions</h3>
                <span class="text-sm text-gray-500">${invigilatorCompetitions.length} total</span>
            </div>
            
            ${invigilatorCompetitions.map(competition => `
                <div class="competition-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
                     onclick="selectInvigilatorCompetition('${competition.id}')">
                    <div class="p-4">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center space-x-3 mb-2">
                                    <div class="w-10 h-10 ${competition.isCompleted ? 'bg-green-600' : 'bg-blue-600'} rounded-lg flex items-center justify-center text-white">
                                        ${competition.isCompleted ? invigilatorIcons.check : invigilatorIcons.competitions}
                                    </div>
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-gray-900 leading-tight">${competition.name}</h4>
                                        <p class="text-sm text-gray-600">${competition.categories.name}</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center space-x-4 mt-3">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        competition.categories.name === 'MIX ZONE' 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }">
                                        ${competition.categories.name}
                                    </span>
                                    
                                    <span class="text-xs text-gray-500">
                                        ${competition.is_stage ? '🎭' : '📚'} 
                                        ${competition.is_group ? 'Group' : 'Individual'}
                                    </span>
                                    
                                    <span class="text-xs text-gray-500">
                                        Max ${competition.max_participants_per_team}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="flex flex-col items-end space-y-2">
                                ${competition.isCompleted ? `
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✓ Completed
                                    </span>
                                ` : `
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        📋 Pending
                                    </span>
                                `}
                                
                                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function selectInvigilatorCompetition(competitionId) {
    if (window.hapticFeedback) window.hapticFeedback('light');
    
    invigilatorSelectedCompetition = invigilatorCompetitions.find(c => c.id === competitionId);
    if (!invigilatorSelectedCompetition) return;
    
    try {
        await checkExistingCompetitionSession(competitionId);
        await loadCompetitionParticipants(competitionId);
        showParticipantReportingModal();
    } catch (error) {
        console.error('Error selecting competition:', error);
        showAlert('Failed to load competition details: ' + error.message, 'error');
        if (window.hapticFeedback) window.hapticFeedback('error');
    }
}

async function checkExistingCompetitionSession(competitionId) {
    try {
        const { data: sessions, error } = await window.db
            .from('competition_sessions')
            .select('*')
            .eq('competition_id', competitionId)
            .eq('stage_id', invigilatorCurrentStageId);
            
        if (error) {
            console.error('Error checking existing sessions:', error);
            return;
        }
        
        if (sessions && sessions.length > 0) {
            invigilatorCodesFinalized = true;
            invigilatorCodeGenerated = true;
            
            sessions.forEach(session => {
                invigilatorReportedParticipants.add(session.participant_id);
                invigilatorParticipantCodes[session.participant_id] = session.random_code;
            });
        } else {
            invigilatorReportedParticipants.clear();
            invigilatorCodeGenerated = false;
            invigilatorParticipantCodes = {};
            invigilatorCodesFinalized = false;
        }
    } catch (error) {
        console.error('Error checking competition session:', error);
    }
}

async function loadCompetitionParticipants(competitionId) {
    try {
        if (invigilatorSelectedCompetition.is_group) {
            const { data: groupEntries, error } = await window.db
                .from('group_entries')
                .select(`*, teams(name)`)
                .eq('competition_id', competitionId);
                
            if (error) throw error;
            invigilatorParticipants = groupEntries || [];
        } else {
            const { data: assignments, error } = await window.db
                .from('assignments')
                .select(`*, participants(*, teams(name), categories(name))`)
                .eq('competition_id', competitionId);
                
            if (error) throw error;
            invigilatorParticipants = assignments?.map(a => a.participants) || [];
        }
    } catch (error) {
        console.error('Error loading competition participants:', error);
        throw error;
    }
}

function showParticipantReportingModal() {
    const modal = document.getElementById('qrModal');
    const title = document.getElementById('qrModalTitle');
    const content = document.getElementById('qrModalContent');
    
    title.textContent = `${invigilatorSelectedCompetition.name} - ${invigilatorCodesFinalized ? 'Results' : 'Check-in'}`;
    
    if (invigilatorParticipants.length === 0) {
        content.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.916-.75M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.916-.75M7 20v-2c0-.656.126-1.283.356-1.857M13 8a3 3 0 11-6 0 3 3 0 716 0zM9 12a6 6 0 016 6H3a6 6 0 716-6z" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Participants</h3>
                <p class="text-gray-600">No participants have been assigned to this competition yet.</p>
            </div>
        `;
    } else {
        content.innerHTML = renderParticipantReporting();
    }
    
    modal.classList.remove('hidden');
}

function renderParticipantReporting() {
    if (invigilatorCodeGenerated) {
        return renderGeneratedCodes();
    }
    
    const checkedInCount = invigilatorReportedParticipants.size;
    const totalCount = invigilatorParticipants.length;
    
    return `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div class="flex items-center justify-between mb-3">
                <h4 class="text-lg font-semibold text-gray-900">Participant Check-in</h4>
                <span class="text-sm font-medium text-blue-700">${checkedInCount}/${totalCount}</span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                     style="width: ${totalCount > 0 ? (checkedInCount / totalCount) * 100 : 0}%"></div>
            </div>
            
            <div class="flex items-center justify-between">
                <p class="text-sm text-gray-700">
                    Checked In: <span class="font-medium text-green-700">${checkedInCount}</span> participants
                </p>
                <button onclick="startDirectQRScanning()" 
                        class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    ${invigilatorIcons.scan}
                    <span class="ml-2">Scan QR</span>
                </button>
            </div>
        </div>
        
        <div class="space-y-3 mb-6 max-h-96 overflow-y-auto">
            ${invigilatorParticipants.map(participant => {
                const isCheckedIn = invigilatorReportedParticipants.has(participant.id);
                const chessNumber = calculateChessNumber(participant);
                
                return `
                    <div class="flex items-center justify-between p-4 bg-white border rounded-lg ${
                        isCheckedIn ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    } transition-all duration-200">
                        <div class="flex-1">
                            <h5 class="font-medium text-gray-900">
                                ${participant.name || participant.representative_name}
                            </h5>
                            <p class="text-sm text-gray-600">${participant.teams?.name || 'No Team'}</p>
                            <p class="text-xs text-gray-500">Chess #${chessNumber}</p>
                        </div>
                        
                        <div class="flex items-center space-x-3">
                            ${!invigilatorCodesFinalized ? `
                                <button onclick="toggleParticipantReport('${participant.id}')" 
                                        class="px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                                            isCheckedIn 
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }">
                                    ${isCheckedIn ? 'Undo' : 'Check In'}
                                </button>
                            ` : `
                                <span class="px-4 py-2 text-sm rounded-lg font-medium ${
                                    isCheckedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                }">
                                    ${isCheckedIn ? 'Participated' : 'Not Present'}
                                </span>
                            `}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        ${checkedInCount > 0 && !invigilatorCodesFinalized ? `
            <div class="sticky bottom-0 bg-white border-t pt-4 -mx-6 px-6 -mb-6 pb-6">
                <button onclick="generateCodeLetters()" 
                        class="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    ${invigilatorIcons.letter}
                    <span class="ml-2">Generate Code Letters (${checkedInCount} participants)</span>
                </button>
            </div>
        ` : ''}
    `;
}

function toggleParticipantReport(participantId) {
    if (invigilatorCodesFinalized) {
        showAlert('Competition has been finalized. No changes allowed.', 'error');
        if (window.hapticFeedback) window.hapticFeedback('error');
        return;
    }
    
    if (invigilatorReportedParticipants.has(participantId)) {
        invigilatorReportedParticipants.delete(participantId);
        if (window.hapticFeedback) window.hapticFeedback('light');
    } else {
        invigilatorReportedParticipants.add(participantId);
        if (window.hapticFeedback) window.hapticFeedback('success');
    }
    
    document.getElementById('qrModalContent').innerHTML = renderParticipantReporting();
}

async function startDirectQRScanning() {
    if (invigilatorCodesFinalized) {
        showAlert('Competition has been finalized. No changes allowed.', 'error');
        if (window.hapticFeedback) window.hapticFeedback('error');
        return;
    }
    
    lastScannedCode = null;
    
    try {
        if (barcodeDetector) {
            await startBuiltInScanning();
        } else {
            await startManualInput();
        }
    } catch (error) {
        console.error('Error starting QR scanning:', error);
        showAlert('Scanner not available. Please enter code manually.', 'error');
        await startManualInput();
    }
}

async function startBuiltInScanning() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'environment',
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });
        const modal = document.getElementById('qrScannerModal');
        const container = document.getElementById('qr-scanner-container');
        
        container.innerHTML = `
            <video id="qr-video" autoplay playsinline class="w-full rounded-lg"></video>
            <div class="mt-4 text-center">
                <div id="scan-status" class="text-sm text-blue-600 mb-3">Position QR code in view</div>
                <div class="flex justify-center space-x-3">
                    <button onclick="stopDirectScanning()" 
                            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Stop Scanning
                    </button>
                    <button onclick="startManualInput()" 
                            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                        Manual Input
                    </button>
                </div>
                <p class="text-xs text-gray-500 mt-3">Scan multiple QR codes continuously</p>
            </div>
        `;
        
        const video = document.getElementById('qr-video');
        video.srcObject = videoStream;
        
        modal.classList.remove('hidden');
        scanningActive = true;
        
        if (window.hapticFeedback) window.hapticFeedback('light');
        
        await scanQRLoop(video);
        
    } catch (error) {
        console.error('Camera access denied:', error);
        showAlert('Camera access required for QR scanning', 'error');
        await startManualInput();
    }
}

async function scanQRLoop(video) {
    if (!scanningActive || !barcodeDetector) return;
    
    try {
        const barcodes = await barcodeDetector.detect(video);
        
        if (barcodes.length > 0) {
            const qrData = barcodes[0].rawValue;
            
            if (qrData !== lastScannedCode) {
                lastScannedCode = qrData;
                await processScannedQR(qrData);
                
                setTimeout(() => {
                    if (lastScannedCode === qrData) {
                        lastScannedCode = null;
                    }
                }, 2000);
            }
        }
    } catch (error) {
        // Continue scanning
    }
    
    if (scanningActive) {
        requestAnimationFrame(() => scanQRLoop(video));
    }
}

async function processScannedQR(qrData) {
    let foundParticipant = null;
    
    for (const participant of invigilatorParticipants) {
        const chessNumber = calculateChessNumber(participant).toString();
            
        if (qrData === chessNumber || qrData === participant.id || qrData.includes(participant.id)) {
            foundParticipant = participant;
            break;
        }
    }
    
    if (foundParticipant) {
        const wasAlreadyCheckedIn = invigilatorReportedParticipants.has(foundParticipant.id);
        
        if (!wasAlreadyCheckedIn) {
            invigilatorReportedParticipants.add(foundParticipant.id);
            showAlert(`${foundParticipant.name || foundParticipant.representative_name} checked in`, 'success');
            
            if (window.hapticFeedback) window.hapticFeedback('success');
            
            document.getElementById('qrModalContent').innerHTML = renderParticipantReporting();
        } else {
            showAlert(`${foundParticipant.name || foundParticipant.representative_name} already checked in`, 'info');
            if (window.hapticFeedback) window.hapticFeedback('light');
        }
        
        const status = document.getElementById('scan-status');
        if (status) {
            status.textContent = `✓ ${foundParticipant.name || foundParticipant.representative_name}`;
            status.className = 'text-sm text-green-600 mb-3';
            
            setTimeout(() => {
                if (status && scanningActive) {
                    status.textContent = 'Position QR code in view';
                    status.className = 'text-sm text-blue-600 mb-3';
                }
            }, 3000);
        }
    } else {
        if (window.hapticFeedback) window.hapticFeedback('error');
        
        const status = document.getElementById('scan-status');
        if (status) {
            status.textContent = `Code not recognized: ${qrData}`;
            status.className = 'text-sm text-red-600 mb-3';
            
            setTimeout(() => {
                if (status && scanningActive) {
                    status.textContent = 'Position QR code in view';
                    status.className = 'text-sm text-blue-600 mb-3';
                }
            }, 3000);
        }
    }
}

async function startManualInput() {
    const qrData = prompt('Enter QR Code data or participant chess number:');
    if (qrData) {
        await processScannedQR(qrData.trim());
    }
}

function stopDirectScanning() {
    scanningActive = false;
    lastScannedCode = null;
    
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    
    document.getElementById('qrScannerModal').classList.add('hidden');
}

async function validateParticipantExists(participantId) {
    try {
        const { data, error } = await window.db
            .from('participants')
            .select('id')
            .eq('id', participantId)
            .single();
            
        return data !== null && !error;
    } catch (error) {
        console.error('Error validating participant:', error);
        return false;
    }
}

async function generateCodeLetters() {
    if (invigilatorReportedParticipants.size === 0) {
        showAlert('No participants checked in yet', 'error');
        if (window.hapticFeedback) window.hapticFeedback('error');
        return;
    }
    
    const reportedParticipants = invigilatorParticipants.filter(p => 
        invigilatorReportedParticipants.has(p.id)
    );
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shuffledLetters = letters.split('').slice(0, reportedParticipants.length);
    
    for (let i = shuffledLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
    }
    
    reportedParticipants.forEach((participant, index) => {
        invigilatorParticipantCodes[participant.id] = shuffledLetters[index];
    });
    
    invigilatorCodeGenerated = true;
    showAlert(`Code letters generated for ${reportedParticipants.length} participants`, 'success');
    if (window.hapticFeedback) window.hapticFeedback('success');
    
    document.getElementById('qrModalContent').innerHTML = renderGeneratedCodes();
}

function renderGeneratedCodes() {
    const reportedParticipants = invigilatorParticipants.filter(p => 
        invigilatorReportedParticipants.has(p.id)
    );
    
    const statusText = invigilatorCodesFinalized ? 'Competition Completed' : 'Ready to Start';
    const statusColor = invigilatorCodesFinalized ? 'text-blue-800' : 'text-green-800';
    const statusBg = invigilatorCodesFinalized ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200';
    
    return `
        <div class="${statusBg} border rounded-lg p-4 mb-6">
            <div class="flex items-start space-x-3">
                <div class="w-8 h-8 ${invigilatorCodesFinalized ? 'bg-blue-600' : 'bg-green-600'} rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold ${statusColor}">${statusText}</h3>
                    <p class="text-sm ${statusColor.replace('800', '600')} mt-1">
                        ${invigilatorCodesFinalized ? 
                            'This competition has been completed and results are saved.' : 
                            'Code letters generated. Ready to proceed with competition.'
                        }
                    </p>
                    ${!invigilatorCodesFinalized ? `
                        <button onclick="goBackToReporting()" 
                                class="inline-flex items-center mt-3 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            ${invigilatorIcons.back}
                            <span class="ml-1.5">Back to Check-in</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            ${reportedParticipants.map(participant => {
                const code = invigilatorParticipantCodes[participant.id];
                const chessNumber = calculateChessNumber(participant);
                
                return `
                    <div class="bg-white rounded-lg border p-4 text-center ${
                        invigilatorCodesFinalized ? 'border-blue-200' : 'border-green-200'
                    }">
                        <div class="w-16 h-16 mx-auto mb-3 ${
                            invigilatorCodesFinalized ? 'bg-blue-100' : 'bg-green-100'
                        } rounded-lg flex items-center justify-center">
                            <span class="text-2xl font-bold ${
                                invigilatorCodesFinalized ? 'text-blue-800' : 'text-green-800'
                            }">${code}</span>
                        </div>
                        <h5 class="font-medium text-gray-900 text-sm leading-tight">
                            ${participant.name || participant.representative_name}
                        </h5>
                        <p class="text-xs text-gray-600 mt-1">${participant.teams?.name || 'No Team'}</p>
                        <p class="text-xs text-gray-500 mt-0.5">Chess #${chessNumber}</p>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="sticky bottom-0 bg-white border-t pt-4 -mx-6 px-6 -mb-6 pb-6">
            ${!invigilatorCodesFinalized ? `
                <button onclick="proceedToNext()" 
                        class="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    ${invigilatorIcons.proceed}
                    <span class="ml-2">Proceed & Finalize Competition</span>
                </button>
            ` : `
                <button onclick="closeQRModal()" 
                        class="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <span>Close</span>
                </button>
            `}
        </div>
    `;
}

function goBackToReporting() {
    if (invigilatorCodesFinalized) {
        showAlert('Competition has been finalized. Cannot go back to check-in.', 'error');
        if (window.hapticFeedback) window.hapticFeedback('error');
        return;
    }
    
    invigilatorCodeGenerated = false;
    if (window.hapticFeedback) window.hapticFeedback('light');
    document.getElementById('qrModalContent').innerHTML = renderParticipantReporting();
}

async function proceedToNext() {
    if (invigilatorReportedParticipants.size === 0) {
        showAlert('No participants checked in', 'error');
        if (window.hapticFeedback) window.hapticFeedback('error');
        return;
    }
    
    const reportedParticipants = invigilatorParticipants.filter(p => 
        invigilatorReportedParticipants.has(p.id)
    );
    
    try {
        // Validate all participants exist in database before inserting
        for (const participant of reportedParticipants) {
            const exists = await validateParticipantExists(participant.id);
            if (!exists) {
                showAlert(`Participant ${participant.name || participant.representative_name} not found in database`, 'error');
                if (window.hapticFeedback) window.hapticFeedback('error');
                return;
            }
        }
        
        const competitionSessions = reportedParticipants.map(participant => ({
            competition_id: invigilatorSelectedCompetition.id,
            stage_id: invigilatorCurrentStageId,
            participant_id: participant.id,
            random_code: invigilatorParticipantCodes[participant.id]
        }));
        
        const { error } = await window.db.from('competition_sessions')
            .upsert(competitionSessions, {
                onConflict: 'competition_id,participant_id'
            });
        
        if (error) {
            console.error('Error finalizing competition:', error);
            showAlert('Failed to finalize competition: ' + error.message, 'error');
            if (window.hapticFeedback) window.hapticFeedback('error');
            return;
        }
        
        invigilatorCodesFinalized = true;
        
        showAlert(`Competition finalized! ${reportedParticipants.length} participants registered.`, 'success');
        if (window.hapticFeedback) window.hapticFeedback('success');
        
        document.getElementById('qrModalContent').innerHTML = renderGeneratedCodes();
        
    } catch (error) {
        console.error('Error finalizing competition:', error);
        showAlert('Failed to finalize competition: ' + error.message, 'error');
        if (window.hapticFeedback) window.hapticFeedback('error');
    }
}

function calculateChessNumber(participant) {
    if (invigilatorSelectedCompetition.is_group) {
        return `GROUP-${participant.id.slice(-4).toUpperCase()}`;
    }
    
    const teamIndex = participant.teams ? 
        [...new Set(invigilatorParticipants.map(p => p.teams?.name))].sort().indexOf(participant.teams.name) : 0;
    return (teamIndex + 1) * 100 + (parseInt(participant.id.slice(-3), 36) % 99 + 1);
}

function closeQRModal() {
    document.getElementById('qrModal').classList.add('hidden');
    stopDirectScanning();
    
    if (window.hapticFeedback) window.hapticFeedback('light');
    
    if (!invigilatorCodesFinalized) {
        invigilatorSelectedCompetition = null;
        invigilatorParticipants = [];
        invigilatorReportedParticipants.clear();
        invigilatorCodeGenerated = false;
        invigilatorParticipantCodes = {};
    }
}

// Make functions globally available
window.renderInvigilatorApp = renderInvigilatorApp;
window.selectInvigilatorCompetition = selectInvigilatorCompetition;
window.toggleParticipantReport = toggleParticipantReport;
window.startDirectQRScanning = startDirectQRScanning;
window.stopDirectScanning = stopDirectScanning;
window.startManualInput = startManualInput;
window.generateCodeLetters = generateCodeLetters;
window.goBackToReporting = goBackToReporting;
window.proceedToNext = proceedToNext;
window.closeQRModal = closeQRModal;
