import Link from "next/link";
import { privacy, site } from "../content";

function WithMail({
  text,
  email,
}: {
  text: string;
  email: string;
}) {
  if (!text.includes(email)) return text;

  const parts = text.split(email);
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 ? (
        <a
          href={`mailto:${email}`}
          className="underline decoration-intro-ink/35 underline-offset-[5px] transition-[text-decoration-color] hover:decoration-intro-ink/70"
        >
          {email}
        </a>
      ) : null}
    </span>
  ));
}

export function PrivacyNotice() {
  const email = privacy.responsable.email;

  return (
    <>
      <header className="footer-surface relative isolate">
        <div className="relative z-10 mx-auto flex w-[var(--content)] items-center justify-between gap-6 py-8 md:py-10">
          <Link
            href={privacy.backHref}
            className="text-[0.68rem] font-medium tracking-[0.28em] text-hero-ink uppercase transition-opacity hover:opacity-70 md:text-[0.72rem]"
          >
            {site.brand}
          </Link>
          <Link
            href={privacy.backHref}
            className="text-[0.8rem] text-hero-ink/85 underline decoration-hero-ink/35 underline-offset-[5px] transition-[text-decoration-color,color] hover:text-hero-ink hover:decoration-hero-ink/70 md:text-[0.85rem]"
          >
            {privacy.backLabel}
          </Link>
        </div>
      </header>

      <main className="intro-surface relative isolate flex-1">
        <div className="intro-grain" aria-hidden />

        <article className="relative z-10 mx-auto w-[var(--content)] py-[var(--section-pad)]">
          <p className="text-[0.68rem] font-medium tracking-[0.28em] text-intro-ink/70 uppercase md:text-[0.72rem]">
            {privacy.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-[clamp(1.85rem,5.5vw,3.5rem)] leading-[1.08] font-medium tracking-[0.06em] text-intro-ink uppercase">
            {privacy.title}
          </h1>
          <p className="mt-5 text-[0.8rem] tracking-wide text-intro-ink/65 md:text-[0.85rem]">
            {privacy.updatedLabel}: {privacy.updated}
          </p>
          <p className="mt-10 max-w-2xl text-[0.95rem] leading-[1.8] font-light text-intro-ink md:mt-12 md:text-base md:leading-[1.85]">
            {privacy.lead}
          </p>

          <div className="mt-16 max-w-2xl space-y-14 md:mt-20 md:space-y-16">
            {privacy.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-[0.95rem] font-medium tracking-[0.08em] text-intro-ink uppercase md:text-base">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-[0.9rem] leading-[1.8] font-light text-intro-ink/90 md:text-[0.95rem] md:leading-[1.85]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      <WithMail text={paragraph} email={email} />
                    </p>
                  ))}
                  {"items" in section && section.items ? (
                    <ul className="space-y-3 pl-0">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden
                            className="mt-[0.7em] h-px w-3 shrink-0 bg-intro-ink/40"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {"afterItems" in section && section.afterItems
                    ? section.afterItems.map((paragraph) => (
                        <p key={paragraph}>
                          <WithMail text={paragraph} email={email} />
                        </p>
                      ))
                    : null}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
