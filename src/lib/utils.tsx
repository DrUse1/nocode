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

export function separateFileExtension(name: string) {
  if (!name.includes(".")) return [];
  if (name.at(-1) === ".") return [];
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

export function parseCookies(str: string) {
  let splitted = str.split("; ");
  const result: Record<string, string> = {};
  for (let i in splitted) {
    const cur = splitted[i].split("=");
    result[cur[0]] = cur[1];
  }
  return result;
}

export async function htmlResponse(
  body: string | Promise<string>,
  options?: ResponseInit | undefined,
) {
  return new Response(await body, {
    headers: {
      "Content-Type": "text/html",
    },
    ...options,
  });
}
