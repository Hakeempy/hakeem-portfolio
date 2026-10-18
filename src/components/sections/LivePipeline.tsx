"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { sampleTrip, tripDay } from "@/data/trips";
import { Reveal } from "@/components/motion/Reveal";
import { useTheme } from "@/components/theme/ThemeToggle";

// The trip pipeline's validation rules, as written in that project's README.
const DATETIME = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

function validDatetime(value: string) {
  const m = DATETIME.exec(value.trim());
  if (!m) return false;
  const [, y, mo, d, h, mi, s] = m.map(Number);
  const date = new Date(Date.UTC(y, mo - 1, d, h, mi, s));
  return date.getUTCMonth() === mo - 1 && date.getUTCDate() === d && h < 24 && mi < 60 && s < 60;
}

function isNumeric(value: string) {
  return value.trim() !== "" && Number.isFinite(Number(value));
}

type Trip = { tripId: string; pickup: string; estimate: string; dropoff: string; fare: string };

type Kpi = { date: string; count: number; total: number; max: number; min: number };

/** Completed trips, keyed by trip_id like the DynamoDB table. */
type Completed = Record<string, { date: string; fare: number }>;

type Result =
  | { ok: false; stage: 1; reason: string }
  | { ok: true; trip: Trip; date: string; fare: number; duplicate: boolean };

function run(trip: Trip, completed: Completed): Result {
  const missing = (["tripId", "pickup", "estimate", "dropoff", "fare"] as const).find(
    (key) => trip[key].trim() === "",
  );
  if (missing) {
    const names = {
      tripId: "trip_id",
      pickup: "pickup_datetime",
      estimate: "estimated_fare_amount",
      dropoff: "dropoff_datetime",
      fare: "fare_amount",
    };
    return { ok: false, stage: 1, reason: `Rejected: ${names[missing]} is missing.` };
  }
  if (!validDatetime(trip.pickup))
    return { ok: false, stage: 1, reason: "Rejected: pickup_datetime must be YYYY-MM-DD HH:MM:SS." };
  if (!validDatetime(trip.dropoff))
    return { ok: false, stage: 1, reason: "Rejected: dropoff_datetime must be YYYY-MM-DD HH:MM:SS." };
  if (!isNumeric(trip.estimate))
    return { ok: false, stage: 1, reason: "Rejected: estimated_fare_amount must be a number." };
  if (!isNumeric(trip.fare))
    return { ok: false, stage: 1, reason: "Rejected: fare_amount must be a number." };

  const existing = completed[trip.tripId.trim()];
  return {
    ok: true,
    trip,
    // A duplicate is reported against the day its first, kept record belongs to.
    date: existing ? existing.date : trip.pickup.trim().slice(0, 10),
    fare: Number(trip.fare),
    duplicate: Boolean(existing),
  };
}

// The day's other 4,998 trips stay fixed; the first trip in the data starts in `completed`,
// so sending it again shows the duplicate check at work.
const others = {
  date: tripDay.date,
  count: tripDay.tripCount - 1,
  total: tripDay.totalFare - sampleTrip.fullFare,
  max: tripDay.maxFare,
  min: tripDay.minFare,
};

const initialCompleted: Completed = {
  [sampleTrip.tripId]: { date: tripDay.date, fare: sampleTrip.fullFare },
};

function dailyKpis(completed: Completed): Kpi[] {
  const days = new Map<string, Kpi>([[others.date, { ...others }]]);
  for (const { date, fare } of Object.values(completed)) {
    const day = days.get(date) ?? { date, count: 0, total: 0, max: -Infinity, min: Infinity };
    days.set(date, {
      date,
      count: day.count + 1,
      total: day.total + fare,
      max: Math.max(day.max, fare),
      min: Math.min(day.min, fare),
    });
  }
  return [...days.values()].filter((d) => d.count > 0).sort((a, b) => a.date.localeCompare(b.date));
}

// Stage marker colours per theme: waiting, passed, served (gold) and rejected.
const MARKS = {
  dark: { idle: "#3a342e", done: "#f4f1ec", served: "#c9a45a", failed: "#d96b5f", error: "#e08a7f" },
  light: { idle: "#cec9c1", done: "#1a1714", served: "#a07b34", failed: "#b0453a", error: "#a3402f" },
};

