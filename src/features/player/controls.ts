import type { VisualControl } from '../../shared/contracts/game';
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function controlValue(code: string, control: VisualControl) {
  const block = code.match(new RegExp(`${escapeRegex(control.selector)}\\s*\\{([^}]*)\\}`));
  const raw = block?.[1]
    .match(new RegExp(`(?:^|;)\\s*${escapeRegex(control.property)}\\s*:\\s*([^;]+)`))?.[1]
    ?.trim();
  return raw ?? (control.type === 'number' ? '0' : (control.options?.[0].value ?? ''));
}
export function changeControl(code: string, control: VisualControl, value: string) {
  const regex = new RegExp(`(${escapeRegex(control.selector)}\\s*\\{)([^}]*)(\\})`);
  const declaration = new RegExp(`(${escapeRegex(control.property)}\\s*:\\s*)([^;]+)`);
  const cssValue = control.type === 'number' ? `${value}${control.suffix ?? ''}` : value;
  return code.replace(
    regex,
    (_match, start: string, body: string, end: string) =>
      `${start}${declaration.test(body) ? body.replace(declaration, `$1${cssValue}`) : `${body}\n  ${control.property}: ${cssValue};\n`}${end}`,
  );
}
