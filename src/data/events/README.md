# Event File Layout

`src/data/events.js` is only the aggregate export. Do not add event objects there.

For the full authoring workflow, see `docs/EVENT_AUTHORING_SOP.md`.

Add events under this directory by era or everyday-life theme:

- `core/lifecycle.js`: birth, school entry, first job framework, marriage, retirement, death.
- `core/narrative-arcs.js`: cross-year structural chains with an opening turn, stateful consequences, and a partial resolution.
- `history/pre1949.js`: late Qing, Republic era, Red Army, Anti-Japanese War, Civil War, Nanyang migration.
- `history/early-prc.js`: 1949-1977, land reform, collectivization, famine, Cultural Revolution, sent-down youth, planned work.
- `history/reform-era.js`: 1978-1999, restored gaokao, reform opening, getihu, xiahai, layoffs, early migration.
- `history/contemporary.js`: 2000-2020, WTO, SARS, Olympics, mobile internet, platform work, housing pressure.
- `history/future.js`: 2021+ near-future events such as AI-era work changes.
- `history/expansion-future-2036.js`: low-stakes future texture and ordinary adaptation.
- `history/speculative-history.js`: fictional 2036-2120 historical processes with opening pressure, consequences, and partial resolution.
- `daily/childhood.js`: low-stakes childhood texture events.
- `daily/school.js`: recurring school and learning texture events.
- `daily/family-relationships.js`: family, friendship, romance, marriage, children, neighborhood.
- `daily/work-wealth.js`: everyday work, money, migration, small opportunities and setbacks.
- `daily/health-aging.js`: health drift texture, aging, old-age social life.

When one file grows beyond roughly 100-150 events, split it by a narrower theme, for example:

- `history/pre1949/war.js`
- `history/pre1949/education.js`
- `daily/family/children.js`
- `daily/work/platform.js`

Authoring rule: keep one semantic life event as one event object. If only the wording changes by era, province, class, hukou, gender, trait, or tag, use `text: [{ conditions, text, weight }]`. Split into separate event IDs only when trigger logic, effects, priority, follow-up dependencies, or historical meaning genuinely differ.
