import { NextFunction, Request, Response } from "express"
import { Session } from "../entity/Session"
import { Server } from "../entity/Server"
import LdapClient from "../ldapClient"
import { v4 as uuid } from 'uuid'
import { ObjectID } from "typeorm"
import { GroupSearcher } from "../groupSearcher"
import { group } from "console"

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
    return request.locals.dataSource.getMongoRepository(Session).findOne({where: {id: request.params.id as unknown as ObjectID}})
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const username = request.body.username || ''
    const password = request.body.password || ''

    if (!username || !password) {
      return {
        error: 'Could not login'
      }
    }

    console.log('Attempting login for username:', username)
    const servers = await request.locals.dataSource.getMongoRepository(Server).find()

    for (let server of servers) {
      let client = new LdapClient('ldap://' + server.host + ':' + server.port, server.domain ? server.domain + '\\' + username : `cn=${username}${username === 'admin' ? '' : ',ou=users'},${server.baseDN}`, password)
      
      try {
        await client.bind() 
      } catch (err) {
        continue
      }
      
      console.log('Client authenticated:',client.authenticated)

      const groupSearcher = new GroupSearcher()

      const groups = await groupSearcher.getUsersGroups(client, username)

      console.log('LDAP Groups:', JSON.stringify(groups, null, 2))
      if (client.authenticated) {

        client.logout()
        
        return request.locals.dataSource.getMongoRepository(Session).save({
          app: request.body.app || 'LDAP',
          clientIpAddress: request.ip,
          referer: request.header('referer') || '',
          server: server.id as unknown as string,
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
    let userToRemove = await request.locals.dataSource.getMongoRepository(Session).findOne({where: {id: request.params.id as unknown as ObjectID}})
    await request.locals.dataSource.getMongoRepository(Session).remove(userToRemove)
  }
}