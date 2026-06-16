/* ════════════════════════════════════════════════════════════════
   gradguide-auth.js
   Shared auth helper used by every GradGuide page.
   Load it AFTER the Supabase library, like this (in the page's <head>):

     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="gradguide-auth.js"></script>

   Then:
   • To PROTECT a page (require login), also add:
       <script>gradguideRequireLogin();</script>
   • To LOG OUT, point a button at gradguideLogout()
   ════════════════════════════════════════════════════════════════ */

/* Your project's address + public key. Live in ONE place now. */
const SUPABASE_URL = 'https://yjazbxhrxxhupoyhwabs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cyhm89oaEmFeztd4RRE1Rg_v7b8pesQ';

/* `db` = your remote control for the backend, available on every page. */
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Where to send people who aren't logged in. */
const GRADGUIDE_LOGIN_PAGE = 'gradguideloginpage.html';

/* ── THE GUARD ──────────────────────────────────────────────────
   Call this at the top of any page you want to lock. It asks the
   browser "is there a valid session (wristband)?" If not, it sends
   the visitor to the login page instead of showing the content.   */
async function gradguideRequireLogin() {
  try {
    const { data } = await db.auth.getSession();
    if (!data.session) {
      // No wristband → not allowed in. Replace (not push) so the
      // protected page doesn't linger in the back-button history.
      window.location.replace(GRADGUIDE_LOGIN_PAGE);
    }
  } catch (err) {
    console.error('Auth guard error:', err);
    window.location.replace(GRADGUIDE_LOGIN_PAGE);
  }
}

/* ── LOGOUT ─────────────────────────────────────────────────────
   Tears up the wristband on the server + in the browser, then
   sends the user back to the login page.                          */
async function gradguideLogout() {
  await db.auth.signOut();
  window.location.replace(GRADGUIDE_LOGIN_PAGE);
}

/* ── (Optional) WHO'S LOGGED IN ─────────────────────────────────
   Handy later for greeting the user by name, e.g.
     const user = await gradguideCurrentUser();
     if (user) console.log(user.user_metadata.full_name);          */
async function gradguideCurrentUser() {
  const { data } = await db.auth.getUser();
  return data.user;
}