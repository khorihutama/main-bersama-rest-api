import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import User from 'App/Models/User'
import CreateBookingValidator from 'App/Validators/CreateBookingValidator'

export default class BookingsController {
    /**
     * 
     * @swagger 
     *  /api/v1/bookings:
     *     get:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Bookings
     *      summary: Show Booking List
     *      responses:
     *          200:
     *              description: Success
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Internal server error
     */
    public async index({ response }: HttpContextContract) {
        const booking = await Booking.query()
            .preload('fields', (query) => {
                query.select('id', 'name', 'type', 'venue_id')
            })
            .select('id', 'field_id', 'play_date_start', 'play_date_end', 'user_id')
        return response.ok({ message: "get data booking", data: booking })
    }

    /**
     * 
     * @swagger 
     *  /api/v1/venues/{id}/bookings:
     *     post:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: Show Venue List by Id
     *      parameters:
     *          - name: id
     *            in: path
     *            description: venue id
     *            required: true
     *            type: integer
     *      requestBody:
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          play_date_start:
     *                              type: string
     *                              format: date-time
     *                          play_date_end:
     *                              type: string
     *                              format: date-time
     *                      required: 
     *                          - play_date_start
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          play_date_start:
     *                              type: string
     *                              format: date-time
     *                          play_date_end:
     *                              type: string
     *                              format: date-time
     *                      required: 
     *                          - play_date_start
     *      responses:
     *          201:
     *              description: Success create booking
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Internal server error
     */
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

    /**
     * 
     * @swagger 
     *  /api/v1/bookings/{id}:
     *     get:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Bookings
     *      summary: Show List By Id Booking
     *      parameters:
     *          - name: id
     *            in: path
     *            description: venue id
     *            required: true
     *            type: integer
     *      responses:
     *          200:
     *              description: Success
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Internal server error
     */
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

    /**
     * 
     * @swagger 
     *  /api/v1/schedules:
     *     get:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Bookings
     *      summary: Show Schedule By User
     *      responses:
     *          200:
     *              description: Success
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Internal server error
     */
    public async schedules({ response, auth }: HttpContextContract) {
        let userId = auth.user?.id

        if (userId) {
            const schedule = await User.query().preload('bookings', query => {
                query.select('play_date_start', 'play_date_end', 'field_id')
                query.as('schedule')
            }).where('id', userId).select('id', 'name', 'email')
            return response.ok({ message: "get data booking", data: schedule })
        }
        return response.badRequest({ message: "error" })

    }

    /**
     * 
     * @swagger 
     *  /api/v1/bookings/{id}/join:
     *     put:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Bookings
     *      summary: Join Booking
     *      parameters:
     *          - name: id
     *            in: path
     *            description: venue id
     *            required: true
     *            type: integer
     *      responses:
     *          200:
     *              description: Success
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Internal server error
     */
    public async join({ params, response, auth }: HttpContextContract) {
        let id = params.id

        const authUser = auth.user
        await authUser?.related('bookings').sync([id])

        response.ok({ message: "successfully join", status: true })
    }

    /**
     * 
     * @swagger 
     *  /api/v1/bookings/{id}/unjoin:
     *     put:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Bookings
     *      summary: Unjoin Booking
     *      parameters:
     *          - name: id
     *            in: path
     *            description: venue id
     *            required: true
     *            type: integer
     *      responses:
     *          200:
     *              description: Success
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Internal server error
     */
    public async unjoin({ params, response, auth }: HttpContextContract) {
        let id = params.id

        const authUser = auth.user
        await authUser?.related('bookings').detach([id])

        response.ok({ message: "successfully unjoin", status: true })
    }
}
