/* =========================================================
   Ljusrum – hemsidan (/)
   Enkel router med hash-adresser så att webbläsarens bakåtknapp
   fungerar:  #/  #/om-kursen  #/boka  #/uppgifter  #/granska  #/bekraftelse
   ========================================================= */

const app = document.getElementById('app');
const W = LJUSRUM.workshop;
const DRAFT_KEY = 'ljusrum-utkast';
const LAST_KEY = 'ljusrum-senaste-bokning';

const getDraft = () => safeRead(sessionStorage, DRAFT_KEY, {});
const setDraft = (patch) => safeWrite(sessionStorage, DRAFT_KEY, { ...getDraft(), ...patch });

/* ---------- Gemensamma delar ---------- */
function footer() {
  return `
    <footer class="site-footer footer-wrap">
      <p>Plats: Ljusrum fotostudio på Södermalm</p>
      <p>Telefon: <a href="tel:+46712345678">+46 71 234 56 78</a></p>
      <p>E-post: <a href="mailto:fotoworkshop@hej.se">fotoworkshop@hej.se</a></p>
    </footer>`;
}
function backLink(href, text = '← Tillbaka') {
  return `<a class="text-link" href="${href}">${text}</a>`;
}
function pageHead(title) {
  return `<h1 class="page-title" tabindex="-1">${title}</h1><hr class="divider">`;
}
const dateList = () =>
  LJUSRUM.sessions.map((s) => `<li>${s.label} <span class="date-list__time nowrap">${W.time}</span></li>`).join('');

