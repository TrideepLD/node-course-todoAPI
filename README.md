# My Node.JS course
Basically me learning how to Node.JS

## What to do when starting this:
Upon initial download:
    a)Create a file to store the database(I've called it mongo-data)
    b)Remeber file path to the database folder(hopefully in the same drive as the robomongo)

## After creation:
    a)Download MongoDB/RoboMongo
    b)traverse to downloaded file in any terminal
    c)run mongod.exe and set the database path to your database safe/database folder(mine is mongo-data)
    d)Open another terminal with same path and run mongo.exe
    e)Open another terminal.
    d)traverse to node-todo-api in terminal
    e)Run according to package.json
Example:*NEW TERMINAL* 
            cd /MongoDB/server/4.0/bin
                mongod.exe -dbpath /Users/user/mongo-data
        *NEW TERMINAL*
            cd /MongoDB/server/4.0/bin
                mongo.exe
        *NEW TERMINAL*
            cd /node-todo-api
                npm test
                ^c
                node server/server.js


## Making todo routes private - 23/5/2019
    First thing was to update todo model. If todo is associateed with user there needed a way to associate with the user
    That happens in todo with creation of the user and in this case the object property _creator
    Once that was created, we added authentication of the two routes
    Either we set creator property equal to id of the login user
    or we fetch todo but only the ones of the currently logged in users.
    this lets us know wtf to do
    
### P.S I should really work on this more like really gotta private the todo models but that shall be done eventually
