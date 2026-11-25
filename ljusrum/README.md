# Ljusrum – fotoworkshop

Webbplats för bokning av workshoppen *Ta kontroll över din kamera*.

- `/` – hemsidan: information, välj tid, fyll i uppgifter, granska, bekräftelse
- `/admin` – arrangörens bokningsöversikt med detaljvy

Byggd med vanlig HTML, CSS och JavaScript – inget byggsteg behövs.
Bokningar sparas i webbläsarens `localStorage` (ingen databas). En bokning
som görs på hemsidan syns direkt i admin i samma webbläsare.

## Filer

```
index.html        Hemsidan
admin/index.html  Admin
css/styles.css    Gemensam stil: färger, typografi, knappar
css/site.css      Hemsidans layout
css/admin.css     Admins layout
js/data.js        Tillfällen, exempelbokningar, sparande
js/app.js         Hemsidans vyer och bokningsflöde
js/admin.js       Admins vyer
images/           Bilder från Figma
vercel.json       Gör att /admin fungerar på Vercel
```

## Brytpunkter

| Bredd | Layout |
|---|---|
| under 600 px | Mobil – en kolumn, deltagarlistan i admin visas som kort |
| 600–1023 px | Tablet – bredare marginaler, bild och text bredvid varandra |
| från 1024 px | Desktop – hero i två kolumner, innehåll max 1120 px, textspalter max 720 px |

## Testa lokalt

Öppna en terminal i mappen och kör:

```
npx serve .
```

eller `python3 -m http.server`. Gå sedan till `http://localhost:3000` (eller port 8000) och `/admin`.

## Publicera på Vercel

1. Skapa ett nytt repo på GitHub och ladda upp alla filer i mappen (dra och släpp går bra).
2. Logga in på vercel.com → **Add New… → Project** → välj repot → **Deploy**.
   Inga inställningar behöver ändras (Framework: *Other*).
3. Kontrollera att både `https://ditt-projekt.vercel.app` och `…/admin` öppnas
   i ett privat fönster utan Vercel-inloggning. Om Vercel ber om inloggning:
   **Settings → Deployment Protection** → stäng av *Vercel Authentication*.
