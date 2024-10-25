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
const price_service_1 = require("../src/price/price.service");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const priceService = app.get(price_service_1.PriceService);
        const chain = 'Ethereum';
        try {
            const hourlyPrices = yield priceService.getHourlyPrices(chain);
            console.log(`Hourly prices for ${chain}:`);
            hourlyPrices.forEach((price) => {
                console.log(`Hour: ${price.hour.toISOString()}, Avg Price: $${parseFloat(price.avg_price).toFixed(2)}`);
            });
        }
        catch (error) {
            console.error('Failed to get hourly prices:', error);
        }
        yield app.close();
    });
}
bootstrap();
//# sourceMappingURL=get-hourly-prices-script.js.map