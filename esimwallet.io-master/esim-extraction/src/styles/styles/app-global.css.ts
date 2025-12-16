import './base-init.css';
import './base-reset.css';
import './base-typography.css';
import './base-forms.css';
//
// animations stuff
//
import './animations/keyframes.css';
import './animations/animations.css';
//
// @layer: comp
//         We add here commonly used components...
//         Just to be sure about loading order and to remove warnings in Storybook
//
import '../components/ui.shadcn/form/form.vars.css';
import '../components/ui.shadcn/form/form.css';
import '../components/ui.shadcn/form/button.css';
import '../components/ui.shadcn/form/checkbox.css';
import '../components/ui.shadcn/avatar.css';
import '../components/ui.shadcn/card.css';
import '../components/ui.shadcn/command.css';
import '../components/ui.shadcn/separator.css';
//
// @layer: comp
//         app components
//
import '../components/ui/Headline.css';
import '../components/ui/loader.css';
import '../components/ui/textual.css';
//
// @layer: utils
//
import './layout.css';
import './typography.css';
