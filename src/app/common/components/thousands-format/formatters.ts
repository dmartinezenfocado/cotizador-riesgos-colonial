/** Formatea un número a #,### con locale en-US (ej. 20,000.50) */
export function formatNumberUS(n: number | string): string {
  const x = typeof n === 'number' ? n : parseNumberUS(n);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(isFinite(x) ? x : 0);
}

/** Parsea una cadena con comas/moneda a número (acepta %, RD$, etc.) */
export function parseNumberUS(raw: string | number): number {
  if (typeof raw === 'number') return raw || 0;
  if (!raw) return 0;

  // Si trae porcentaje, devuélvelo como fracción (ej. "10%" -> 0.1)
  const pct = raw.toString().trim().match(/^(-?\d+(?:[.,]\d+)?)\s*%$/);
  if (pct) {
    const num = Number(pct[1].replace(/[^\d.]/g, '').replace(/,/g, ''));
    return isFinite(num) ? num / 100 : 0;
  }

  // Limpia moneda y separadores: "RD$ 20,000.50" -> 20000.50
  const cleaned = raw
    .toString()
    .replace(/[^\d.,-]/g, '') // deja dígitos, . , y signo
    .replace(/,/g, '');       // quita comas (en-US usa coma de miles)

  const val = Number(cleaned);
  return isFinite(val) ? val : 0;
}

/**
 * Formatea un <input type="text"> durante la escritura.
 * - Muestra miles con coma.
 * - Mantiene valor numérico consistente en el DOM.
 * - No altera el modelo; úsalo junto a (ngModelChange) para setear el número.
 */
export function formatCurrencyInput(evt: any) {
  const el = evt?.target as HTMLInputElement;
  if (!el) return;

  // Mantén solo dígitos y punto (decimales); elimina comas/moneda
  const raw = el.value || '';
  const numeric = raw.replace(/[^\d.]/g, '');
  if (!numeric) {
    el.value = '';
    return;
  }

  // Evita múltiples puntos
  const parts = numeric.split('.');
  const integer = parts[0];
  const decimals = parts[1]?.slice(0, 2) ?? '';

  const intFormatted = new Intl.NumberFormat('en-US').format(Number(integer));
  el.value = decimals ? `${intFormatted}.${decimals}` : intFormatted;
}

export function formatCurrency(event: any) {
  let value = event.target.value;

  // Elimina todo lo que no sea número
  value = value.replace(/[^0-9]/g, "");

  if (value) {
    // Convierte a número y lo formatea con separadores de miles
    value = new Intl.NumberFormat("en-US").format(Number(value));
  }

  // Actualiza el campo
  event.target.value = value;
}


/** Para totales en UI con símbolo */
export function toUSCurrency(n: number): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // si prefieres RD$, cámbialo pero mantén en-US para comas
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n || 0);
  } catch {
    const x = Number.isFinite(n as number) ? Number(n) : 0;
    return '$ ' + x.toFixed(2);
  }
}
