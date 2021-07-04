import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'
import Venue from 'App/Models/Venue'

export default class VenuesController {
    public async index({ response }: HttpContextContract) {
        let venues = await Venue.all()
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

        let venue = await Venue.query().preload('field')?.where('id', id).first()
        response.ok({ message: "success", data: venue })
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
