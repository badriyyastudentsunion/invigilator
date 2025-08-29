// Invigilator App Variables
let invigilatorCurrentStageId = null;
let invigilatorCurrentStageName = '';
let invigilatorCompetitions = [];
let invigilatorSelectedCompetition = null;
let invigilatorParticipants = [];
let invigilatorReportedParticipants = new Set();
let invigilatorCodeGenerated = false;
let invigilatorParticipantCodes = {};
let invigilatorCompetitionCompleted = false; // New variable for completion status
let videoStream = null;
let barcodeDetector = null;
let scanningActive = false;

// SVG Icons for Invigilator
const invigilatorIcons = {
    competitions: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    participants: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>`,
    qr: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z"></path></svg>`,
    start: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>`,
    check: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`,
    scan: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4z" clip-rule="evenodd"></path></svg>`,
    letter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path></svg>`,
    proceed: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`,
    home: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 101.414 1.414L8 5.414V17a1 1 0 102 0V5.414l6.293 6.293a1 1 0 001.414-1.414l-9-9z"></path></svg>`
};

async function renderInvigilatorApp(stageId, stageName) {
    invigilatorCurrentStageId = stageId;
    invigilatorCurrentStageName = stageName;
    
    // Initialize barcode detector
    await initializeBarcodeDetector();
    
    await loadInvigilatorData();
    
    const root = document.getElementById('invigilator-app');
    root.innerHTML = `
        <div class="p-6 bg-gray-100 min-h-screen">
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800">Invigilator Panel</h2>
                <p class="text-gray-600">Stage: <span class="font-semibold">${invigilatorCurrentStageName}</span></p>
            </div>
            
            <div class="grid gap-6">
                ${renderInvigilatorCompetitions()}
            </div>
        </div>
    `;
}

async function initializeBarcodeDetector() {
    try {
        if ('BarcodeDetector' in window) {
            // Check if QR code format is supported
            const supportedFormats = await BarcodeDetector.getSupportedFormats();
            if (supportedFormats.includes('qr_code')) {
                barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
                console.log('Built-in BarcodeDetector initialized');
            } else {
                console.log('QR codes not supported by built-in detector');
            }
        } else {
            console.log('BarcodeDetector not available in this browser');
        }
    } catch (error) {
        console.error('Error initializing barcode detector:', error);
    }
}

async function loadInvigilatorData() {
    try {
        const { data: competitions, error } = await db
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
            showAlert('Failed to load competitions', 'error');
            return;
        }
        
        invigilatorCompetitions = competitions || [];
    } catch (error) {
        console.error('Error loading invigilator data:', error);
        showAlert('Failed to load data', 'error');
    }
}

