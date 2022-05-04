import { Client, createClient, SearchCallBack, SearchOptions } from 'ldapjs'

// Define client definition
export default class LdapClient {
  private client: Client
  private username: string
  private password: string
  public authenticated: boolean = false

  // Constructor: we need a URL, username, and password. 
  // The username can be a full LDAP string, but at my company 
  // we use a shorthand.
  // An example of a user string might be `cn=The User,ou=users,dc=example,dc=com`
  constructor(url: string | string[], username: string, password: string) {
    this.username = username
    this.password = password
    this.client = createClient({ url: url })
  }

  // Bind will throw a Promise rejection if the login to the LDAP server fails
  // The bind() function will change the 'authenticated' state of the class instance
  // if the login was successful, and that authenticated state can be retrieved
  // by the instantiating application
  async bind() {
    return new Promise((resolve, reject) => {
      this.client.bind(this.username, this.password, (err, res) => {
        if (err) {
          reject(false)
        }

        this.authenticated = true

        resolve(true)
      })
    })
  }

  // Search is a function to get any object in the LDAP directory
  async search(base: string, options: SearchOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.search(base, options, (err, response) => {
        let returnData = {
          entries: [],
          referrals: [],
          errors: [],
          exitCode: 1
        }

        if (err) {
          returnData.errors.push(err)
          return resolve(returnData)
        }

        response.on('searchEntry', entry => {
          returnData.entries.push(entry.object)
        })

        response.on('searchReference', referral => {
          returnData.referrals = returnData.referrals.concat(referral.uris)
        })

        response.on('error', error => {
          returnData.errors.push(error)
        })

        response.on('end', result => {
          return resolve(returnData)
        })
      })
    })
  }

  async logout() {
    await this.client.unbind();
  }
}