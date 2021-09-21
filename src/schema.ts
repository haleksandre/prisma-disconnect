import "dotenv/config";

import { join } from "path";
import { makeSchema } from "nexus";
import { types } from "./types";

export const schema = (async () =>
  makeSchema({
    types,
    outputs: {
      typegen: join(
        __dirname,
        "..",
        "node_modules",
        "@types",
        "nexus-typegen",
        "index.d.ts"
      ),
      schema: join(__dirname, "..", "schema.graphql"),
    },
    sourceTypes: {
      modules: [
        {
          module: "@prisma/client",
          alias: "prisma",
        },
      ],
    },
    contextType: {
      module: join(process.cwd(), "src", "server.ts"),
      export: "KoaContext",
    },
    plugins: [],
  }))();
