/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
}).as('home')


Route.group(() => {
  Route.group(() => {
    Route.resource('venues', 'VenuesController').apiOnly().middleware({ '*': ['auth', 'verify'], 'store': ['role'], 'update': ['role'], 'destroy': ['role'] })
    Route.resource('venues.fields', 'FieldsController').apiOnly().middleware({ '*': ['auth', 'verify'], 'store': ['role'], 'update': ['role'], 'destroy': ['role'] })
   
    // bookings
    Route.post('venues/:id/bookings', 'BookingsController.store').as('bookings.store').middleware(['auth', 'verify'])
    Route.get('bookings/:id', 'BookingsController.show').as('booking.show').middleware(['auth', 'verify'])
    Route.get('bookings', 'BookingsController.index').as('booking.index').middleware(['auth', 'verify'])
    Route.get('schedules', 'BookingsController.schedules').as('booking.schedules').middleware(['auth', 'verify'])
    Route.put('bookings/:id/join', 'BookingsController.join').as('booking.join').middleware(['auth', 'verify'])
    Route.put('bookings/:id/unjoin', 'BookingsController.unjoin').as('booking.unjoin').middleware(['auth', 'verify'])

    /// auth
    Route.post('/register', 'AuthController.register').as('auth.register')
    Route.post('/login', 'AuthController.login').as('auth.login').middleware(['verifyLogin'])

    Route.post('/otp-confirmation', 'AuthController.otpConfirmation').as('auth.otpConfirm')
  }).prefix('/v1')
}).prefix('/api')
