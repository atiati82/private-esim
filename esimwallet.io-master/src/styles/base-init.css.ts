import { assignVars, globalLayer } from '@vanilla-extract/css';

import { lightThemeTokens, vars } from '@/styles/theme.css';
import { globalStyleThemeLayer } from '@/styles/utils';
import { layers } from '@/styles/utils/layers';

globalLayer(layers.base);
globalLayer(layers.theme);
globalLayer(layers.comp);
globalLayer(layers.utils);

globalStyleThemeLayer(':root', {
  vars: assignVars(vars, lightThemeTokens),
});
