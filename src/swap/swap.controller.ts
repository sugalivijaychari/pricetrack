import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Query,
  Logger,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Swaps')
@Controller('swap')
export class SwapController {
  private readonly logger = new Logger(SwapController.name);

  constructor(private readonly swapService: SwapService) {}

  // API to add a new swap fee configuration
  @Post('add-fee')
  @ApiOperation({
    summary: 'Add a new swap fee percentage for a specific chain and token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chain: { type: 'string', example: 'Ethereum' },
        token: { type: 'string', example: 'ETH' },
        fee_percentage: { type: 'number', example: 0.03 },
      },
      required: ['chain', 'token', 'fee_percentage'],
    },
  })
  @ApiResponse({ status: 201, description: 'Swap fee added successfully' })
  @ApiResponse({ status: 400, description: 'Swap fee already exists' })
  async addSwapFee(
    @Body('chain') chain: string,
    @Body('token') token: string,
    @Body('fee_percentage') feePercentage: number,
  ) {
    this.logger.log(
      `Received request to add swap fee for ${chain} - ${token} with fee: ${feePercentage}`,
    );

    if (feePercentage <= 0 || feePercentage > 1) {
      this.logger.error('Invalid fee percentage provided');
      throw new Error('Invalid fee percentage. It must be between 0 and 1.');
    }

    try {
      const success = await this.swapService.addSwapFee(
        chain,
        token,
        feePercentage,
      );

      if (success) {
        return { message: 'Swap fee added successfully' };
      } else {
        return { message: 'Swap fee already exists', statusCode: 400 };
      }
    } catch (error) {
      this.logger.error('Failed to add swap fee', error);
      throw error;
    }
  }

  // API to modify an existing swap fee configuration
  @Patch('modify-fee')
  @ApiOperation({
    summary: 'Modify the swap fee percentage for a specific chain and token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chain: { type: 'string', example: 'Ethereum' },
        token: { type: 'string', example: 'ETH' },
        fee_percentage: { type: 'number', example: 0.03 },
      },
      required: ['chain', 'token', 'fee_percentage'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Swap fee percentage updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Swap fee config not found' })
  async modifySwapFee(
    @Body('chain') chain: string,
    @Body('token') token: string,
    @Body('fee_percentage') feePercentage: number,
  ) {
    this.logger.log(
      `Received request to modify swap fee for ${chain} - ${token} to: ${feePercentage}`,
    );

    if (feePercentage <= 0 || feePercentage > 1) {
      this.logger.error('Invalid fee percentage provided');
      throw new Error('Invalid fee percentage. It must be between 0 and 1.');
    }

    try {
      const success = await this.swapService.modifySwapFee(
        chain,
        token,
        feePercentage,
      );

      if (success) {
        return { message: 'Swap fee percentage updated successfully' };
      } else {
        return { message: 'Swap fee config not found', statusCode: 404 };
      }
    } catch (error) {
      this.logger.error('Failed to modify swap fee', error);
      throw error;
    }
  }

  // API to get the current swap fee percentage for a specific chain and token
  @Get('get-fee')
  @ApiOperation({
    summary:
      'Get the current swap fee percentage for a specific chain and token',
  })
  @ApiQuery({
    name: 'chain',
    required: true,
    description: 'Blockchain name (e.g., Ethereum)',
  })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Token symbol (e.g., ETH)',
  })
  @ApiResponse({
    status: 200,
    description: 'Current swap fee percentage fetched successfully',
  })
  async getSwapFee(
    @Query('chain') chain: string,
    @Query('token') token: string,
  ) {
    this.logger.log(`Received request to get swap fee for ${chain} - ${token}`);

    try {
      const feePercentage = await this.swapService.getSwapFee(chain, token);

      if (feePercentage !== null) {
        return { chain, token, fee_percentage: feePercentage };
      } else {
        return { message: 'Swap fee config not found', statusCode: 404 };
      }
    } catch (error) {
      this.logger.error('Failed to fetch current swap fee percentage', error);
      throw error;
    }
  }

  // Endpoint to calculate the swap rate for ETH to BTC
  @Get('rate/eth-to-btc')
  @ApiOperation({ summary: 'Get ETH to BTC swap rate and fees' })
  @ApiQuery({
    name: 'eth_amount',
    type: 'number',
    description: 'Amount of ETH to be swapped to BTC',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the BTC amount and fees for the given ETH amount',
    schema: {
      type: 'object',
      properties: {
        btcAmount: { type: 'number', description: 'The BTC receivable amount' },
        feeInEth: { type: 'number', description: 'The fee in ETH' },
        feeInUsd: { type: 'number', description: 'The fee in USD' },
      },
    },
  })
  async getEthToBtcSwapRate(@Query('eth_amount') ethAmount: number) {
    this.logger.log(
      `Received request to get swap rate for ETH amount: ${ethAmount}`,
    );

    if (!ethAmount || ethAmount <= 0) {
      throw new Error('ETH amount must be greater than zero');
    }

    try {
      // Call the SwapService to calculate the ETH to BTC swap
      const swapResult =
        await this.swapService.calculateEthToBtcSwap(ethAmount);

      this.logger.log(
        `Successfully calculated swap for ETH amount: ${ethAmount}`,
      );
      return swapResult;
    } catch (error) {
      this.logger.error('Failed to get ETH to BTC swap rate', error);
      throw error;
    }
  }
}
