declare module 'react-dom/client' {
  import { Root, ReactNode } from 'react';
  export interface RootOptions {
    hydrate?: boolean;
    unstable_strictMode?: boolean;
  }
  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment, options?: RootOptions): Root;
}
