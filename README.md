client-vs-server-performance-test
=================================
Installation
---------------------------------
1. First of all you need nodejs and mongodb
   get the latest mongodb version from http://www.mongodb.org/downloads
   and the latest nodejs version from http://nodejs.org/
2. Open your terminal and change into the directory of this project
3. Install the node packages via npm "sudo npm install"
4. Start the mongodb "mongod"
5. Start nodejs server "node testplatform"

Seed local database
---------------------------------
1. To seed the local db the testplatform uses the twitter api
2. You need to setup a twitter app on https://dev.twitter.com/apps
3. Open locolhost:3001/seeddb and enter the consumer key and consumer secret of your twitter app
   This will be only saved in your localdb and can not read by anyone else
4. Enter a search term where a lot of tweets are curretnly posted (e.g. prism, cats, ...)
   and enter the amount of tweets you want to fetch.
   You can repeat this step as often as you wanted depending of the amount of entities you want for your rendertest

Start render test
----------------------------------
1. Open localhost:3001/tweets/render
2. Select the approach you want to test (server side rendering or client side rendering)
3. Enter the start and end amount of the amount of entities you want to test
4. Enter the interval
5. If you uncheck save test results the measured time will not be saved into local database and there
   will not be an iterative test
6. If you uncheck disable profile pictures the rendered templates will use a default profile picture instead of
   the twitter user profile pic. This option reduces unessesary traffic for the tests
7. Start the test

Evaluate test results
----------------------------------
1. Open localhost:3001/tests
2. Download the results as csv files
3. Insert them into a calculation tool like Excel

Further reading
-----------------------------------
Read my conclusing about the testresults on 
http://blog.mwaysolutions.com/2013/11/08/client-vs-serverside-rendering-the-big-battle-2/

