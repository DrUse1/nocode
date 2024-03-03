import Html from "@kitajs/html";
import { cn } from "$/lib/utils";

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ElementProps<
  JSX.HtmlButtonTag,
  {
    variant?:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
    href?: string;
  }
>) {
  return (
    <tag
      of={props.href ? "a" : "button"}
      {...props}
      class={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow":
            variant === "default",
        },
        {
          "text-secondary-foreground bg-secondary shadow-sm hover:bg-secondary/80":
            variant === "secondary",
        },
        {
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm":
            variant === "destructive",
        },
        {
          "bg-background hover:bg-accent hover:text-accent-foreground border border-input shadow-sm":
            variant === "outline",
        },
        {
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        },
        {
          "text-primary underline-offset-4 hover:underline": variant === "link",
        },
        {
          "h-9 px-4 py-2": size === "default",
        },
        {
          "h-8 rounded-md px-3 text-xs": size === "sm",
        },
        {
          "h-10 rounded-md px-8": size === "lg",
        },
        {
          "h-9 w-9": size === "icon",
        },
        className,
      )}
      {...props}>
      {props.children as unknown}
    </tag>
  );
}

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: ElementProps<
  JSX.HtmlTag,
  {
    orientation?: "horizontal" | "vertical";
  }
>) {
  return (
    <div
      role="none"
      class={cn(
        "bg-border shrink-0",
        {
          "h-[1px] w-full": orientation === "horizontal",
          "h-full w-[1px]": orientation === "vertical",
        },
        className,
      )}
      {...props}></div>
  );
}

export function Label({ className, ...props }: ElementProps<JSX.HtmlLabelTag>) {
  return (
    <label
      {...props}
      class={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}>
      {props.children as unknown}
    </label>
  );
}

export function Input({ className, ...props }: ElementProps<JSX.HtmlInputTag>) {
  return (
    <input
      {...props}
      class={cn(
        "placeholder:text-muted-foreground flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}

export function Textarea({
  className,
  ...props
}: ElementProps<JSX.HtmlTextAreaTag>) {
  return (
    <textarea
      {...props}
      class={cn(
        "placeholder:text-muted-foreground flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}>
      {props.children as unknown}
    </textarea>
  );
}

export function InputGroup({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <div class={cn("space-y-1.5", className)} {...props}>
      {props.children as unknown}
    </div>
  );
}

export function InputError({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <span class={cn("text-error text-sm empty:hidden", className)} {...props}>
      {props.children as unknown}
    </span>
  );
}

export function Badge({
  className,
  variant = "default",
  ...props
}: ElementProps<
  JSX.HtmlTag,
  {
    variant?: "default" | "secondary" | "destructive" | "outline";
    href?: string;
  }
>) {
  return (
    <div
      {...props}
      class={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow":
            variant === "default",
        },
        {
          "text-secondary-foreground border-transparent bg-secondary hover:bg-secondary/80":
            variant === "secondary",
        },
        {
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent shadow":
            variant === "destructive",
        },
        {
          "text-foreground": variant === "outline",
        },
        className,
      )}
      {...props}>
      {props.children as unknown}
    </div>
  );
}
