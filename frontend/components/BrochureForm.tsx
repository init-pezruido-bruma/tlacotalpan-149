"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { brochureDelivery, contact, contactEmail, privacy, site } from "../content";
import {
  brochureMailto,
  parseBrochureRequest,
  type BrochureChannel,
  type BrochureField,
} from "../lib/brochureRequest";

const copy = contact.form;

export function BrochureForm() {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const privacyId = useId();
  const statusRef = useRef<HTMLHeadingElement>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<BrochureChannel | null>(null);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Partial<Record<BrochureField, string>>>(
    {},
  );

  useEffect(() => {
    if (!done) return;
    statusRef.current?.focus();
  }, [done]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      channel: data.get("channel"),
      privacy: data.get("privacy") === "on",
      company: data.get("company"),
    };
    const parsed = parseBrochureRequest(payload);

    if (!parsed.ok) {
      setFields(parsed.fields);
      setError(parsed.message);
      return;
    }
    if (parsed.honeypot) {
      setDone("correo");
      return;
    }

    if (brochureDelivery === "mailto") {
      const href = brochureMailto(contactEmail, parsed.lead, site.brand);
      setMailtoHref(href);
      setDone(parsed.lead.channel);
      window.location.href = href;
      return;
    }

    setPending(true);
    setError("");
    setFields({});

    try {
      const response = await fetch("/api/brochure", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        fields?: Partial<Record<BrochureField, string>>;
      } | null;

      if (!response.ok || !body?.ok) {
        setFields(body?.fields ?? {});
        setError(body?.message || copy.error);
        return;
      }

      setDone(parsed.lead.channel);
    } catch {
      setError(copy.error);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="mt-10 max-w-md" role="status">
        <h3
          ref={statusRef}
          tabIndex={-1}
          className="text-lg tracking-wide text-intro-ink outline-none"
        >
          {mailtoHref ? copy.mailtoReadyTitle : copy.successTitle}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-intro-ink/80">
          {mailtoHref ? copy.mailtoReadyBody : copy.successByChannel[done]}
        </p>
        {mailtoHref ? (
          <a
            href={mailtoHref}
            className="mt-8 inline-flex min-h-11 items-center bg-[var(--hero-green-deep)] px-5 text-sm tracking-wide text-hero-ink transition-opacity hover:opacity-90"
          >
            {copy.mailtoAgain}
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="brochure-form relative mt-10 max-w-md"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Sitio web
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        id={nameId}
        name="name"
        label={copy.name}
        autoComplete="name"
        error={fields.name}
      />
      <Field
        id={emailId}
        name="email"
        type="email"
        label={copy.email}
        autoComplete="email"
        inputMode="email"
        error={fields.email}
      />
      <Field
        id={phoneId}
        name="phone"
        type="tel"
        label={copy.phone}
        autoComplete="tel"
        inputMode="tel"
        error={fields.phone}
      />

      <fieldset className="mt-8">
        <legend className="text-[0.72rem] tracking-[0.14em] text-intro-ink/70 uppercase">
          {copy.channelLegend}
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {copy.channels.map((option) => (
            <label
              key={option.value}
              className="flex min-h-11 cursor-pointer items-center gap-3 border border-intro-ink/30 px-3 text-sm tracking-wide text-intro-ink has-[:checked]:border-intro-ink"
            >
              <input
                type="radio"
                name="channel"
                value={option.value}
                className="size-4 accent-[var(--intro-ink)]"
              />
              {option.label}
            </label>
          ))}
        </div>
        {fields.channel ? (
          <p className="mt-2 text-sm text-[#6e2e24]" role="alert">
            {fields.channel}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-8">
        <label htmlFor={privacyId} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed text-intro-ink/85">
          <input
            id={privacyId}
            name="privacy"
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[var(--intro-ink)]"
            aria-invalid={fields.privacy ? true : undefined}
            aria-describedby={fields.privacy ? `${privacyId}-error` : undefined}
          />
          <span>
            {copy.privacyLead}{" "}
            <Link
              href={privacy.path}
              className="underline decoration-intro-ink/45 underline-offset-[4px] hover:decoration-intro-ink"
            >
              {copy.privacyLink}
            </Link>
            .
          </span>
        </label>
        {fields.privacy ? (
          <p id={`${privacyId}-error`} className="mt-2 text-sm text-[#6e2e24]" role="alert">
            {fields.privacy}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mt-6 text-sm text-[#6e2e24]" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex min-h-11 items-center bg-[var(--hero-green-deep)] px-5 text-sm tracking-wide text-hero-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {brochureDelivery === "mailto"
          ? pending
            ? copy.opening
            : copy.prepare
          : pending
            ? copy.sending
            : copy.submit}
      </button>
      <p className="mt-4 max-w-sm text-xs leading-relaxed text-intro-ink/75">
        {copy.note}
      </p>
      <noscript>
        <p className="mt-4 text-sm text-intro-ink/80">{copy.fallback}</p>
      </noscript>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  inputMode,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete: string;
  inputMode?: "email" | "tel";
  error?: string;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="mt-6 first:mt-0">
      <label htmlFor={id} className="text-[0.72rem] tracking-[0.14em] text-intro-ink/70 uppercase">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 min-h-11 w-full border-b border-intro-ink/35 bg-transparent text-base text-intro-ink outline-none placeholder:text-intro-ink/40"
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[#6e2e24]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
