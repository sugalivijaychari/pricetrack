import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PriceService } from '../price/price.service';
import { HourlyPrice } from './interfaces/price.interface';

@ApiTags('Price Trackers') // This groups all endpoints in this controller under the 'price' tag
@Controller('price')
export class PriceController {
  private readonly logger = new Logger(PriceController.name);

  constructor(private readonly priceService: PriceService) {}

  // API to get hourly prices for the last 24 hours
  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  @ApiQuery({
    name: 'chain',
    required: true,
    description:
      'The blockchain chain to fetch prices for (e.g., Ethereum, Polygon)',
  })
  @ApiResponse({
    status: 200,
    description: 'Hourly prices retrieved successfully',
    schema: {
      example: [
        {
          hour: '2024-10-24T00:00:00.000Z',
          avg_price: '1534.45 USD',
        },
        {
          hour: '2024-10-24T01:00:00.000Z',
          avg_price: '1540.12 USD',
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request if chain parameter is missing',
  })
  async getHourlyPrices(@Query('chain') chain: string) {
    this.logger.log('Received request to get hourly prices');

    if (!chain) {
      this.logger.error('Chain parameter is missing');
      throw new Error('Chain parameter is required');
    }

    this.logger.log(`Fetching hourly prices for chain: ${chain}`);

    try {
      // Retrieve the hourly prices from the service
      const hourlyPrices: HourlyPrice[] =
        await this.priceService.getHourlyPrices(chain);

      this.logger.log(`Successfully fetched hourly prices for chain: ${chain}`);

      // Format the response to include hour and formatted avg_price
      return hourlyPrices.map((price) => ({
        hour: price.hour.toISOString(), // Convert Date to ISO string format
        avg_price: parseFloat(price.avg_price).toFixed(2) + ' USD', // Format avg_price to two decimal places
      }));
    } catch (error) {
      this.logger.error(
        `Failed to fetch hourly prices for chain: ${chain}`,
        error,
      );
      throw error;
    }
  }
}
