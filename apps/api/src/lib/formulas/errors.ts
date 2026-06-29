export class FormulaParseError extends Error {
  constructor(
    public formulaId: string,
    public cause: unknown,
  ) {
    super(`Failed to parse formula ${formulaId}: ${String(cause)}`);
    this.name = 'FormulaParseError';
  }
}

export class NoFormulaMatchError extends Error {
  constructor(
    public occasion: string,
    public vibes?: string[],
    public expression?: string,
  ) {
    const parts = [`No formula match for occasion="${occasion}"`];
    if (vibes?.length) parts.push(`vibes=[${vibes.join(',')}]`);
    if (expression) parts.push(`expression="${expression}"`);
    super(parts.join(', '));
    this.name = 'NoFormulaMatchError';
  }
}
