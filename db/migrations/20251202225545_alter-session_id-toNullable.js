export async function up(knex) {
    await knex.schema.alterTable('transactions', table => {
        table.uuid('session_id').after('id').alter();
    });
}
export async function down(knex) {
    await knex.schema.alterTable('transactions', table => {
        table.uuid('session_id').notNullable().after('id').alter();
    });
}
//# sourceMappingURL=20251202225545_alter-session_id-toNullable.js.map