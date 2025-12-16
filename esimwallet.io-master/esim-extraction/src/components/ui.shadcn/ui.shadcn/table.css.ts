import { createVar, style, StyleRule } from '@vanilla-extract/css';

import { buttonIconSize } from '@/components/ui.shadcn/form/button.css';
import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { forBaseLayer, globalStyleCompLayer } from '@/styles/utils';

const tableCellPadding = createVar();
const tableBorderColor = createVar();

// relative w-full overflow-auto
export const tableWrapper = style(
  forBaseLayer({
    vars: {
      [tableCellPadding]: `${cssVal.space.base} ${cssVal.space.base}`,
      [tableBorderColor]: vars.color.border,
    },
    position: 'relative',
    width: '100%',
    overflow: 'auto',
  }),
);
export const tableWrapper_bordered = style(
  forBaseLayer({
    borderWidth: 1,
    borderRadius: cssVal.radii.large,
    borderColor: tableBorderColor,
  }),
);
export const table = style(
  forBaseLayer({
    width: '100%',
    captionSide: 'bottom',
    fontSize: cssVal.fontSize.sm,
  }),
);

export const tableHeader = style(forBaseLayer({}));
export const tableFooter = style(
  forBaseLayer({
    color: vars.color.muted.lighter,
    fontSize: cssVal.fontSize.md,
    borderTopColor: tableBorderColor,
  }),
);
export const tableCaption = style(
  forBaseLayer({
    marginTop: cssVal.space.base,
    fontSize: cssVal.fontSize.sm,
    color: vars.color.muted.lighter,
  }),
);

export const tableBody = style(forBaseLayer({}));
export const tableRow = style(
  forBaseLayer({
    borderBottomWidth: 1,
    borderBottomColor: tableBorderColor,
    selectors: {
      [`&:last-child`]: {
        borderBottomWidth: 0,
      },
      '&:hover': {
        backgroundColor: vars.color.muted.default,
      },
      '&[data-state=selected]': {
        backgroundColor: vars.color.muted.default,
      },
    },
  }),
);

const hasCheckboxStyles: StyleRule['selectors'] = {
  ['&:has([role=checkbox])']: {
    paddingRight: 0,
  },
};
export const tableHead = style(
  forBaseLayer({
    padding: tableCellPadding,
    fontSize: cssVal.fontSize.base,
    fontWeight: cssVal.fontWeight.bold,
    color: vars.color.muted.foreground,
    backgroundColor: vars.color.secondary.default,
    textAlign: 'left',
    verticalAlign: 'bottom',
    selectors: { ...hasCheckboxStyles },
  }),
);
globalStyleCompLayer(`${tableHead} > * `, {
  verticalAlign: 'bottom',
});
export const tableCell = style(
  forBaseLayer({
    padding: tableCellPadding,
    verticalAlign: 'middle',
    selectors: { ...hasCheckboxStyles },
  }),
);

// Icon button inside Cell
globalStyleCompLayer(`${tableCell} > button, ${tableHead} > button`, {
  vars: {
    [buttonIconSize]: cssVal.space.base,
  },
  marginLeft: cssVal.space.s2,
  marginRight: cssVal.space.s2,
  verticalAlign: 'baseline',
});
