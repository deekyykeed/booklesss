import type { CardSet } from "../_types";
import alexTurner from "./alex-turner";

/* One design, the owner's call after seeing eight side by side: "only use
   Free UI Cards and keep them sized small." The other seven sets live in git
   (92bd777) rather than parked here. */
export const SETS: CardSet[] = [alexTurner];
