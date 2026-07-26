/* A replica of the reader's course nav — same labels as
 * platform/src/lib/course-data.json, same geometry constants as
 * platform/src/components/reader/Sidebar.tsx. Everything below is in the app's
 * own CSS pixels; the composition scales the whole panel up at render time, so
 * the proportions stay honest to the real sidebar. */

export type Node = { id: string; label: string; children?: Node[] };

export const TREE: Node[] = [
  {
    id: "getting-started",
    label: "Getting started",
    children: [
      { id: "what-is-economics", label: "What is Economics" },
      { id: "how-to-use", label: "How to use this course" },
      { id: "key-terms", label: "Key terms & glossary" },
    ],
  },
  {
    id: "microeconomics",
    label: "Microeconomics",
    children: [
      {
        id: "supply-demand",
        label: "Supply & demand",
        children: [
          { id: "law-of-demand", label: "The law of demand" },
          { id: "law-of-supply", label: "The law of supply" },
          { id: "market-equilibrium", label: "Market equilibrium" },
          {
            id: "elasticity",
            label: "Elasticity",
            children: [
              { id: "ped", label: "Price elasticity of demand" },
              { id: "yed", label: "Income elasticity" },
              { id: "xed", label: "Cross-price elasticity" },
            ],
          },
        ],
      },
      {
        id: "consumer-choice",
        label: "Consumer choice",
        children: [
          { id: "utility", label: "Utility & marginal utility" },
          { id: "indifference", label: "Indifference curves" },
          { id: "budget", label: "Budget constraints" },
        ],
      },
      { id: "firms", label: "Firms & production", children: [{ id: "costs", label: "Costs of production" }] },
    ],
  },
  {
    id: "macroeconomics",
    label: "Macroeconomics",
    children: [{ id: "gdp", label: "Gross Domestic Product" }],
  },
  {
    id: "behavioral",
    label: "Behavioral economics",
    children: [{ id: "biases", label: "Cognitive biases" }],
  },
];

/* Sidebar.tsx constants, unchanged. */
export const STEP = 18;
export const RAIL = 2;
export const BAR = 3;
export const BAR_H = 16;
export const ROW_H = 32;
export const GAP = 2; // gap-0.5 between rows
export const PITCH = ROW_H + GAP;
export const RAIL_INSET = (ROW_H - BAR_H) / 2;
export const GUTTER = 15.5;
export const ROOT_PAD = 8;
export const ROW_BORDER = 2;
export const PANEL_W = 265; // --sidebar-docs

/** x of the bar's left edge for rows nested under a folder at `depth`. */
export const barLeftFor = (depth: number) => GUTTER + depth * STEP;
/** Text indent for a row at `depth`, net of the border. */
export const padFor = (depth: number) =>
  depth === 0 ? ROOT_PAD : GUTTER + BAR + GUTTER + (depth - 1) * STEP - ROW_BORDER;

export type Placed = {
  id: string;
  label: string;
  depth: number;
  isFolder: boolean;
  open: boolean;
  parent: string | null;
  /** y of the row's top edge, in app pixels */
  y: number;
};

/** The visible rows for a given set of open folders, top to bottom. */
export function layout(open: Set<string>): Map<string, Placed> {
  const out = new Map<string, Placed>();
  let i = 0;

  const walk = (nodes: Node[], depth: number, parent: string | null) => {
    for (const n of nodes) {
      const isFolder = !!n.children?.length;
      const isOpen = isFolder && open.has(n.id);
      out.set(n.id, {
        id: n.id,
        label: n.label,
        depth,
        isFolder,
        open: isOpen,
        parent,
        y: i * PITCH,
      });
      i += 1;
      if (isOpen) walk(n.children!, depth + 1, n.id);
    }
  };

  walk(TREE, 0, null);
  return out;
}

/** Direct children of a folder, for drawing its rail. */
export function childIdsOf(id: string): string[] {
  const find = (nodes: Node[]): Node | null => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const hit = find(n.children);
        if (hit) return hit;
      }
    }
    return null;
  };
  return find(TREE)?.children?.map((c) => c.id) ?? [];
}

/** Every folder id in the tree. */
export const FOLDER_IDS: string[] = (() => {
  const ids: string[] = [];
  const walk = (nodes: Node[]) =>
    nodes.forEach((n) => {
      if (n.children?.length) {
        ids.push(n.id);
        walk(n.children);
      }
    });
  walk(TREE);
  return ids;
})();
