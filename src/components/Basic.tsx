import Html from "@kitajs/html";
import { cn } from "../lib/utils";

export function Button({
  className,
  ...props
}: ElementProps<
  JSX.HtmlButtonTag,
  {
    variant?: "secondary" | "destructive" | "outline" | "ghost" | "link";
    href?: string;
  }
>) {
  return (
    <tag
      of={props.href ? "a" : "button"}
      {...props}
      class={cn(
        "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-secondary hover:bg-secondary/80 text-black":
            props.variant === "secondary",
        },
        {
          "bg-red-600 hover:bg-red-500": props.variant === "destructive",
        },
        {
          "hover:bg-secondary border bg-transparent text-black":
            props.variant === "outline",
        },
        {
          "hover:bg-secondary bg-transparent text-black shadow-none":
            props.variant === "ghost",
        },
        {
          "h-5 bg-transparent p-0 text-black underline-offset-4 shadow-none hover:bg-transparent hover:underline":
            props.variant === "link",
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
        "shrink-0 bg-[rgb(228,228,231)]",
        {
          "my-4 h-[1px] w-full": orientation === "horizontal",
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
        "border-input placeholder:text-secondary focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent bg-white px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
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
        "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
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
    <span class={cn("text-sm text-red-400 empty:hidden", className)} {...props}>
      {props.children as unknown}
    </span>
  );
}

export function Badge({
  className,
  ...props
}: ElementProps<
  JSX.HtmlTag,
  {
    variant?: "secondary" | "destructive" | "outline" | "ghost" | "link";
    href?: string;
  }
>) {
  return (
    <div
      {...props}
      class={cn(
        "focus:ring-ring inline-flex items-center rounded-md border border-transparent bg-black px-2.5 py-0.5 text-xs font-semibold text-white shadow transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          "bg-secondary hover:bg-secondary/80 text-black":
            props.variant === "secondary",
        },
        {
          "bg-red-600 hover:bg-red-500": props.variant === "destructive",
        },
        {
          "hover:bg-secondary border border-[#e5e7eb] bg-transparent text-black shadow-none":
            props.variant === "outline",
        },
        className,
      )}
      {...props}>
      {props.children as unknown}
    </div>
  );
}
