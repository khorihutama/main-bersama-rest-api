import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.enu('type', ['soccer', 'minisoccer', 'futsal', 'basketball', 'volleyball']).alter()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.enu('type', ['futsal', 'mini soccer', 'basketball']).alter()

    })
  }
}
