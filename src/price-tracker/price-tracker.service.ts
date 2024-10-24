import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoralisService } from '../moralis/moralis.service';
import { PriceService } from '../price/price.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PriceTrackerService {
  private readonly logger = new Logger(PriceTrackerService.name);

  constructor(
    private readonly moralisService: MoralisService,
    private readonly priceService: PriceService,
    private readonly mailService: MailService,
  ) {}

  // Schedule task to run every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchPrices() {
    try {
      const ethPrice = await this.moralisService.getEthereumPrice();
      const maticPrice = await this.moralisService.getPolygonPrice();

      await this.priceService.addPrice('Ethereum', ethPrice);
      await this.priceService.addPrice('Polygon', maticPrice);

      this.logger.log(`ETH Price: ${ethPrice}, MATIC Price: ${maticPrice}`);
    } catch (error) {
      this.logger.error('Failed to fetch prices:', error);
    }
  }

  // Schedule task to check price increase every hour
  @Cron(CronExpression.EVERY_HOUR)
  async checkPriceIncrease() {
    const chains = ['Ethereum', 'Polygon']; // Chains to monitor

    for (const chain of chains) {
      try {
        this.logger.log(`Checking price increase for ${chain}`);

        // Get the current price and the price from an hour ago
        const currentPrice = await this.priceService.getLatestPrice(chain);
        this.logger.log(`Current price for ${chain}: ${currentPrice}`);

        const oneHourAgoPrice =
          await this.priceService.getPriceOneHourAgo(chain);
        this.logger.log(`Price for ${chain} one hour ago: ${oneHourAgoPrice}`);

        if (!currentPrice || !oneHourAgoPrice) {
          this.logger.warn(`Price data unavailable for ${chain}`);
          continue;
        }

        // Calculate the percentage increase
        const percentageIncrease =
          ((currentPrice - oneHourAgoPrice) / oneHourAgoPrice) * 100;
        this.logger.log(
          `Percentage increase for ${chain}: ${percentageIncrease}%`,
        );

        // Send email if the increase is more than 3%
        if (percentageIncrease > 3) {
          this.logger.log(
            `Price increase for ${chain} is more than 3%, sending alert email`,
          );
          await this.mailService.sendPriceAlertEmail(
            chain,
            oneHourAgoPrice,
            currentPrice,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to check price increase for ${chain}:`,
          error,
        );
      }
    }
  }
}
