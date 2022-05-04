import { getRepository } from "typeorm"
import { NextFunction, Request, Response } from "express"
import { Server } from "../entity/Server"

export class LdapServerController {
  // TypeORM's getRepository uses an Entity from ../entities to create a controller
  // based on a type.

  async all(request: Request, response: Response, next: NextFunction) {
    return request.locals.dataSource.getRepository(Server).find()
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return request.locals.dataSource.getRepository(Server).findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return request.locals.dataSource.getRepository(Server).save(request.body)
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let serverToRemove = await request.locals.dataSource.getRepository(Server).findOne(request.params.id)
    await request.locals.dataSource.getRepository(Server).remove(serverToRemove)
  }
}