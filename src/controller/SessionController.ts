import { NextFunction, Request, Response } from "express"
import { Session } from "../entity/Session"
import { Server } from "../entity/Server"
import { getMongoRepository } from "typeorm"
import LdapClient from "../ldapClient"
import { v4 as uuid } from 'uuid'

export class SessionController {

  async retrieveAll(request: Request, response: Response, next: NextFunction) {
    if (request.query.sessionId) {
      let response = await request.locals.dataSource.getMongoRepository(Session).find({
        where: {
          sessionId: request.query.sessionId as string || ''
        }
      })

      if (response.length === 1) {
        return response[0]
      }

      return {}
    } else {
      return request.locals.dataSource.getMongoRepository(Session).find()
    }
  }

  async retrieve(request: Request, response: Response, next: NextFunction) {
    return request.locals.dataSource.getMongoRepository(Session).findOne(request.params.id)
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const username = request.body.username || ''
    const password = request.body.password || ''

    const servers = await request.locals.dataSource.getMongoRepository(Server).find()

    for (let server of servers) {
      let client = new LdapClient('ldap://' + server.host + ':' + server.port, server.domain + '\\' + username, password)
      
      try {
        await client.bind() 
      } catch (err) {
        continue
      }
      
      if (client.authenticated) {

        client.logout()
        
        return request.locals.dataSource.getMongoRepository(Session).save({
          app: request.body.app || 'LDAP',
          clientIpAddress: request.ip,
          referer: request.header('referer') || '',
          server: server.id,
          created: Date.now().toString(),
          failure: false,
          sessionId: uuid(),
          userAgent: request.header('user-agent'),
          username
        })
      }
    }

    response.status(400)

    return {
      error: 'Could not login'
    }
  }

  async logout(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await request.locals.dataSource.getMongoRepository(Session).findOne(request.params.id)
    await request.locals.dataSource.getMongoRepository(Session).remove(userToRemove)
  }
}