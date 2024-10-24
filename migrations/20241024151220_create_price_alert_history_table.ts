import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('price_alert_history', (table) => {
    table.uuid('id').primary();
    table.string('chain').notNullable(); // Ethereum, Polygon
    table.decimal('previous_price', 20, 8).notNullable(); // Previous price in USD
    table.decimal('new_price', 20, 8).notNullable(); // New price in USD
    table.uuid('alert_id').references('id').inTable('alert').notNullable(); // Reference to Alert
    table.timestamp('triggered_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('price_alert_history');
}
