import { getRepository } from "typeorm";
import User from "../models/User";
import sha256 from "sha256";
import generateToken from "../../../helpers/generateToken";
import TokenRepository from "./Token";
import MedService from "../models/MedService";
import ServiceToUser from "../models/ServiceToUser";
import ApiError from "../../../helpers/handleError";

export default class UserRepository {
  repository = getRepository(User);
  medRepository = getRepository(MedService);
  serviceToUserRepository = getRepository(ServiceToUser);
  async registerUser(reqParameters) {
    const { email, password } = reqParameters;

    const user = await this.repository.findOne({ email });

    if (!user) {
      const newUser = {};
      newUser.email = email;
      newUser.password = sha256(password);
      newUser.firstName = reqParameters.firstName;
      newUser.lastName = reqParameters.lastName;
      if (reqParameters.role) {
        newUser.role = reqParameters.role;
      }
      const savedUser = await this.repository.save(newUser);

      const { _id } = savedUser;

      const role = savedUser.role;

      const tokens = generateToken({ email, _id, role });
      await new TokenRepository().saveToken(_id, tokens.refreshToken);
      const userToReturn = { ...savedUser, ...{ tokens } };
      return userToReturn;
    } else {
      const userExist = true;
      return { ...user, userExist };
    }
  }
  async loginUser(reqParameters) {
    const { email, password } = reqParameters;

    const user = await this.repository.findOne({ email });

    if (user && user.email) {
      const reqPassword = sha256(password);
      if (reqPassword === user.password) {
        const _id = user._id.toString();

        const role = user.role;

        const tokens = generateToken({ email, _id, role });
        await new TokenRepository().saveToken(_id, tokens.refreshToken);

        return { ...tokens, user };
      } else {
        throw ApiError.AuthenticationError("wrong password");
      }
    } else {
      throw ApiError.AuthenticationError("requested user doesn't exist");
    }
  }
  async findUser(_id) {
    const user = await this.repository.findOne({ _id });
    return user;
  }
  async updateProfile(reqParameters) {
    const { _id } = reqParameters;
    const userFromDB = await this.repository.findOne({ _id });
    if (!userFromDB) {
      throw ApiError.AuthenticationError("requested user doesn't exist");
    }
    const checkEmail = await this.repository.find({
      email: reqParameters.email,
    });
    checkEmail.length &&
      checkEmail.map((item) => {
        if (item && item._id.toString() !== _id.toString()) {
          throw ApiError.AuthenticationError("User exists already");
        }
      });

    const user = await this.repository
      .createQueryBuilder()
      .update(User, {
        firstName: reqParameters.firstName || userFromDB.firstName,
        email: reqParameters.email || userFromDB.email,
      })
      .where("_id = :id", { id: _id })
      .returning("*")
      .updateEntity(true)
      .execute();

    return user.raw[0];
  }
  async updatePassword(reqParameters) {
    const { _id, password } = reqParameters;
    const user = await this.repository.findOne({ _id });

    const reqPassword = sha256(password);
    if (user && reqPassword === user.password) {
      const newPassword = sha256(reqParameters.newPassword);
      const updatedUser = await this.repository
        .createQueryBuilder()
        .update(User, {
          password: newPassword,
        })
        .where("_id = :id", { id: _id })
        .returning("*")
        .updateEntity(true)
        .execute();

      return updatedUser.raw[0];
    } else {
      throw ApiError.AuthenticationError("wrong password");
    }
  }
  async addNewService(reqParameters) {
    const {
      serviceId,
      userId,
      appointmentDate = new Date().toLocaleDateString("en-ca"),
      lastVisitDate = new Date().toLocaleDateString("en-ca"),
      changeDate,
    } = reqParameters;
    const userInfo = await this.repository.findOne({
      _id: userId,
    });

    const serviceInfo = await this.medRepository.findOne({
      _id: serviceId,
    });
    if (serviceInfo && userInfo) {
      const isAppointmentAlreadyExist =
        await this.serviceToUserRepository.findOne({
          relations: ["user", "service"],
          where: {
            user: {
              _id: userId,
            },
            service: {
              _id: serviceId,
            },
          },
        });

      if (isAppointmentAlreadyExist) {
        if (changeDate) {
          isAppointmentAlreadyExist.appointmentDate = appointmentDate;
          isAppointmentAlreadyExist.lastVisitDate = lastVisitDate;
          isAppointmentAlreadyExist.attended = false;

          const savedAppointment = await this.serviceToUserRepository.save(
            isAppointmentAlreadyExist
          );

          return savedAppointment;
        } else {
          return {
            appointmentAlreadyExist: true,
          };
        }
      }
      const newAppointment = {
        appointmentDate,
        lastVisitDate,
      };
      newAppointment.user = userInfo;
      newAppointment.service = serviceInfo;

      const savedAppointment = await this.serviceToUserRepository.save(
        newAppointment
      );

      return savedAppointment;
    } else {
      throw ApiError.AuthenticationError("requested service doesn't exist");
    }
  }
  async addBasicServices(reqParameters) {
    const { servicesInfo, userId } = reqParameters;
    const userInfo = await this.repository.findOne({
      _id: userId,
    });

    if (userInfo) {
      const newAppointments = await servicesInfo.map(async (item) => {
        const service = await this.medRepository.findOne({
          _id: item._id,
        });
        const appointment = {
          appointmentDate:
            item.appointmentDate || new Date().toLocaleDateString("en-ca"),
          lastVisitDate:
            item.lastVisitDate || new Date().toLocaleDateString("en-ca"),
          user: userInfo,
          service,
        };
        const savedAppointments = await this.serviceToUserRepository.save(
          appointment
        );
        if (savedAppointments._id) {
          return savedAppointments;
        }
      });

      return Promise.all(newAppointments);
    } else {
      throw ApiError.AuthenticationError("requested user doesn't exist");
    }
  }

