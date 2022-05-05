import LdapClient from '../ldapClient'
export interface IGroupSearcher {
    getUsersGroups(client: LdapClient, username: string): Promise<string[]>
}