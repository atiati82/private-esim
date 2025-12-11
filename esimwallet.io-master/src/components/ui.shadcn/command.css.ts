import { createVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { formItemWithIcon } from '@/components/ui.shadcn/form/form.css';
import { cssVal } from '@/styles/css-values';
import { disabledButtonStates } from '@/styles/shared-rules';
import { vars } from '@/styles/theme.css';
import { forCompLayer, globalStyleCompLayer } from '@/styles/utils';
import { layers } from '@/styles/utils/layers';

const defaultIconSize = '1.3em';

/**
 * HINT: use together with {@link containerWithBorder} class, to enable border around the <Command /> el.
 */
export const commandContainer = style(
  forCompLayer({
    display: 'flex',
    width: '100%',
    // height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: cssVal.space.s2,
    borderRadius: cssVal.radii.default,
    selectors: {
      '.popover-content > &': {
        margin: `-${cssVal.space.base}`, // compensate for default .popover-content padding
        width: `calc(100% + 2rem)`,
      },
    },
  }),
);
export const commandContainer_borderContainer = style(
  forCompLayer({
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'transparent',
  }),
);
// globalStyleCompLayer(`.popover-content > `, {})

// max-h-[300px] overflow-y-auto overflow-x-hidden
export const commandList = style(
  forCompLayer({
    // When maxHeight + overflow is set, it enables browser scrollbars.
    // For now, we only want it inside Popover...
    // Otherwise, `CommandList` will take as much height as needed by items inside.
    selectors: {
      '.popover-content &': {
        maxHeight: '13.6rem',
        overflowX: 'hidden',
        overflowY: 'auto',
      },
    },
  }),
);

// [&_[cmdk-group-heading]]:font-medium overflow-hidden p-1
// text-foreground [&_[cmdk-group-heading]]:px-2
// [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs
// [&_[cmdk-group-heading]]:text-muted-foreground
export const commandGroup = style(
  forCompLayer({
    // overflow: 'hidden', // There shouldn't be really any situations when we need overflow hidden here?
    // padding: cssVal.space.s3, // Padding is now set on the main command container...
  }),
);
globalStyleCompLayer(`${commandGroup} [cmdk-group-heading]`, {
  padding: `${cssVal.space.s4} ${cssVal.space.s1}`,
  fontSize: cssVal.fontSize.xs,
  fontWeight: cssVal.fontWeight.semibold,
});

const _commandItemPaddingVar = createVar();
export const commandItem = style(
  forCompLayer({
    vars: {
      [_commandItemPaddingVar]: `${cssVal.space.s2} ${cssVal.space.s1}`,
    },
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: _commandItemPaddingVar,
    fontSize: cssVal.fontSize.sm,
    userSelect: 'none',
    outline: 'none',
    borderRadius: cssVal.radii.small,
    color: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.2s ease',
    ...disabledButtonStates,
    selectors: {
      ...disabledButtonStates.selectors,
      '&[aria-selected="true"]': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
  }),
);
globalStyleCompLayer(`${commandItem} > svg`, {
  marginRight: cssVal.space.s1,
  width: defaultIconSize,
  height: defaultIconSize,
  opacity: 0.6,
});

globalStyleCompLayer(`${commandItem}.linkInside`, {
  padding: 0,
});
globalStyleCompLayer(`${commandItem}.linkInside > a`, {
  flexBasis: '100%',
  padding: _commandItemPaddingVar,
});

globalStyleCompLayer(`${commandItem}.navItem`, {
  vars: {
    [_commandItemPaddingVar]: `${cssVal.space.s1} ${cssVal.space.s1}`,
  },
  fontSize: cssVal.fontSize.base,
});
globalStyleCompLayer(`${commandItem}.navItem[aria-selected="true"]`, {
  backgroundColor: 'rgba(37, 99, 235, 0.3)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 12px rgba(37, 99, 235, 0.2)',
});

// flex px-11 py-2 pt-4 text-sm text-muted-foreground md:px-12
// shadcn: "py-6 text-center text-sm"
export const commandEmptyMsg = style(
  forCompLayer({
    padding: `${cssVal.space.s2} ${cssVal.space.s1}`,
    fontSize: cssVal.fontSize.sm,
    color: vars.color.muted.foreground,
    fontWeight: cssVal.fontWeight.semibold,
  }),
);

export const commandKbdShortcut = style({
  '@layer': {
    [layers.comp]: {
      marginLeft: 'auto',
      fontSize: cssVal.fontSize.xs,
      letterSpacing: '0.1em',
    },
    [layers.theme]: {
      color: vars.color.muted.foreground,
    },
  },
});

export const commandSeparator = style(
  forCompLayer({
    height: 1,
    marginLeft: `-${cssVal.space.s1}`,
    marginRight: `-${cssVal.space.s1}`,
    marginTop: cssVal.space.s2,
    marginBottom: cssVal.space.s2,
    backgroundColor: vars.color.border,
  }),
);

export const commandInputContainer = style([
  formItemWithIcon,
  forCompLayer({
    marginBottom: cssVal.space.s2,
  }),
]);
export const commandInputIcon = style(
  forCompLayer({
    flexShrink: 0,
    width: defaultIconSize,
    height: defaultIconSize,
  }),
);
// flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none
// placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50
export const commandInputEl = style(
  forCompLayer({
    paddingTop: cssVal.space.s1,
    paddingBottom: cssVal.space.s1,
    paddingLeft: calc.add(cssVal.space.l1, cssVal.space.s1),
  }),
);
