# Knol Contacts App #
Fetch and display user's google contacts

## Usage ##

1. To login browse at :
    http://localhost:8811/knol/login

2. After logging in, user will be redirected to google consent page
    if user approves the consent, we will redirect the user to contact details page.

3. User can logout after viewing contact details

4. NO deletion operation possible

5. Site makes use of cookies

## Setup ##

1. change the values of following keys in the config.{environment}.json with your values.

*   "apiKey": "",
*   "clientId": "",
*   "client_secret": "",
*   "redirectUrl": "http://localhost:5611/knol/redirect",

also whitelist the URLs for your project at the https://console.developers.google.com/

* config.development.json -- for local use
* config.production.json -- for deployment on server (in .gitignore)
* config.staging.json -- for docker


## For Docker Setup ##

1. change the redirectUrl in config.staging.json to system IP (where service is deployed), otherwise let it be same(if testing locally)
i.e     "redirectUrl": "http://{SYSTEM_IP}:8811/knol/redirect",

Also, Need to whitelist this IP in the console.developers.google.com

2. execute 'docker-compose up' from root directory.

3. Create the DB and tables after by using the sql file at location Contacts\scripts\Create.sql

command for creating DB and table by using the above file:
    'mysql -u <username> -p <DBName> < Create.sql'

3. PHPMyAdmin page is at : localhsot:9079
    Use it to visualize the data better


## Future Enhacements ##

* add loaders on screen


## Support ##

* Please drop a mail at souvikddss@gmail.com for more support