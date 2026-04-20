/**
 * Thrown by `configure()` when the supplied configuration fails runtime
 * validation (bad shape, missing fields, malformed regex patterns, etc.).
 *
 * Catch this specifically to distinguish user-config problems from other
 * runtime errors:
 *
 * ```ts
 * try {
 *   configure(userConfig);
 * } catch (err) {
 *   if (err instanceof ConfigurationError) {
 *     // surface the message to the user; it names the offending field
 *   } else {
 *     throw err;
 *   }
 * }
 * ```
 */
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
    // Preserve the original constructor in the stack trace (V8).
    if (typeof (Error as unknown as { captureStackTrace?: unknown }).captureStackTrace === "function") {
      (Error as unknown as { captureStackTrace: (t: object, c: Function) => void }).captureStackTrace(this, ConfigurationError);
    }
    // Ensure `instanceof` works across down-level compile targets (TS extends-Error gotcha).
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}
