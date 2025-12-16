import * as React from 'react';

import { cn, debugVariantInfo, isTruthy } from '@/lib/utils';

import { TextualVariants, textualVariants } from './textual.css';

type TextElement = HTMLParagraphElement | HTMLUListElement;
export type TextProps = React.HTMLAttributes<TextElement> &
  TextualVariants & {
    renderAsHtmlContent?: boolean;
  };

const Textual = React.forwardRef<TextElement, TextProps>(
  ({ className, as, renderAsHtmlContent, size, variant, align, children, ...props }, ref) => {
    const Comp = (isTruthy(as) ? as : 'p') as React.ElementType;

    if (renderAsHtmlContent) {
      return (
        <Comp
          {...debugVariantInfo({ as, renderAsHtmlContent, size, variant, align })}
          className={cn(textualVariants({ as, size, variant, align }), className)}
          {...props}
          dangerouslySetInnerHTML={{ __html: children as string }}
        ></Comp>
      );
    } else {
      return (
        <Comp
          {...debugVariantInfo({ as, renderAsHtmlContent, size, variant, align })}
          className={cn(textualVariants({ as, size, variant, align }), className)}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }
  },
);
Textual.displayName = 'Textual';

export { Textual, textualVariants };
