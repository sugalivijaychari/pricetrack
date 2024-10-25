import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SwapService } from '../src/swap/swap.service';

async function testEthToBtcSwap() {
  // Initialize the NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Retrieve the SwapService from the application context
    const swapService = app.get(SwapService);

    // Define the ETH amount for testing
    const ethAmount = 1; // Change this to the desired ETH amount

    // Call the calculateEthToBtcSwap method to get the swap rate
    const swapResult = await swapService.calculateEthToBtcSwap(ethAmount);

    // Log the response
    console.log(`Test ETH to BTC Swap for ${ethAmount} ETH:`);
    console.log(`BTC Amount: ${swapResult.btcAmount}`);
    console.log(`Fee in ETH: ${swapResult.feeInEth}`);
    console.log(`Fee in USD: $${swapResult.feeInUsd}`);
  } catch (error) {
    console.error('Error calculating ETH to BTC swap:', error);
  } finally {
    // Close the application context
    await app.close();
  }
}

// Execute the function
testEthToBtcSwap();
