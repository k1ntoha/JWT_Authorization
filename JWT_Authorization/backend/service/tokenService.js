const jwt = require("jsonwebtoken");
const tokenModel = require("../models/tokenModel");
class tokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }
  async saveToken(userId, rfr) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = rfr;
      return tokenData.save();
    }
    const token = await tokenModel.create({
      user: userId,
      refreshToken: rfr,
    });
    return token;
  }
  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }
  validateRefreshToken(token) {
    try {
      const valid = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      return valid;
    } catch (e) {
      return null;
    }
  }
  validateAccessToken(token) {
    try {
      const valid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return valid;
    } catch (e) {
      return null;
    }
  }
  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
  async findTokenId(id) {
    const tokenData = await tokenModel.findOne({ user: id });
    return tokenData;
  }
}
module.exports = new tokenService();
