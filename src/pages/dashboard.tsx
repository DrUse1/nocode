import { Separator } from "$/components/Basic";
import { BaseHtml } from "$/layouts/base";
import { db, getUserFromSession } from "$/lib/db";
import { datasets } from "$/lib/db/schema";
import { Router } from "$/router";
import Html from "@kitajs/html";
import * as ls from "@lemonsqueezy/lemonsqueezy.js";
import Stripe from "stripe";

// https://billing.stripe.com/p/session/test_YWNjdF8xTnlpSGhBbTRqcEhKbWQzLF9Qb2pWOWRhbDE1aG5OaEIxODJiMGdaYWpmU3lVZjdD0100BCyM4XLI

// const STORE_ID = "79079" as const;
// const PRODUCT_ID = "232980" as const;
// const VARIANT_ID = "317668" as const;

const PRODUCT_ID = "prod_PojFdjjm0beL5G" as const;
const PRICE_ID = "price_1Oz5n6Am4jpHJmd3mtCMWJje" as const;
const CUSTOMER_ID = "cus_PojOCKBZmv3Zc6" as const;
const SUBSCRIPTION_ID = "sub_1Oz6WiAm4jpHJmd3uoKNQtFd" as const;
const SUBSCRIPTION_ITEM_ID = "si_Pok0CyGBVaX3Xi" as const;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

ls.lemonSqueezySetup({ apiKey: process.env.LEMON_KEY });

async function lsRequest(
  url: string,
  method?: string,
  body?: Record<any, any>,
) {
  return await (
    await fetch("https://api.lemonsqueezy.com" + url, {
      method: method || "GET",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: "Bearer " + process.env.LEMON_KEY,
      },
      body: JSON.stringify(body),
    })
  ).json();
}

function Aside() {
  return (
    <aside class="flex h-screen flex-col">
      <div>Logo</div>
      <a
        href=""
        class="m-2 flex min-w-60 items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"></path>
        </svg>
        <span>Home</span>
      </a>
      <Separator />
      <a
        href="/dashboard/datasets"
        class="m-2 mb-0 flex min-w-60 items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 2H12.5C12.7761 2 13 2.22386 13 2.5V5H8V2ZM7 5V2H2.5C2.22386 2 2 2.22386 2 2.5V5H7ZM2 6V9H7V6H2ZM8 6H13V9H8V6ZM8 10H13V12.5C13 12.7761 12.7761 13 12.5 13H8V10ZM2 12.5V10H7V13H2.5C2.22386 13 2 12.7761 2 12.5ZM1 2.5C1 1.67157 1.67157 1 2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"></path>
        </svg>
        <span>Datasets</span>
      </a>
      <a
        href=""
        class="m-2 mt-0 flex min-w-60 items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.2 1H4.17741H4.1774C3.86936 0.999988 3.60368 0.999978 3.38609 1.02067C3.15576 1.04257 2.92825 1.09113 2.71625 1.22104C2.51442 1.34472 2.34473 1.51442 2.22104 1.71625C2.09113 1.92825 2.04257 2.15576 2.02067 2.38609C1.99998 2.60367 1.99999 2.86935 2 3.17738V3.1774V3.2V11.8V11.8226V11.8226C1.99999 12.1307 1.99998 12.3963 2.02067 12.6139C2.04257 12.8442 2.09113 13.0717 2.22104 13.2837C2.34473 13.4856 2.51442 13.6553 2.71625 13.779C2.92825 13.9089 3.15576 13.9574 3.38609 13.9793C3.60368 14 3.86937 14 4.17741 14H4.2H10.8H10.8226C11.1306 14 11.3963 14 11.6139 13.9793C11.8442 13.9574 12.0717 13.9089 12.2837 13.779C12.4856 13.6553 12.6553 13.4856 12.779 13.2837C12.9089 13.0717 12.9574 12.8442 12.9793 12.6139C13 12.3963 13 12.1306 13 11.8226V11.8V3.2V3.17741C13 2.86936 13 2.60368 12.9793 2.38609C12.9574 2.15576 12.9089 1.92825 12.779 1.71625C12.6553 1.51442 12.4856 1.34472 12.2837 1.22104C12.0717 1.09113 11.8442 1.04257 11.6139 1.02067C11.3963 0.999978 11.1306 0.999988 10.8226 1H10.8H4.2ZM3.23875 2.07368C3.26722 2.05623 3.32362 2.03112 3.48075 2.01618C3.64532 2.00053 3.86298 2 4.2 2H10.8C11.137 2 11.3547 2.00053 11.5193 2.01618C11.6764 2.03112 11.7328 2.05623 11.7613 2.07368C11.8285 2.11491 11.8851 2.17147 11.9263 2.23875C11.9438 2.26722 11.9689 2.32362 11.9838 2.48075C11.9995 2.64532 12 2.86298 12 3.2V11.8C12 12.137 11.9995 12.3547 11.9838 12.5193C11.9689 12.6764 11.9438 12.7328 11.9263 12.7613C11.8851 12.8285 11.8285 12.8851 11.7613 12.9263C11.7328 12.9438 11.6764 12.9689 11.5193 12.9838C11.3547 12.9995 11.137 13 10.8 13H4.2C3.86298 13 3.64532 12.9995 3.48075 12.9838C3.32362 12.9689 3.26722 12.9438 3.23875 12.9263C3.17147 12.8851 3.11491 12.8285 3.07368 12.7613C3.05624 12.7328 3.03112 12.6764 3.01618 12.5193C3.00053 12.3547 3 12.137 3 11.8V3.2C3 2.86298 3.00053 2.64532 3.01618 2.48075C3.03112 2.32362 3.05624 2.26722 3.07368 2.23875C3.11491 2.17147 3.17147 2.11491 3.23875 2.07368ZM5 10C4.72386 10 4.5 10.2239 4.5 10.5C4.5 10.7761 4.72386 11 5 11H8C8.27614 11 8.5 10.7761 8.5 10.5C8.5 10.2239 8.27614 10 8 10H5ZM4.5 7.5C4.5 7.22386 4.72386 7 5 7H10C10.2761 7 10.5 7.22386 10.5 7.5C10.5 7.77614 10.2761 8 10 8H5C4.72386 8 4.5 7.77614 4.5 7.5ZM5 4C4.72386 4 4.5 4.22386 4.5 4.5C4.5 4.77614 4.72386 5 5 5H10C10.2761 5 10.5 4.77614 10.5 4.5C10.5 4.22386 10.2761 4 10 4H5Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"></path>
        </svg>
        <span>History</span>
      </a>
      <a
        href=""
        class="mx-2 mt-auto flex min-w-60 items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"></path>
        </svg>
        <span>Project Settings</span>
      </a>
      <a
        href=""
        class="m-2 mt-0 flex min-w-60 items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"></path>
        </svg>
        <span>Search</span>
      </a>
    </aside>
  );
}

