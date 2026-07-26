// Edge-safe constants (no Node built-ins) so middleware can import them without
// pulling the Node `crypto` module into the Edge runtime.
export const SESSION_COOKIE = "admin_session";
