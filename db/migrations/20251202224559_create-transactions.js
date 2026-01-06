export async function up(knex) {
    await knex.schema.createTable('transactions', table => {
        table.string('id').primary();
        table.string('title').notNullable();
        table.decimal('amount', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
}
export async function down(knex) {
    await knex.schema.dropTable('transactions');
}
//# sourceMappingURL=20251202224559_create-transactions.js.map