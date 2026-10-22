import type { CardSet } from "../_types";
import jorixent from "./jorixent";
import foremark from "./foremark";
import jamesPeterson from "./james-peterson";
import alexTurner from "./alex-turner";
import noahThompson from "./noah-thompson";
import alexanderRoss from "./alexander-ross";
import odusanya from "./odusanya";
import oliviaRhye from "./olivia-rhye";

/* One entry per reference profile card, in the order the owner pinned them.
   Each file builds to CardSet in ../_types and draws from ../_shared only. */
export const SETS: CardSet[] = [jorixent, foremark, jamesPeterson, alexTurner, noahThompson, alexanderRoss, odusanya, oliviaRhye];
