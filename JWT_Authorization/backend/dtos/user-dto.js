module.exports = class UserDto {
  email;
  id;
  isActivated;
  login;
  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
    this.login = model.login;
  }
};