/* ---------- Vyer ---------- */
const views = {
  /* Startsida */
  start() {
    return {
      title: 'Ta kontroll över din kamera – fotokurs för nybörjare | Ljusrum',
      html: `
      <div class="page">
        <div class="hero">
          <div class="hero__text">
            <div class="hero__head">
              <h1 class="hero__title" tabindex="-1">Ta kontroll över <br class="br-desktop">din kamera</h1>
              <p class="hero__sub">En fotokurs för nybörjare i Stockholm</p>
            </div>
            <a class="btn btn--compact hero__cta-desktop" href="#/boka">Välj tid och boka</a>
          </div>
          <img class="hero__img" src="images/hero.jpg" alt="Person som håller upp en systemkamera framför ansiktet" width="1206" height="639">
          <a class="btn btn--compact hero__cta-mobile" href="#/boka">Välj tid och boka</a>
        </div>

        <section class="section" aria-labelledby="h-kort">
          <div class="intro">
            <h2 id="h-kort">Kort om kursen</h2>
            <p>En heldag för vuxna nybörjare som vill komma vidare från autoläget på din kamera.
            Vi varvar korta genomgångar med praktiska fotoövningar, både i studion och ute på Södermalm.</p>
            <div class="intro__more"><a class="text-link" href="#/om-kursen">Läs mer om kursen →</a></div>
          </div>
        </section>

        <section class="section split" aria-labelledby="h-niva">
          <div>
            <h2 id="h-niva">Kunskapsnivå</h2>
            <p>Passar dig som är nybörjare. Inga tidigare fotokunskaper behövs – vi går igenom kamerans inställningar steg för steg.</p>
          </div>
          <div class="split__media"><img src="images/kunskapsniva.jpg" alt="Person i röd mössa som fotograferar utomhus" loading="lazy" width="780" height="520"></div>
        </section>

        <section class="section split split--reverse" aria-labelledby="h-kamera">
          <div>
            <h2 id="h-kamera">Kamerakrav</h2>
            <p>Egen kamera där du kan ställa in bländare, slutartid och ISO. Mobilkamera räcker inte. Osäker på din kamera? Mejla oss modellen så svarar vi.</p>
          </div>
          <div class="split__media"><img src="images/kamerakrav.jpg" alt="Systemkamera på en randig filt" loading="lazy" width="480" height="320"></div>
        </section>

        <section class="section" aria-labelledby="h-tider">
          <h2 id="h-tider">Lediga tider i närtid</h2>
          <ul class="date-list">${dateList()}</ul>
          <a class="btn btn--compact" href="#/boka">Välj tid och boka</a>
        </section>

        ${footer()}
      </div>`,
    };
  },

  /* Mer om kursen */
  'om-kursen'() {
    return {
      title: 'Mer om kursen | Ljusrum',
      html: `
      <div class="page page--narrow stack">
        ${pageHead('Mer om kursen')}
        <section class="prose" aria-labelledby="h-forvanta">
          <h2 id="h-forvanta">Vad du kan förvänta dig av kursen</h2>
          <p style="margin-top:16px">Ta kontroll över din kamera är en workshop för dig som vill lära dig fotografera manuellt.
          Dagen består av korta genomgångar och praktiska övningar, inne i studion och utomhus i närheten.
          Du övar på bländare, slutartid, ISO, fokus, ljus och komposition.</p>
          <dl class="facts" style="margin-top:16px">
            <dt>Tid</dt><dd>Kl. 10–15</dd>
            <dt>Plats</dt><dd>Ljusrum fotostudio på Södermalm, Stockholm, och utomhus i närheten</dd>
            <dt>Pris</dt><dd>1 200 kr inkl. moms. Faktura skickas via e-post efter bokningen.</dd>
            <dt>Grupp</dt><dd>Högst 10 deltagare</dd>
          </dl>
        </section>
        <img class="wide-img" src="images/om-kursen-1.jpg" alt="Två personer tittar glatt på en bild i kamerans skärm" loading="lazy" width="1206" height="639">
        <section aria-labelledby="h-ingar">
          <h2 id="h-ingar">Detta ingår i kursen</h2>
          <ul class="include-list">
            <li><span class="include-list__icon" aria-hidden="true">✓</span>Handledning under hela dagen</li>
            <li><span class="include-list__icon" aria-hidden="true">✓</span>Övningsmaterial</li>
            <li><span class="include-list__icon" aria-hidden="true">✓</span>Fika</li>
            <li class="include-list__no"><span class="include-list__icon" aria-hidden="true">✕</span>Lunch ingår inte</li>
          </ul>
        </section>
        <hr class="divider">
        <section aria-labelledby="h-krav">
          <h2 id="h-krav">Kunskapsnivå och kamerakrav</h2>
          <p style="margin-top:16px">Inga tidigare fotokunskaper behövs.</p>
          <p style="margin-top:16px"><strong>Ta med:</strong> Egen kamera där du kan ställa in bländare, slutartid och ISO,
          laddat batteri och minneskort. Mobilkamera räcker inte. Extra objektiv och stativ behövs inte.</p>
          <p style="margin-top:16px"><strong>Klädsel:</strong> Kläder efter väder – en del av dagen är vi ute.</p>
        </section>
        <img class="wide-img" src="images/om-kursen-2.jpg" alt="Närbild på en systemkamera med motljusskydd" loading="lazy" width="1206" height="639">
        <hr class="divider">
        <h2>Låter detta som något för dig?</h2>
        <a class="btn btn--compact" href="#/boka">Välj tid och boka</a>
        ${backLink('#/')}
        ${footer()}
      </div>`,
    };
  },

  /* Steg 1: Välj en tid */
  boka() {
    const draft = getDraft();
    const options = LJUSRUM.sessions.map((s) => {
      const left = spotsLeft(s.id);
      const full = left === 0;
      return `
        <label class="option ${full ? 'is-full' : ''}">
          <input type="radio" name="tillfalle" value="${s.id}" ${draft.session === s.id ? 'checked' : ''} ${full ? 'disabled' : ''}>
          <span class="option__radio" aria-hidden="true"></span>
          <span class="option__text">
            <span class="option__date">${s.label}</span>
            <span class="option__info">${full ? 'Fullbokat' : `Kl. 10–15 · ${left} platser kvar`}</span>
          </span>
          <span class="option__badge" aria-hidden="true">✓ Vald</span>
        </label>`;
    }).join('');
    return {
      title: 'Välj en tid | Ljusrum',
      html: `
      <div class="page page--narrow stack">
        ${pageHead('Välj en tid')}
        <form id="time-form" class="stack" novalidate>
          <fieldset class="picker">
            <legend>Välj ett tillfälle</legend>
            ${options}
          </fieldset>
          <div class="selected-time" id="selected-time" aria-live="polite"></div>
          <button class="btn" type="submit" id="to-details">Gå vidare till bokning</button>
        </form>
        ${backLink('#/')}
        ${footer()}
      </div>`,
      mount() {
        const form = document.getElementById('time-form');
        const out = document.getElementById('selected-time');
        const btn = document.getElementById('to-details');
        const update = () => {
          const s = getSession(getDraft().session);
          if (s) {
            out.innerHTML = `<strong>Vald tid</strong>${s.label}, <span class="nowrap">${W.time}</span>`;
            btn.disabled = false;
          } else {
            out.textContent = 'Ingen tid vald än. Välj ett tillfälle ovan för att gå vidare.';
            btn.disabled = true;
          }
        };
        form.addEventListener('change', (e) => {
          if (e.target.name === 'tillfalle') { setDraft({ session: e.target.value }); update(); }
        });
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (getSession(getDraft().session)) location.hash = '#/uppgifter';
        });
        update();
      },
    };
  },

  /* Steg 2: Fyll i dina uppgifter */
  uppgifter() {
    const d = getDraft();
    const s = getSession(d.session);
    if (!s) return { redirect: '#/boka' };
    return {
      title: 'Fyll i dina uppgifter | Ljusrum',
      html: `
      <div class="page page--narrow stack">
        ${pageHead('Fyll i dina uppgifter')}
        <div>
          <h2>Din valda tid</h2>
          <p style="margin-top:8px">${s.label}, <span class="nowrap">${W.time}</span></p>
          <p>${W.placeShort} · ${formatPrice(W.price)} inkl. moms</p>
          <a class="text-link" href="#/boka">← Ändra tid</a>
        </div>
        <form id="details-form" class="stack" novalidate>
          <div class="field">
            <label for="namn">Namn</label>
            <input id="namn" name="namn" type="text" autocomplete="name" placeholder="T.ex. Anna Andersson"
              value="${esc(d.name || '')}" aria-describedby="namn-fel" required>
            <p class="field__error" id="namn-fel"></p>
          </div>
          <div class="field">
            <label for="epost">E-postadress</label>
            <input id="epost" name="epost" type="email" autocomplete="email" inputmode="email" placeholder="T.ex. anna@exempel.se"
              value="${esc(d.email || '')}" aria-describedby="epost-hint epost-fel" required>
            <p class="field__hint" id="epost-hint">Hit skickar vi bekräftelse och faktura.</p>
            <p class="field__error" id="epost-fel"></p>
          </div>
          <button class="btn" type="submit">Granska bokning</button>
        </form>
        ${backLink('#/boka')}
        ${footer()}
      </div>`,
      mount() {
        const form = document.getElementById('details-form');
        const fields = {
          namn: { el: form.namn, err: document.getElementById('namn-fel'),
            check: (v) => v.trim().length >= 2 ? '' : 'Skriv ditt för- och efternamn.' },
          epost: { el: form.epost, err: document.getElementById('epost-fel'),
            check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Skriv en giltig e-postadress, t.ex. anna@exempel.se.' },
        };
        const show = (f, msg) => {
          f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
          f.err.innerHTML = msg ? `<span aria-hidden="true">⚠</span><span>${msg}</span>` : '';
        };
        Object.values(fields).forEach((f) => f.el.addEventListener('input', () => {
          if (f.el.getAttribute('aria-invalid') === 'true') show(f, f.check(f.el.value));
        }));
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          let firstBad = null;
          for (const f of Object.values(fields)) {
            const msg = f.check(f.el.value);
            show(f, msg);
            if (msg && !firstBad) firstBad = f.el;
          }
          if (firstBad) { firstBad.focus(); return; }
          setDraft({ name: form.namn.value.trim(), email: form.epost.value.trim() });
          location.hash = '#/granska';
        });
      },
    };
  },

  /* Steg 3: Granska */
  granska() {
    const d = getDraft();
    const s = getSession(d.session);
    if (!s) return { redirect: '#/boka' };
    if (!d.name || !d.email) return { redirect: '#/uppgifter' };
    return {
      title: 'Granska din bokning | Ljusrum',
      html: `
      <div class="page page--narrow stack">
        ${pageHead('Granska din bokning')}
        <p>Kontrollera att allt stämmer innan du bekräftar.</p>
        <section class="card review-card" aria-labelledby="h-ws">
          <div class="card__head"><h2 id="h-ws">Workshop</h2><a class="text-link" href="#/boka">Ändra tid</a></div>
          <dl class="facts">
            <dt>Kurs:</dt><dd>${W.title}</dd>
            <dt>Tid:</dt><dd>${s.label}, <span class="nowrap">${W.time}</span></dd>
            <dt>Plats:</dt><dd>${W.placeShort}, Stockholm</dd>
            <dt>Pris:</dt><dd>${formatPrice(W.price)} inkl. moms</dd>
          </dl>
        </section>
        <section class="card review-card" aria-labelledby="h-du">
          <div class="card__head"><h2 id="h-du">Dina uppgifter</h2><a class="text-link" href="#/uppgifter">Ändra</a></div>
          <dl class="facts">
            <dt>Namn:</dt><dd>${esc(d.name)}</dd>
            <dt>E-post:</dt><dd>${esc(d.email)}</dd>
          </dl>
        </section>
        <p>Ingen betalning sker nu. Fakturan skickas till din e-post efter bokningen.</p>
        <p class="field__error" id="book-error" role="alert"></p>
        <button class="btn" type="button" id="confirm">Bekräfta bokning</button>
        ${backLink('#/uppgifter')}
        ${footer()}
      </div>`,
      mount() {
        document.getElementById('confirm').addEventListener('click', () => {
          const draft = getDraft();
          if (spotsLeft(draft.session) === 0) {
            document.getElementById('book-error').textContent = '⚠ Tillfället blev precis fullbokat. Välj en annan tid.';
            return;
          }
          const booking = addBooking(draft);
          safeWrite(sessionStorage, LAST_KEY, booking);
          sessionStorage.removeItem(DRAFT_KEY);
          location.hash = '#/bekraftelse';
        });
      },
    };
  },

  /* Bokningsbekräftelse */
  bekraftelse() {
    const b = safeRead(sessionStorage, LAST_KEY, null);
    if (!b) return { redirect: '#/' };
    const s = getSession(b.session);
    return {
      title: 'Bokningsbekräftelse | Ljusrum',
      html: `
      <div class="page page--narrow stack">
        <p class="page-title" style="font-size:24px;font-weight:700">Bokningsbekräftelse</p>
        <hr class="divider">
        <h1 class="confirm-title" tabindex="-1">✓ Din plats är bokad!</h1>
        <dl class="facts">
          <dt>Bokning:</dt><dd>${b.id}</dd>
          <dt>Namn:</dt><dd>${esc(b.name)}</dd>
          <dt>Datum:</dt><dd>${s.label}, <span class="nowrap">${W.time}</span></dd>
          <dt>Plats:</dt><dd>${W.place}</dd>
          <dt>Pris:</dt><dd>${formatPrice(W.price)} inkl. moms</dd>
          <dt>Faktura:</dt><dd>${esc(b.email)}</dd>
        </dl>
        <p><strong>Ta med:</strong> Egen kamera där du kan ställa in bländare, slutartid och ISO, laddat batteri och minneskort. Kläder efter väder.</p>
        <p>En bekräftelse och fakturan skickas till din e-post. Ingen betalning görs på webbplatsen.</p>
        <img class="confirm-img" src="images/bekraftelse.jpg" alt="Systemkamera bland höstlöv" width="720" height="400">
        <a class="btn-secondary btn-secondary--full" href="#/">← Tillbaka till startsidan</a>
        ${footer()}
      </div>`,
    };
  },
};

/* ---------- Router ---------- */
function render() {
  const route = (location.hash.replace(/^#\/?/, '') || 'start').split('?')[0];
  const view = (views[route] || views.start)();
  if (view.redirect) { location.replace(view.redirect); return; }
  app.innerHTML = view.html;
  document.title = view.title;
  if (view.mount) view.mount();
  window.scrollTo(0, 0);
  // Flytta fokus till sidans rubrik så att skärmläsare hör att sidan bytts
  if (render.hasRendered) { const h = app.querySelector('h1'); if (h) h.focus({ preventScroll: true }); }
  render.hasRendered = true;
}
window.addEventListener('hashchange', render);
render();
