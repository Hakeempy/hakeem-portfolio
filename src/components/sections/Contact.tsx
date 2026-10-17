"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

export function Contact() {
  const [message, setMessage] = useState("");

  function send(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("Hello from your portfolio");
    const body = encodeURIComponent(message.trim());
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  const rows = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "LinkedIn", value: "wikireh-hakeem", href: site.links.linkedin },
    { label: "GitHub", value: "Hakeempy", href: site.links.github },
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="px-margin pt-[200px] pb-[160px]">
      <Reveal className="mx-auto w-full max-w-[520px] lg:mr-auto lg:ml-[41.66%]">
        <h2 id="contact-heading" data-reveal className="text-lead leading-[1.25] font-medium">
          <span className="block text-muted">Hiring, learning or&nbsp;stuck?</span>
          <span className="block">Tell me what you&rsquo;re working&nbsp;on.</span>
        </h2>

        <form onSubmit={send} data-reveal style={{ "--i": 1 } as React.CSSProperties} className="relative mt-7">
          <label htmlFor="message" className="sr-only-heading">
            Your message
          </label>
          <input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="I need help with…"
            autoComplete="off"
            className="h-[60px] w-full bg-field pr-16 pl-5 text-body text-accent-ink placeholder:text-[#6f6862] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:h-16"
          />
          <button
            type="submit"
            aria-label="Write the email"
            className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center bg-accent text-accent-ink transition-transform duration-[140ms] ease-out active:scale-95"
          >
            <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h11M10 4.5 14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </form>
        <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-4 text-small text-muted">
          This opens your email app with your message written in.
        </p>

        <dl data-reveal style={{ "--i": 3 } as React.CSSProperties} className="mt-[72px] grid gap-5 text-small sm:grid-cols-[120px_1fr] sm:gap-y-3">
          {rows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-muted">{row.label}</dt>
              <dd className="-mt-4 sm:mt-0">
                <a href={row.href} className="link">
                  {row.value}
                </a>
              </dd>
            </div>
          ))}
          <dt className="text-muted">Based in</dt>
          <dd className="-mt-4 sm:mt-0">{site.location}</dd>
        </dl>
      </Reveal>
    </section>
  );
}
