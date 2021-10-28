import { EntitySchema } from "typeorm";

const MedService = new EntitySchema({
  name: "MedService",

  columns: {
    _id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    description: {
      type: "text",
    },
    visitsPerYear: {
      type: "bigint",
    },
    ageLimits: {
      type: "varchar",
    },
    basicService: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    serviceToUser: {
      target: "ServiceToUser",
      type: "one-to-many",
      inverseSide: "service",
    },
  },
});
export default MedService;
