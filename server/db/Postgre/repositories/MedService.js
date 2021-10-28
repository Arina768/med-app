import { getRepository, Like, Any } from "typeorm";
import MedService from "../models/MedService";

export default class MedServiceRepository {
  repository = getRepository(MedService);

  async saveService(reqParameters) {
    const medService = {};
    medService.name = reqParameters.name.toLowerCase();
    medService.description = reqParameters.description;
    medService.visitsPerYear = reqParameters.visitsPerYear;

    medService.ageLimits = reqParameters.ageLimits || "0";
    medService.basicService = !!reqParameters.basicService;

    const savedMedService = await this.repository.save(medService);

    return savedMedService;
  }

  async deleteService(id) {
    const deleted = await this.repository.delete(id);

    return deleted;
  }

  async getServices(ReqQuery) {
    if (ReqQuery.basicService) {
      const medServices = await this.repository.find({
        where: {
          basicService: ReqQuery.basicService || Any(),
        },
      });
      return medServices;
    } else {
      const medServices = await this.repository.find({
        where: {
          name: Like(`%${ReqQuery.name ? ReqQuery.name.toLowerCase() : ""}%`),
        },
      });
      return medServices;
    }
  }

  async getServiceById(_id) {
    const medService = await this.repository.findOne({ _id });

    return medService;
  }
}
