import { FieldHook } from 'payload';

/**
 * Mutate the sibling data to prevent DB storage
 * (as per Payload example with "virtual fieds" (i.e. calculated on the fly)
 */
export const virtualFieldBeforeChange: FieldHook = ({ siblingData, field }) => {
  // eslint-disable-next-line no-param-reassign
  siblingData[field.name ?? ''] = undefined;
};