function renderInvigilatorCompetitions() {
    if (invigilatorCompetitions.length === 0) {
        return `
            <div class="bg-white rounded-lg shadow p-6 text-center">
                <div class="text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No competitions assigned</h3>
                    <p class="mt-1 text-sm text-gray-500">No competitions have been assigned to this stage yet.</p>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Assigned Competitions</h3>
                <p class="text-sm text-gray-600">Select a competition to manage participants and reporting</p>
            </div>
            <div class="divide-y divide-gray-200">
                ${invigilatorCompetitions.map(competition => `
                    <div class="p-6 hover:bg-gray-50 cursor-pointer" onclick="selectInvigilatorCompetition('${competition.id}')">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        ${invigilatorIcons.competitions}
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-medium text-gray-900">${competition.name}</h4>
                                    <div class="flex items-center text-sm text-gray-500">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                            ${competition.categories.name}
                                        </span>
                                        <span class="mr-2">${competition.is_stage ? '🎭 Stage' : '📚 Non-Stage'}</span>
                                        <span>${competition.is_group ? '👥 Group' : '👤 Individual'}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-sm text-gray-400">
                                Max ${competition.max_participants_per_team} per team
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

async function selectInvigilatorCompetition(competitionId) {
    invigilatorSelectedCompetition = invigilatorCompetitions.find(c => c.id === competitionId);
    if (!invigilatorSelectedCompetition) return;
    
    // Reset state
    invigilatorReportedParticipants.clear();
    invigilatorCodeGenerated = false;
    invigilatorParticipantCodes = {};
    invigilatorCompetitionCompleted = false;
    
    // Load participants for this competition
    await loadCompetitionParticipants(competitionId);
    
    // Show participant reporting modal
    showParticipantReportingModal();
}

async function loadCompetitionParticipants(competitionId) {
    try {
        if (invigilatorSelectedCompetition.is_group) {
            // Load group entries for group competitions
            const { data: groupEntries, error } = await db
                .from('group_entries')
                .select(`
                    *,
                    teams(name)
                `)
                .eq('competition_id', competitionId);
                
            if (error) {
                console.error('Error loading group entries:', error);
                showAlert('Failed to load group entries', 'error');
                return;
            }
            
            invigilatorParticipants = groupEntries || [];
        } else {
            // Load individual participants
            const { data: assignments, error } = await db
                .from('assignments')
                .select(`
                    *,
                    participants(
                        *,
                        teams(name),
                        categories(name)
                    )
                `)
                .eq('competition_id', competitionId);
                
            if (error) {
                console.error('Error loading participants:', error);
                showAlert('Failed to load participants', 'error');
                return;
            }
            
            invigilatorParticipants = assignments?.map(a => a.participants) || [];
        }
    } catch (error) {
        console.error('Error loading competition participants:', error);
        showAlert('Failed to load participants', 'error');
    }
}

function showParticipantReportingModal() {
    const modal = document.getElementById('qrModal');
    const title = document.getElementById('qrModalTitle');
    const content = document.getElementById('qrModalContent');
    
    title.textContent = `${invigilatorSelectedCompetition.name} - Participant Reporting`;
    
    if (invigilatorParticipants.length === 0) {
        content.innerHTML = `
            <div class="text-center py-8">
                <div class="text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.916-.75M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.916-.75M7 20v-2c0-.656.126-1.283.356-1.857M13 8a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 016 6H3a6 6 0 016-6z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No participants</h3>
                    <p class="mt-1 text-sm text-gray-500">No participants have been assigned to this competition yet.</p>
                </div>
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
    
    const reportedCount = invigilatorReportedParticipants.size;
    const totalCount = invigilatorParticipants.length;
    
    const participantsList = invigilatorSelectedCompetition.is_group 
        ? renderGroupParticipantsReporting()
        : renderIndividualParticipantsReporting();
        
    return `
        <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h4 class="text-lg font-medium text-gray-900">Participants (${totalCount})</h4>
                    <p class="text-sm text-gray-600">
                        Reported: <span class="font-medium text-green-600">${reportedCount}</span> / 
                        <span class="font-medium">${totalCount}</span>
                    </p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startDirectQRScanning()" class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ${invigilatorIcons.scan}
                        <span class="ml-2">Scan QR</span>
                    </button>
                </div>
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-blue-800">Instructions</h3>
                        <div class="mt-2 text-sm text-blue-700">
                            <p>1. Mark participants as "Reported" when they arrive</p>
                            <p>2. Use manual click or QR scan to report attendance</p>
                            <p>3. Click "Generate Code Letters" when ready to start the competition</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="space-y-3 mb-6">
            ${participantsList}
        </div>
        
        <div class="flex justify-center">
            <button onclick="generateCodeLetters()" class="flex items-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium">
                ${invigilatorIcons.letter}
                <span class="ml-2">Generate Code Letters</span>
            </button>
        </div>
    `;
}

function renderIndividualParticipantsReporting() {
    return invigilatorParticipants.map(participant => {
        const isReported = invigilatorReportedParticipants.has(participant.id);
        const chessNumber = calculateChessNumber(participant);
        
        return `
            <div class="flex items-center justify-between p-4 bg-white border rounded-lg ${isReported ? 'border-green-200 bg-green-50' : 'border-gray-200'}">
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 ${isReported ? 'bg-green-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center">
                            ${isReported ? invigilatorIcons.check : invigilatorIcons.participants}
                        </div>
                    </div>
                    <div>
                        <h5 class="font-medium text-gray-900">${participant.name}</h5>
                        <p class="text-sm text-gray-600">${participant.teams?.name || 'No Team'}</p>
                        <p class="text-xs text-gray-500">Chess #${chessNumber}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isReported 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                    }">
                        ${isReported ? 'Reported' : 'Not Reported'}
                    </span>
                    <button onclick="toggleParticipantReport('${participant.id}')" 
                            class="px-3 py-1 text-sm rounded ${
                                isReported 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }">
                        ${isReported ? 'Unreport' : 'Report'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderGroupParticipantsReporting() {
    return invigilatorParticipants.map(entry => {
        const isReported = invigilatorReportedParticipants.has(entry.id);
        
        return `
            <div class="flex items-center justify-between p-4 bg-white border rounded-lg ${isReported ? 'border-green-200 bg-green-50' : 'border-gray-200'}">
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 ${isReported ? 'bg-green-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center">
                            ${isReported ? invigilatorIcons.check : invigilatorIcons.participants}
                        </div>
                    </div>
                    <div>
                        <h5 class="font-medium text-gray-900">${entry.representative_name}</h5>
                        <p class="text-sm text-gray-600">${entry.teams?.name || 'No Team'}</p>
                        <p class="text-xs text-gray-500">Group Size: ${entry.group_size}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isReported 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                    }">
                        ${isReported ? 'Reported' : 'Not Reported'}
                    </span>
                    <button onclick="toggleParticipantReport('${entry.id}')" 
                            class="px-3 py-1 text-sm rounded ${
                                isReported 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }">
                        ${isReported ? 'Unreport' : 'Report'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleParticipantReport(participantId) {
    if (invigilatorReportedParticipants.has(participantId)) {
        invigilatorReportedParticipants.delete(participantId);
    } else {
        invigilatorReportedParticipants.add(participantId);
    }
    
    // Refresh the modal content
    document.getElementById('qrModalContent').innerHTML = renderParticipantReporting();
}

// Direct Built-in QR Code Scanner
async function startDirectQRScanning() {
    try {
        // First try to use built-in barcode detector with camera
        if (barcodeDetector) {
            await startBuiltInScanning();
        } else {
            // Fallback to manual input
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
        // Request camera access
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'environment', // Use rear camera if available
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });

        // Create and show video element
        const modal = document.getElementById('qrScannerModal');
        const container = document.getElementById('qr-scanner-container');
        
        container.innerHTML = `
            <video id="qr-video" autoplay playsinline style="width: 100%; max-width: 400px; border-radius: 8px;"></video>
            <div class="mt-4 text-center">
                <div id="scan-status" class="text-sm text-blue-600 mb-2">Position QR code in view</div>
                <div class="flex justify-center space-x-3">
                    <button onclick="stopDirectScanning()" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Stop Scanning
                    </button>
                    <button onclick="startManualInput()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Manual Input
                    </button>
                </div>
            </div>
        `;
        
        const video = document.getElementById('qr-video');
        video.srcObject = videoStream;
        
        modal.classList.remove('hidden');
        scanningActive = true;
        
        // Start scanning loop
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
            console.log('QR Code detected:', qrData);
            
            // Process the scanned QR code
            await processScannedQR(qrData);
            return;
        }
    } catch (error) {
        // Ignore detection errors, continue scanning
    }
    
    // Continue scanning
    if (scanningActive) {
        requestAnimationFrame(() => scanQRLoop(video));
    }
}

async function processScannedQR(qrData) {
    // Find participant by QR data
    let foundParticipant = null;
    
    for (const participant of invigilatorParticipants) {
        const chessNumber = invigilatorSelectedCompetition.is_group 
            ? `GROUP-${participant.id}` 
            : calculateChessNumber(participant).toString();
            
        if (qrData === chessNumber || qrData === participant.id || qrData.includes(participant.id)) {
            foundParticipant = participant;
            break;
        }
    }
    
    if (foundParticipant) {
        invigilatorReportedParticipants.add(foundParticipant.id);
        showAlert(`${foundParticipant.name || foundParticipant.representative_name} marked as reported`, 'success');
        
        // Stop scanning and close modal
        stopDirectScanning();
        
        // Refresh the main modal content
        document.getElementById('qrModalContent').innerHTML = renderParticipantReporting();
    } else {
        // Update status but continue scanning
        const status = document.getElementById('scan-status');
        if (status) {
            status.textContent = `Code not recognized: ${qrData}`;
            status.className = 'text-sm text-red-600 mb-2';
            
            // Reset status after 3 seconds
            setTimeout(() => {
                if (status) {
                    status.textContent = 'Position QR code in view';
                    status.className = 'text-sm text-blue-600 mb-2';
                }
            }, 3000);
        }
    }
}

async function startManualInput() {
    stopDirectScanning();
    
    const qrData = prompt('Enter QR Code data or participant chess number:');
    
    if (qrData) {
        await processScannedQR(qrData.trim());
    }
}

function stopDirectScanning() {
    scanningActive = false;
    
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    
    document.getElementById('qrScannerModal').classList.add('hidden');
}

async function generateCodeLetters() {
    if (invigilatorReportedParticipants.size === 0) {
        showAlert('No participants reported yet', 'error');
        return;
    }
    
    const reportedParticipants = invigilatorParticipants.filter(p => 
        invigilatorReportedParticipants.has(p.id)
    );
    
    // Generate random code letters for reported participants
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shuffledLetters = letters.split('').slice(0, reportedParticipants.length);
    
    // Shuffle the letters randomly
    for (let i = shuffledLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
    }
    
    // Assign codes to participants
    reportedParticipants.forEach((participant, index) => {
        invigilatorParticipantCodes[participant.id] = shuffledLetters[index];
    });
    
    try {
        // Use UPSERT to handle existing records
        const competitionSessions = reportedParticipants.map((participant, index) => ({
            competition_id: invigilatorSelectedCompetition.id,
            stage_id: invigilatorCurrentStageId,
            participant_id: participant.id,
            random_code: shuffledLetters[index]
        }));
        
        // Use upsert to handle existing records
        const { error } = await db.from('competition_sessions')
            .upsert(competitionSessions, {
                onConflict: 'competition_id,participant_id'
            });
        
        if (error) {
            console.error('Error creating competition sessions:', error);
            showAlert('Failed to save competition data: ' + error.message, 'error');
            return;
        }
        
        invigilatorCodeGenerated = true;
        showAlert(`Code letters generated for ${reportedParticipants.length} participants`, 'success');
        
        // Update modal content to show generated codes
        document.getElementById('qrModalContent').innerHTML = renderGeneratedCodes();
        
    } catch (error) {
        console.error('Error generating codes:', error);
        showAlert('Failed to generate codes', 'error');
    }
}

// FIXED: Updated renderGeneratedCodes function - removes "Generate QR Codes" button
function renderGeneratedCodes() {
    const reportedParticipants = invigilatorParticipants.filter(p => 
        invigilatorReportedParticipants.has(p.id)
    );
    
    // Show completion message if already completed
    if (invigilatorCompetitionCompleted) {
        return `
            <div class="text-center py-8">
                <div class="text-green-500">
                    <svg class="mx-auto h-16 w-16 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <h3 class="mt-2 text-xl font-medium text-green-900">Competition Completed!</h3>
                    <p class="mt-1 text-sm text-green-700">This competition session has been completed successfully.</p>
                    <p class="mt-2 text-xs text-green-600">No further changes are allowed.</p>
                </div>
                <div class="mt-6">
                    <button onclick="goToInvigilatorHome()" class="flex items-center mx-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        ${invigilatorIcons.home}
                        <span class="ml-2">Back to Home</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h4 class="text-lg font-medium text-gray-900">Generated Code Letters</h4>
                    <p class="text-sm text-gray-600">
                        ${reportedParticipants.length} participants received random codes
                    </p>
                </div>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-green-800">Competition Ready</h3>
                        <div class="mt-2 text-sm text-green-700">
                            <p>Code letters have been generated and saved. Competition can now proceed.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="qr-grid mb-6">
            ${reportedParticipants.map(participant => {
                const code = invigilatorParticipantCodes[participant.id];
                const chessNumber = invigilatorSelectedCompetition.is_group 
                    ? `GROUP-${participant.id}` 
                    : calculateChessNumber(participant);
                
                return `
                    <div class="bg-gray-50 p-4 rounded-lg text-center border-2 border-blue-200">
                        <div class="w-24 h-24 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span class="text-3xl font-bold text-blue-800">${code}</span>
                        </div>
                        <h5 class="font-medium text-gray-900">${participant.name || participant.representative_name}</h5>
                        <p class="text-sm text-gray-600">${participant.teams?.name || 'No Team'}</p>
                        <p class="text-xs text-gray-500">
                            ${invigilatorSelectedCompetition.is_group ? `Group Size: ${participant.group_size}` : `Chess #${chessNumber}`}
                        </p>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="flex justify-center">
            <button onclick="proceedToNext()" class="flex items-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">
                ${invigilatorIcons.proceed}
                <span class="ml-2">Proceed</span>
            </button>
        </div>
    `;
}

// FIXED: Updated proceedToNext function to show completion and disable further changes
function proceedToNext() {
    // Mark competition as completed
    invigilatorCompetitionCompleted = true;
    
    showAlert('Competition session completed successfully!', 'success');
    
    // Update the modal to show completion status
    document.getElementById('qrModalContent').innerHTML = renderGeneratedCodes();
}

// FIXED: New function to go back to invigilator home
function goToInvigilatorHome() {
    // Close modal and reset state
    closeQRModal();
    
    // Reset all state variables
    invigilatorSelectedCompetition = null;
    invigilatorParticipants = [];
    invigilatorReportedParticipants.clear();
    invigilatorCodeGenerated = false;
    invigilatorParticipantCodes = {};
    invigilatorCompetitionCompleted = false;
    
    // Render the home page
    renderInvigilatorApp(invigilatorCurrentStageId, invigilatorCurrentStageName);
}

function calculateChessNumber(participant) {
    // Simple chess number calculation
    const teamIndex = participant.teams ? 
        [...new Set(invigilatorParticipants.map(p => p.teams?.name))].sort().indexOf(participant.teams.name) : 0;
    return (teamIndex + 1) * 100 + (parseInt(participant.id.slice(-3), 36) % 99 + 1);
}

function generateQRCode(container, data) {
    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(container, data, {
            width: 96,
            height: 96,
            margin: 1
        }, function (error) {
            if (error) {
                console.error('QR Code generation error:', error);
                container.innerHTML = `
                    <div class="w-24 h-24 bg-gray-200 flex items-center justify-center rounded text-xs text-gray-500 text-center">
                        QR Error<br/>${data}
                    </div>
                `;
            }
        });
    } else {
        // Fallback if QR library not loaded
        container.innerHTML = `
            <div class="w-24 h-24 bg-gray-200 flex items-center justify-center rounded border text-xs text-gray-600 text-center">
                Chess #<br/>${data}
            </div>
        `;
    }
}

function closeQRModal() {
    document.getElementById('qrModal').classList.add('hidden');
    
    // Stop any active scanning
    stopDirectScanning();
}
