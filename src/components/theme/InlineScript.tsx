/**
 * Runs while the HTML is parsed, before the first paint. On the client the type turns to
 * text/plain so React neither re-runs it nor warns about rendering a script tag.
 * (Pattern from the Next.js guide on preventing flash before hydration.)
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Applies a saved theme choice before paint. With no choice saved, the site stays dark. */
export const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
