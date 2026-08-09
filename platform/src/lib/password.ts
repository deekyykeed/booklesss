/* ------------------------------------------------------------------ *
 * What counts as an acceptable NEW password. One rule, two doors.
 *
 * There are exactly two places a password is chosen — creating an account
 * (AuthForm's sign-up branch) and resetting one (ResetPasswordForm) — and a
 * floor that guards only the first is not a floor. Reset is the EASIER path to
 * walk a weak password in through: the student is mid-recovery, wants to be
 * done, and will type whatever gets them back in. So the rule lives here and
 * both import it.
 *
 * ⚠️ IT IS NOT CHECKED ON SIGN-IN, AND THAT ASYMMETRY IS DELIBERATE. A
 * returning student whose password predates this rule must still be able to get
 * into their own account with it. Measuring a password before the app knows
 * whether it is being CREATED or PRESENTED would lock out exactly the people
 * who did nothing wrong. AuthForm therefore calls this only after a failed
 * sign-in has told it an account is about to be made.
 *
 * WHAT IS DELIBERATELY NOT HERE: character-class rules — must contain an
 * uppercase, a digit, a symbol. They push people toward `Password1!`, which is
 * weaker than three random words and is the first pattern every cracking
 * dictionary tries. Length is the only rule that reliably buys entropy, so it
 * is the only hard one; the rest of this file just refuses the handful of
 * strings that clear a length rule while being trivially guessable.
 *
 * ⚠️ THIS IS NOT A BREACH CHECK, AND NOTHING IN THE BROWSER CAN BE. "correct
 * horse battery" passes everything here and may still be in a breach corpus.
 * The check that catches that is Supabase's leaked-password protection
 * (Dashboard → Authentication → Policies), which tests the candidate against
 * HaveIBeenPwned by k-anonymity hash prefix. It has to run server-side: doing
 * it here would mean sending a hash of a password the student is still typing
 * to a third party from their own browser. When it is on, Supabase rejects the
 * call and both forms turn that error into a sentence. TURNING IT ON IS A
 * DASHBOARD SETTING, not a code change — see the security notes in
 * PROJECT_MEMORY.
 * ------------------------------------------------------------------ */

/** Supabase's own floor is 6. Eight, because the difference costs a student two
 *  characters once and this is the only thing standing in front of their
 *  account. Raising it here raises it on both doors at once.
 *
 *  ⚠️ Keep this at or above whatever "Minimum password length" is set to in the
 *  Supabase dashboard. If the dashboard is higher, this passes a password the
 *  server then rejects, and the student gets Supabase's wording instead of
 *  ours. */
export const MIN_PASSWORD = 8;

/**
 * What is wrong with this as a new password, or null if nothing is.
 *
 * Returns the sentence to show, not a boolean plus a lookup — the caller is a
 * form and the only thing it can do with a failure is print it.
 */
export function weakness(pw: string): string | null {
  if (pw.length < MIN_PASSWORD) return `Passwords need at least ${MIN_PASSWORD} characters.`;

  /* One character repeated. Clears any length rule, guessed immediately. */
  if (/^(.)\1+$/.test(pw)) return "That's one character repeated. Try something else.";

  /* A straight run off the keyboard or the alphabet — "12345678", "abcdefgh",
     "qwertyui". Allowed once the password is long enough that the run is
     plainly a fragment of something longer rather than the whole thing. */
  if (pw.length < 16) {
    const head = pw.slice(0, 10).toLowerCase();
    const RUNS = ["0123456789", "1234567890", "abcdefghij", "qwertyuiop"];
    if (RUNS.some((r) => r.startsWith(head) || head.startsWith(r.slice(0, head.length))))
      return "That's a straight run of characters. Try something else.";
  }

  return null;
}

/**
 * The one guessable string an attacker already holds for a given account.
 *
 * Separate from `weakness` because it needs the email, which the reset form
 * does not have to hand — a recovery session knows who you are without the
 * page having been told. Called only where the address is on screen.
 */
export function containsEmail(pw: string, email: string): string | null {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (local.length > 3 && pw.toLowerCase().includes(local))
    return "Don't put your email in your password.";
  return null;
}
