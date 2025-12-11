import React, { useCallback, useEffect, useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeError, StripePaymentElementOptions } from '@stripe/stripe-js';
import Joi from 'joi';
import startCase from 'lodash/startCase';

import { emitFlashMessage, MessageType } from '@/data-store/messages';
import { navigateAction } from '@/data-store/router/router';
import { useAppDispatch } from '@/data-store/store-hooks';
import { UrlForPage, urlForPage, urlForTransactions } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { tcsFieldSchema } from '@/payload/collections/hooks/accountCreateSchema';

import { Button } from '@/components/ui.shadcn/form/button';
import { Checkbox } from '@/components/ui.shadcn/form/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui.shadcn/form/form';
import { formItemWithCheckbox } from '@/components/ui.shadcn/form/form.css';
import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { CheckoutOrderSummary } from '@/feat-ordering/components/checkout-order-summary';
import { SecureCheckoutStatus } from '@/feat-ordering/components/secure-checkout';
import {
  TransactionPaymentStatuses,
  transactionPaymentStatusLabel,
} from '@/feat-ordering/transactions/transaction-symbols';
import { Transaction } from '@/feat-ordering/transactions/transactions';
import { isStripePaymentClosed, urlForStripeReturn } from '@/feat-ordering/utils-ordering';
import * as styles from './checkout-form.css';

type CheckoutFormData = {
  legalAgreement: boolean;
};
export const checkoutFormSchema = Joi.object<CheckoutFormData>({
  legalAgreement: tcsFieldSchema,
});

type CheckoutFormProps = {
  transaction: Transaction;
  paymentElementOptions?: StripePaymentElementOptions;
  /** Payment status, so far. Usually empty when arriving here, but can be set when re-trying payment */
  paymentStatus: TransactionPaymentStatuses;
};

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  transaction,
  paymentStatus,
  paymentElementOptions = {},
}) => {
  const stripe = useStripe();
  const elements = useElements(); // ref to the <PaymentElement />
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stripeError, setStripeError] = useState<StripeError>();

  // When confirmation failed, Stripe error will contain current PaymentIntent data
  const paymentIntentFromError = stripeError?.payment_intent;
  const currentPaymentStatus = paymentIntentFromError?.status || paymentStatus;
  const paymentStatusLabel = transactionPaymentStatusLabel(currentPaymentStatus);

  /**
   * Handle case when transaction is already paid (in case someone navigated mistakenly here...)
   */
  useEffect(() => {
    if (isStripePaymentClosed(currentPaymentStatus)) {
      dispatch(
        emitFlashMessage({
          path: 'checkout',
          messageType: MessageType.Success,
          title: 'This transaction is already paid',
          message: (
            <>
              This transaction has been paid already, all is set.
              <br />
              Check the details below.
            </>
          ),
        }),
      );
      dispatch(navigateAction(urlForTransactions(transaction.id)));
    }
  }, [currentPaymentStatus]);

  const form = useForm<CheckoutFormData>({
    resolver: joiResolver(checkoutFormSchema),
    resetOptions: { keepErrors: false },
    defaultValues: { legalAgreement: false },
  });
  const onSubmit = useCallback(
    async (_: CheckoutFormData) => {
      if (!stripe || !elements) {
        return; // Stripe hasn't loaded yet...
      }
      setIsLoading(true);

      const res: undefined | { error: StripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: urlForStripeReturn(transaction.id) },
      });
      // console.log('CHECKOUT FORM, confirmation', { res, errorType: res.error?.type });

      if (res.error) {
        // Show error with <SecureCheckoutStatus />
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setStripeError(res.error);
        setIsLoading(false);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    },
    [stripe, elements, transaction.id],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        {/* Show error message to your customers */}
        {shouldShowStripeError(stripeError) && (
          <SecureCheckoutStatus
            title={'Oops, Something Went Wrong'}
            variant="error"
            showIcon={true}
            errorCode={getStripeErrorCode(stripeError)}
          >
            {stripeError?.message} Please try to fix the problem and submit the payment again. BTW,
            current payment status for this transaction is: <strong>{paymentStatusLabel}</strong>.
          </SecureCheckoutStatus>
        )}

        <CheckoutOrderSummary transaction={transaction} />

        <PaymentElement options={paymentElementOptions} />
        <FormField
          control={form.control}
          name="legalAgreement"
          render={({ field }) => <LegalFormItem field={field} />}
        />

        <FormMessage />
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || !stripe || !elements}
          className={styles.submitButton}
        >
          <span>{isLoading ? 'Processing Payment' : 'PAY NOW'}</span>
          <CurrencyFormatter amount={transaction.total} amountInCents={true} narrowVariant={true} />
        </Button>
      </form>
    </Form>
  );
};

type LegalFormItemField = ControllerRenderProps<CheckoutFormData, 'legalAgreement'>;
const LegalFormItem: React.FC<{ field: LegalFormItemField }> = ({ field }) => (
  <FormItem id="legalAgreement" className={cn(formItemWithCheckbox, styles.formItemLegalAgreement)}>
    <FormControl>
      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
    </FormControl>
    <div>
      <FormLabel>
        By clicking <strong>PAY NOW</strong>, I agree to sSIMwallet general{' '}
        <Link href={urlForPage(UrlForPage.GeneralTermsAndConditions)}>Terms and Conditions</Link>,{' '}
        <Link href={urlForPage(UrlForPage.PrivacyPolicy)}>Privacy Policy</Link>,{' '}
        <Link href={urlForPage(UrlForPage.OrderingPaymentPolicy)}>Ordering & Payment</Link> as well
        as{' '}
        <Link href={urlForPage(UrlForPage.ReturnsRefundsPolicy)}>Returns&nbsp;&&nbsp;Refunds</Link>{' '}
        policies.
      </FormLabel>
      <FormMessage />
    </div>
  </FormItem>
);

/**
 * Should this Stripe error be shown in the UI?
 * Some errors are being displayed in the form, so no need for repetition.
 */
function shouldShowStripeError(error: StripeError | undefined): boolean {
  return !!error && error.type !== 'validation_error';
}

function getStripeErrorCode(error: StripeError | undefined): string {
  return error ? `${startCase(error.type)} | ${startCase(error.code)}` : '';
}
