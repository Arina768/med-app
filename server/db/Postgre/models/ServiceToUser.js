import { EntitySchema } from "typeorm";

const ServiceToUser = new EntitySchema({
  name: "ServiceToUser",

  columns: {
    _id: {
      primary: true,
      type: "int",
      generated: true,
    },

    appointmentDate: {
      type: "varchar",
    },
    attended: {
      type: "boolean",
      default: false,
    },
    lastVisitDate: {
      type: "varchar",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinTable: true,
      cascade: true,
    },
    service: {
      target: "MedService",
      type: "many-to-one",
      joinTable: true,
      cascade: true,
    },
  },
});
export default ServiceToUser;
