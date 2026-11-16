import { KnifeIllustration } from "@/components/art/KnifeIllustration";
import { EmberField } from "@/components/art/EmberField";
import { ButtonLink } from "@/components/ui/Button";
import { Caps } from "@/components/ui/Caps";
import { ArrowRightIcon } from "@/components/ui/icons";
import { hero } from "@/content/pages";
import { getProduct } from "@/content/products";
import { appearanceFor } from "@/lib/cart/appearance";
import { defaultSelection } from "@/lib/cart/pricing";

export function Hero() {
  const product = getProduct("esse")!;
  const look = appearanceFor(product, defaultSelection(product));

  return (
    <section className="relative isolate overflow-hidden border-b border-bone/10" aria-labelledby="hero-title">
      <div className="surface-hammered absolute inset-0 -z-20 bg-coal" aria-hidden="true" />
      {/* Esse-Glut: großer, atmender Schein hinter der Klinge */}
      <div
        className="glow-breathe absolute -right-[12%] top-[2%] -z-10 aspect-square w-[78vmin] max-w-[62rem] rounded-full"
        style={{ background: "radial-gradient(circle at 50% 50%, rgb(238 107 45 / 0.34), rgb(198 132 76 / 0.16) 38%, transparent 68%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-coal to-transparent"
        aria-hidden="true"
      />
      <EmberField className="-z-10" />

      <div className="wrap grid items-center gap-x-8 py-10 sm:py-14 lg:min-h-[min(44rem,calc(100svh-6.5rem))] lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:content-center lg:gap-y-0 lg:py-16">
        {/* mobil: Überschrift → Messer → Text → Buttons; ab lg: Text links, Messer rechts über beide Zeilen */}
        <div className="relative z-10 lg:col-span-6 lg:row-start-1">
          <p className="eyebrow text-copper">
            <Caps>{hero.eyebrow}</Caps>
          </p>
          <h1 id="hero-title" className="display mt-6 text-[clamp(2.9rem,5.4vw,5rem)] leading-[1.02]">
            <span className="block">
              Aus <em className="font-display italic text-ember-soft">Feuer</em> geformt.
            </span>{" "}
            <span className="block font-normal italic text-bone/85">Für deinen Alltag gemacht.</span>
          </h1>
        </div>

        <figure className="relative -mx-5 my-1 sm:-mx-8 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:m-0 lg:-mr-12 xl:-mr-20">
          <KnifeIllustration
            dims={product.specs}
            art={product.art}
            view="full"
            aspect={1.28}
            rotation={-17}
            glint
            {...look}
            title="Konzeptdarstellung des handgeschmiedeten Messers Esse mit Holzgriff und Kupferstiften"
            className="h-auto w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
          />
          <figcaption className="px-5 text-xs text-fog sm:px-8 lg:px-0 lg:text-right">{hero.caption}</figcaption>
        </figure>

        <div className="relative z-10 mt-6 lg:col-span-6 lg:row-start-2 lg:mt-7">
          <p className="prose-copy text-lg text-bone/90 sm:text-xl sm:leading-relaxed">{hero.lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/messer" size="lg">
              Messer entdecken <ArrowRightIcon size={19} />
            </ButtonLink>
            <ButtonLink href="/schaerfservice#anfrage" variant="secondary" size="lg">
              Schärfservice anfragen
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
