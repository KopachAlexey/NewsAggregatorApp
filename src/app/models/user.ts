export interface User {
  id : string;
  login : string;
  email : string;
  roleId : number;
  roleName? : string;
  newsMinRate : number;
}
