// src/alert/alert.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async createAlert(chain: string, targetPrice: number, email: string) {
    try {
      await this.knex('alert').insert({
        id: this.knex.raw('gen_random_uuid()'), // Generate UUID
        chain,
        target_price: targetPrice,
        email,
        is_subscribed: true, // Default to subscribed
      });
      this.logger.log(
        `Alert created for ${chain} at $${targetPrice} for ${email}`,
      );
    } catch (error) {
      this.logger.error('Failed to create alert', error);
      throw error;
    }
  }

  async getActiveAlerts(chain: string) {
    try {
      return await this.knex('alert')
        .where('chain', chain)
        .andWhere('is_subscribed', true); // Check if the alert is subscribed
    } catch (error) {
      this.logger.error('Failed to fetch active alerts', error);
      throw error;
    }
  }

  async unsubscribeAlert(alertId: string) {
    try {
      const result = await this.knex('alert')
        .where('id', alertId)
        .update({ is_subscribed: false });

      if (result) {
        this.logger.log(`Alert with ID ${alertId} has been unsubscribed`);
      } else {
        this.logger.warn(`Alert with ID ${alertId} not found`);
      }

      return result > 0;
    } catch (error) {
      this.logger.error('Failed to unsubscribe alert', error);
      throw error;
    }
  }

  async getAlertsByEmail(email: string) {
    try {
      return await this.knex('alert').where('email', email).select('*');
    } catch (error) {
      this.logger.error('Failed to fetch alerts by email', error);
      throw error;
    }
  }

  // Method to log a triggered alert into the price_alert_history table
  async logPriceAlertHistory(
    chain: string,
    previousPrice: number,
    newPrice: number,
    alertId: string,
  ) {
    try {
      await this.knex('price_alert_history').insert({
        id: this.knex.raw('gen_random_uuid()'), // Generate UUID
        chain,
        previous_price: previousPrice,
        new_price: newPrice,
        alert_id: alertId,
        triggered_at: this.knex.fn.now(),
      });
      this.logger.log(`Logged price alert history for alert ID: ${alertId}`);
    } catch (error) {
      this.logger.error('Failed to log price alert history', error);
      throw error;
    }
  }

  // Method to modify the target price of an alert by ID and email
  async modifyAlertPrice(alertId: string, newPrice: number, email: string) {
    try {
      const result = await this.knex('alert')
        .where('id', alertId)
        .andWhere('email', email)
        .update({ target_price: newPrice });

      if (result) {
        this.logger.log(
          `Alert with ID ${alertId} has been updated to new price: ${newPrice} for email: ${email}`,
        );
      } else {
        this.logger.warn(
          `Alert with ID ${alertId} not found or does not belong to email: ${email}`,
        );
      }

      return result > 0;
    } catch (error) {
      this.logger.error('Failed to modify alert price', error);
      throw error;
    }
  }

  async resubscribeAlert(alertId: string, email: string) {
    try {
      const result = await this.knex('alert')
        .where('id', alertId)
        .andWhere('email', email)
        .update({ is_subscribed: true });

      if (result) {
        this.logger.log(
          `Alert with ID ${alertId} has been re-subscribed for email: ${email}`,
        );
      } else {
        this.logger.warn(
          `Alert with ID ${alertId} not found for email: ${email}`,
        );
      }

      return result > 0;
    } catch (error) {
      this.logger.error('Failed to re-subscribe alert', error);
      throw error;
    }
  }
}
