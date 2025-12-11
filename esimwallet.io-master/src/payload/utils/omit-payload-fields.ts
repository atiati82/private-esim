/**
 * Type which omits typical PayloadCMS fields (id etc)
 *
 * @usage:
 * ```
 * type MyProductForCreation = OmitPayloadFields<EsimProduct>;
 * type MyProductForCreation = OmitPayloadFields<EsimProduct, 'someOtherFieldToOmit'>;
 * ```
 */
export type OmitPayloadFields<T, OmitOtherKeys extends keyof T = never> = Omit<
  T,
  'id' | 'updatedAt' | 'createdAt' | OmitOtherKeys
>;
