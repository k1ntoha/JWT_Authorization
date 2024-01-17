const nodemailer = require("nodemailer");
class mailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendActivationLink(link, email) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Активация аккаунта",
      text: "",
      html: `<div>
        <h1>Для актвации перейдите по ссылке</h1>
        <a href ="${link}">${link}</a>
        </div>`,
    });
  }
  async sendRecoverAccess(email, code) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Запрос на изменение пароля в Sales.uz ",
      text: "",
      html: `
        <div>
        <h1>Для измения отправьте пароль</h1>
        <h2>${code}<h2>
        </div>
        `,
    });
  }
}
module.exports = new mailService();
