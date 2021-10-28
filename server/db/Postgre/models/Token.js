import { EntitySchema } from "typeorm";

const Token = new EntitySchema({
  name: "Token",

  columns: {
    _id: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "varchar",
    },
    refreshToken: {
      type: "varchar",
    },
  },
});
export default Token;
