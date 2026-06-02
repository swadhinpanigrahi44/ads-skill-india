import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type LordIconProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string;
  trigger?: string;
  colors?: string;
  stroke?: string;
  delay?: string | number;
  target?: string;
  state?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': LordIconProps;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': LordIconProps;
    }
  }
}

export {};
