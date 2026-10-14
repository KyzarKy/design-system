// Joins class names, skipping any that aren't set. It doesn't resolve conflicts: a
// component's `className` prop is for layout (flex-1, w-full, a margin), which the
// component's own classes never set.

export function joinClasses(...names: (string | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}
