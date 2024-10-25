import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPriceIncreaseAlertEmail(
    chain: string,
    oldPrice: number,
    newPrice: number,
  ): Promise<void> {
    const priceIncrease = (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2);
    const senderEmail = this.configService.get<string>('EMAIL_RECEIVER');

    // No try-catch here to allow errors to propagate
    await this.mailerService.sendMail({
      to: senderEmail,
      subject: `Price Alert: ${chain} increased by more than 3%`,
      text: `The price of ${chain} increased from $${oldPrice} to $${newPrice}, a ${priceIncrease}% increase.`,
    });

    this.logger.log(`Alert email sent for ${chain} price increase.`);
  }

  async sendPriceAlertEmail(
    chain: string,
    targetPrice: number,
    currentPrice: number,
    email: string,
  ): Promise<void> {
    const subject = `Price Alert: ${chain} has reached your target of $${targetPrice}`;
    const text = `Dear User,\n\nThe price of ${chain} has reached your target price of $${targetPrice}.\n\nCurrent Price: $${currentPrice}\n\nThis is a notification based on your alert settings.\n\nThank you,\nBlockchain Price Tracker`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        text: text,
      });
      this.logger.log(
        `Alert email sent to ${email} for ${chain} price target.`,
      );
    } catch (error) {
      this.logger.error('Failed to send price alert email:', error);
      throw error;
    }
  }
}
