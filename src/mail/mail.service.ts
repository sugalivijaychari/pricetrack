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

  async sendPriceAlertEmail(
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
}
