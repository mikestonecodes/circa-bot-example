This project uses Node( javascript ) , websockets and socket.io

If you would like to use another coding language you can use socket.io
C++ for example http://socket.io/blog/socket-io-cpp/

download the zip or git pull this repo

Install
- install Node https://nodejs.org/en/download/
- go to terminal or commandline , cd into directory downloaded
- npm install
- register a user as a bot, use a fake email address  http://45.55.2.124/register
- visit http://45.55.2.124/botapi
- edit bot.js file with correct token
- logout
- register the user you will play as ( a seperate user from the bot ) at http://45.55.2.124/register

Test
- run node bot.js in terminal or commandline
- copy url to join. ( pro-tip, if you are on mac and use chrome set auto_open_tab_mac to true to automatically open a tab )


Ring is how far from center, 1 being closest
get hour by following intersected right circle on board to top. 

For example you may think the intersection in ring 2 hour 12 is straight up but it's not, it's at 2. It's intersected by two white circles on the board, follow the right one to the edge, and you will see it ends at clock position 2.

this might be annoying and counter intuitive but it makes life way easier when doing calcutions.

This api uses socket.io. You can use socket io C++ if you want , just pass ?__sails_io_sdk_version=0.11.0 when connected, and use this code an example of how to use rooms and emits . Here is how to connect to a existing game without the sails client library https://jsfiddle.net/o0d3x8yc/2/

Feel free to join io.socket.post('/game/'+gameID+'/join/'+joinAs , function () ) on a game already started, but make sure to also io.socket.get('/game/'+gameID) to get updates if you do that.

You will get error messages if something is not correct. Currently, the validations take some time to run, so getting a move back from the server will be a little sluggish compared to a normal game. I will work on making it faster and adding more. Make sure you add moves in the correct order, and only after you see the move see the move gets validated and returned from the server in the "/update" room. I provided a queue to do this.

Game ends when both players pass. Both plays must accept score and terrorities to have the game finalized.

All the updates happen on the 'game' game. When you create a game or emit a get to /game/yourgame id you subscribe. this list describes the object you get on an update.  the data property contains the actual payload if there is one. 
