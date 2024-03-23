import { cn } from "$/lib/utils";
import Html from "@kitajs/html";

export function Dropdown(props: Html.PropsWithChildren) {
  return <div class="dropdown relative">{props.children}</div>;
}

export function DropdownTrigger({
  className,
  ...props
}: ElementProps<JSX.HtmlTag>) {
  return (
    <button
      class={cn("", className)}
      {...props}
      onclick="document.querySelector('.dropdown input').checked = true">
      {props.children as unknown}
    </button>
  );
}

export function DropdownContent({
  className,
  ...props
}: ElementProps<JSX.HtmlTag>) {
  return (
    <>
      <input type="checkbox" class="peer hidden" />
      <div class="hidden peer-checked:block">
        <div
          class="fixed left-0 top-0 z-10 h-full w-full"
          onclick="document.querySelector('.dropdown input').checked = false"
        />
        <div
          class={cn(
            "absolute right-0 top-10 z-20 rounded-md bg-background p-4 shadow-md",
            className,
          )}
          {...props}>
          {props.children as unknown}
        </div>
      </div>
    </>
  );
}

{/* <Dropdown>
  <DropdownTrigger className="flex size-8 items-center justify-center rounded-[50%] bg-red-500">
    D
  </DropdownTrigger>
  <DropdownContent>Nice</DropdownContent>
</Dropdown>; */}
