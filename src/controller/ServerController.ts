import { getRepository, ObjectID } from "typeorm"
import { NextFunction, Request, Response } from "express"
import { Server } from "../entity/Server"

export class LdapServerController {
  // TypeORM's getRepository uses an Entity from ../entities to create a controller
  // based on a type.

  async all(request: Request, response: Response, next: NextFunction) {
    return request.locals.dataSource.getMongoRepository(Server).find()
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return request.locals.dataSource.getMongoRepository(Server).findOne({where: {id: request.params.id as unknown as ObjectID}})
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return request.locals.dataSource.getMongoRepository(Server).save(request.body)
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let serverToRemove = await request.locals.dataSource.getRepository(Server).findOne({where: {id: request.params.id as unknown as ObjectID}})
    await request.locals.dataSource.getMongoRepository(Server).remove(serverToRemove)
  }
}