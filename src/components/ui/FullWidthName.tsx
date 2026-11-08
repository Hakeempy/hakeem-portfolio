import { site } from "@/data/site";

/*
 * The name set edge to edge. Measured in Switzer Medium with -0.045em tracking, the ink of
 * "Hakeem Wikireh" is 6.86em wide and starts 0.073em after its origin. So a font size of
 * 1/6.86 of the container's width, pulled left by that 0.073em, puts the H on the left margin
 * and the final h on the right one at every width.
 */
export function FullWidthName({ className = "" }: { className?: string }) {
  return (
    <div className="@container">
      <p
        aria-hidden
        data-reveal
        className={`-ml-[0.073em] text-[14.57cqi] font-medium tracking-[-0.045em] whitespace-nowrap ${className}`}
      >
        {site.name}
      </p>
    </div>
  );
}
