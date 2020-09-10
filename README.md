## For docker deployment ##

1. change the redirectUrl in config.staging.json to system IP (where service is deployed), otherwise let it be same(if testing locally)
i.e     "redirectUrl": "http://{SYSTEM_IP}:8811/knol/pages/redirect",

//Need to whitelist this IP in the console.developers.google.com

2. Create the tables after the executing the "docker-compose up" command by using the sql file at location Contacts\scripts\Create.sql

command for creating DB and table by using the above file:
    'mysql -u <username> -p <DBName> < Create.sql'

3. PHPMyAdmin page is at : localhsot:9079
    Use it to visualize the data better