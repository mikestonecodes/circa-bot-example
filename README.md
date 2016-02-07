This project uses Node( javascript ) , websockets and socket.io

If you would like to use another coding language you can use socket.io
C++ for example http://socket.io/blog/socket-io-cpp/

download the zip or git pull this repo

Install
- install Node https://nodejs.org/en/download/
- go to terminal or commandline , cd into directory downloaded
- npm install
- register a user as a bot, fake email ok http://45.55.2.124/register
- visit http://45.55.2.124/botapi
- edit bot.js file with correct token
- logout
- register the user you will play as ( a seperate user from the bot ) at http://45.55.2.124/register

Test
- create New game , join as white
- copy game id from url ( /game/55f390c5bc0010467ced9b6d/ , the game id is 55f390c5bc0010467ced9b6d )
- edit bot.js with the correct game id
- run node bot.js in terminal or commandline
