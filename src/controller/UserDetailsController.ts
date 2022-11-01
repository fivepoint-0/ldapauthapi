import { NextFunction, Request, Response } from "express"
import { Server } from "../entity/Server"
import LdapClient from "../ldapClient"
import { LdapParser } from "../ldapParser"
import { config } from 'dotenv'
import { User } from "../entity/User"

config()

export class UserDetailsController {
  // TypeORM's getRepository uses an Entity from ../entities to create a controller
  // based on a type.

  async one(request: Request, response: Response, next: NextFunction) {
    const username = request.params.username

    const servers: Array<Server> = await request.locals.dataSource.getMongoRepository(Server).find()

    const ldapBindUsername = process.env.LDAP_GENERIC_USERNAME
    const ldapBindPassword = process.env.LDAP_GENERIC_PASSWORD

    for (let server of servers) {
      let client = new LdapClient('ldap://' + server.host + ':' + server.port, server.domain + '\\' + ldapBindUsername, ldapBindPassword)
      
      try {
        await client.bind() 
      } catch (err) {
        continue
      }
      
      if (client.authenticated) {
        let results = await client.search(server.baseDN, {
            scope: 'sub',
            filter: `(sAMAccountName=${username})`
        })

        let user: User = {
            username: '',
            title: '',
            groupMemberships: [],
            department: '',
            office: '',
            telephoneNumber: '',
            name: '',
            country: ''
        }
        
        if (results.entries.length === 1) {
            let userEntry = results.entries[0]

            user = {
                username: username,
                title: userEntry.title,
                groupMemberships: userEntry.memberOf.map(LdapParser.parseMemberOfLine),
                department: userEntry.department,
                office: userEntry.l,
                telephoneNumber: userEntry.telephoneNumber,
                name: userEntry.name,
                country: userEntry.co
            }
        }
        
        client.logout()
        
        return user
      }
    }

    return {}
  }
}