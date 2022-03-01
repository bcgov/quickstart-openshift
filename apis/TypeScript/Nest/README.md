To Run this in on local,
1. Please  run `docker-compose up` command.
2. login to KC admin console http://localhost:8191/auth/
3. click on admin console
4. sign-in with admin/admin
5. go to clients menu in left side-bar
6. click on create new client and then import, select the kc-local-client.json file present in this folder.
7. run the nest application by `npm run start:dev:windows`
8. It will run typeorm migrations and then start the application on port 8000.
9. you can now access the swagger ui at http://localhost:8000/
