import { Html } from "@kitajs/html";
import { cn } from "$/lib/utils";

export function Card({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <div
      class={cn(
        "bg-card text-card-foreground rounded-xl border shadow",
        className,
      )}
      {...props}>
      {props.children as unknown}
    </div>
  );
}

export function CardHeader({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <div class={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {props.children as unknown}
    </div>
  );
}

export function CardContent({
  className,
  ...props
}: ElementProps<JSX.HtmlTag>) {
  return (
    <div class={cn("p-6 pt-0", className)} {...props}>
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
    <p class={cn("text-muted-foreground text-sm", className)} {...props}>
      {props.children as unknown}
    </p>
  );
}

export function CardFooter({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <div class={cn("flex items-center p-6 pt-0", className)} {...props}>
      {props.children as unknown}
    </div>
  );
}
