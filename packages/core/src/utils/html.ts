export class SafeHtml {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

export function safe(value: string): SafeHtml {
  return new SafeHtml(value);
}

function insert(value: unknown): string {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(insert).join("");
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): SafeHtml {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += insert(values[i]);
    result += strings[i + 1];
  }
  return new SafeHtml(result);
}
