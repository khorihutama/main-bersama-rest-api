import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'
import Venue from 'App/Models/Venue'
import Field from 'App/Models/Field'

export default class VenuesController {
 
    public async index({ response }: HttpContextContract) {
        let venues = await Venue.query().preload('fields', (query) => {
            query.select('id', 'name', 'type')
        }).select('id', 'address', 'name', 'phone')
        response.ok({ message: "success", data: venues })
    }
    
    public async store({ request, response, auth }: HttpContextContract) {
        try {
            const data = await request.validate(CreateVenueValidator)
            const venue = new Venue()
            venue.name = data.name
            venue.address = data.address
            venue.phone = data.phone

            const authUser = auth.user

            await authUser?.related('venues').save(venue)

            response.created({ message: "created", data: venue })
        } catch (error) {
            response.badRequest({ error: error.messages })
        }
    }

 
    public async show({ params, response }: HttpContextContract) {
        let id = params.id

        let venue = await Field.query().preload('bookings', (query) => {
            query.select('id', 'user_id', 'play_date_start', 'play_date_end', 'field_id')
        })
            .join('venues', 'venues.id', 'fields.venue_id').where('fields.id', id).select('fields.*', 'venues.*').first()

        response.ok({ message: "success", status: true, data: venue })
    }

 
    public async update({ params, request, response }: HttpContextContract) {
        let id = params.id

        let venue = await Venue.findOrFail(id)
        await venue.merge({
            name: request.input('name'),
            address: request.input('address'),
            phone: request.input('phone'),
        }).save()

        response.ok({ message: "updated", data: venue })
    }

    public async destroy({ params, response }: HttpContextContract) {
        let id = params.id

        let venue = await Venue.findOrFail(id)
        venue.delete()

        response.ok({ message: "deleted" })
    }
}
