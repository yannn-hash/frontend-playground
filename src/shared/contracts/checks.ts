import type { Check, ElementSnapshot, LayoutSnapshot, ValidationResult } from './game';

export const near = (a: number, b: number, tolerance = 2) => Math.abs(a - b) <= tolerance;
export const visible = (element: ElementSnapshot) =>
  element.width > 0 &&
  element.height > 0 &&
  element.styles.visibility !== 'hidden' &&
  element.styles.opacity !== '0';
export const cssNumber = (node: ElementSnapshot | undefined, property: string) =>
  parseFloat(node?.styles[property] ?? '') || 0;
export const check = (id: string, label: string, passed: boolean, detail: string): Check => ({
  id,
  label,
  passed,
  detail,
});
export const result = (checks: Check[]): ValidationResult => ({
  passed: checks.length > 0 && checks.every((item) => item.passed),
  checks,
});
export function node(snapshot: LayoutSnapshot | undefined, id: string): ElementSnapshot {
  return snapshot?.nodes[id] ?? { x: -9999, y: -9999, width: 0, height: 0, styles: {} };
}
