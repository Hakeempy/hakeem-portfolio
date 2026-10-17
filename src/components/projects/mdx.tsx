import type { ComponentPropsWithoutRef } from "react";
import { Reveal } from "@/components/motion/Reveal";

/*
 * Prose for the case studies, set in the room's own type: headings at the lead step, running
 * text in the full ink at the body step, a 64ch measure. Monospace appears only inside code.
 */
export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <Reveal className="mt-[clamp(56px,6vw,96px)] first:mt-0">
      <h2 data-reveal className="text-lead leading-tight font-medium tracking-[-0.015em]" {...props} />
    </Reveal>
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-10 text-body font-medium" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="mt-8 text-body font-medium text-muted" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-5 max-w-[64ch] first:mt-0" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="underline decoration-muted decoration-[0.07em] underline-offset-[0.22em] transition-[text-decoration-color] duration-200 hover:decoration-ink"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-5 max-w-[64ch] list-disc space-y-2 pl-5 marker:text-muted" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="tabular mt-5 max-w-[64ch] list-decimal space-y-2 pl-6 marker:text-muted" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-10 max-w-[40ch] text-lead leading-[1.3] text-muted [&_p]:max-w-none" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="bg-surface-2 px-[0.35em] py-[0.1em] font-mono text-[0.88em]" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="mt-8 overflow-x-auto bg-surface p-[clamp(16px,2vw,28px)] font-mono text-small leading-[1.6] [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em]"
      {...props}
    />
  ),
  hr: () => <div role="separator" className="h-[clamp(40px,5vw,72px)]" />,
  img: ({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) => (
    // Body images come from the MDX author with no known size, so next/image cannot place them.
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className="mt-10 w-full bg-surface" loading="lazy" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="mt-8 overflow-x-auto">
      <table className="tabular w-full text-left text-small" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-surface-2 font-medium" {...props} />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="even:bg-surface" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th className="px-4 py-2.5 font-medium" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => <td className="px-4 py-2.5" {...props} />,
};
