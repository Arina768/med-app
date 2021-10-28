import { getRepository } from "typeorm";

import Token from "../models/Token";

export default class TokenRepository {
  repository = getRepository(Token);

  async saveToken(userId, refreshToken) {
    const tokenData = await this.repository.findOne({ userId: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return this.repository.save(tokenData);
    }

    const token = await this.repository.save({ userId, refreshToken });
    return token;
  }

  async findToken(refreshToken) {
    const tokenData = await this.repository.findOne({
      refreshToken: refreshToken,
    });
    return tokenData;
  }
}
