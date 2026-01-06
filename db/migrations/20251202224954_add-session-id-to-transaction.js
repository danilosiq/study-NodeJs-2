export async function up(knex) {
    await knex.schema.alterTable('transactions', table => {
        table.uuid('session_id').notNullable().after('id');
    });
}
export async function down(knex) {
    await knex.schema.alterTable('transactions', table => {
        table.dropColumn('session_id');
    });
}
//# sourceMappingURL=20251202224954_add-session-id-to-transaction.js.map