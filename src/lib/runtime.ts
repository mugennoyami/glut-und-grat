/**
 * Laufzeitmodus. Beim Build für GitHub Pages (`npm run build:pages`) wird die Seite als rein statischer Export
 * ausgeliefert: Es gibt keinen Server, also auch keine API-Routen. Formulare können dann nichts zustellen
 * und die Demo-Kasse rechnet im Browser. Beides wird auf der Seite offen so benannt.
 */
export const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