  async getAllServices(_id) {
    const user = await this.repository.findOne({ _id });

    if (user) {
      const services = await this.serviceToUserRepository.find({
        relations: ["user", "service"],
        where: {
          user: {
            _id: _id,
          },
        },
      });
      return services;
    } else {
      throw ApiError.AuthenticationError("requested user doesn't exist");
    }
  }
  async modifyAppointment(reqParameters, method) {
    const {
      appointmentId,
      userId,
      serviceId,
      newAppointmentDate = "",
      addAppointmentInYear = false,
    } = reqParameters;
    const appointmentInfo = await this.serviceToUserRepository.findOne({
      relations: ["user", "service"],
      where: {
        _id: appointmentId,
      },
    });
    if (
      appointmentInfo &&
      appointmentInfo.user._id.toString() === userId.toString() &&
      appointmentInfo.service._id.toString() === serviceId.toString()
    ) {
      if (method === "DELETE") {
        const deleted = await this.serviceToUserRepository.delete(
          appointmentId
        );
        return deleted;
      } else if (method === "PUT") {
        appointmentInfo.appointmentDate = newAppointmentDate;
        const savedAppointment = await this.serviceToUserRepository.save(
          appointmentInfo
        );
        return savedAppointment;
      } else if (method === "POST") {
        appointmentInfo.attended = true;
        await this.serviceToUserRepository.save(appointmentInfo);
        if (addAppointmentInYear) {
          const newAppointmentNextYear = new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          );
          const newAppointment = {
            appointmentDate: newAppointmentNextYear,
            lastVisitDate: appointmentInfo.appointmentDate,
            user: appointmentInfo.user,
            service: appointmentInfo.service,
          };

          const savedNewAppointment = await this.serviceToUserRepository.save(
            newAppointment
          );
          return savedNewAppointment;
        }
      }
    } else {
      throw ApiError.AuthenticationError("appointment info is wrong");
    }
  }
}
