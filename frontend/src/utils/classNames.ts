/**
 * Utility function to build CSS class names from an array of class strings.
 * Filters out falsy values and joins them with spaces.
 *
 * @param classes - Array of class names (can include falsy values)
 * @returns Space-separated string of valid class names
 */
export const classNames = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ')
}
