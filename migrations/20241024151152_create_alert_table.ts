import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('alert', (table) => {
    table.uuid('id').primary();
    table.string('chain').notNullable(); // Ethereum, Polygon
    table.decimal('target_price', 20, 8).notNullable(); // Target price in USD
    table.string('email').notNullable(); // Email address
    table.boolean('is_triggered').defaultTo(false); // Alert triggered status
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('alert');
}
