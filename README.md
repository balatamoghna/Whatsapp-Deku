✍ Short Description:\
This application is a Client that simulates the connection to WhatsApp Web through Puppeteer , instantiating the connection in real time.\
\
▶ Installation:\
Install Whatsapp-web.js: ```npm i whatsapp-web.js```  
Please note that Node v10.18.1+ is required due to Puppeteer.\
Download and install these dependencies too:  
```npm install popyt```  
```npm install youtube-dl```  
```npm install follow-redirects```  
```npm install qrcode-terminal```  
After this is done, just do ```node WABot.js```  
\
⚡ Commands:\
!ping - Pong!\
!groupinfo - Gives you the group's info\
!info - Gives you Deku's info\
!mediainfo - Quote a message and invoke command to get its media information\
!quoteinfo - Quote a message and get its information\
!resendmedia - Quote a message and Deku will send you the media again\
!mtemplate - Gives you meme templates\
!meme - make your own meme! Do !meme template;str1;str2 to make your memes!\
!joke - Deku will crack a joke\
!anquote - Deku will give you an anime quote\
!ansearch - Do "!ansearch animename" to get details of the anime name.\
!insult - Deku will insult!\
!compliment - Deku will compliment!\
!del - Quote Deku's response to your command and issue !del to delete that message from everyone!\
!horoscope - Check your horoscope! Do !horoscope YourSign\
!video - Get any video search result under 7-10mins!\
\
Note: This project is hosted on a Raspberry Pi 4, As such uses Chromium and has some modifications done to Puppeteer.
If you wish to run this project without a rpi, remove the existing new Client code and replace with:
```
const client = new Client();
client.initialize();
```
Disclaimer of Liability\
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or affiliates. The official WhatsApp website can be found at https://whatsapp.com . "WhatsApp" as well as names, brands, emblems and related images are registered trademarks of their respective owners.
Acknowledgments and Credits\
https://github.com/pedroslopez  
\
Contact\
bala98410@gmail.com 
