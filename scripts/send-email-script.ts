import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create a Nest application context
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the MailService and ConfigService from the context
  const mailService = app.get(MailService);
  const configService = app.get(ConfigService);

  // Fetch the EMAIL_RECEIVER from the environment variables
  const receiverEmail =
    configService.get<string>('EMAIL_RECEIVER') || 'vijaysugali98@gmail.com';

  try {
    // Send the email manually
    await mailService.sendPriceIncreaseAlertEmail('Ethereum', 2500, 2850);
    console.log(`Email successfully sent to ${receiverEmail}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }

  // Close the application context
  await app.close();
}

bootstrap();

// Execute this script using npx ts-node scripts/send-email-script.ts

