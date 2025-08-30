<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Exuberanza Festival Management</title>
    
    <!-- PWA Configuration -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#3b82f6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Exuberanza">
    <link rel="apple-touch-icon" href="logo.png">
    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    
    <style>
        .hidden { display: none !important; }
        .modal-backdrop { background: rgba(0, 0, 0, 0.5); }
        .qr-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; }
        #qr-scanner-container { width: 100%; max-width: 350px; margin: 0 auto; }
        
        /* Mobile-first responsive design */
        .mobile-container { max-width: 100vw; overflow-x: hidden; }
        .mobile-header { position: sticky; top: 0; z-index: 40; }
        .mobile-content { padding-bottom: env(safe-area-inset-bottom, 20px); }
        .tap-highlight { -webkit-tap-highlight-color: transparent; }
        .touch-action { touch-action: manipulation; }
        
        /* Competition card animations */
        .competition-card { transition: all 0.2s ease; }
        .competition-card:active { transform: scale(0.98); }
        
        /* Status indicators */
        .status-completed { background: linear-gradient(135deg, #10b981, #059669); }
        .status-active { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .status-pending { background: linear-gradient(135deg, #6b7280, #4b5563); }
        
        /* Install prompt */
        .install-prompt { 
            transform: translateY(100%); 
            transition: transform 0.3s ease; 
        }
        .install-prompt.show { transform: translateY(0); }
        
        /* Custom scrollbar for mobile */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen mobile-container">
    <!-- Mobile Header (Only for non-login pages) -->
    <header id="main-header" class="mobile-header bg-white shadow-sm border-b">
        <div class="px-4 py-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <img src="exuberanza.svg" alt="Logo" class="h-8 w-auto">
                    <span id="header-title" class="text-lg font-bold text-gray-800"></span>
                </div>
                <button id="btn-logout" class="hidden bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 tap-highlight touch-action">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="inline w-4 h-4 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3a1 1 0 10-2 0v7a1 1 0 002 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21h6a2 2 0 002-2V11H7v8a2 2 0 002 2z" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    </header>

    <!-- PWA Install Prompt -->
    <div id="installPrompt" class="install-prompt fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 z-50">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <img src="logo.png" alt="Install" class="w-8 h-8 rounded">
                <div>
                    <p class="font-medium text-sm">Install Exuberanza App</p>
                    <p class="text-xs opacity-90">Add to home screen for quick access</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button id="installBtn" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium tap-highlight touch-action">
                    Install
                </button>
                <button id="dismissInstall" class="text-white opacity-75 hover:opacity-100 tap-highlight touch-action">
                    ✕
                </button>
            </div>
        </div>
    </div>

    <!-- Authentication (No Header) -->
    <div id="auth" class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mobile-content">
        <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm mx-4">
            <div class="text-center mb-6">
                <img src="exuberanza.svg" alt="Exuberanza" class="h-16 w-auto mx-auto mb-4">
                <h2 class="text-2xl font-bold text-gray-800">Login</h2>
                <p class="text-gray-500 text-sm mt-1">Access your festival management</p>
            </div>
            <form id="loginForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select id="role" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 touch-action">
                        <option value="admin">Admin</option>
                        <option value="leader">Team Leader</option>
                        <option value="invigilator">Invigilator</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Username/Stage Name</label>
                    <input type="text" id="username" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 touch-action" placeholder="Enter username or stage name">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" id="password" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 touch-action" placeholder="Enter password">
                </div>
                <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium touch-action">
                    Login
                </button>
                
                <!-- Install App Button -->
                <button type="button" id="installBtnLogin" class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium touch-action hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="inline w-5 h-5 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Install App
                </button>
            </form>
        </div>
    </div>

    <!-- Admin App -->
    <div id="admin-app" class="hidden mobile-content"></div>

    <!-- Leader App -->
    <div id="leader-app" class="hidden mobile-content"></div>

    <!-- Invigilator App -->
    <div id="invigilator-app" class="hidden mobile-content"></div>

    <!-- Alert Modal -->
    <div id="alertModal" class="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
            <div class="flex items-center mb-4">
                <div id="alertIcon" class="mr-3"></div>
                <h3 id="alertTitle" class="text-lg font-semibold"></h3>
            </div>
            <p id="alertMessage" class="text-gray-600 mb-6"></p>
            <button onclick="document.getElementById('alertModal').classList.add('hidden')" 
                    class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 touch-action">
                OK
            </button>
        </div>
    </div>

    <!-- All other modals remain the same -->
    <div id="adminModal" class="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 id="adminModalTitle" class="text-xl font-semibold"></h3>
                <button onclick="closeAdminModal()" class="text-gray-500 hover:text-gray-700 text-2xl touch-action">&times;</button>
            </div>
            <div id="adminModalContent"></div>
        </div>
    </div>

    <div id="adminBulkImportModal" class="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Bulk Import</h3>
                <button onclick="closeAdminBulkImportModal()" class="text-gray-500 hover:text-gray-700 text-2xl touch-action">&times;</button>
            </div>
            <div id="adminBulkImportContent"></div>
        </div>
    </div>

    <div id="leaderAssignModal" class="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 id="leaderAssignModalTitle" class="text-xl font-semibold"></h3>
                <button onclick="closeLeaderAssignModal()" class="text-gray-500 hover:text-gray-700 text-2xl touch-action">&times;</button>
            </div>
            <div id="leaderAssignModalContent"></div>
        </div>
    </div>

    <div id="leaderAlertModal" class="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
            <div class="flex items-center mb-4">
                <div id="leaderAlertIcon" class="mr-3"></div>
                <h3 id="leaderAlertTitle" class="text-lg font-semibold"></h3>
            </div>
            <p id="leaderAlertMessage" class="text-gray-600 mb-4"></p>
            <button onclick="document.getElementById('leaderAlertModal').classList.add('hidden')" 
                    class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 touch-action">
                OK
            </button>
        </div>
    </div>

    <div id="qrModal" class="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[95vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h3 id="qrModalTitle" class="text-lg font-semibold truncate"></h3>
                <button onclick="closeQRModal()" class="text-gray-500 hover:text-gray-700 text-2xl touch-action">&times;</button>
            </div>
            <div id="qrModalContent" class="p-6"></div>
        </div>
    </div>

    <div id="qrScannerModal" class="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">QR Code Scanner</h3>
                <button onclick="stopDirectScanning()" class="text-gray-500 hover:text-gray-700 text-2xl touch-action">&times;</button>
            </div>
            <div id="qr-scanner-container"></div>
        </div>
    </div>

    <script>
        // PWA Install functionality
        let deferredPrompt;
        let deferredLoginPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            deferredLoginPrompt = e;
            
            // Show general install prompt
            document.getElementById('installPrompt').classList.add('show');
            
            // Show login page install button
            const loginInstallBtn = document.getElementById('installBtnLogin');
            if (loginInstallBtn) {
                loginInstallBtn.classList.remove('hidden');
            }
        });

        // General install button
        document.getElementById('installBtn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                document.getElementById('installPrompt').classList.remove('show');
            }
        });

        // Login page install button
        document.getElementById('installBtnLogin').addEventListener('click', async () => {
            if (deferredLoginPrompt) {
                deferredLoginPrompt.prompt();
                const { outcome } = await deferredLoginPrompt.userChoice;
                console.log('Install prompt result:', outcome);
                deferredLoginPrompt = null;
                document.getElementById('installBtnLogin').classList.add('hidden');
                
                if (window.hapticFeedback) {
                    window.hapticFeedback(outcome === 'accepted' ? 'success' : 'light');
                }
            }
        });

        document.getElementById('dismissInstall').addEventListener('click', () => {
            document.getElementById('installPrompt').classList.remove('show');
        });

        // Hide install prompt when app is installed
        window.addEventListener('appinstalled', () => {
            document.getElementById('installPrompt').classList.remove('show');
            const loginInstallBtn = document.getElementById('installBtnLogin');
            if (loginInstallBtn) {
                loginInstallBtn.classList.add('hidden');
            }
            console.log('PWA was installed');
        });

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => console.log('SW registered'))
                .catch((error) => console.log('SW registration failed'));
        }

        // Haptic feedback utility
        function hapticFeedback(type = 'light') {
            if ('vibrate' in navigator) {
                switch(type) {
                    case 'light': navigator.vibrate(10); break;
                    case 'medium': navigator.vibrate(20); break;
                    case 'heavy': navigator.vibrate([10, 10, 10]); break;
                    case 'success': navigator.vibrate([100, 50, 100]); break;
                    case 'error': navigator.vibrate([200, 100, 200]); break;
                    default: navigator.vibrate(10);
                }
            }
        }

        // Make haptic feedback globally available
        window.hapticFeedback = hapticFeedback;
    </script>

    <script src="utils.js"></script>
    <script src="app.js"></script>
    <script src="admin.js"></script>
    <script src="leader.js"></script>
    <script src="invigilator.js"></script>
</body>
</html>