const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STAGES = [
  { service: "Kinesis", job: "Receive the start and end events" },
  { service: "Lambda", job: "Validate both against the rules" },
  { service: "DynamoDB", job: "Match them into one completed trip" },
  { service: "Glue", job: "Recompute the day's numbers" },
];

export function LivePipeline() {
  const reduce = useReducedMotion();
  const marks = MARKS[useTheme()];
  const [trip, setTrip] = useState<Trip>({
    tripId: "hakeem0001",
    pickup: "2024-05-25 18:40:00",
    estimate: "38.00",
    dropoff: "2024-05-25 19:06:00",
    fare: "42.50",
  });
  const [completed, setCompleted] = useState<Completed>(initialCompleted);
  const [changedDate, setChangedDate] = useState<string | null>(null);
  const days = dailyKpis(completed);
  const [result, setResult] = useState<Result | null>(null);
  const [step, setStep] = useState(-1); // last stage the record has reached
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function send(e: FormEvent) {
    e.preventDefault();
    timers.current.forEach(clearTimeout);
    const r = run(trip, completed);
    setResult(r);
    const last = r.ok ? 3 : 1;
    const gap = reduce ? 0 : 520;
    setStep(-1);
    for (let i = 0; i <= last; i++) {
      timers.current.push(
        window.setTimeout(() => {
          setStep(i);
          // Like match_and_complete in the trip pipeline: a trip_id that is already COMPLETED is not written again.
          if (i === 3 && r.ok && !r.duplicate) {
            setCompleted((prev) => ({ ...prev, [r.trip.tripId.trim()]: { date: r.date, fare: r.fare } }));
            setChangedDate(r.date);
          }
        }, gap * (i + 1)),
      );
    }
  }

  const field = (key: keyof Trip, label: string, hint: string) => (
    <label className="block">
      <span className="block text-small text-muted">{label}</span>
      <input
        value={trip[key]}
        onChange={(e) => setTrip((t) => ({ ...t, [key]: e.target.value }))}
        inputMode={key === "fare" || key === "estimate" ? "decimal" : "text"}
        spellCheck={false}
        autoComplete="off"
        aria-describedby={`${key}-hint`}
        className="mt-1.5 h-12 w-full bg-surface-2 px-3 text-ink transition-[background-color] duration-200 outline-none focus:bg-[#2c2721] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      />
      <span id={`${key}-hint`} className="sr-only-heading">
        {hint}
      </span>
    </label>
  );

  const failedAt = result && !result.ok ? result.stage : null;

  return (
    <section
      id="try"
      aria-labelledby="try-heading"
      className="px-margin py-section"
    >
      <Reveal className="grid gap-x-[var(--gap)] gap-y-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 id="try-heading" data-reveal className="display text-head">
            Send a trip through&nbsp;it
          </h2>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-6 max-w-[44ch]">
            This is my real-time trip pipeline, small enough to run in your browser. The
            day already holds {tripDay.tripCount.toLocaleString("en-US")} real trips from the
            project&rsquo;s data. Edit yours, send it, and watch it get checked, matched and counted.
            Break a date or a fare to see a rejection.
          </p>

          <form onSubmit={send} data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-10 grid grid-cols-2 gap-4">
            <div className="col-span-2">{field("tripId", "Trip ID", "Any text; it joins the two events")}</div>
            {field("pickup", "Pickup time", "Format YYYY-MM-DD HH:MM:SS")}
            {field("estimate", "Estimated fare", "A number")}
            {field("dropoff", "Dropoff time", "Format YYYY-MM-DD HH:MM:SS")}
            {field("fare", "Final fare", "A number")}
            <div className="col-span-2 mt-2 flex items-center gap-5">
              <button type="submit" className="button">
                Send trip
              </button>
              <button
                type="button"
                className="link text-small text-muted hover:text-ink"
                onClick={() =>
                  setTrip({
                    tripId: sampleTrip.tripId,
                    pickup: sampleTrip.pickup,
                    estimate: sampleTrip.estimate,
                    dropoff: sampleTrip.dropoff,
                    fare: sampleTrip.fare,
                  })
                }
              >
                Use the first trip in the data
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-6 md:col-start-7" aria-live="polite">
          <ol className="space-y-7">
            {STAGES.map((stage, i) => {
              const reached = step >= i;
              const failed = failedAt === i && reached;
              return (
                <li key={stage.service} data-reveal style={{ "--i": i + 1 } as React.CSSProperties} className="grid grid-cols-[14px_1fr] gap-x-4">
                  <motion.span
                    aria-hidden
                    className="mt-[0.55em] block size-[10px]"
                    animate={{
                      backgroundColor: failed ? marks.failed : reached ? (i === 3 ? marks.served : marks.done) : marks.idle,
                      scale: reached ? [1, 1.5, 1] : 1,
                    }}
                    transition={{ duration: reduce ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div>
                    <p className={`text-lead leading-tight transition-colors duration-300 ${reached ? "text-ink" : "text-muted"}`}>
                      {stage.service}
                    </p>
                    <p className="mt-1 text-muted">{stage.job}</p>
                    {result && reached && <StageOutput index={i} result={result} days={days} errorColor={marks.error} />}
                  </div>
                </li>
              );
            })}
          </ol>

          <table className="tabular mt-12 w-full text-left text-small">
            <caption className="mb-3 text-left text-muted">
              Daily KPIs, written to S3 and queried in Athena
            </caption>
            <thead className="text-muted">
              <tr>
                <th scope="col" className="pb-2 pl-2 font-normal">pickup_date</th>
                <th scope="col" className="pb-2 text-right font-normal">trip_count</th>
                <th scope="col" className="pb-2 text-right font-normal">total_fare</th>
                <th scope="col" className="pb-2 text-right font-normal">average_fare</th>
                <th scope="col" className="hidden pb-2 text-right font-normal sm:table-cell">max</th>
                <th scope="col" className="hidden pb-2 text-right font-normal sm:table-cell">min</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <motion.tr
                  key={`${d.date}-${d.count}-${d.total.toFixed(2)}`}
                  initial={d.date === changedDate && step === 3 && !reduce ? { backgroundColor: "rgba(201,164,90,0.28)" } : false}
                  animate={{ backgroundColor: "rgba(201,164,90,0)" }}
                  transition={{ duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
                  className="odd:bg-surface"
                >
                  <td className="py-2.5 pl-2">{d.date}</td>
                  <td className="py-2.5 text-right">{d.count.toLocaleString("en-US")}</td>
                  <td className="py-2.5 text-right">{money(d.total)}</td>
                  <td className="py-2.5 text-right">{money(d.total / d.count)}</td>
                  <td className="hidden py-2.5 text-right sm:table-cell">{money(d.max)}</td>
                  <td className="hidden py-2.5 text-right sm:table-cell">{money(d.min)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}

function StageOutput({
  index,
  result,
  days,
  errorColor,
}: {
  index: number;
  result: Result;
  days: Kpi[];
  errorColor: string;
}) {
  if (!result.ok) {
    if (index === 1)
      return (
        <p className="mt-2" style={{ color: errorColor }}>
          {result.reason}
        </p>
      );
    return <p className="mt-2 text-ink">2 events received.</p>;
  }
  const t = result.trip;
  const lines = [
    "2 events received.",
    "Required fields present, dates in format, fares numeric.",
    `RAW#START + RAW#END → COMPLETED#${t.pickup.trim().replace(" ", "T")}`,
    (() => {
      const count = days.find((d) => d.date === result.date)?.count ?? 1;
      const trips = `${count.toLocaleString("en-US")} ${count === 1 ? "trip" : "trips"}`;
      return result.duplicate
        ? `${result.trip.tripId.trim()} is already completed, so the duplicate was dropped. Still ${trips}.`
        : `${result.date}: now ${trips}.`;
    })(),
  ];
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mt-2 break-words text-ink"
    >
      {lines[index]}
    </motion.p>
  );
}
