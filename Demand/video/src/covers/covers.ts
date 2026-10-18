import type { CoverProps } from "./Cover";

/* One row per lesson video. The key is the file name under out/covers/. */
export const COVERS: Record<string, CoverProps> = {
  b1: { kind: "budget", eyebrow: "budgets · lesson 1", lead: "what a budget is", word: "for", world: "paper" },
  b2: { kind: "costs", eyebrow: "budgets · lesson 2", lead: "fixed and", word: "variable", world: "ink" },
  b3: { kind: "breakeven", eyebrow: "budgets · lesson 3", lead: "break", word: "even", world: "paper" },
  m1: { kind: "supply", eyebrow: "microeconomics · lesson 1", lead: "supply and", word: "demand", world: "ink" },
  m2: { kind: "elasticity", eyebrow: "microeconomics · lesson 2", lead: "price", word: "elasticity", world: "paper" },
  m3: { kind: "markets", eyebrow: "microeconomics · lesson 3", lead: "market", word: "structures", world: "ink" },
  mk1: { kind: "customer", eyebrow: "marketing · lesson 1", lead: "know your", word: "customer", world: "paper" },
  mk2: { kind: "price", eyebrow: "marketing · lesson 2", lead: "setting a", word: "price", world: "ink" },
  s1: { kind: "averages", eyebrow: "statistics · lesson 1", lead: "averages that", word: "lie", world: "ink" },
  t1: { kind: "cashflow", eyebrow: "treasury · lesson 1", lead: "cash", word: "flow", world: "paper" },
};
