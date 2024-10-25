import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('alert', (table) => {
    table.uuid('id').primary();
    table.string('chain').notNullable(); // Chain (e.g., Ethereum, Polygon)
    table.decimal('target_price', 20, 8).notNullable(); // Target price in USD
    table.string('email').notNullable(); // Email to send the alert
    table.boolean('is_triggered').defaultTo(false); // Whether the alert has been triggered
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('alert');
}
