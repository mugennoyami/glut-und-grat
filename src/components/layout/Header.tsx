"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/shop/CartProvider";
import { buttonClass } from "@/components/ui/Button";
import { BagIcon, MenuIcon } from "@/components/ui/icons";
import { SideDialog } from "@/components/ui/SideDialog";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/content/site";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { summary, openDrawer, ready } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = ready ? summary.itemCount : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-bone/10 bg-coal/88 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Link href="/" className="-mx-1 rounded-[3px] px-1 py-2 text-bone" aria-label="Glut & Grat – zur Startseite">
          <Wordmark />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden md:block">
          <ul className="flex items-center gap-1 lg:gap-3">
            {site.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium transition-colors hover:text-copper ${
                      active ? "text-copper" : "text-bone"
                    }`}
                  >
                    {item.label}
                    {active ? <span className="absolute inset-x-3 bottom-1.5 h-px bg-copper" aria-hidden="true" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openDrawer}
            aria-haspopup="dialog"
            aria-controls="cart-drawer"
            aria-label={count > 0 ? `Warenkorb öffnen, ${count} ${count === 1 ? "Artikel" : "Artikel"}` : "Warenkorb öffnen, leer"}
            className="relative grid h-11 min-w-11 place-items-center rounded-[3px] px-2 text-bone transition-colors hover:text-copper"
            data-testid="cart-button"
          >
            <BagIcon size={23} />
            {count > 0 ? (
              <span
                className="absolute right-0.5 top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-ember px-1 text-[0.6875rem] font-bold leading-none text-coal tabular-nums"
                data-testid="cart-count"
              >
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            aria-label="Menü öffnen"
            className="grid h-11 w-11 place-items-center rounded-[3px] text-bone hover:text-copper md:hidden"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </div>

      <SideDialog id="mobile-menu" open={menuOpen} onClose={() => setMenuOpen(false)} title="Menü" side="right" width="min(24rem, 100vw)">
        <nav aria-label="Mobile Navigation" className="flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-8 pt-4">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href} className="border-b border-bone/10">
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="font-display flex min-h-16 items-center text-3xl font-semibold hover:text-copper aria-[current=page]:text-copper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3">
            <Link href="/schaerfservice#anfrage" onClick={() => setMenuOpen(false)} className={buttonClass({ full: true, size: "lg" })}>
              Schärfservice anfragen
            </Link>
            <Link href="/kontakt" onClick={() => setMenuOpen(false)} className={buttonClass({ variant: "secondary", full: true })}>
              Kontakt
            </Link>
            <p className="pt-3 text-sm text-fog">{site.claim}</p>
          </div>
        </nav>
      </SideDialog>
    </header>
  );
}
