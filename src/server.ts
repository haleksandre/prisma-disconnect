import type {
  Middleware as KoaMiddleware,
  DefaultState,
  ParameterizedContext,
  Next,
} from "koa";
import type {
  IMiddleware as RouterMiddleware,
  RouterContext as RouterParameterizedContext,
} from "koa-router";
import type { Server as HttpServer } from "http";
import type { User } from "@prisma/client";
import type { Prisma, Select } from "./prisma";

import "dotenv/config";

import { createServer } from "http";
import { ApolloServer } from "apollo-server-koa";
import { PubSub } from "graphql-subscriptions";
import { Server as WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createTerminus } from "@godaddy/terminus";
import Koa from "koa";
import Router from "koa-router";
import parser from "koa-bodyparser";
// import limit from "koa-ratelimit";

export interface Options {
  protocol?: "https:" | "http:";
  host?: string;
  port?: string | number;
  path?: string;
}

type Server = {
  http: HttpServer;
  ws: (scallback?: () => void) => void;
};

export type Context = {
  prisma: Prisma;
  select: Select;
  pubsub: PubSub;
  user?: User;
};

export type KoaContext = ParameterizedContext<DefaultState, Context>;

export type RouterContext = RouterParameterizedContext<DefaultState, Context>;

export type Middleware = {
  (ctx: KoaContext, next: Next): Promise<KoaMiddleware<DefaultState, Context>>;
  (ctx: RouterContext, next: Next): Promise<
    RouterMiddleware<DefaultState, Context>
  >;
};

export const server = async (opts?: Options): Promise<Server> => {
  const [schema, client, select] = await Promise.all([
    import("./schema"),
    import("./prisma"),
  ]).then(([{ schema }, { prisma, select }]) =>
    Promise.all([schema, prisma, select])
  );

  const prisma = client();

  const path = opts?.path || process.env.SERVER_PATH || "/api/graphql";

  const koa = new Koa<DefaultState, Context>();
  const pubsub = new PubSub();
  const apollo = new ApolloServer({
    introspection: process.env.NODE_ENV !== "production",
    schema,
    context: async ({ ctx, connection }) => ({
      ...connection?.context,
      ...ctx,
    }),
    plugins: [],
  });

  const router = new Router<DefaultState, Context>();

  koa.use(parser());
  koa.use(async (ctx, next) => {
    ctx.prisma ||= prisma;
    ctx.select ||= select;
    ctx.pubsub ||= pubsub;

    return next();
  });

  await apollo.start();
  router.post(path, apollo.getMiddleware({ path }));

  if (process.env.NODE_ENV === "development") {
    router.get(path, apollo.getMiddleware({ path }));
  }

  if (process.env.NODE_ENV === "test") {
    const { middleware, test } = await import("./test/routes");
    koa.use(test().routes());
    koa.use(middleware);
  }

  koa.use(router.routes());
  koa.use(router.allowedMethods());

  const http = createServer(koa.callback());
  const ws = new WebSocketServer({ server: http, path });

  return {
    http: createTerminus(http, {
      signals: ["SIGTERM", "SIGINT"],
      async onSignal() {
        prisma.$disconnect();
      },
    }),
    ws: (cb) => {
      useServer(
        {
          context: () => ({
            prisma,
            select,
            pubsub,
          }),
          schema,
        },
        ws
      );

      if (typeof cb === "function") {
        cb();
      }
    },
  };
};
