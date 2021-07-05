import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Field from 'App/Models/Field'
import User from 'App/Models/User'

/**
 * @swagger
 * definitions:
 *  Venue:
 *    type: object
 *    properties:
 *      id: 
 *        type: integer
 *      name: 
 *        type: string
 *      address: 
 *        type: string
 *      phone: 
 *        type: string
 *      userId: 
 *        type: string
 *    required:
 *      - name
 *      - address
 *      - phone
 */
export default class Venue extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public phone: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Field)
  public fields: HasMany<typeof Field>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
