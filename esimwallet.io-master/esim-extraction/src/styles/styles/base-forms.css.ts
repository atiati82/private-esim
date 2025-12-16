import {
  formLabelPaddingValue,
  formLabelPaddingVar,
} from '@/components/ui.shadcn/form/form.vars.css';
import { cssVal } from '@/styles/css-values';
import { disabledStyles } from '@/styles/shared-rules';
import { vars } from '@/styles/theme.css';
import { globalStyleBaseLayer, globalStyleThemeLayer } from '@/styles/utils';

globalStyleBaseLayer('form', {
  vars: {
    [formLabelPaddingVar]: formLabelPaddingValue,
  },
  // Not sure if form should be styled globally like that
  // but let's keep it like that for now...
  width: '28rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: cssVal.space.l2,
  paddingRight: cssVal.space.l2,
});

globalStyleBaseLayer('label, input, textarea', {
  width: '100%',
  display: 'block',
});
globalStyleBaseLayer('form > h1, form > h2, form > h3', {
  marginBottom: cssVal.space.l1,
});

globalStyleBaseLayer(':moz-focusring', {
  outline: 'auto',
});
globalStyleBaseLayer(':-moz-ui-invalid', {
  boxShadow: 'none',
});
globalStyleBaseLayer(`[type='search']`, {
  WebkitAppearance: 'textfield',
  outlineOffset: 2,
});
globalStyleBaseLayer('::-webkit-search-decoration', {
  WebkitAppearance: 'none',
});
globalStyleBaseLayer('::-webkit-file-upload-button', {
  WebkitAppearance: 'button',
  font: 'inherit',
});

// TODO: style label which is adjacent to :disabled field
//  like it was in TailwindCSS:
//  peer-disabled:cursor-not-allowed peer-disabled:opacity-70
globalStyleBaseLayer('label', {
  fontSize: cssVal.fontSize.sm,
  marginBottom: cssVal.space.s3,
  paddingLeft: formLabelPaddingVar,
  paddingRight: formLabelPaddingVar,
});

globalStyleThemeLayer('input::placeholder, textarea::placeholder', {
  opacity: 0.6,
  color: vars.color.foreground,
});

globalStyleBaseLayer('input, textarea', {
  'padding': cssVal.space.base,
  // To prevent zoom-in on iOS/Webkit Safari, we set the (large) minimum font size
  // and increase it later, for larger screens
  'fontSize': '16px',
  'borderWidth': 1,
  'borderColor': vars.color.accent.default,
  'backgroundColor': vars.color.muted.default,
  'borderRadius': cssVal.radii.default,
  'outlineColor': vars.color.primary.lighter,
  '@media': {
    [cssVal.screen.sm]: {
      fontSize: cssVal.fontSize.sm,
    },
  },
});

/**
 * Alt(ernative) variant of <input> elements
 */
globalStyleBaseLayer('input.alt, textarea.alt', {
  borderColor: vars.color.border,
  backgroundColor: vars.color.secondary.default,
});

globalStyleThemeLayer('input[aria-invalid=true], textarea[aria-invalid=true]', {
  borderColor: vars.color.destructive.default,
  outlineColor: vars.color.destructive.default,
});

// TODO: this is untested, needs to be polished...
globalStyleThemeLayer('input:disabled, textarea:disabled', disabledStyles);
