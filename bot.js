const fs = require('fs');
const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrCode = require('qrcode');

const SESSION_FILE_PATH = './session.json';
const QR_CODE_PATH = './qrcode.png';
const PORT = 3000; // Change this to the desired port number

const app = express();

// Set up the route to serve the QR code image
app.get('/qrcode', (req, res) => {
  res.sendFile(QR_CODE_PATH);
});

// Check if session file exists
if (fs.existsSync(SESSION_FILE_PATH)) {
  // If it exists, load the session data
  const sessionData = require(SESSION_FILE_PATH);
  initializeBot(sessionData);
} else {
  console.log('No session data found. Please scan the QR code to log in.');

  const client = new Client();

  client.on('qr', async (qr) => {
    // Generate QR code as a PNG image
    await qrCode.toFile(QR_CODE_PATH, qr);
    console.log('QR code saved as qrcode.png');
  });

  client.on('authenticated', (session) => {
    // Save the session data to the session file
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
    // Handle incoming messages
  });

  client.on('message_create', async (message) => {
    // Handle incoming media (including videos)
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

      // Check if the source JID matches the incoming message's JID
      if (sourceJIDs.includes(message.from)) {
        const caption = `${message.reply_message.text}\n\n *© ꌗ ꓄ ꍏ ꓄ ꀎ ꌗ    ꍏ ꋪ ꍟ ꍏ*`;

        // Forward the video with caption to each destination JID
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

// Start the web server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
