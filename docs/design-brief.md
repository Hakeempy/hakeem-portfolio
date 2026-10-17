# Design brief

Art direction dealt by the Taste skill (`.taste-skill/direction.json`, seed 1434534315): **The dark room**.
Type: Switzer. Palette: warm black and gold. Signature motion: slow crossfade.

## The idea

> On this page, **the screens Hakeem's own pipelines report to** (his Grafana panels, Airflow runs,
> Step Functions graphs and DynamoDB tables) become **lit exhibits in a dark room**, like monitors
> glowing in an operations room at night.

Gold is the only colour, and it means what it means in a lakehouse: the gold layer, the data that is ready
to use. It is used once per screen, on the action and on whatever is "served".

**The live thing:** *Send a trip through it.* A miniature of the Lab7 trip pipeline. The visitor edits a trip
(start and end events), sends it, and watches it pass the real validation rules, get matched into a
`COMPLETED#` record, and change the real daily KPIs for 2024-05-25 (4,999 trips in the source data).
Bad input is rejected with the rule that rejected it. Without JavaScript the last run is shown as text.

## The argument (one claim per section)

| Section | Claim | Proof |
| --- | --- | --- |
| Hero | I build the pipelines data runs on. | His own dashboards, crossfading. |
| Work (full panels) | They are real and they run. | Six projects, each shown by its own screen and one true fact. |
| Live pipeline | You can try one. | Lab7's rules and data, in the browser. |
| List | The range goes from Kafka to Power BI. | Every other project, with its picture. |
| Path (pinned) | I understand data from both ends. | Analyst, instructor, data scientist, engineer, each with real work. |
| Teaching (sentence) | I still teach it. | 2022, 100+ students, 5 tools, 95% satisfaction (resume). |
| Contact (one field) | Hire me, learn from me, or bring me a data problem. | One field that opens an email. |
| Footer | Made in Accra. | Independence Arch, credited. |

## Copy to confirm before launch

- Hero: "I build the pipelines your data runs on."
- The four career sentences in `src/data/path.ts`.
- The teaching sentence: the figures come from the resume.
- Project facts on the work panels come from the screenshots and READMEs.

## House rules (from the skill)

No eyebrows, no monospace outside code, no 01/02/03, no hairlines, no gradients, no shadows at rest,
no glass, no icon cards, no styled accent words. Headlines two lines or fewer at every width.
One accent. Square corners throughout.
