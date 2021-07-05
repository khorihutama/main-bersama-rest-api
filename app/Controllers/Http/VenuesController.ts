import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'
import Venue from 'App/Models/Venue'
import Field from 'App/Models/Field'

export default class VenuesController {
    /**
     * 
     * @swagger 
     *  /api/v1/venues:
     *     get:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: Show Venue List
     *      responses:
     *          200:
     *              description: Success list venues
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Internal server error
     */
    public async index({ response }: HttpContextContract) {
        let venues = await Venue.query().preload('fields', (query) => {
            query.select('id', 'name', 'type')
        }).select('id', 'address', 'name', 'phone')
        response.ok({ message: "success", data: venues })
    }
    /**
     * 
     * @swagger 
     *  /api/v1/venues:
     *     post:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: Create new venue
     *      requestBody:
     *          required: true
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      $ref: '#definitions/Venue'
     *              application/json:
     *                  schema:
     *                      $ref: '#definitions/Venue'
     *      responses:
     *          201:
     *              description: Success create venue
     *          401:
     *              description: Unauthorized
     *          422:
     *              description: Bad Request
     *          500:
     *              description: Internal server error
     */
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

    /**
     * 
     * @swagger 
     *  /api/v1/venues/{id}:
     *     get:
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
     *      responses:
     *          200:
     *              description: Success list venues by id
     *          401:
     *              description: Unauthorized
     *          500:
     *              description: Internal server error
     */
    public async show({ params, response }: HttpContextContract) {
        let id = params.id

        let venue = await Field.query().preload('bookings', (query) => {
            query.select('id', 'user_id', 'play_date_start', 'play_date_end', 'field_id')
        })
            .join('venues', 'venues.id', 'fields.venue_id').where('fields.id', id).select('fields.*', 'venues.*').first()

        response.ok({ message: "success", status: true, data: venue })
    }

    /**
     * 
     * @swagger 
     *  /api/v1/venues/{id}:
     *     put:
     *      security: 
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: Update venue information
     *      parameters:
     *          - name: id
     *            in: path
     *            description: venue id
     *            required: true
     *            type: integer
     *      requestBody:
     *          required: false
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          name: 
     *                              type: string
     *                          address: 
     *                              type: string
     *                          phone: 
     *                              type: string
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          name: 
     *                              type: string
     *                          address: 
     *                              type: string
     *                          phone: 
     *                              type: string
     *      responses:
     *          200:
     *              description: Success update venue
     *          401:
     *              description: Unauthorized
     *          404:
     *              description: Venue Not Found
     *          422:
     *              description: Bad Request
     *          500:
     *              description: Internal server error
     */
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
