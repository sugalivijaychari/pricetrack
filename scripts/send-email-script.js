"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const mail_service_1 = require("../src/mail/mail.service");
const config_1 = require("@nestjs/config");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const mailService = app.get(mail_service_1.MailService);
        const configService = app.get(config_1.ConfigService);
        const receiverEmail = configService.get('EMAIL_RECEIVER') || 'vijaysugali98@gmail.com';
        try {
            yield mailService.sendPriceIncreaseAlertEmail('Ethereum', 2500, 2850);
            console.log(`Email successfully sent to ${receiverEmail}`);
        }
        catch (error) {
            console.error('Failed to send email:', error);
        }
        yield app.close();
    });
}
bootstrap();
//# sourceMappingURL=send-email-script.js.map