import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Query,
  Param,
  Logger,
  Put,
  Patch,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Alerts')
@Controller('alert')
export class AlertController {
  private readonly logger = new Logger(AlertController.name);

  constructor(private readonly alertService: AlertService) {}

  @Post('set')
  @ApiOperation({ summary: 'Set a new price alert' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chain: { type: 'string', example: 'Ethereum' },
        target_price: { type: 'number', example: 1000 },
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['chain', 'target_price', 'email'],
    },
  })
  @ApiResponse({ status: 201, description: 'Alert created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async setAlert(
    @Body('chain') chain: string,
    @Body('target_price') targetPrice: number,
    @Body('email') email: string,
  ) {
    this.logger.log('Received request to set an alert');

    try {
      await this.alertService.createAlert(chain, targetPrice, email);
      return { message: 'Alert created successfully' };
    } catch (error) {
      this.logger.error('Failed to set alert', error);
      throw error;
    }
  }

  @Patch('unsubscribe/:alertId')
  @ApiOperation({ summary: 'Unsubscribe from an alert' })
  @ApiResponse({ status: 200, description: 'Alert unsubscribed successfully' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async unsubscribeAlert(@Param('alertId') alertId: string) {
    this.logger.log(
      `Received request to unsubscribe alert with ID: ${alertId}`,
    );

    try {
      const success = await this.alertService.unsubscribeAlert(alertId);

      if (success) {
        return { message: 'Alert unsubscribed successfully' };
      } else {
        return { message: 'Alert not found', statusCode: 404 };
      }
    } catch (error) {
      this.logger.error('Failed to unsubscribe from alert', error);
      throw error;
    }
  }

  @Get('by-email')
  @ApiOperation({ summary: 'Get all alerts for a specific email' })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'User email to fetch alerts for',
  })
  @ApiResponse({ status: 200, description: 'Alerts fetched successfully' })
  async getAlertsByEmail(@Query('email') email: string) {
    this.logger.log(`Received request to get alerts for email: ${email}`);

    try {
      const alerts = await this.alertService.getAlertsByEmail(email);
      return alerts;
    } catch (error) {
      this.logger.error('Failed to get alerts by email', error);
      throw error;
    }
  }

  @Patch('modify-price/:alertId')
  @ApiOperation({ summary: 'Modify the target price of an existing alert' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        target_price: { type: 'number', example: 1200 },
      },
      required: ['email', 'target_price'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Alert target price updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Alert not found or does not belong to the provided email',
  })
  async modifyAlertPrice(
    @Param('alertId') alertId: string,
    @Body('target_price') newPrice: number,
    @Body('email') email: string,
  ) {
    this.logger.log(
      `Received request to modify target price for alert ID: ${alertId} with email: ${email}`,
    );

    try {
      const success = await this.alertService.modifyAlertPrice(
        alertId,
        newPrice,
        email,
      );

      if (success) {
        return { message: 'Alert target price updated successfully' };
      } else {
        return {
          message: 'Alert not found or does not belong to the provided email',
          statusCode: 404,
        };
      }
    } catch (error) {
      this.logger.error('Failed to modify alert price', error);
      throw error;
    }
  }

  @Patch('resubscribe/:alertId')
  @ApiOperation({ summary: 'Re-subscribe to an unsubscribed alert' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 200, description: 'Alert re-subscribed successfully' })
  @ApiResponse({
    status: 404,
    description: 'Alert not found or does not belong to the provided email',
  })
  async resubscribeAlert(
    @Param('alertId') alertId: string,
    @Body('email') email: string,
  ) {
    this.logger.log(
      `Received request to re-subscribe alert with ID: ${alertId} for email: ${email}`,
    );

    try {
      const success = await this.alertService.resubscribeAlert(alertId, email);

      if (success) {
        return { message: 'Alert re-subscribed successfully' };
      } else {
        return {
          message: 'Alert not found or does not belong to the provided email',
          statusCode: 404,
        };
      }
    } catch (error) {
      this.logger.error('Failed to re-subscribe alert', error);
      throw error;
    }
  }
}
