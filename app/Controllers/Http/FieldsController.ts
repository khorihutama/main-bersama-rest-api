import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateFieldValidator from 'App/Validators/CreateFieldValidator'
import Field from 'App/Models/Field'
import Venue from 'App/Models/Venue'
export default class FieldsController {
  public async index({ response }: HttpContextContract) {
    let field = await Field.all()
    response.ok({ message: "success", data: field })
  }

  public async store({ params, request, response }: HttpContextContract) {
    try {
      let venue_id = params.venue_id
      let data = await request.validate(CreateFieldValidator)
      const venue = await Venue.find(venue_id)
      await venue?.related('fields').create(data)
      return response.created({ message: "new field created", data })
    } catch (error) {
      response.badRequest({ error: error.messages })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    let { venue_id, id } = params
    let field = await Field.query()
      .where('id', id)
      .where('venue_id', venue_id)
      .firstOrFail()

    response.ok({ message: "success", data: field })
  }

  public async update({ params, request, response }: HttpContextContract) {
    let { venue_id, id } = params

    let field = await Field.query()
      .where('id', id)
      .where('venue_id', venue_id)
      .firstOrFail()

    await field.merge({
      name: request.input('name'),
      type: request.input('type'),
      venueId: venue_id
    }).save()

    response.ok({ message: "updated", data: field })
  }

  public async destroy({ params, response }: HttpContextContract) {
    let { venue_id, id } = params
    let field = await Field.query()
      .where('id', id)
      .where('venue_id', venue_id)
      .firstOrFail()

    await field.delete()
    response.ok({ message: "deleted" })
  }
}
