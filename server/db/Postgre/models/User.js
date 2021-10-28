import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",

  columns: {
    _id: {
      primary: true,
      type: "int",
      generated: true,
    },
    email: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
    firstName: {
      type: "varchar",
    },
    role: {
      type: "varchar",
      default: "user",
      enum: ["user", "admin"],
    },
  },
  relations: {
    serviceToUser: {
      target: "ServiceToUser",
      type: "one-to-many",
      inverseSide: "user",
    },
  },
});
export default User;
