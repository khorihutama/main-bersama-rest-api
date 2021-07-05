import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import CreateBookingValidator from 'App/Validators/CreateBookingValidator'

export default class BookingsController {
    public async index({ response }: HttpContextContract) {
        const booking = await Booking.query()
            .preload('fields', (query) => {
                query.select('id', 'name', 'type', 'venue_id')
            })
            .select('id', 'field_id', 'play_date_start', 'play_date_end', 'user_id')
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
            const field = await Field.findOrFail(id)
            await field?.related('bookings').create(payload)

            response.created({ message: "booking success" })
        } catch (error) {
            if (error.messages !== null) {
                response.badRequest({ error: error.message })
            } else {
                response.badRequest({ error: error.messages })
            }
        }
    }

    public async show({ params, response }: HttpContextContract) {
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

    public async schedules({ response, auth }: HttpContextContract) {
        let userId = auth.user?.id

        if (userId) {
            const booking = await Booking.query()
                .preload('fields', (query) => {
                    query.select('id', 'name', 'type', 'venue_id')
                })
                .where('user_id', userId)
                .select('id', 'field_id', 'play_date_start', 'play_date_end', 'user_id')
            return response.ok({ message: "get data booking", data: booking })
        }
        return response.badRequest({ message: "error" })

    }

    public async join({ params, response, auth }: HttpContextContract) {
        let id = params.id

        const authUser = auth.user
        await authUser?.related('bookings').sync([id])

        response.ok({ message: "successfully join", status: true })
    }

    public async unjoin({ params, response, auth }: HttpContextContract) {
        let id = params.id

        const authUser = auth.user
        await authUser?.related('bookings').detach([id])

        response.ok({ message: "successfully unjoin", status: true })
    }
}
