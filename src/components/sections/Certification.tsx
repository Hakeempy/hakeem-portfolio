import Image from "next/image";
import { certifications } from "@/data/certifications";
import { Reveal } from "@/components/motion/Reveal";

/** The credential, with what an employer needs to check it: dates, validation number, where to verify. */
export function Certification() {
  return (
    <section id="certification" aria-labelledby="certification-heading" className="px-margin py-section">
      <h2 id="certification-heading" className="sr-only-heading">
        Certification
      </h2>
      {certifications.map((cert) => (
        <Reveal
          key={cert.validationNumber}
          className="grid items-center gap-y-10 md:grid-cols-12 md:gap-x-[var(--gap)]"
        >
          <div data-reveal className="w-[min(220px,56vw)] md:col-span-3 md:col-start-2 md:w-full md:max-w-[260px]">
            <Image
              src={cert.badge.src}
              alt={`${cert.name} badge`}
              width={cert.badge.width}
              height={cert.badge.height}
              sizes="(min-width: 768px) 260px, 56vw"
              className="h-auto w-full"
            />
          </div>
          <div className="md:col-span-6 md:col-start-6">
            <p
              data-reveal
              style={{ "--i": 1 } as React.CSSProperties}
              className="display text-lead font-medium [text-wrap:balance] lg:text-head"
            >
              {cert.name}
            </p>
            <dl
              data-reveal
              style={{ "--i": 3 } as React.CSSProperties}
              className="tabular mt-8 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2 text-small"
            >
              <dt className="text-muted">Issued by</dt>
              <dd>{cert.issuer}</dd>
              <dt className="text-muted">Issued</dt>
              <dd>{cert.issued}</dd>
              <dt className="text-muted">Valid until</dt>
              <dd>{cert.expires}</dd>
              <dt className="text-muted">Validation number</dt>
              <dd className="break-all">{cert.validationNumber}</dd>
            </dl>
            <a
              data-reveal
              style={{ "--i": 4 } as React.CSSProperties}
              href={cert.verifyUrl}
              className="link mt-8 inline-block"
            >
              Verify it on AWS with the validation number
            </a>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
