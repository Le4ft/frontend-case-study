# Komentáře k řešení

## Shrnutí

Aplikace je dokončena dle zadání v [README.md](./README.md) — zobrazení detailu akce, interaktivní mapa sedadel,
košík, checkout jako host nebo přihlášený uživatel a vytvoření objednávky přes API. Navíc jsou implementovány obě
bonusové funkce (přidání do kalendáře, multijazyčnost CS/EN).

## Architektura

-   **State management** — `React Context` + `useState`/`useMemo` (žádná externí knihovna, na rozsah aplikace by byl
    Redux/Zustand zbytečný overhead):
    -   `CartContext` — obsah košíku (`Map<seatId, CartItem>`), výpočet celkového počtu a ceny.
    -   `AuthContext` — přihlášený uživatel, perzistence do `localStorage`.
    -   `I18nContext` — aktuální jazyk a slovník překladů, perzistence do `localStorage`, výchozí jazyk dle
        `navigator.language`.
-   **Data fetching** — `useEventData` hook volá `/event` a navazující `/event-tickets` sekvenčně (druhý požadavek
    potřebuje `eventId` z prvního), s loading/error stavy. API klient je v `src/lib/api.ts` včetně typované
    `ApiError`.
-   **Mapa sedadel** (`SeatMap.tsx`) — řadí řady i sedadla vzestupně a mezi neexistující čísla sedadel vykresluje
    prázdné placeholdery, aby zůstalo zachováno vizuální rozestavění (viz poznámka v zadání o nespojitém pořadí
    sedadel). Typ vstupenky je barevně odlišen a vysvětlen v legendě.
-   **Checkout** (`CheckoutDialog.tsx`) — pokud je uživatel přihlášen, objednávka se rovnou odešle s jeho údaji.
    Jinak nabízí přepínání mezi "pokračovat jako host" (formulář) a přihlášením. Po odeslání se zobrazí stav
    úspěchu/chyby dle odpovědi API.

## Rozhodnutí a kompromisy

-   Bez React Router — aplikace je jednostránková (one-page) přesně dle zadání, routing by přidával zbytečnou
    komplexitu.
-   Bez formulářové knihovny (React Hook Form apod.) — formuláře jsou jednoduché (2–3 pole), stačí `useState` a
    HTML5 validace (`required`, `type="email"`).
-   Barvy sedadel podle typu vstupenky jsou generovány z fixní palety podle pořadí `ticketTypeId` v poli
    `ticketTypes` — API nevrací barvu, takže jde o klientské rozhodnutí pro lepší UX (rychlá vizuální orientace).
-   "Přidat do kalendáře" generuje `.ics` soubor (`BEGIN:VCALENDAR…`) čistě na klientovi a stáhne ho přes `Blob`
    URL — funguje offline a bez závislosti na Google/Apple kalendáři konkrétně.

## Co by šlo dál (mimo rozsah 2–4h)

-   Testy (Vitest + React Testing Library) pro `CartContext` a `SeatMap` (řazení/mezery v sedadlech).
-   Optimistické blokování sedadel, která si zrovna vybírá jiný uživatel (websocket/polling), pokud by to API
    podporovalo.
-   Perzistence obsahu košíku mezi reloady stránky.

## Nasazení

Repozitář je připraven pro nasazení na Vercel (`npm run build` → `dist/`). Pro nasazení stačí propojit repozitář
s Vercel projektem (Framework Preset: Vite).
