const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error.js");

class userService {
  async registration(email, password, login) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользлватель с почтовым адресом ${email} уже сущесетвует`
      );
    } else {
      const hashPassword = await bcrypt.hash(password, 3);
      const activationLink = uuid.v4();
      const user = await userModel.create({
        email,
        password: hashPassword,
        activationLink,
        login,
      });
      const dataForToken = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...dataForToken });
      await tokenService.saveToken(dataForToken.id, tokens.refreshToken);
      await mailService.sendActivationLink(
        `${process.env.API_URL}/api/v1/activate/${activationLink}`,
        email
      );
      return { ...tokens, user: dataForToken };
    }
  }
  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Ссылка не действительна");
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password, flag) {
    let user;
    if (flag) {
      user = await userModel.findOne({ email });
    } else {
      user = await userModel.findOne({ login: email });
    }

    if (!user) {
      throw ApiError.Unauthorized("Пользователь не найден");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const userData = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userData });
    await tokenService.saveToken(userData.id, tokens.refreshToken);
    return { ...tokens, userData };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.Unauthorized();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.Unauthorized();
    }
    const user = await userModel.findById(tokenFromDb.user);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    tokenFromDb.refreshToken = tokens.refreshToken;
    await tokenService.saveToken(tokenFromDb.user, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
  async getAllUsers() {
    const users = await userModel.find({});
    let userForFront = users.map((usr) => {
      return new UserDto(usr);
    });
    return userForFront;
  }
  async sendCode(email) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Юзер не найден");
    }
    const code = String(Math.floor(Math.random() * 1000000));
    const hashCode = await bcrypt.hash(code, 3);
    await mailService.sendRecoverAccess(email, code);
    await user.updateOne({ activationCode: hashCode });
    const userInfo = new UserDto(user);
    return userInfo;
  }
  async recover(email, code, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    const isTrue = await bcrypt.compare(code, user.activationCode);
    if (!isTrue) {
      throw ApiError.BadRequest("Неправильный код");
    }
    const hashPassword = await bcrypt.hash(password, 3);
    await user.updateOne({ password: hashPassword });
  }
  async googleAuth(login, email, password) {
    if (!login || !email || !password) {
      throw ApiError.BadRequest();
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const isUser = await userModel.findOne({ email });
    if (isUser) {
      const dataForToken = new UserDto(isUser);
      const tokens = tokenService.generateTokens({ ...dataForToken });
      await tokenService.saveToken(isUser._id, tokens.refreshToken);
      return { ...tokens, user: dataForToken };
    } else {
      const user = await userModel.create({
        email,
        password: hashPassword,
        activationLink,
        login,
      });
      const dataForToken = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...dataForToken });
      await tokenService.saveToken(dataForToken.id, tokens.refreshToken);
      await mailService.sendActivationLink(
        `${process.env.API_URL}/api/v1/activate/${activationLink}`,
        email
      );
      return { ...tokens, user: dataForToken };
    }
  }
}

module.exports = new userService();
