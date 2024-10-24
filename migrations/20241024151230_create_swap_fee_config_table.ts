import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('swap_fee_config', (table) => {
    table.uuid('id').primary();
    table.decimal('fee_percentage', 5, 3).notNullable().defaultTo(0.03); // Default 3% fee
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('swap_fee_config');
}
