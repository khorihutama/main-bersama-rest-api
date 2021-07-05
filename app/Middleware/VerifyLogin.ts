import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
export default class VerifyLogin {
  public async handle({ response, request }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let email = request.input('email')
    const user = await User.findBy('email', email)
    if (user?.isVerified) {
      await next()
    } else {
      return response.unauthorized({ message: 'belum verifikasi otp' })
    }
  }
}
