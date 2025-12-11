import { EsimProduct } from '@/data/esim-product';

export function formatPlanAllowanceNum(voiceOrDataAllowance: number): string {
  return voiceOrDataAllowance < 0 ? 'Unlimited' : `${voiceOrDataAllowance}`;
}

export function formatCurrencyVal(amount: number | string, amountInCents = false): string {
  return amountInCents
    ? (parseInt(`${amount}`) / 100).toFixed(2)
    : parseFloat(`${amount}`).toFixed(2);
}

export function amountToCents(amount: number | string): number {
  const cents = Number(parseFloat(formatCurrencyVal(amount)) * 100).toFixed(0);
  return parseInt(cents);
}

export function getFamilyNameFromProduct(product: EsimProduct): string {
  const filteredTokens: string[] = [];

  const tokens = product.name.split(' ');
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isNumber = parseInt(token);

    // Skip data segments (like '50 GB', '20 Days', etc.) by skipping the current token and the next one
    if (isNumber && i + 1 < tokens.length) {
      i++; // Skip the next token
      continue;
    }

    // Skip tokens like 'FREE'
    if (['FREE'].includes(token.toUpperCase())) {
      continue;
    }

    // Add the current token to the filtered tokens array
    filteredTokens.push(token);
  }

  return filteredTokens.join(' ').trim();
}

export function calculateProfit(listingPrice: number = 0, supplierPrice: number = 0): number {
  if (!supplierPrice) {
    return -0.01; // unknown profit as -1 %
  }
  return (listingPrice - supplierPrice) / (supplierPrice || 1);
}

export function getPlanExpiryDate(
  activationDate: string | null | undefined,
  planValidityInDays: number,
): string | undefined {
  const date = activationDate && new Date(activationDate);
  if (date) {
    date.setDate(date.getDate() + planValidityInDays);
    return date.toISOString();
  }
  return undefined;
}
