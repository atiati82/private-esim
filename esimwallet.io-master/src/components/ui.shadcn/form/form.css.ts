import { style } from '@vanilla-extract/css';

import { formLabelPaddingVar } from '@/components/ui.shadcn/form/form.vars.css';
import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { forBaseLayer, forCompLayer, globalStyleBaseLayer } from '@/styles/utils';

/**
 * Wrapper for {@link FormItem} inside the <form> element
 */
export const formItem = style(
  forCompLayer({
    marginTop: cssVal.space.base,
    marginBottom: cssVal.space.base,
  }),
);

/**
 * Paragraph with description (under the input)
 */
export const formDescription = style(
  forCompLayer({
    fontSize: cssVal.fontSize.sm,
    marginTop: cssVal.space.s3,
    marginBottom: cssVal.space.s2,
    paddingLeft: formLabelPaddingVar,
    paddingRight: formLabelPaddingVar,
    color: vars.color.muted.foreground,
  }),
);

export const formErrorMessage = style([
  formDescription,
  forCompLayer({
    color: vars.color.destructive.default,
    fontWeight: cssVal.fontWeight.semibold,
  }),
]);
export const formRootErrorMessage = style([
  formErrorMessage,
  forCompLayer({
    textAlign: 'center',
  }),
]);

/**
 * Use to render <Input /> with icon in it.
 */
export const formItemWithIcon = style(
  // Use @layer base, to allow easy override (this utility is tricky, so perhaps will be overridden often)
  forBaseLayer({
    display: 'flex',
    position: 'relative',
  }),
);
globalStyleBaseLayer(`${formItemWithIcon} > svg`, {
  position: 'absolute',
  flexShrink: 0,
  alignSelf: 'center',
  marginLeft: cssVal.space.s1,
  opacity: 0.6,
});
globalStyleBaseLayer(`${formItemWithIcon} input`, {
  paddingLeft: cssVal.space.l2,
});

/**
 * {@link FormItem} with checkbox inside
 */
export const formItemWithCheckbox = style(
  // Use @layer base, to allow easy override
  forBaseLayer({
    display: 'flex',
    columnGap: cssVal.space.s2,
  }),
);
globalStyleBaseLayer(`${formItemWithCheckbox} > div`, {
  display: 'flex',
  flexDirection: 'column', // if there's more items here, stack them one under another
  flexGrow: 1, // this div is inside flex box, make it full width
  marginTop: `-0.1rem`, // the checkbox is slightly bigger than line height here... need to adjust
});
globalStyleBaseLayer(`${formItemWithCheckbox} label`, {
  marginTop: -1,
  marginBottom: 0,
});
