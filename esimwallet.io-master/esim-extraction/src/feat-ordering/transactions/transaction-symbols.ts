import type { PaymentIntent } from '@stripe/stripe-js';
import type { OptionObject } from 'payload';

import { getOptionLabel } from '@/payload/utils/data-utils';

/**
 * @see https://docs.stripe.com/payments/paymentintents/lifecycle
 */
export enum TransactionPaymentStatus {
  RequiresPaymentMethod = 'requires_payment_method',
  RequiresConfirmation = 'requires_confirmation',
  RequiresAction = 'requires_action',
  RequiresCapture = 'requires_capture',
  Processing = 'processing',
  Cancelled = 'canceled',
  Succeeded = 'succeeded',
}

export type TransactionPaymentStatuses =
  | TransactionPaymentStatus
  | PaymentIntent.Status
  | undefined
  | null;

export const transactionPaymentStatusOptions: OptionObject[] = [
  { value: TransactionPaymentStatus.RequiresPaymentMethod, label: 'Incomplete: Requires Payment' },
  { value: TransactionPaymentStatus.RequiresConfirmation, label: 'Requires Confirmation' },
  { value: TransactionPaymentStatus.RequiresAction, label: 'Requires Action' },
  { value: TransactionPaymentStatus.RequiresCapture, label: 'Requires Capture' },
  { value: TransactionPaymentStatus.Processing, label: 'Processing' },
  { value: TransactionPaymentStatus.Cancelled, label: 'Cancelled' },
  { value: TransactionPaymentStatus.Succeeded, label: 'Paid' },
];
export const transactionPaymentStatusDefault = TransactionPaymentStatus.RequiresPaymentMethod;

export function transactionPaymentStatusLabel(val: TransactionPaymentStatuses): string {
  return (
    getOptionLabel(transactionPaymentStatusOptions, val as string) ||
    (transactionPaymentStatusOptions[0].label as string)
  );
}
