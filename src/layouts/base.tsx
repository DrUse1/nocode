import Html from "@kitajs/html";

export function BaseHtml(
  props: Html.PropsWithChildren<{ title?: string; class?: string }>,
) {
  return (
    <>
      {"<!DOCTYPE html>"}
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="/public/styles.css" />
          <script src="/public/hyperscript.js" />
          <script src="/public/htmx.js" />
          <script src="https://unpkg.com/htmx.org/dist/ext/sse.js"></script>
          <script src="/public/script.js" defer />
          <title safe>{props.title || "TODO"}</title>
        </head>
        <body class={props.class || ""}>{props.children}</body>
      </html>
    </>
  );
}
