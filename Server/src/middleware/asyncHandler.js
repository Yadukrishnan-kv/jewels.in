// Express 4 does not catch rejected promises from async route handlers —
// an unhandled rejection here would crash the whole process (Node's default
// since v15). Wrapping every handler funnels errors into errorHandler.js instead.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
