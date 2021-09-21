import { objectType } from "nexus";
import * as Prisma from "nexus-prisma";

export const User = objectType({
  name: Prisma.User.$name,
  description: Prisma.User.$description,
  definition(t) {
    t.field("id", Prisma.User.id);
    t.field("username", Prisma.User.username);
    t.field("email", Prisma.User.email);
    t.field("type", Prisma.User.type);
    t.field("status", Prisma.User.status);
  },
});