export const dashboardRouter = new Router({ prefix: "/dashboard" })
  .get("/", async () => {
    const amount = (
      await stripe.subscriptionItems.listUsageRecordSummaries(
        SUBSCRIPTION_ITEM_ID,
      )
    ).data[0].total_usage;

    return (
      <BaseHtml>
        <div class="flex">
          <Aside />
          <main class="flex flex-col">
            <div>Amount = {amount}</div>
            <button hx-get="/dashboard/info" hx-swap="none">
              Get info
            </button>
            <button hx-post="/dashboard/customer" hx-swap="none">
              New customer
            </button>
            <button hx-post="/dashboard/checkout" hx-swap="none">
              New checkout
            </button>
            <button hx-post="/dashboard/unit" hx-swap="none">
              New Unit
            </button>
          </main>
        </div>
      </BaseHtml>
    );
  })
  .get("/datasets", async (req) => {
    const user = await getUserFromSession(req);

    if (!user)
      return new Response("", { status: 302, headers: { Location: "/" } });

    return (
      <BaseHtml>
        <div class="flex">
          <Aside />
          <main class="flex flex-col">
            <div>{user.datasets.map((d) => d.name)}</div>
            <button hx-post="/dashboard/datasets" hx-swap="none">
              Add a dataset
            </button>
          </main>
        </div>
      </BaseHtml>
    );
  })
  .post("/datasets", async (req) => {
    const user = await getUserFromSession(req);
    if (!user) return new Response("", { status: 401 });

    const insert = await db
      .insert(datasets)
      .values({
        id: crypto.randomUUID(),
        name: "Dataset 1",
        s3fileId: "fileId-1",
        userId: user.id,
      })
      .returning();

    console.log(insert);

    return "";
  })
  .get("/info", async () => {
    // console.log(await stripe.subscriptionItems.retrieve(SUBSCRIPTION_ITEM_ID));

    return "";
  })
  .post("/customer", async () => {
    // console.log(await stripe.customers.del("cus_PojORijdMHlR3Q"));
    return "";
  })
  .post("/checkout", async () => {
    console.log(
      await stripe.checkout.sessions.create({
        customer: CUSTOMER_ID,
        line_items: [{ price: PRICE_ID }],
        mode: "subscription",
        currency: "usd",
        success_url: "http://localhost:3000/dashboard",
      }),
    );
    return "";
  })
  .post("/unit", async () => {
    console.log(
      await stripe.subscriptionItems.createUsageRecord(SUBSCRIPTION_ITEM_ID, {
        quantity: 4,
        action: "increment",
      }),
    );
    return "";
  });
