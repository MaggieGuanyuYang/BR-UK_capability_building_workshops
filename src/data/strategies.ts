import sourceTable from "./source-table.json";

export const PAPER_URL =
  "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0357909";
export const TABLE_URL = `${PAPER_URL}#pone-0357909-t003`;
export const PAPER_TITLE =
  "Developing the UK’s capability in behavioural research: Identifying strengths, challenges and strategies through cross-sector workshops";
export const CITATION = `Yang G, Saunders KRK, Hart N, Davan Wetton J, Coupe N, Olson I, et al. (2026). ${PAPER_TITLE}. PLOS One 21(9): e0357909. https://doi.org/10.1371/journal.pone.0357909`;

export const roles = [
  {
    id: "researchers",
    label: "Researchers",
    source: "Researchers",
    lines: ["Researchers"],
  },
  {
    id: "practitioners",
    label: "Research users & practitioners",
    source: "Research users/practitioners",
    lines: ["Research users", "& practitioners"],
  },
  {
    id: "networks",
    label: "Research communities & networks",
    source: "Research community/networks",
    lines: ["Research", "communities", "& networks"],
  },
  {
    id: "institutions",
    label: "Universities & research institutions",
    source: "Universities/research institutions",
    lines: ["Universities", "& research", "institutions"],
  },
  {
    id: "funders",
    label: "Research funders",
    source: "Research funders",
    lines: ["Research", "funders"],
  },
  {
    id: "government",
    label: "National & local government",
    source: "National/local governments",
    lines: ["National & local", "government"],
  },
  {
    id: "international",
    label: "International organisations",
    source: "International organisations",
    lines: ["International", "organisations"],
  },
  {
    id: "industry",
    label: "Industry partners",
    source: "Industry partners",
    lines: ["Industry", "partners"],
  },
  {
    id: "organisations",
    label: "Research user organisations",
    source: "Research user organisations",
    lines: ["Research user", "organisations"],
  },
  {
    id: "publishers",
    label: "Publishers",
    source: "Publishers",
    lines: ["Publishers"],
  },
] as const;

export type Role = (typeof roles)[number];
export type RoleId = Role["id"];

// Short labels are for map navigation only. Strategy content comes from Table 3.
const mapLabels = [
  ["Communicate", "clearly"],
  ["Share", "resources"],
  ["Embed in", "decisions"],
  ["Build", "skills"],
  ["Rethink", "funding"],
  ["Support", "champions"],
  ["Strengthen", "engagement"],
  ["Connect", "disciplines"],
  ["Think in", "systems"],
  ["Set quality", "standards"],
];

// Use the published wording verbatim, separating only numbering and bullet markers.
// The panel, saved plan and exports all share this single source of strategy text.
export const strategies = sourceTable.map((row, index) => {
  const [sourceTitle, ...sourceActions] = row.strategy.split("•");
  const sourceActors = row.actors.split(";").map((actor) => actor.trim());
  return {
    id: index + 1,
    short: mapLabels[index],
    title: sourceTitle.replace(/^\d+\.\s*/, "").trim(),
    actions: sourceActions.map((action) => action.trim()),
    sourceQuote: row.quote,
    frameworks: row.frameworks.split(";").map((framework) => framework.trim()),
    roles: roles
      .filter((role) => sourceActors.includes(role.source))
      .map((role) => role.id),
  };
});

export type Strategy = (typeof strategies)[number];
export const relevantStrategies = (role: RoleId) =>
  strategies.filter((strategy) => strategy.roles.includes(role));
export const strategyNumber = (id: number) => String(id).padStart(2, "0");
