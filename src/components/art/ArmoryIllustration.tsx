import { useId } from "react";
import type { ArmoryMotif } from "@/content/collections";

/** Stilisiertes Wappenmotiv, keine Abbildung eines erhältlichen Produkts. */
export function ArmoryIllustration({ motif, className = "" }: { motif: ArmoryMotif | "crest"; className?: string }) {
  const id = useId().replace(/:/g, "");
  const steel = `url(#${id}-steel)`;
  const edge = `url(#${id}-edge)`;
  const gold = `url(#${id}-gold)`;
  const sword = (
    <g>
      <path d="M286 194 L314 194 L308 408 L300 446 L292 408Z" fill={steel} stroke="#a9aaa0" strokeWidth="1.2" />
      <path d="M300 199V425" stroke="#e4e3ce" opacity=".65" />
      <path d="M240 182 Q300 165 360 182 L362 195 Q300 186 238 195Z" fill={gold} stroke="#d8ba76" />
      <path d="M288 113H312L309 174H291Z" fill="#302421" stroke="#ae9361" />
      {[121, 131, 141, 151, 161].map(y => <path key={y} d={`M291 ${y}l18 5`} stroke="#907655" strokeWidth="2" />)}
      <circle cx="300" cy="100" r="16" fill={gold} stroke="#d8ba76" />
      <path d="m300 89 6 11-6 11-6-11Z" fill="#2a302b" />
    </g>
  );
  const shield = (
    <g>
      <path d="M194 141 Q300 103 406 141 L394 295 Q378 362 300 405 Q222 362 206 295Z" fill="#28342f" stroke="#b79a61" strokeWidth="5" />
      <path d="M207 152 Q300 120 393 152 L382 292 Q366 350 300 389 Q234 350 218 292Z" fill="none" stroke="#9b875b" opacity=".6" />
      <path d="M300 130V388" stroke="#b79a61" strokeWidth="2" />
      <path d="m300 199 18 48 49 17-49 18-18 54-18-54-49-18 49-17Z" fill={gold} />
      <circle cx="300" cy="265" r="12" fill="#29342f" stroke="#e0c88e" />
      {[164, 205, 246, 287].map((y, i) => <g key={y} fill="#bdab80"><circle cx={218 + i * 3} cy={y} r="2" /><circle cx={382 - i * 3} cy={y} r="2" /></g>)}
    </g>
  );
  const armor = (
    <g>
      <path d="M248 242 L226 255 198 246 166 264 151 311 201 329 218 304 227 391 Q300 419 373 391 L382 304 399 329 449 311 434 264 402 246 374 255 352 242Z" fill={steel} stroke="#92978d" strokeWidth="2" />
      <path d="M246 247Q300 280 354 247L365 359Q300 385 235 359Z" fill={edge} stroke="#8c948c" />
      <path d="M300 268V391M170 282l44 17M164 299l39 16M386 299l44-17M397 315l39-16" fill="none" stroke="#c5c7b5" opacity=".65" />
      <path d="M227 372Q300 398 373 372M229 386Q300 413 371 386" fill="none" stroke="#a8a892" />
      <path d="M244 226V162Q244 100 300 89Q356 100 356 162V226L328 254H272Z" fill={steel} stroke="#aaa998" strokeWidth="2" />
      <path d="M300 90V249L272 242 250 218 251 161Z" fill="#64706a" opacity=".4" />
      <path d="M250 163l43 5v11l-43-3ZM307 168l43-5v13l-43 3Z" fill="#101715" stroke="#b6b7a4" />
      <path d="M299 146v94" stroke="#b79a61" strokeWidth="5" />
      <path d="M249 185l50 6 52-6" fill="none" stroke="#b79a61" strokeWidth="4" />
      {[202, 214, 226].map(y => <g key={y} fill="#1c2422">{[266, 278, 322, 334].map(x => <circle key={x} cx={x} cy={y} r="2.5" />)}</g>)}
      <path d="M263 114Q300 93 337 114M260 122Q300 102 340 122" fill="none" stroke="#e0debf" opacity=".4" />
    </g>
  );
  const katana = (
    <g transform="rotate(36 300 250)">
      <path d="M293 174Q285 309 325 430L342 451L338 421Q307 285 312 174Z" fill={edge} stroke="#bcc5ba" strokeWidth="1.5" />
      <path d="M299 182Q294 315 335 433" fill="none" stroke="#e6ead6" strokeWidth="2" />
      <path d="M284 173L290 66Q301 60 314 66L317 173Z" fill="#242a27" stroke="#b79a61" strokeWidth="2" />
      {[76, 93, 110, 127, 144].map(y => <path key={y} d={`m291 ${y} 20 11-20 11 20-11Z`} fill="#c6b891" stroke="#776a50" />)}
      <ellipse cx="301" cy="176" rx="35" ry="8" fill={gold} stroke="#d9c28a" strokeWidth="2" />
      <path d="M291 66H313V74H290Z" fill={gold} />
      <path d="M294 185H312V197H294Z" fill={gold} />
    </g>
  );
  return (
    <svg viewBox="0 0 600 500" aria-hidden="true" className={className} fill="none">
      <defs>
        <linearGradient id={`${id}-steel`} x1="150" y1="180" x2="430" y2="290" gradientUnits="userSpaceOnUse"><stop stopColor="#1b2523" /><stop offset=".38" stopColor="#929a8f" /><stop offset=".51" stopColor="#d0d2bd" /><stop offset=".53" stopColor="#535e58" /><stop offset="1" stopColor="#1c2523" /></linearGradient>
        <linearGradient id={`${id}-edge`} x1="224" y1="250" x2="364" y2="270" gradientUnits="userSpaceOnUse"><stop stopColor="#35413c" /><stop offset=".5" stopColor="#abb3a5" /><stop offset=".51" stopColor="#53625b" /><stop offset="1" stopColor="#26322d" /></linearGradient>
        <linearGradient id={`${id}-gold`} x1="240" y1="180" x2="350" y2="280" gradientUnits="userSpaceOnUse"><stop stopColor="#e0c58b" /><stop offset=".5" stopColor="#a28a5a" /><stop offset="1" stopColor="#625335" /></linearGradient>
      </defs>
      <circle cx="300" cy="250" r="197" stroke="#b7a170" opacity=".16" />
      <circle cx="300" cy="250" r="181" stroke="#b7a170" strokeDasharray="1 11" opacity=".4" />
      <path d="M300 25v24M300 451v24M75 250h24M501 250h24" stroke="#b7a170" opacity=".5" />
      {motif === "crest" ? <><g opacity=".85" transform="rotate(-32 300 250)">{sword}</g><g opacity=".85" transform="rotate(32 300 250)">{sword}</g><g transform="translate(30 10) scale(.9)">{shield}</g><g transform="translate(90 36) scale(.7)">{armor}</g></> : null}
      {motif === "armor" ? armor : null}
      {motif === "sword" ? <g transform="rotate(28 300 250)">{sword}</g> : null}
      {motif === "shield" ? shield : null}
      {motif === "katana" ? katana : null}
    </svg>
  );
}
