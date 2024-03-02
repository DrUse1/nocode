import Html, { PropsWithChildren } from "@kitajs/html";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export function Script({ src }: PropsWithChildren<{ src: Function }>) {
  const functionString = src.toString();
  const body = functionString
    .substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}"))
    .trim();
  return <script defer>{body}</script>;
}

export function seperateFileExtension(name: string) {
  return [
    name.substring(0, name.lastIndexOf(".")),
    name.substring(name.lastIndexOf("."), name.length),
  ];
}

export function redirect(to: string) {
  return new Response("", {
    status: 302,
    headers: {
      Location: to,
    },
  });
}
