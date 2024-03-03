import { Html } from "@kitajs/html";
import { cn } from "$/lib/utils";

export function Table({ className, ...props }: ElementProps<JSX.HtmlTableTag>) {
  return (
    <div class="relative w-full overflow-auto">
      <table class={cn("w-full caption-bottom text-sm", className)} {...props}>
        {props.children as unknown}
      </table>
    </div>
  );
}

export function TableBody({ className, ...props }: ElementProps<JSX.HtmlTag>) {
  return (
    <tbody class={cn("[&_tr:last-child]:border-0", className)} {...props}>
      {props.children as unknown}
    </tbody>
  );
}

export function TableCaption({
  className,
  ...props
}: ElementProps<JSX.HtmlTag>) {
  return (
    <caption
      class={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}>
      {props.children as unknown}
    </caption>
  );
}

export function TableCell({
  className,
  ...props
}: ElementProps<JSX.HtmlTableDataCellTag>) {
  return (
    <td
      class={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}>
      {props.children as unknown}
    </td>
  );
}

export function TableFooter({
  className,
  ...props
}: ElementProps<JSX.HtmlTableSectionTag>) {
  return (
    <tfoot
      class={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}>
      {props.children as unknown}
    </tfoot>
  );
}

export function TableHead({
  className,
  ...props
}: ElementProps<JSX.HtmlTableHeaderCellTag>) {
  return (
    <th
      class={cn(
        "text-muted-foreground h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}>
      {props.children as unknown}
    </th>
  );
}

export function TableHeader({
  className,
  ...props
}: ElementProps<JSX.HtmlTableSectionTag>) {
  return (
    <thead class={cn("[&_tr]:border-b", className)} {...props}>
      {props.children as unknown}
    </thead>
  );
}

export function TableRow({
  className,
  ...props
}: ElementProps<JSX.HtmlTableRowTag>) {
  return (
    <tr
      class={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}>
      {props.children as unknown}
    </tr>
  );
}
