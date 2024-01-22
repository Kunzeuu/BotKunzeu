const { WebhookClient } = require('discord.js');
const Parser = require('rss-parser');
const sqlite3 = require('sqlite3').verbose();

// URL del feed RSS que deseas seguir
const feedUrl = 'https://guaridadevortus.com/feed/';

// URL de tu webhook de Discord
const webhookUrl = 'https://discord.com/api/webhooks/1150100023162458195/RY0AbJnDC5aNldZ116rgvDMhy3qVhDEPspGbVkWV6cSziR3-uz1flDVK4BARRrhhx68G'; // Reemplaza con la URL de tu webhook

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('postIds.db');

// Crea la tabla para almacenar los IDs si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS post_ids (
    guid TEXT PRIMARY KEY
  );
`);

// Función para enviar un mensaje al webhook de Discord
async function sendMessageToWebhook(message) {
  try {
    const webhookClient = new WebhookClient({ url: webhookUrl });
    await webhookClient.send(message);
    console.log('Mensaje enviado con éxito al webhook de Discord.');
  } catch (error) {
    console.error('Error al enviar el mensaje al webhook:', error);
  }
}

// Función para obtener y procesar el contenido del feed RSS
async function processRssFeed() {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);

    for (const item of feed.items) {
      // Verifica si el GUID del post ya está en la base de datos
      db.get('SELECT guid FROM post_ids WHERE guid = ?', [item.guid], (err, row) => {
        if (err) {
          console.error('Error al consultar la base de datos:', err);
        } else if (!row) {
          // Si el GUID no existe en la base de datos, es un nuevo post
          // Envía un mensaje y agrega el GUID a la base de datos
          const message = {
            content: `**Nueva publicación en Guarida de Vortus**:\n${item.title}\n${item.link}`,
          };
          sendMessageToWebhook(message);

          // Agrega el GUID a la base de datos para evitar envíos duplicados
          db.run('INSERT INTO post_ids (guid) VALUES (?)', [item.guid]);
        }
      });
    }
  } catch (error) {
    console.error('Error al procesar el feed RSS:', error);
  }
}

// Programa la ejecución automática para obtener y procesar el feed cada 5 minutos (300000 milisegundos)
setInterval(() => {
  processRssFeed();
}, 300000); // Ejecuta cada 5 minutos (300000 milisegundos)
