"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/site";
import { courses } from "@/data/courses";
import { Reveal } from "@/components/motion/Reveal";

type Topic = "course" | "consulting" | "other";

const topics: { key: Topic; label: string }[] = [
  { key: "course", label: "A course" },
  { key: "consulting", label: "Consulting" },
  { key: "other", label: "Something else" },
];

/**
 * The contact form for the courses page. It asks what the message is about first (and which
 * course, for a course), so the email arrives with a subject that says so.
 */
export function CoursesContact() {
  const [topic, setTopic] = useState<Topic>("course");
  const [course, setCourse] = useState(courses[0].key);
  const [message, setMessage] = useState("");

  const subject =
    topic === "course"
      ? `${courses.find((c) => c.key === course)?.title ?? "A"} course`
      : topic === "consulting"
        ? "Consulting"
        : "Hello from your portfolio";

  function send(e: FormEvent) {
    e.preventDefault();
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message.trim())}`;
  }

  const choice = (on: boolean) =>
    `relative py-1.5 transition-colors duration-200 ${on ? "text-ink" : "text-muted hover:text-ink"}`;
  const bar = <span aria-hidden className="absolute -bottom-0.5 left-0 block h-[3px] w-full bg-accent" />;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-6 px-margin pt-[clamp(96px,10vw,160px)] pb-[clamp(120px,12vw,200px)]">
      <Reveal className="mx-auto w-full max-w-[560px] lg:mr-auto lg:ml-[41.66%]">
        <h2 id="contact-heading" data-reveal className="text-lead leading-[1.25] font-medium">
          <span className="block text-muted">Learning, hiring help or&nbsp;stuck?</span>
          <span className="block">Tell me what you&rsquo;re working&nbsp;on.</span>
        </h2>

        <form onSubmit={send} data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-8">
          <fieldset>
            <legend className="text-small text-muted">It&rsquo;s about</legend>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {topics.map((t) => (
                <button key={t.key} type="button" aria-pressed={topic === t.key} onClick={() => setTopic(t.key)} className={choice(topic === t.key)}>
                  {t.label}
                  {topic === t.key && bar}
                </button>
              ))}
            </div>
          </fieldset>

          {topic === "course" && (
            <fieldset className="mt-5">
              <legend className="text-small text-muted">Which course</legend>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                {courses.map((c) => (
                  <button key={c.key} type="button" aria-pressed={course === c.key} onClick={() => setCourse(c.key)} className={choice(course === c.key)}>
                    {c.tab}
                    {course === c.key && bar}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="relative mt-7">
            <label htmlFor="message" className="sr-only-heading">
              Your message
            </label>
            <input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={topic === "consulting" ? "We need help with…" : "I'd like to…"}
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
          </div>
        </form>
        <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-4 text-small text-muted">
          This opens your email app with the subject &ldquo;{subject}&rdquo; and your message written in.
        </p>
      </Reveal>
    </section>
  );
}
