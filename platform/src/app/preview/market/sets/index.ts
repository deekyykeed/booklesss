import type { CardSet } from "../_types";
import alexTurner from "./alex-turner";

/* One design, the owner's call after seeing eight side by side: "only use
   Free UI Cards and keep them sized small." The other seven sets sit beside
   this file again because /preview/row shows every design in a row; this
   page still draws only the one. */
export const SETS: CardSet[] = [alexTurner];
