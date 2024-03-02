import Html from "@kitajs/html";
import { Router } from "../router";
import { BaseHtml } from "../layouts/base";

export const mainRouter = new Router().get("/", () => {
  return (
    <BaseHtml>
      <form
        hx-post="/file"
        hx-replace-url="false"
        hx-swap="none"
        hx-encoding="multipart/form-data">
        <input type="file" name="file" />
        <button>Submit</button>
      </form>
    </BaseHtml>
  );
});
