declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof zodEnv> {}
  }
  var interval: Timer | null;
}

declare namespace JSX {
  interface HTMLAttributes {
    _?: string;
  }
}

type ElementProps<T, U = {}> = Omit<Html.PropsWithChildren<T>, "class"> & {
  className?: string;
} & U;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
