// scripts/get-hourly-prices-script.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PriceService } from '../src/price/price.service';
import { HourlyPrice } from '../src/price/interfaces/price.interface'; // Import the interface

async function bootstrap() {
  // Create a Nest application context
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the PriceService from the context
  const priceService = app.get(PriceService);

  // Specify the chain (Ethereum or Polygon)
  const chain = 'Ethereum'; // Change to 'Polygon' if needed

  try {
    // Fetch hourly prices for the specified chain
    const hourlyPrices: HourlyPrice[] =
      await priceService.getHourlyPrices(chain);

    // Output the results
    console.log(`Hourly prices for ${chain}:`);
    hourlyPrices.forEach((price) => {
      console.log(
        `Hour: ${price.hour.toISOString()}, Avg Price: $${parseFloat(
          price.avg_price,
        ).toFixed(2)}`,
      );
    });
  } catch (error) {
    console.error('Failed to get hourly prices:', error);
  }

  // Close the application context
  await app.close();
}

bootstrap();
