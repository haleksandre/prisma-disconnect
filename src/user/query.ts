import { queryField, arg, intArg } from "nexus";

export const Query = queryField((t) => {
  t.field("user", {
    type: "User",
    description: "Fetch a specific user",
    args: {
      where: arg({ type: "UserWhereUniqueInput" }),
    },
    resolve: async (_, args, ctx, info) =>
      ctx.prisma.user.findUnique({
        ...ctx.select(ctx, info).value,
        ...args,
      }),
  });

  t.list.nonNull.field("users", {
    type: "User",
    description: "Fetch a list of users",
    args: {
      where: arg({ type: "UserWhereInput" }),
    },
    resolve: async (_, args, ctx, info) =>
      ctx.prisma.user.findMany({
        ...ctx.select(ctx, info).value,
        ...args,
      }),
  });
});
