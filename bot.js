const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal'); // Import the qrcode-terminal library

const SESSION_FILE_PATH = './session.json';

if (fs.existsSync(SESSION_FILE_PATH)) {
  const sessionData = require(SESSION_FILE_PATH);
  initializeBot(sessionData);
} else {
  console.log('No session data found. Please scan the QR code to log in.');

  const client = new Client();

  client.on('qr', (qr) => {
    console.log('Scan the QR code to log in:');
    qrcode.generate(qr, { small: true }); // Display the QR code
  });

  client.on('authenticated', (session) => {
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
    console.log('Authenticated successfully!');
    initializeBot(session);
  });

  client.initialize();
}

function initializeBot(sessionData) {
  const client = new Client({
    session: sessionData,
  });

  client.on('message', (message) => {
     });

  client.on('message_create', async (message) => {
   
    if (message.isMedia && message.type === 'video') {
      const sourceJIDs = [
        '917510883348-1617467618@g.us',
        '120363045348136566@g.us',
        '120363042912265113@g.us',
      ];
      const destinationJIDs = [
        '919847995177-1605954708@g.us',
        '120363143109055893@g.us',
      ];

     
      if (sourceJIDs.includes(message.from)) {
        const caption = `${message.reply_message.text}\n\n *© ꌗ ꓄ ꍏ ꓄ ꀎ ꌗ    ꍏ ꋪ ꍟ ꍏ*`;

       
        for (const destinationJID of destinationJIDs) {
          await forwardVideo(client, message.mediaContent, destinationJID, caption);
        }
      }
    }
  });

  client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
  });

  client.initialize();
}

async function forwardVideo(client, videoMedia, destinationJID, caption) {
  await client.sendMessage(destinationJID, {
    media: videoMedia,
    caption: caption,
  });
            }
            
