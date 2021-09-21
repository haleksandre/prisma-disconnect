import type { GraphQLResolveInfo } from "graphql";
import type { KoaContext } from "./server";

import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaSelect } from "@paljs/plugins";

export interface Options {
  rejectOnNotFound: true;
}

export type Prisma = PrismaClient<Options>;
export type Select = (
  ctx: KoaContext,
  info: GraphQLResolveInfo
) => PrismaSelect;

export const prisma: Promise<(opts?: Prisma.PrismaClientOptions) => Prisma> = (
  async () => (opts?: Prisma.PrismaClientOptions) => {
    const prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "test"
          ? []
          : [
              {
                emit: "stdout",
                level: "query",
              },
              {
                emit: "stdout",
                level: "error",
              },
              {
                emit: "stdout",
                level: "info",
              },
              {
                emit: "stdout",
                level: "warn",
              },
            ],
      ...opts,
    });

    return prisma;
  }
)();

export const select = (
  async () => (_ctx: KoaContext, info: GraphQLResolveInfo) =>
    new PrismaSelect(info, {
      defaultFields: {
        User: {
          id: true,
          email: true,
          username: true,
          type: true,
          status: true,
        },
      },
    })
)();
