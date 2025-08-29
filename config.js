// Supabase client
const SUPABASE_URL = 'https://aivaxrmytffpmkxgemom.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdmF4cm15dGZmcG1reGdlbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Mjk2ODEsImV4cCI6MjA3MjAwNTY4MX0.FS4OhSiG4Z5g_lp0NNOlHSBj7DZivsGkFoR-qdqYlGk';

window.db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Session helpers
function currentUser() {
  const raw = localStorage.getItem('af_user');
  return raw ? JSON.parse(raw) : null;
}

function setUser(user) {
  localStorage.setItem('af_user', JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem('af_user');
}

// UI helpers
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

async function logout() {
  clearUser();
  location.reload();
}
