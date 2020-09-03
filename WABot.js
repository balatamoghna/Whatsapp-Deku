const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, Location } = require('./index');
const { MessageMedia } = require('whatsapp-web.js');
var https = require('follow-redirects').https;
const version="v1.0.0"
const youtubedl = require('youtube-dl');
const { YouTube } = require('popyt');
const youtube = new YouTube('APIKEY');





const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true,
    executablePath:'/usr/bin/chromium-browser', args:["--no-sandbox","--disable-setuid-sandbox"] }, session: sessionCfg });
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

client.initialize();

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log('READY');
    console.log("WhatsApp Web v", await client.getWWebVersion());
    console.log("WWebJS v", require("whatsapp-web.js").version);
});
    var recentcmd = new Set();
    var fspamm=new Set();
    var sban= new Set();
    var stickerspam=new Set();
    var stp=new Set();
    var loaded=0;
    var counter=0;

client.on('message', async msg => {
    
    console.log('MESSAGE RECEIVED', msg);
    if(msg.type=='sticker'){
       if(!(msg.fromMe)){ 
        const ur=msg.from;
        if(msg.author!="undefined"){
        const ur=msg.author;
       }
        let chat = await msg.getChat();
        let info = client.info;
        let aq = chat.participants.filter(x => x.id.user ==  info.me.user);
        var contact = await msg.getContact();
        if(chat.isGroup){
        if(aq[0].isAdmin){
        if(stickerspam.has(ur) && !(stp.has(ur))){
            stp.add(ur);
            msg.reply('You are spamming stickers! :]');
            
            if(contact.number == chat.owner.user){
                msg.reply("Owner cannot be removed!");
            }else{
                setTimeout(()=>{
                chat.removeParticipants([contact.id._serialized]);},1000);}
            
        }
         
        }}
        stickerspam.add(ur);
        setTimeout(() =>{
    stickerspam.delete(ur);
    stp.delete(ur);

    },400);
    }}
    else if(msg.type=='video'){
        if(!(msg.fromMe)){
        const ur = msg.author || msg.from;
        let chat = await msg.getChat();
        let info = client.info;
        let aq = chat.participants.filter(x => x.id.user ==  info.me.user);
        var contact = await msg.getContact();
        if(chat.isGroup){
        if(aq[0].isAdmin){
        if(stickerspam.has(ur) && !(stp.has(ur))){
            stp.add(ur);
            msg.reply('You are spamming!');
            if(contact.number == chat.owner.user){
                msg.reply("Owner cannot be removed!");
            }else{
                chat.removeParticipants([contact.id._serialized]);}
            
        }
         
        }}
        stickerspam.add(ur);
        setTimeout(() =>{
    stickerspam.delete(ur);
    stp.delete(ur);
    },6000);
    }
  }
    
    else if(msg.body.startsWith("!") && counter<=4){
        counter++;
        const usr = msg.author || msg.from
        
    
        if(recentcmd.has(usr) || sban.has(usr)){
        if(!(fspamm.has(usr) || (sban.has(usr)))){
        msg.reply('You are on cooldown!');
        fspamm.add(usr);
        var keyToFind = `${usr}`;
    
        
}
    else if(!(sban.has(usr))){
        msg.reply(`WARNING: COMMAND SPAM DETECTED
Command banned for 15 minutes`);
        sban.add(usr);
        }
    
    
        }
        else{
        if(msg.body =='!help'){
            msg.reply(`Help command: !help

!ping - Pong!
!groupinfo - Gives you the group's info
!info - Gives you Deku's info
!mediainfo - Quote a message and invoke command to get its media information
!quoteinfo - Quote a message and get its information
!resendmedia - Quote a message and Deku will send you the media again
!mtemplate - Gives you meme templates
!meme - make your own meme! \nDo !meme template;str1;str2 to make your memes!
!joke - Deku will crack a joke
!anquote - Deku will give you an anime quote
!ansearch - Do "!ansearch animename" to get details of the anime name.
!insult - Deku will insult!
!compliment - Deku will compliment!
!del - Quote Deku's response to your command and issue !del to delete that message from everyone!
!horoscope - Check your horoscope! Do !horoscope YourSign
!video - Get any video search result with !video SearchTitle or !video URL under 7-10mins!


To activate spam control, just make the Bot Admin!(Stops stickers,gif and video spam only)

Do you enjoy the bot? Want to support my passion?
https://www.patreon.com/balatamoghna
Thank you in advance!
`);
            }

    else if (msg.body == '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'Pong!');

    }else if (msg.body == '!groupinfo') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body == '!info') {
        let info = client.info;
        client.sendMessage(msg.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.me.user}
            Platform: ${info.platform}
            Deku version: ${version}
        `);
    } else if (msg.body == '!mediainfo' && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            *Media info*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
    } else if (msg.body == '!quoteinfo' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
    } else if (msg.body == '!resendmedia' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } else if (msg.body === '!mtemplate') {
        const prev=msg;
        msg.reply(`
    "Afraid to Ask Andy": "afraid",
    "Almost Politically Correct Redneck": "apcr",
    "An Older Code Sir, But It Checks Out": "older",
    "Ancient Aliens Guy": "aag",
    "And Then I Said": "atis",
    "At Least You Tried": "tried",
    "Baby Insanity Wolf": "biw",
    "Baby, You've Got a Stew Going": "stew",
    "Bad Luck Brian": "blb",
    "But It's Honest Work": "bihw",
    "But That's None of My Business": "kermit",
    "Butthurt Dweller": "bd",
    "Captain Hindsight": "ch",
    "Comic Book Guy": "cbg",
    "Condescending Wonka": "wonka",
    "Confession Bear": "cb",
    "Confused Gandalf": "gandalf",
    "Conspiracy Keanu": "keanu",
    "Crying on Floor": "cryingfloor",
    "Dating Site Murderer": "dsm",
    "Disaster Girl": "disastergirl",
    "Do It Live!": "live",
    "Do You Want Ants?": "ants",
    "Doge": "doge",
    "Donald Trump": "trump",
    "Drakeposting": "drake",
    "Ermahgerd": "ermg",
    "Facepalm": "facepalm",
    "Feels Good": "feelsgood",
    "First Try!": "firsttry",
    "First World Problems": "fwp",
    "Forever Alone": "fa",
    "Foul Bachelor Frog": "fbf",
    "Fuck Me, Right?": "fmr",
    "Futurama Fry": "fry",
    "Good Guy Greg": "ggg",
    "Grumpy Cat": "grumpycat",
    "Hide the Pain Harold": "harold",
    "Hipster Barista": "hipster",
    "I Can Has Cheezburger?": "icanhas",
    "I Feel Like I'm Taking Crazy Pills": "crazypills",
    "I Guarantee It": "mw",
    "I Have No Idea What I'm Doing": "noidea",
    "I Immediately Regret This Decision!": "regret",
    "I Should Buy a Boat Cat": "boat",
    "I Should Not Have Said That": "hagrid",
    "I Would Be So Happy": "sohappy",
    "I am the Captain Now": "captain",
    "I'm Going to Build My Own Theme Park": "bender",
    "Inigo Montoya": "inigo",
    "Insanity Wolf": "iw",
    "It's A Trap!": "ackbar",
    "It's Happening": "happening",
    "It's Simple, Kill the Batman": "joker",
    "Jony Ive Redesigns Things": "ive",
    "Joseph Ducreux / Archaic Rap": "jd",
    "Laughing Lizard": "ll",
    "Laundry Room Viking": "lrv",
    "Leo Strutting": "leo",
    "Life... Finds a Way": "away",
    "Matrix Morpheus": "morpheus",
    "Member Berries": "mb",
    "Milk Was a Bad Choice": "badchoice",
    "Mini Keanu Reeves": "mini-keanu",
    "Minor Mistake Marvin": "mmm",
    "Mocking Spongebob": "spongebob",
    "No Soup for You / Soup Nazi": "soup-nazi",
    "Nothing To Do Here": "jetpack",
    "Oh, I'm Sorry, I Thought This Was America": "imsorry",
    "Oh, Is That What We're Going to Do Today?": "red",
    "One Does Not Simply Walk into Mordor": "mordor",
    "Oprah You Get a Car": "oprah",
    "Overly Attached Girlfriend": "oag",
    "Pepperidge Farm Remembers": "remembers",
    "Persian Cat Room Guardian": "persian",
    "Philosoraptor": "philosoraptor",
    "Probably Not a Good Idea": "jw",
    "Push it somewhere else Patrick": "patrick",
    "Roll Safe": "rollsafe",
    "Sad Barack Obama": "sad-obama",
    "Sad Bill Clinton": "sad-clinton",
    "Sad Frog / Feels Bad Man": "sadfrog",
    "Sad George Bush": "sad-bush",
    "Sad Joe Biden": "sad-biden",
    "Sad John Boehner": "sad-boehner",
    "Salt Bae": "saltbae",
    "Sarcastic Bear": "sarcasticbear",
    "Schrute Facts": "dwight",
    "Scumbag Brain": "sb",
    "Scumbag Steve": "ss",
    "Seal of Approval": "soa",
    "Sealed Fate": "sf",
    "See? Nobody Cares": "dodgson",
    "Shut Up and Take My Money!": "money",
    "Skeptical Snake": "snek",
    "Skeptical Third World Kid": "sk",
    "So Hot Right Now": "sohot",
    "So I Got That Goin' For Me, Which is Nice": "nice",
    "Socially Awesome Awkward Penguin": "awesome-awkward",
    "Socially Awesome Penguin": "awesome",
    "Socially Awkward Awesome Penguin": "awkward-awesome",
    "Socially Awkward Penguin": "awkward",
    "Stop It, Get Some Help": "stop-it",
    "Stop Trying to Make Fetch Happen": "fetch",
    "Success Kid": "success",
    "Sudden Clarity Clarence": "scc",
    "Super Cool Ski Instructor": "ski",
    "Sweet Brown / Ain't Nobody Got Time For That": "aint-got-time",
    "That Would Be Great": "officespace",
    "The Most Interesting Man in the World": "interesting",
    "The Rent Is Too Damn High": "toohigh",
    "This is Bull, Shark": "bs",
    "This is Fine": "fine",
    "This is Sparta!": "sparta",
    "Ugandan Knuckles": "ugandanknuck",
    "Unpopular opinion puffin": "puffin",
    "What Year Is It?": "whatyear",
    "What is this, a Center for Ants?!": "center",
    "Why Not Both?": "both",
    "Winter is coming": "winter",
    "X all the Y": "xy",
    "X, X Everywhere": "buzz",
    "Xzibit Yo Dawg": "yodawg",
    "Y U NO Guy": "yuno",
    "Y'all Got Any More of Them": "yallgot",
    "You Know What Really Grinds My Gears?": "gears",
    "You Should Feel Bad": "bad",
    "You Sit on a Throne of Lies": "elf",
    "You Were the Chosen One!": "chosen"`);
    
    } else if (msg.body.startsWith('!meme ')) {
        let mtmp = msg.body.slice(6);
        mtmp = mtmp.replace(/_/g,"__");
        mtmp = mtmp.replace(/-/g,"-");
        mtmp = mtmp.replace(/\s+/g,"-");
        mtmp = mtmp.replace(/"?"/g,"~q");
        mtmp = mtmp.replace(/"%"/g,"~p");
        mtmp = mtmp.replace(/"#"/g,"~h");
        mtmp = mtmp.replace(/\//g,"~s");
        mtmp = mtmp.replace(/"'"/g,"''");
        //msg.reply(mtmp);
        let marr = mtmp.split(';');
        const file = fs.createWriteStream(`./meme.jpg`);
        //msg.reply(`https://memegen.link/${marr[0]}/${marr[1]}/${marr[2]}.jpg`);
        msg.reply('Your meme is being generated, It takes upto *10 seconds* to complete so please be patient!');
        let request = https.get(`https://memegen.link/${marr[0]}/${marr[1]}/${marr[2]}.jpg`, function(response) {
        response.pipe(file);
        
        });
        setTimeout(function(){
       const imageAsBase64 = fs.readFileSync(`./meme.jpg`, 'base64');
        const media = new MessageMedia('image/jpg', imageAsBase64);
        client.sendMessage(msg.from, media, { caption: 'Requested Meme!' });
        }, 8000);
        fs.unlink(`./meme.jpg`);
    } else if (msg.body == '!joke') {
        https.get(`https://official-joke-api.appspot.com/random_joke`, function(response) {
        var buffer = '';
        response.on('data', function(d) {
        buffer += d;
        }).on('end', function() {
        var body;
        try {
        obj = JSON.parse(buffer);
        msg.reply(`${obj.setup} \n${obj.punchline}`);
      } catch (err) {
        return msg.reply(err);
      }
    }).setEncoding('utf8');
    });
        
        

    } else if (msg.body == '!anquote') {
        https.get(`https://anime-chan.herokuapp.com/api/quotes/random`, function(response) {
        var buffer = '';
        response.on('data', function(d) {
        buffer += d;
        }).on('end', function() {
        var body;
        try {
        obj = JSON.parse(buffer);
        msg.reply(`"${obj[0].quote}" \n-${obj[0].character}(${obj[0].anime})`);
      } catch (err) {
        return msg.reply(err);
      }
    }).setEncoding('utf8');
    });
       
        
        
        

    } else if (msg.body.toLowerCase().startsWith('!ansearch ')) {
        let str= msg.body.slice(9);
        let stri = str.replace(/\s/g,"_");
        https.get(`https://api.jikan.moe/v3/search/anime?q=${stri}&limit=1`, function(response) {
        var buffer = '';
        response.on('data', function(d) {
        buffer += d;
        }).on('end', function() {
        var body;
        try {
        obj = JSON.parse(buffer);
        obj = obj.results[0];
        if(obj.hasOwnProperty('title')){
        //msg.reply(`${response}`);
        msg.reply(`Title:${obj.title} \nAiring? ${obj.airing}\nDescription:${obj.synopsis}\nEpisodes:${obj.episodes}\nURL:${obj.url}`);}
        else {msg.reply("Error! Could not find specified search result!");}
      } catch (err) {
        return msg.reply(err);
      }
    }).setEncoding('utf8');
    });
        
        

    } else if (msg.body.startsWith('!insult')) {
        https.get(`https://evilinsult.com/generate_insult.php?lang=en&type=json`, function(response) {
        var buffer = '';
        response.on('data', function(d) {
        buffer += d;
        }).on('end', function() {
        var body;
        try {
        body = JSON.parse(buffer);
        
        msg.reply(`${body.insult}`);
      } catch (err) {
        return msg.reply(err);
      }
    }).setEncoding('utf8');
    });
        
        

    } else if (msg.body.startsWith('!compliment')) {
        https.get(`https://complimentr.com/api`, function(response) {
        var buffer = '';
        response.on('data', function(d) {
        buffer += d;
        }).on('end', function() {
        var body;
        try {
        body = JSON.parse(buffer);
        msg.reply(`${body.compliment}`);
      } catch (err) {
        return msg.reply(err);
      }
    }).setEncoding('utf8');
    });
        
        

    }  else if (msg.body == '!del' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.fromMe) {
            const qmsg=await quotedMsg.getQuotedMessage();
            let author = msg.author || msg.from;
            let author1 = qmsg.author || qmsg.from; 
            
            if(author1 == author){
            quotedMsg.delete(true);}
            else {msg.reply('You did not invoke that message!');}
            }
        } else if(msg.body.startsWith("!hbd ")){
            let chat = await msg.getChat();
            let mtmp = msg.body.slice(5);
            mtmp = mtmp.replace(/_/g,"__");
            mtmp = mtmp.replace(/-/g,"-");
            mtmp = mtmp.replace(/\s+/g,"-");
            mtmp = mtmp.replace(/"?"/g,"~q");
            mtmp = mtmp.replace(/"%"/g,"~p");
            mtmp = mtmp.replace(/"#"/g,"~h");
            mtmp = mtmp.replace(/\//g,"~s");
            mtmp = mtmp.replace(/"'"/g,"''");
        //msg.reply(mtmp);
        const file = fs.createWriteStream(`./meme.jpg`);
        msg.reply('Incoming surprise!\nPlease be patient!');
        let request = https.get(`https://memegen.link/custom/_/${mtmp}!.jpg?alt=https://i.scdn.co/image/ab67616d0000b2731613559b6cc074d0ccec2e88`, function(response) {
        response.pipe(file);
        
        });
        setTimeout(function(){
       const imageAsBase64 = fs.readFileSync(`./meme.jpg`, 'base64');
        const media = new MessageMedia('image/jpg', imageAsBase64);
        client.sendMessage(msg.from, media, { caption: `Happy birthday ${mtmp}!` });
        }, 8000);
        fs.unlink(`./meme.jpg`);
            
        } 
    
     
    
     else if(msg.body.startsWith('!horoscope ')){
            let horoscope =msg.body.slice(11);
            https.get(`https://horoscope-api.herokuapp.com/horoscope/today/${horoscope}`, function(response) {
        var buffer = '';
        response.on('data', function(d) {
        buffer += d;
        }).on('end', function() {
        var body;
        try {
        obj = JSON.parse(buffer);
        msg.reply(`${obj.sunsign}:\n${obj.horoscope}\n${obj.date}`);
      } catch (err) {
        return msg.reply(err);
      }
    }).setEncoding('utf8');
    });
            }
    
    
    
     else if (msg.body.startsWith('!video ')) {
         if(loaded==0){

 
         let datetime = new Date();
         let search = msg.body.slice(7);
        
         
        const videodl = await youtube.getVideo(`${search}`);
     
        if(videodl.url.includes("https")){
      
        if(videodl.minutes<=6){
             

        msg.reply(`Title:${videodl.title}\nUrl:${videodl.url} \nSeems to be the Title of the video! \nIf this is what you require,please reply !dw to this message!`);
        }else{
            
        msg.reply('Video too lengthy! Only send videos upto 6 minutes!');}
        }} 
        else{
        msg.reply('Command limit reached! Please try after sometime');}
        }
        
        else if(msg.body =="!dw" && msg.hasQuotedMsg && (loaded ==0)){
            const qmsg = await msg.getQuotedMessage();
            if(qmsg.body.includes("Url:") && qmsg.fromMe){
                let chat = await msg.getChat();
                let datetime = new Date();
                const file = fs.createWriteStream(`/DIRECTORY/video${datetime}.mp4`);
                let str=qmsg.body.substr(qmsg.body.indexOf('https://'));
                const video = youtubedl(`${str}`,
  ['--format=18'],);
  
  video.on('info', function(info) {
               loaded=1;
                       msg.reply(`Acknowledged!
Sending video in 20 seconds!\nYou will recieve a direct message from me!`);
}
);


 video.pipe(file);
   
   setTimeout(function(){
       const musicAsBase64 = fs.readFileSync(`/DIRECTORY/video${datetime}.mp4`, 'base64');
        const media = new MessageMedia('video/mp4', musicAsBase64);
        if(chat.isGroup){
        client.sendMessage(msg.author, media);}
        else{
        client.sendMessage(msg.from,media);
            }
        
        loaded =0;
        }, 20000);
                
                }
            }
        

        
        


    
    
    
    


    setTimeout(()=>{
    counter--;},1000)
recentcmd.add(usr);
    setTimeout(() =>{
    recentcmd.delete(usr);
    fspamm.delete(usr);
    },5000);
    
    setTimeout(() =>{
    sban.delete(usr);
    
    },900000);


            
    
    
    
    
               
    }} 
    else{setTimeout(()=>{counter=0;},15000);}
 //Cooldown condition close
});

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if(ack == 3) {
        // The message was read
    }
});

client.on('group_join', async (notification) => {
    // User has joined or been added to the group.
});

client.on('group_leave', async (notification) => {
    // User has left or been kicked from the group.
    
    console.log('leave', notification);
    
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});

client.on('change_battery', (batteryInfo) => {
    // Battery percentage for attached device has changed
    const { battery, plugged } = batteryInfo;
    console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.on('change_state', async (reason) => {
    if(reason=="TIMEOUT"){
    console.log("Bye Bye");
    pool.end()
    client.destroy();
    process.exit();
}
    
});


