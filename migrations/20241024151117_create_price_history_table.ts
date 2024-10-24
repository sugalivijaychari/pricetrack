import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('price_history', (table) => {
    table.uuid('id').primary();
    table.string('chain').notNullable(); // Ethereum, Polygon
    table.decimal('price', 20, 8).notNullable(); // Price in USD
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('price_history');
}
