import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import CreateBookingValidator from 'App/Validators/CreateBookingValidator'

export default class BookingsController {
    public async index({ params, response, auth }: HttpContextContract) {
        let id = params.id
        const booking = await Field.query()
            .preload('venue', (query) => {
                query.select('name', 'address', 'phone')
            })
            .preload('bookings', (query) => {
                query.select('id', 'field_id', 'play_date_start', 'play_date_end', 'user_id')
            })
            .where('id', id).select('*').first()
        return response.ok({ message: "get data booking", data: booking })
    }

    public async store({ params, request, response, auth }: HttpContextContract) {
        try {
            let id = params.id
            await request.validate(CreateBookingValidator)
            const userId = auth.user?.id

            let payload = {
                playDateStart: request.input('play_date_start'),
                playDateEnd: request.input('play_date_end'),
                userId
            }
            const field = await Field.find(id)
            await field?.related('bookings').create(payload)

            response.created({ message: "booking success" })
        } catch (error) {
            response.badRequest({ error: error })
        }
    }

    public async show({ params, request, response, auth }: HttpContextContract) {
        let id = params.id

        let booking = await Booking.query()
            .withCount('users', (query) => {
                query.as('total_players')
            })
            .preload('users', (query) => {
                query.select('id', 'name', 'email')
                query.as('players')
            })
            .select('id', 'field_id', 'play_date_start', 'play_date_end', 'user_id').where('id', id).first()
        response.ok({ message: "success", data: booking })
    }

    public async join({ params, request, response, auth }: HttpContextContract) {
        let id = params.id

        const authUser = auth.user
        let booking = await authUser?.related('bookings').sync([authUser?.id])

        response.ok({ message: "join success" })
    }
}
