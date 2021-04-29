# KEYCOAK SETUP/CONFIGURATION

1. Stop the Keycloak container and remove it.
&nbsp;

2. In MYSQL run the `DB_setup/MySQL_Keycloak_DB_Setup_Script.sql`.
&nbsp;

3. Start the Keycloak container.
&nbsp;

4. To check that it's working open <http://localhost:8080>.
&nbsp;

5. Click on Admin Console <http://localhost:8080/auth/admin/>. The user and password are `admin`.
&nbsp;

6. Create a `realm_PetStore` realm.

    Keycloak ref <https://www.keycloak.org/docs/latest/server_admin/index.html#_create-realm>.

    On the left click on the drop down to the right of the `Master` realm and select `Add Realm`.
&nbsp;

7. Create realm roles: `admin_role`, `read_role`, `write_role`

     * `admin_role`
     * `read_role`
     * `write_role`
&nbsp;
    Keycloak ref: <https://www.keycloak.org/docs/latest/server_admin/index.html#realm-roles>

     * Note: Each client can has their own "client roles", scoped only to the client. Keycloak ref: <https://www.keycloak.org/docs/latest/server_admin/index.html#client-roles>
&nbsp;

8. Create users (don't forget to disable `Temporary` password)

    Keycloak ref: <https://www.keycloak.org/docs/latest/server_admin/index.html#_create-new-user>
    * login: `admin_user`, password: `admin_user`
    * login: `read_user`, password: `read_user`
    * login: `write_user`, password: `write_user`
&nbsp;

9. Add roles to users:

    Keycloak ref: <https://www.keycloak.org/docs/latest/server_admin/index.html#user-role-mappings>
    * user: `admin_user` , role: `admin`
    * user: `read_user` , role: `read_role`
    * user: `write_user` , role: `read_role`
&nbsp;

10. Create a `PetStore_CLIENT`

    Keycloak ref: <https://www.keycloak.org/docs/latest/server_admin/index.html#oidc-clients>
&nbsp;
      * Client ID:  `PetStore_CLIENT`
      * Name: ``
      * Description: ``
      * Enabled: `ON`
      * Always Display in Console: `OFF`
      * Consent Required: `OFF`
      * Login Theme : ``
      * Client Protocol: `openid-connect`
      * Access Type:  **`Confidential`**
      * Standard Flow Enabled: `ON`
      * Implicit Flow Enabled: `OFF`
      * Direct Access Grants Enabled: `ON`   - **Important**: it should be `ON` for the custom login (to provide login/password via an application login page)
      * Service Accounts Enabled: **`ON`**
      * Authorization Enabled: **`ON`**  -  **Important**: to add polices
      * Root URL : ``
      * Valid Redirect URIs: **`http://localhost:10010/*`**. Keycloak will use this value to check redirect URL at least for logout. It can be just a wildcard `*`.
      * Base URL : ``
      * Admin URL : ``
      * Web Origins: **`*`**
      * Backchannel Logout URL: ``
      * Backchannel Logout Session Required: `ON`
      * Backchannel Logout Revoke Offline Sessions: `OFF`
&nbsp;

11. Using `Clients -> PetStore_CLIENT -> Roles` create the following client roles:

    * `admin_client_role`
    * `read_client_role`
    * `write_client_role`
&nbsp;
    Keycloak ref: <https://www.keycloak.org/docs/latest/server_admin/index.html#client-roles>
&nbsp;

12. Using `Clients -> PetStore_CLIENT -> Authorization -> Policies` add role based polices.

    Keycloak ref: <https://www.keycloak.org/docs/latest/authorization_services/index.html#_policy_rbac>
&nbsp;
    | Policy                         | Role                |
    |--------------------------------|---------------------|
    | Admin_Policy                   | admin_role          |
    | Read_Policy                    | read_role           |
    | Write_Policy                   | write_role          |
    | SuperUser_Policy               | Aggregated Policy*  |  

    Aggregated Policy*
    This policy consist of an aggregation of other polices:
        * `Admin_Policy`, `Read_Policy`, `Write_Policy`
&nbsp;

13. Using `Clients -> PetStore_CLIENT -> Mappers ->` add scopes

    Keycloak ref: <https://www.keycloak.org/docs/latest/server_admin/index.html#oidc-clients>
&nbsp;
      * Name:  **`ClientMapper`**
      * Mapper Type: **`Audience`**
      * Included Client Audience: **`PetStore_CLIENT`**
      * Included Custom Audience: ``
      * Add to ID token: `OFF`
      * Add to access token: `ON`

14. Using `Clients -> PetStore_CLIENT -> Authorization -> "Authorization Scopes"` add scopes

    * petstore:read
    * petstore:write
    * petstore:admin
&nbsp;

15. Using `Clients -> PetStore_CLIENT -> Authorization -> Resources` add resourcess. Scopes should be entered in the `Scopes` field for every resource.
&nbsp;

    | Resource Name | Scopes         |
    |---------------|----------------|
    | res:read      | petstore:read  |
    | res:write     | petstore:write |
    | res:admin     | petstore:admin |

16. Using `Clients -> PetStore_CLIENT -> Authorization -> Permissions` add scope-based permissions.

    Keycloak ref: <https://www.keycloak.org/docs/latest/authorization_services/index.html#_permission_create_scope>

    Set *decision strategy* for every permission

    * Decision Strategy: `Affirmative`
&nbsp;
    | Permission      | Resource   | Scope          | Polices           |
    |-----------------|------------|----------------|-------------------|
    | petstore-read   | res:read   | petstore:read  | Read_Policy       |
    | petstore-write  | res:write  | petstore:read  | Write_Policy      |
    | petstore-admin  | res:admin  | petstore:admin | SuperUser_Policy  |
&nbsp;

17. Using `Clients -> PetStore_CLIENT -> Authorization -> Installation` download `keycloak.json` by selecting `Keycloak OIDC JSON` drop down option.
  
    Keycloak ref: <https://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter>
&nbsp;
