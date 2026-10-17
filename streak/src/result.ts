// Errors as values (chapter 08). A function that can fail says so in its return type, and the
// caller cannot read `value` until it has checked `ok`.

export type Result<T, E> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E }

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}
