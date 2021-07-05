import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Role {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let role = auth.user?.role
    if (role === "owner") {
      await next()

    } else {
      return response.forbidden({ message: 'Anda tidak dapat mengakses halaman ini' })
    }
  }
}
