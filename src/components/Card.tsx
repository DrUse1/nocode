import { Html } from "@kitajs/html";
import { cn } from "../lib/utils";

export function Card({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <div
      class={cn(
        "space-y-6 overflow-auto rounded-xl border bg-white p-6 text-black shadow",
        className,
      )}
      {...props}>
      {props.children as unknown}
    </div>
  );
}

export function CardHeader({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <div class={cn("flex flex-col space-y-1.5", className)} {...props}>
      {props.children as unknown}
    </div>
  );
}

export function CardContent({
  className,
  ...props
}: ElementProps<JSX.HtmlTag>) {
  return (
    <div class={cn("flex flex-col gap-2", className)} {...props}>
      {props.children as unknown}
    </div>
  );
}

export function CardTitle({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <h3
      class={cn("font-semibold leading-none tracking-tight", className)}
      {...props}>
      {props.children as unknown}
    </h3>
  );
}

export function CardDescription({
  className,
  ...props
}: ElementProps<JSX.HtmlTag>) {
  return (
    <p class={cn("text-sm text-secondary", className)} {...props}>
      {props.children as unknown}
    </p>
  );
}

export function CardFooter({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <div class={cn("items-center", className)} {...props}>
      {props.children as unknown}
    </div>
  );
}
