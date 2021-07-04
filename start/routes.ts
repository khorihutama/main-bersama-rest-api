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
    Route.resource('venues', 'VenuesController').apiOnly().middleware({ '*': ['auth'] })
    Route.resource('venues.fields', 'FieldsController').apiOnly().middleware({ '*': ['auth'] })
    Route.post('fields/:id/bookings', 'BookingsController.store').as('bookings.store').middleware(['auth'])
    Route.get('fields/:id', 'BookingsController.index').as('booking.index').middleware(['auth'])
    Route.get('bookings/:id', 'BookingsController.show').as('booking.show').middleware(['auth'])
    Route.post('bookings/:id', 'BookingsController.join').as('booking.join').middleware(['auth'])

    Route.post('/register', 'AuthController.register').as('auth.register')
    Route.post('/login', 'AuthController.login').as('auth.login')

    Route.post('/verifikasi-otp', 'AuthController.otpVerification').as('auth.otpVerify')
  }).prefix('/v1')
}).prefix('/api')
