import { createConnection } from "typeorm";

// import { User } from './Postgre/models/User';
// import { Token } from './Postgre/models/Token';

// require("reflect-metadata");

export const connectDB = async () => {
  await createConnection({
    type: "postgres",
    host: process.env.PG_CONN_HOST,
    port: Number(process.env.PG_CONN_PORT),
    username: process.env.PG_CONN_USERNAME.toString(),
    password: process.env.PG_CONN_PASSWORD.toString(),
    database: process.env.PG_DB.toString(),
    ssl: {
      rejectUnauthorized: false,
    },
  });

  console.log("Postgres has been connected");
};
