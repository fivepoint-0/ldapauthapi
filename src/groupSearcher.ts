import { EqualityFilter } from "ldapjs";
import LdapClient from "./ldapClient";
import { IGroupSearcher } from "./types/IGroupSearcher";

export class GroupSearcher implements IGroupSearcher {
    
    async getUsersGroups(client: LdapClient, username: string): Promise<string[]> {
        return await client.search('ou=users,dc=example,dc=org', {
            filter: '(objectClass=groupOfNames)',
            attributes: ['objectClass'],
            scope: 'sub',
            derefAliases: 3
        })
    }

}