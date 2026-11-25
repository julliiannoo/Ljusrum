/* =========================================================
   Ljusrum – gemensam data för hemsidan och admin
   Bokningar sparas i webbläsarens localStorage (ingen databas
   krävs i uppgiften). Förberedda exempelbokningar finns alltid med.
   ========================================================= */

const LJUSRUM = {
  workshop: {
    title: 'Ta kontroll över din kamera',
    price: 1200,
    capacity: 10,
    time: 'kl. 10–15',
    place: 'Ljusrum fotostudio på Södermalm, Stockholm',
    placeShort: 'Ljusrum fotostudio, Södermalm',
  },
  sessions: [
    { id: '2026-11-14', label: 'Lördag 14 november 2026', short: '14 november 2026' },
    { id: '2026-11-21', label: 'Lördag 21 november 2026', short: '21 november 2026' },
    { id: '2026-11-28', label: 'Lördag 28 november 2026', short: '28 november 2026' },
  ],
  seedBookings: [
    { id: 'L101', session: '2026-11-14', name: 'Alma Lind', email: 'alma.lind@example.com' },
    { id: 'L102', session: '2026-11-14', name: 'Robin Berg', email: 'robin.berg@example.com' },
    { id: 'L103', session: '2026-11-14', name: 'Sam Ek', email: 'sam.ek@example.com' },
    { id: 'L104', session: '2026-11-21', name: 'Kim Dahl', email: 'kim.dahl@example.com' },
    { id: 'L105', session: '2026-11-21', name: 'Alex Holm', email: 'alex.holm@example.com' },
    { id: 'L106', session: '2026-11-28', name: 'Noor Lund', email: 'noor.lund@example.com' },
  ],
};

const STORAGE_KEY = 'ljusrum-bokningar';

function safeRead(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function safeWrite(storage, key, value) {
  try { storage.setItem(key, JSON.stringify(value)); } catch (e) { /* t.ex. privat läge */ }
}

/** Alla bokningar: förberedda + de som gjorts i den här webbläsaren */
function getAllBookings() {
  const saved = safeRead(localStorage, STORAGE_KEY, []);
  return [...LJUSRUM.seedBookings, ...saved].map((b) => ({ status: 'Bekräftad', ...b }));
}

function getSession(id) {
  return LJUSRUM.sessions.find((s) => s.id === id);
}

function bookingsForSession(sessionId) {
  return getAllBookings().filter((b) => b.session === sessionId);
}

function spotsLeft(sessionId) {
  return Math.max(0, LJUSRUM.workshop.capacity - bookingsForSession(sessionId).length);
}

/** Skapar en ny bokning och returnerar den */
function addBooking({ session, name, email }) {
  const all = getAllBookings();
  const maxNr = all.reduce((m, b) => Math.max(m, parseInt(b.id.slice(1), 10) || 0), 100);
  const booking = {
    id: 'L' + (maxNr + 1),
    session,
    name: name.trim(),
    email: email.trim(),
    createdAt: new Date().toISOString(),
  };
  const saved = safeRead(localStorage, STORAGE_KEY, []);
  saved.push(booking);
  safeWrite(localStorage, STORAGE_KEY, saved);
  return booking;
}

function formatPrice(kr) {
  return kr.toLocaleString('sv-SE').replace(/ /g, ' ') + ' kr';
}

/** Skyddar mot att användarens text tolkas som HTML */
function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
