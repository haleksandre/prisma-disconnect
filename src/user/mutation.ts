import { mutationField, arg, nonNull } from "nexus";
import { hash } from "bcrypt";

export const Mutation = mutationField((t) => {
  t.field("user", {
    type: "User",
    description: "Create a new user",
    args: {
      data: nonNull(arg({ type: "UserCreateInput" })),
    },
    resolve: async (_, { data }, ctx, info) =>
      ctx.prisma.user.create({
        ...ctx.select(ctx, info).value,
        data: {
          ...data,
          password: await hash(data.password, 10),
        },
      }),
  });

  t.field("updateUser", {
    type: "User",
    description: "Update an existing user",
    args: {
      where: nonNull(arg({ type: "UserWhereUniqueInput" })),
      data: nonNull(arg({ type: "UserUpdateInput" })),
    },
    resolve: async (_, args, ctx, info) => {
      const update = {
        where: { ...args.where },
        data: {
          ...args.data,
          ...(args.data.password && {
            password: await hash(args.data.password, 10),
          }),
        },
      };

      return ctx.prisma.user.update({
        ...ctx.select(ctx, info).value,
        ...update,
      });
    },
  });
});
