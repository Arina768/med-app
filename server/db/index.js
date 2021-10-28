import { createConnection } from "typeorm";
import MedService from "./Postgre/models/MedService";
import ServiceToUser from "./Postgre/models/ServiceToUser";
import Token from "./Postgre/models/Token";
import User from "./Postgre/models/User";
import UserPostgreRepository from "./Postgre/repositories/User";
import TokenPostgreRepository from "./Postgre/repositories/Token";
import MedServicePostgreRepository from "./Postgre/repositories/MedService";

export let MedServiceRepository;

export let UserRepository;
export let TokenRepository;

export const connectDB = async () => {
  await createConnection({
    type: "postgres",
    host: process.env.PG_CONN_HOST,
    port: Number(process.env.PG_CONN_PORT),
    username: process.env.PG_CONN_USERNAME.toString(),
    password: process.env.PG_CONN_PASSWORD.toString(),
    database: process.env.PG_DB.toString(),
    entities: [User, Token, MedService, ServiceToUser],
    synchronize: true,

    ssl: {
      rejectUnauthorized: false,
    },
  });
  MedServiceRepository = MedServicePostgreRepository;
  UserRepository = UserPostgreRepository;
  TokenRepository = TokenPostgreRepository;

  console.log("Postgres has been connected");
};
