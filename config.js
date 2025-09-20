// Supabase client - single instance to avoid multiple client warnings
if (!window.db) {
    const SUPABASE_URL = 'https://nxxjjriywohylaybmbkk.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eGpqcml5d29oeWxheWJtYmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTIxODgsImV4cCI6MjA3MzM4ODE4OH0.N9yHU09APsKNZTtFaKCBGtoZGxAIIHil61niNv8aNZ0';

    window.db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Session helpers (removed duplicate declarations)
function currentUser() {
    return getUser();
}

// UI helpers (avoid redeclaration)
if (typeof show === 'undefined') {
    function show(el) { el.classList.remove('hidden'); }
}

if (typeof hide === 'undefined') {
    function hide(el) { el.classList.add('hidden'); }
}

async function logout() {
    clearUser();
    location.reload();
}
