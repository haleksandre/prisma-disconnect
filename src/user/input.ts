import { inputObjectType } from "nexus";

export const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  description: "The user create fields",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("username");
    t.nonNull.string("password");
    t.field("type", { type: "UserType" });
    t.field("status", { type: "UserStatus" });
  },
});

export const UserUpdateInput = inputObjectType({
  name: "UserUpdateInput",
  description: "The user update fields",
  definition(t) {
    t.string("email");
    t.string("username");
    t.string("password");
    t.field("type", { type: "UserType" });
    t.field("status", { type: "UserStatus" });
  },
});

export const UserWhereUniqueInput = inputObjectType({
  name: "UserWhereUniqueInput",
  description: "The user unique filter fields",
  definition(t) {
    t.string("id");
    t.string("email");
    t.string("username");
  },
});

export const UserWhereInput = inputObjectType({
  name: "UserWhereInput",
  description: "The user filter fields",
  definition(t) {
    t.list.nonNull.field("AND", { type: "UserWhereInput" });
    t.list.nonNull.field("OR", { type: "UserWhereInput" });
    t.list.nonNull.field("NOT", { type: "UserWhereInput" });
    t.field("id", { type: "StringFilter" });
    t.field("email", { type: "StringFilter" });
    t.field("username", { type: "StringFilter" });
    t.field("type", { type: "EnumUserTypeFilter" });
    t.field("status", { type: "EnumUserStatusFilter" });
  },
});

export const UserOrderByInput = inputObjectType({
  name: "UserOrderByInput",
  description: "The user order by fields",
  definition(t) {
    t.field("id", { type: "SortOrder" });
    t.field("email", { type: "SortOrder" });
    t.field("username", { type: "SortOrder" });
    t.field("password", { type: "SortOrder" });
    t.field("type", { type: "SortOrder" });
  },
});

export const EnumUserTypeFilter = inputObjectType({
  name: "EnumUserTypeFilter",
  description: "The user type filter field",
  definition(t) {
    t.field("equals", { type: "UserType" });
    t.list.nonNull.field("in", { type: "UserType" });
    t.list.nonNull.field("notIn", { type: "UserType" });
    t.field("not", { type: "EnumUserTypeFilter" });
  },
});

export const EnumUserStatusFilter = inputObjectType({
  name: "EnumUserStatusFilter",
  description: "The user status filter field",
  definition(t) {
    t.field("equals", { type: "UserStatus" });
    t.list.nonNull.field("in", { type: "UserStatus" });
    t.list.nonNull.field("notIn", { type: "UserStatus" });
    t.field("not", { type: "EnumUserStatusFilter" });
  },
});
