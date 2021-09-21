import { server } from "./server";

export async function config(): Promise<void> {
  process.env.SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || "https:";
  process.env.SERVER_HOST = process.env.SERVER_HOST || "0.0.0.0";
  process.env.SERVER_PORT = process.env.SERVER_PORT || "4000";
  process.env.SERVER_PATH = process.env.SERVER_PATH || "/api/graphql";

  process.env.POSTGRES_HOST = process.env.POSTGRES_HOST || "postgres";
  process.env.POSTGRES_PORT = process.env.POSTGRES_PORT || "5432";
  process.env.POSTGRES_DATABASE =
    process.env.POSTGRES_DATABASE || "metierplus_dev";

  if (process.env.NODE_ENV === "test") {
    const { nanoid } = await import("nanoid");

    process.env.SERVER_PROTOCOL = "http:";
    process.env.SERVER_HOST = "0.0.0.0";
    process.env.SERVER_PORT = "4001";
    process.env.SERVER_PATH = "/api/graphql";

    process.env.POSTGRES_DATABASE = "metierplus_test";
    process.env.POSTGRES_SCHEMA = `test_${nanoid()}`;
    process.env.POSTGRES_URL = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}?schema=${process.env.POSTGRES_SCHEMA}`;
  }
}

(async () => {
  await config();

  const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT, SERVER_PATH } =
    process.env;

  try {
    const { http, ws } = await server({ path: SERVER_PATH });

    http.listen(parseInt(SERVER_PORT || "4000"), SERVER_HOST, () => {
      console.log(
        `🚀  Server ready at ${SERVER_PROTOCOL}//${SERVER_HOST}:${SERVER_PORT}${SERVER_PATH}`
      );

      ws(() => {
        console.log(
          `🚀  Subscriptions ready at wss://${SERVER_HOST}:${SERVER_PORT}${SERVER_PATH}`
        );
      });
    });
  } catch (error) {
    console.log(error);
  }
})();
