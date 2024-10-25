import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('alert', (table) => {
    // Remove the `isTriggered` field
    table.dropColumn('is_triggered');

    // Add the `isSubscribed` field to indicate if the alert is active
    table.boolean('is_subscribed').defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('alert', (table) => {
    // Rollback the changes by re-adding the `isTriggered` field
    table.boolean('is_triggered').defaultTo(false);

    // Remove the `isSubscribed` field
    table.dropColumn('is_subscribed');
  });
}
