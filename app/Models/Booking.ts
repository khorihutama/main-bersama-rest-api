import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Field from 'App/Models/Field'

/**
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      id: 
 *        type: integer
 *      name: 
 *        type: string
 *      email: 
 *        type: string
 *      password: 
 *        type: string
 *      role: 
 *        type: string
 *    required:
 *      - name
 *      - email
 *      - password
 */
export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public playDateStart: DateTime

  @column()
  public playDateEnd: DateTime

  @column()
  public userId: number

  @column()
  public fieldId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

  @belongsTo(() => Field)
  public fields: BelongsTo<typeof Field>
}
