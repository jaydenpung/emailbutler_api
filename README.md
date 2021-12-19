# emailbutler_api  
[![Deploy master branch](https://github.com/jaydenpung/emailbutler_api/actions/workflows/deploy.yml/badge.svg)](https://github.com/jaydenpung/emailbutler_api/actions/workflows/deploy.yml)  
Api repository for emailbutler api. Steps below are for references only.

## Setup
- Rename **.env.tmp** in root folder to **.env**

## Notes
### Getting auth0 token with permissions:
Note that machine-to-machine application does not contain permissions. To obtain token with permissions, follow these steps:
1. Call the v1/login api.
2. Copy the url from the result and open it in browser.
3. Sign in when prompted, and you will be redirect to https://token:YOUR_TOKEN_HERE_WITH_OTHER_PARAMS, extract your token.
4. Access [auth0 dashboard](https://manage.auth0.com/) and assign roles/permissions to the user.
5. You can now use this token:
```
header 'Authorization: Bearer TOKEN_VALUE'
```

## References

Scaffolding and mongodb guide:  
https://dev.to/carlomigueldy/building-a-restful-api-with-nestjs-and-mongodb-mongoose-2165

Auth0 Guide:  
https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authorization/

Nestjs openapi Guide:  
https://docs.nestjs.com/openapi/introduction
