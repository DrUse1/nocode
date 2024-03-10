import { Server } from "bun";
import { htmlResponse } from "./lib/utils";

// type IsPathParameter<Part extends string> = Part extends `:${infer Parameter}`
//   ? Parameter
//   : never;

// type ExtractParams<Path extends string> = Path extends `${infer A}/${infer B}`
//   ? IsPathParameter<A> | ExtractParams<B>
//   : IsPathParameter<Path>;

type TCallback = (
  req: Request,
  params: Record<string, string>,
) => Response | string | Promise<Response | string>;

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

type TMethod = (typeof METHODS)[number];

type Route = {
  path: TPath;
  cb: TCallback;
};

type TSecureCallback = (req: Request) => boolean | Promise<boolean>;

type TPath = `${"/"}${string}`;

type Routes = { [key in TMethod]: Route[] };

export class Router {
  prefix: TPath;
  bunServer: Server | undefined;
  routes: Routes = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
  };
  secureCb: TSecureCallback = () => true;

  constructor({ prefix }: { prefix: TPath } = { prefix: "/" }) {
    this.prefix = prefix;
  }

  get server() {
    return this.bunServer;
  }

  private addPath(path: TPath, cb: TCallback, method: TMethod) {
    if (this.prefix.length > 1) {
      path = this.prefix + path;
    }

    if (path.length > 1 && path.at(-1) === "/") {
      path = path.slice(0, -1) as TPath;
    }

    this.routes[method].push({
      path: path,
      cb,
    });
  }

  get(path: TPath, cb: TCallback) {
    this.addPath(path, cb, "GET");
    return this;
  }

  post(path: TPath, cb: TCallback) {
    this.addPath(path, cb, "POST");
    return this;
  }

  put(path: TPath, cb: TCallback) {
    this.addPath(path, cb, "PUT");
    return this;
  }

  delete(path: TPath, cb: TCallback) {
    this.addPath(path, cb, "DELETE");
    return this;
  }

  use(router: Router) {
    for (
      let methodIndex = 0;
      methodIndex < Object.keys(this.routes).length;
      methodIndex++
    ) {
      const method = Object.keys(this.routes)[methodIndex] as TMethod;
      const routes = this.routes[method];

      routes.push(
        ...router.routes[method].map((route) => {
          let path = route.path;
          if (this.prefix.length > 1) {
            path = (this.prefix + path) as TPath;
          }
          if (path.length > 1 && path.at(-1) === "/") {
            path = path.slice(0, -1) as TPath;
          }
          return {
            path,
            cb: route.cb,
          };
        }),
      );
    }

    return this;
  }

  secure(secureCb: TSecureCallback) {
    this.secureCb = secureCb;
    return this;
  }

  cron(time: number, cb: () => void) {
    if (global.interval) {
      clearInterval(global.interval);
    }
    global.interval = setInterval(cb, time);
    return this;
  }

  /**
   * Listens on the specified port and maximum body size, and handles incoming requests.
   *
   * @param {number} port - the port to listen on
   * @param {number} maxBodySize - the maximum body size for incoming requests in Mo
   * @return {this} the current object for method chaining
   */
  listen(port: number, maxBodySize: number) {
    const duplicates = getDuplicates(this.routes);
    if (duplicates) {
      throw Error("Duplicate route: " + JSON.stringify(duplicates, null, 2));
    }

    const self = this;
    this.bunServer = Bun.serve({
      port,
      maxRequestBodySize: maxBodySize * (1000 * 1000),
      async fetch(req) {
        const url = new URL(req.url);
        let pathname = url.pathname;
        if (pathname.length > 1 && pathname.at(-1) === "/") {
          pathname = pathname.slice(0, -1);
        }

        if (req.method === "GET") {
          if (url.pathname.startsWith("/public")) {
            const filePath = "." + url.pathname;
            const file = Bun.file(filePath);
            if (await file.exists()) {
              return new Response(file);
            }
          }
        }

        if (!(await self.secureCb(req))) {
          return new Response("", { status: 403 });
        }

        for (
          let methodIndex = 0;
          methodIndex < Object.keys(self.routes).length;
          methodIndex++
        ) {
          const method = Object.keys(self.routes)[methodIndex] as TMethod;
          const routes = self.routes[method];

          if (method === req.method) {
            let params: Record<string, string> = {};
            const route = routes.find((route) => {
              const isDynamic = route.path.includes("/:");
              if (isDynamic) {
                params = getParams(route.path, pathname);
                return Object.keys(params).length > 0;
              }
              return route.path === pathname;
            });

            if (route) {
              const response = await route.cb(req, params);
              if (typeof response === "string") {
                return await htmlResponse(response);
              }
              return response;
            }
          }
        }

        return new Response("", { status: 404 });
      },
    });
    return this;
  }
}

function getParams(url: string, route: string) {
  const params: Record<string, string> = {};

  url = url.slice(1);
  route = route.slice(1);
  if (url.split("/").length !== route.split("/").length) {
    return params;
  }

  for (let i = 0; i < url.split("/").length; i++) {
    if (url.split("/")[i].startsWith(":")) {
      params[url.split("/")[i].slice(1)] = route.split("/")[i];
    } else {
      if (url.split("/")[i] !== route.split("/")[i]) {
        return {};
      }
    }
  }

  return params;
}

function getDuplicates(routes: Routes) {
  let isDuplicates = false;
  const duplicates: { [key in TMethod]: string[] } = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
  };

  const reduced: { [key in TMethod]: string[] } = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
  };

  for (let methodIndex = 0; methodIndex < METHODS.length; methodIndex++) {
    const removed: string[] = [];
    const method = METHODS[methodIndex];
    reduced[method] = routes[method].map((route) => route.path);

    for (let i = 0; i < reduced[method].length; i++) {
      if (removed.includes(reduced[method][i])) {
        duplicates[method].push(reduced[method][i]);
        isDuplicates = true;
      } else {
        removed.push(reduced[method][i]);
      }
    }
  }

  return isDuplicates ? duplicates : null;
}
