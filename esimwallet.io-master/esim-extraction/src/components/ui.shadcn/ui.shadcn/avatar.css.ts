import { createVar, fallbackVar, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { forCompLayer } from '@/styles/utils';

export const avatarSizeVar = createVar();

const _avatarSizeVar = createVar();
const avatarDefaultSize = cssVal.space.l2;

export const avatar = style(
  forCompLayer({
    vars: {
      [_avatarSizeVar]: fallbackVar(avatarSizeVar, avatarDefaultSize),
    },
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 999,
    height: _avatarSizeVar,
    width: _avatarSizeVar,
  }),
);

export const avatarFallback = style(
  forCompLayer({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    height: _avatarSizeVar,
    width: _avatarSizeVar,
    backgroundColor: vars.color.muted.default,
  }),
);
