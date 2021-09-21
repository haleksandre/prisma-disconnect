import type Koa from "koa";
import type { Context } from "../server";

import type { DefaultState, Middleware } from "koa";
import type { KoaContext } from "../server";

import Router from "koa-router";

export const middleware: Middleware<KoaContext, DefaultState> = async (
  ctx,
  next
) => {
  const client = await import("../prisma").then(({ prisma }) => prisma);

  await ctx.prisma.$disconnect();
  delete ctx.prisma;

  ctx.prisma = client({
    datasources: { db: { url: process.env.POSTGRES_URL } },
  });

  return next();
};

export const test = (): Router<Koa.DefaultState, Context> => {
  const router = new Router<Koa.DefaultState, Context>();

  router.use("/test", async ({ req }, next) => {
    if (
      process.env.NODE_ENV !== "test" ||
      !req.headers["x-cypress-allow-hooks"]
    ) {
      return;
    }

    return next();
  });

  router.get("/test/setup", async (ctx) => {
    try {
      const [{ nanoid }, { default: execa }] = await Promise.all([
        import("nanoid"),
        import("execa"),
      ]);

      await ctx.prisma.$disconnect();

      process.env.POSTGRES_SCHEMA = `test_${nanoid()}`;
      process.env.POSTGRES_URL = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}?schema=${process.env.POSTGRES_SCHEMA}`;

      await ctx.prisma.$connect();

      const { stdout: migrate } = await execa(
        "prisma",
        ["db", "push", "--force-reset", "--accept-data-loss"],
        {
          env: process.env,
        }
      );

      ctx.status = 200;
      ctx.body = {
        stdout: {
          migrate,
        },
      };
      console.log("\n%s\n%s\n", migrate);
    } catch (error) {
      console.log(error);

      ctx.status = 500;
      ctx.body = { error };
    }
  });

  router.get("/test/teardown", async (ctx) => {
    try {
      const drop = await ctx.prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${process.env.POSTGRES_SCHEMA}" CASCADE`
      );

      await ctx.prisma.$disconnect();

      ctx.status = 200;
      ctx.body = {
        drop,
        schema: process.env.POSTGRES_SCHEMA,
      };

      console.log(`Schema ${process.env.POSTGRES_SCHEMA} successfully dropped`);
    } catch (error) {
      console.log(error);

      ctx.status = 500;
      ctx.body = { error };
    }
  });

  return router;
};
