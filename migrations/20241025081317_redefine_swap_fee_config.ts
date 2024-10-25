import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('swap_fee_config'); // Drop the existing table if it exists

  // Create a new `swap_fee_config` table with columns for chain, token, and fee
  await knex.schema.createTable('swap_fee_config', (table) => {
    table.uuid('id').primary(); // Primary key
    table.string('chain').notNullable(); // Blockchain name (e.g., Ethereum, Polygon)
    table.string('token').notNullable(); // Token symbol (e.g., ETH, MATIC)
    table.decimal('fee_percentage', 5, 4).notNullable(); // Fee percentage with 4 decimal precision (e.g., 0.0250 for 2.5%)
    table.unique(['chain', 'token']); // Ensure unique configuration per chain and token
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('swap_fee_config');
}
