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
const swap_service_1 = require("../src/swap/swap.service");
function testEthToBtcSwap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        try {
            const swapService = app.get(swap_service_1.SwapService);
            const ethAmount = 1;
            const swapResult = yield swapService.calculateEthToBtcSwap(ethAmount);
            console.log(`Test ETH to BTC Swap for ${ethAmount} ETH:`);
            console.log(`BTC Amount: ${swapResult.btcAmount}`);
            console.log(`Fee in ETH: ${swapResult.feeInEth}`);
            console.log(`Fee in USD: $${swapResult.feeInUsd}`);
        }
        catch (error) {
            console.error('Error calculating ETH to BTC swap:', error);
        }
        finally {
            yield app.close();
        }
    });
}
testEthToBtcSwap();
//# sourceMappingURL=get-eth-to-btc-swap-rate.js.map