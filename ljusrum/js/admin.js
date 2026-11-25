/* =========================================================
   Ljusrum – admin (/admin)
   Valt tillfälle och öppnad bokning ligger i adressen, t.ex.
   /admin#tillfalle=2026-11-14&bokning=L101
   Därför tappas inte valt tillfälle när man går tillbaka.
   ========================================================= */

const main = document.getElementById('admin-main');
const WS = LJUSRUM.workshop;

function readState() {
  const p = new URLSearchParams(location.hash.slice(1));
  const session = getSession(p.get('tillfalle')) ? p.get('tillfalle') : LJUSRUM.sessions[0].id;
  return { session, booking: p.get('bokning'), q: p.get('sok') || '' };
}
function link(state) {
  const p = new URLSearchParams();
  p.set('tillfalle', state.session);
  if (state.booking) p.set('bokning', state.booking);
  return '#' + p.toString();
}

/* ---------- Bokningsöversikt ---------- */
function overview(state) {
  const s = getSession(state.session);
  const list = bookingsForSession(state.session);
  const booked = list.length;
  const left = Math.max(0, WS.capacity - booked);
  const options = LJUSRUM.sessions.map((x) =>
    `<option value="${x.id}" ${x.id === state.session ? 'selected' : ''}>${x.short} (${bookingsForSession(x.id).length}/${WS.capacity})</option>`
  ).join('');

  document.title = `Bokningsöversikt ${s.short} | Ljusrum admin`;
  main.innerHTML = `
    <div>
      <p class="eyebrow">Bokningsöversikt</p>
      <h1 class="admin-title" tabindex="-1">Fotoworkshop: ${WS.title}</h1>
    </div>

    <div class="session-picker">
      <label for="tillfalle">Workshopdatum</label>
      <select id="tillfalle" class="select">${options}</select>
    </div>

    <section class="stats" aria-label="Sammanfattning för ${s.short}">
      <div class="stat"><span class="stat__label">Bokade</span><span class="stat__value">${booked}/${WS.capacity}</span><span class="stat__unit">platser</span></div>
      <div class="stat"><span class="stat__label">Lediga</span><span class="stat__value">${left}</span><span class="stat__unit">platser kvar</span></div>
      <div class="stat"><span class="stat__label">Intäkt</span><span class="stat__value">${formatPrice(booked * WS.price).replace(' kr', '&nbsp;kr')}</span><span class="stat__unit">bekräftat</span></div>
    </section>

    <section class="panel" aria-labelledby="h-deltagare">
      <div class="panel__head">
        <div>
          <h2 id="h-deltagare">Deltagare</h2>
          <p id="count">${booked} ${booked === 1 ? 'bokning' : 'bokningar'} totalt</p>
        </div>
        <div>
          <label for="sok" class="visually-hidden">Sök deltagare</label>
          <input id="sok" class="search" type="search" placeholder="Sök på namn, e-post eller ID" value="${esc(state.q)}" autocomplete="off">
        </div>
      </div>
      <div id="rows"></div>
    </section>`;

  const rowsEl = document.getElementById('rows');
  const drawRows = (q) => {
    const term = q.trim().toLowerCase();
    const shown = list.filter((b) => !term || [b.id, b.name, b.email].some((v) => v.toLowerCase().includes(term)));
    if (!list.length) { rowsEl.innerHTML = '<p class="empty">Inga bokningar för det här tillfället än.</p>'; return; }
    if (!shown.length) { rowsEl.innerHTML = `<p class="empty" role="status">Inga deltagare matchar ”${esc(q)}”.</p>`; return; }
    rowsEl.innerHTML = `
      <table class="table">
        <thead><tr><th class="col-id" scope="col">Boknings-ID</th><th class="col-namn" scope="col">Namn</th><th class="col-epost" scope="col">E-post</th><th class="col-visa" scope="col"><span class="visually-hidden">Länk</span></th></tr></thead>
        <tbody>
          ${shown.map((b) => `
            <tr>
              <td class="col-id">${b.id}</td>
              <td class="col-namn">${esc(b.name)}</td>
              <td class="col-epost">${esc(b.email)}</td>
              <td class="col-visa"><a class="text-link row-link" href="${link({ session: state.session, booking: b.id })}" aria-label="Visa bokning ${b.id}, ${esc(b.name)}">Visa bokning</a></td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  };
  drawRows(state.q);

  document.getElementById('tillfalle').addEventListener('change', (e) => {
    location.hash = link({ session: e.target.value });
  });
  document.getElementById('sok').addEventListener('input', (e) => drawRows(e.target.value));
}

/* ---------- Detaljvy ---------- */
function detail(state) {
  const b = getAllBookings().find((x) => x.id === state.booking);
  if (!b) { location.replace(link({ session: state.session })); return; }
  const s = getSession(b.session);
  const back = link({ session: state.session });
  document.title = `Bokning ${b.id} | Ljusrum admin`;
  main.innerHTML = `
    <div>
      <p class="eyebrow"><a href="${back}">Bokningsöversikt</a> › Bokning ${b.id}</p>
      <h1 class="admin-title" tabindex="-1">Bokning ${b.id}</h1>
    </div>
    <section class="detail" aria-label="Bokningsdetaljer">
      <div>
        <p class="detail__name">${esc(b.name)}</p>
        <p class="detail__mail"><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></p>
      </div>
      <dl class="facts">
        <dt>Workshop</dt><dd>${WS.title}</dd>
        <dt>Datum</dt><dd>${s.short}</dd>
        <dt>Tid</dt><dd>10:00–15:00</dd>
        <dt>Plats</dt><dd>${WS.placeShort}</dd>
        <dt>Pris</dt><dd>${formatPrice(WS.price)}</dd>
        <dt>Status</dt><dd><span class="status"><span aria-hidden="true">✓</span> ${b.status}</span></dd>
      </dl>
    </section>
    <div><a class="text-link" href="${back}">← Tillbaka till bokningsöversikt</a></div>`;
}

/* ---------- Router ---------- */
let first = true;
function render() {
  const state = readState();
  if (state.booking) detail(state); else overview(state);
  if (!first) { const h = main.querySelector('h1'); if (h) h.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  first = false;
}
window.addEventListener('hashchange', render);
// Uppdatera om en bokning görs i en annan flik
window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) render(); });
render();
