import {
  queryType,
  mutationType,
  subscriptionType,
  objectType,
  inputObjectType,
  enumType,
} from "nexus";

import * as User from "./user/type";
import * as UserInputs from "./user/input";
import * as UserEnums from "./user/enum";
import * as UserQuery from "./user/query";
import * as UserMutation from "./user/mutation";

const PrismaOutputs = [
  objectType({
    name: "AffectedRowsOutput",
    description: "The count of updated records",
    definition(t) {
      t.nonNull.int("count");
    },
  }),
];

const PrismaInputs = [
  inputObjectType({
    name: "StringFieldUpdateOperationsInput",
    definition(t) {
      t.string("set");
    },
  }),
  inputObjectType({
    name: "StringFilter",
    description: "String filter conditions and operators",
    definition(t) {
      t.string("equals");
      t.list.nonNull.string("in");
      t.list.nonNull.string("notIn");
      t.string("lt");
      t.string("lte");
      t.string("gt");
      t.string("gte");
      t.string("contains");
      t.string("startsWith");
      t.string("endsWith");
      t.field("mode", { type: "QueryMode" });
      t.field("not", { type: "StringFilter" });
    },
  }),
  inputObjectType({
    name: "StringNullableListFilter",
    definition(t) {
      t.list.nonNull.string("equals");
      t.string("has");
      t.list.nonNull.string("hasEvery");
      t.list.nonNull.string("hasSome");
      t.boolean("isEmpty");
    },
  }),
  inputObjectType({
    name: "IntFilter",
    description: "Int filter conditions and operators",
    definition(t) {
      t.int("equals");
      t.list.nonNull.int("in");
      t.list.nonNull.int("notIn");
      t.int("lt");
      t.int("lte");
      t.int("gt");
      t.int("gte");
      t.field("not", { type: "IntFilter" });
    },
  }),
];

const PrismaEnums = [
  enumType({
    name: "SortOrder",
    members: ["asc", "desc"],
  }),
  enumType({
    name: "QueryMode",
    members: ["default", "insensitive"],
  }),
];

// Root Types
const Query = queryType({
  definition(t) {
    t.boolean("_", {
      description:
        "This is the root query needed for Nexus to properly extend `Query` with the use `extendType` or `queryField`",
      resolve: () =>
        // Randomize boolean
        Math.random() < 0.5,
    });
  },
});

const Mutation = mutationType({
  definition(t) {
    t.boolean("_", {
      description:
        "This is the root query needed for Nexus to properly extend `Mutation` with the use `extendType` or `mutationField`",
      resolve: (_root, _args, ctx) => {
        // Randomize boolean
        const _ = Math.random() < 0.5;
        ctx.pubsub.publish("ROOT_TRIGGERED", { _ });

        return _;
      },
    });
  },
});

const Subscription = subscriptionType({
  definition(t) {
    t.boolean("_", {
      description:
        "This is the root query needed for Nexus to properly extend `Subscription` with the use `extendType` or `subscriptionField`",
      subscribe: (_root, _args, ctx) =>
        ctx.pubsub.asyncIterator(["ROOT_TRIGGERED"]),
      resolve: ({ _ }) => _,
    });
  },
});

export const types = [
  PrismaOutputs,
  PrismaInputs,
  UserInputs,
  PrismaEnums,
  UserEnums,
  Query,
  UserQuery,
  User,
  Mutation,
  UserMutation,
  Subscription,
];
