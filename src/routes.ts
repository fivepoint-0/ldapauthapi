import { LdapServerController } from "./controller/ServerController"
import { SessionController } from "./controller/SessionController"
import { UserDetailsController } from "./controller/UserDetailsController"

// Each of the routes in this array of routes has information used to 
// register an API endpoint in the ./index.ts file.
export const Routes = [{
  method: "get",
  route: "/sessions",
  controller: SessionController,
  action: "retrieveAll"
}, {
  method: "get",
  route: "/sessions/:id",
  controller: SessionController,
  action: "retrieve"
}, {
  method: "post",
  route: "/sessions",
  controller: SessionController,
  action: "login"
}, {
  method: "delete",
  route: "/sessions/:id",
  controller: SessionController,
  action: "logout"
},
{
  method: "get",
  route: "/servers",
  controller: LdapServerController,
  action: "all"
},
{
  method: "post",
  route: "/servers",
  controller: LdapServerController,
  action: "save"
},
{
  method: "get",
  route: "/getUserDetails/:username",
  controller: UserDetailsController,
  action: "one"
}]