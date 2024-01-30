const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { getGw2ApiData } = require('../utility/api.js'); // Ajusta la ruta según tu estructura de archivos


// Mapeo bidireccional de ID y nombre de objetos
const itemsMap = new Map([
  [30684, {mainName: 'Frostfang', altNames: ['Frost', 'Colmilloescarcha','ff'] }],
  [30685, {mainName: 'Kudzu', altNames: ['kudzu'] }],
  [30686, {mainName: 'The Dreamer', altNames: ['Soñador'] }],
  [30687, {mainName: 'Incinerator', altNames: ['Incineradora', 'inci'] }],
  [30688, {mainName: 'The Minstrel', altNames: ['Juglar'] }],
  [30689, {mainName: 'Eternity', altNames: ['Eternidad', 'eter'] }],
  [30690, {mainName: 'The Juggernaut', altNames: ['Juggernaut','jug'] }],
  [30691, {mainName: "Kamohoali'i Kotaki", altNames: ['Kotaki', ' lanza'] }],
  [30692, {mainName: 'The Moot', altNames: ['Festin','fes'] }],
  [30693, {mainName: 'Quip', altNames: ['Gracia'] }],
  [30694, {mainName: 'The Predator', altNames: ['Depredador', 'Pred'] }],
  [30695, {mainName: 'Meteorlogicus', altNames: ['Meteorlógico', 'meteor'] }],
  [30696, {mainName: 'The Flameseeker Prophecies', altNames: ['FSP'] }],
  [30697, {mainName: 'Frenzy', altNames: ['frenzy'] }],
  [30698, {mainName: 'The Bifrost', altNames: ['Bifrost'] }],
  [30699, {mainName: 'Bolt', altNames: ['Haz'] }],
  [30700, {mainName: 'Rodgort', altNames: ['Rodgort', 'rod'] }],
  [30701, {mainName: 'Kraitkin', altNames: ['kraitkin']}],
  [30702, {mainName: 'Howler', altNames: ['Aullador', 'aull'] }],
  [30703, {mainName: 'Sunrise', altNames: ['Amanecer','ama'] }],
  [30704, {mainName: 'Twilight', altNames: ['Crepusculo','crep'] }],
  [95612, {mainName: `Aurene's Tail`, altNames: ['maza', 'Cola de Aurene'] }],
  [95675, {mainName: "Aurene's Fang", altNames: ['espada', 'Colmillo de Aurene'] }],
  [95808, {mainName: "Aurene's Argument", altNames: ['pistola', 'Argumento de Aurene'] }],
  [96028, {mainName: "Aurene's Scale", altNames: ['escudo', 'Escama de Aurene'] }],
  [96203, {mainName: "Aurene's Claw", altNames: ['daga', 'Garra de Aurene'] }],
  [96221, {mainName: "Aurene's Wisdom", altNames: ['cetro', 'Sabiduría de Aurene'] }],
  [96356, {mainName: "Aurene's Bite", altNames: ['mandoble', 'mand', 'Mordisco de Aurene'] }],
  [96652, {mainName: "Aurene's Insight", altNames: ['baculo', 'Visión de Aurene'] }],
  [96937, {mainName: "Aurene's Rending", altNames: ['hacha', 'Desgarramiento de Aurene'] }],
  [97077, {mainName: "Aurene's Wing", altNames: ['LS','ls', 'Ala de Aurene'] }],
  [97099, {mainName: "Aurene's Breath", altNames: ['antorcha', 'ant', 'Aliento de Aurene'] }],
  [97165, {mainName: "Aurene's Gaze", altNames: ['foco', 'Mirada de Aurene'] }],
  [97377, {mainName: "Aurene's Persuasion", altNames: ['rifle', 'Persuasión de Aurene'] }],
  [97590, {mainName: "Aurene's Flight", altNames: ['LB', 'lb', 'Vuelo de Aurene'] }],
  [95684, {mainName: `Aurene's Weight`, altNames: ['martillo', 'Peso de Aurene'] }],
  [97783, {mainName: `Aurene's Voice`, altNames: ['Voice', 'cuerno', 'Voz de Aurene'] }],
  [96978, {mainName: 'Antique Summoning Stone', altNames: ['ASS', 'ass'] }],
  [96722, {mainName: 'Jade Runestone', altNames: ['runestone', 'jade'] }],
  [96347, {mainName: 'Chunk of Ancient Ambergris', altNames: ['Amber', 'amber'] }],
  [85016, {mainName: 'Blue', altNames: ['blue'] }],
  [84731, {mainName: 'Green', altNames: ['green'] }],
  [83008, {mainName: 'Yellow', altNames: ['yellow'] }],
  [19721, {mainName: 'Glob of Ectoplasm', altNames: ['Ectos'] }],
  [86497, {mainName: 'Extractor', altNames: ['extractor']}],
  [29166, {mainName: 'Tooth of Frostfang', altNames: ['Diente']}],
  [29167, {mainName: 'Spark', altNames: ['Chispa']}],
  [29168, {mainName: 'The Bard', altNames: ['Bardo']}],
  [29169, {mainName: 'Dawn', altNames: ['Alba']}],
  [29170, {mainName: 'Coloso', altNames: ['coloso']}],
  [29171, {mainName: 'Carcharias', altNames: ['carcharias']}],
  [29172, {mainName: 'Leaf of Kudzu', altNames: ['Hoja de Kudzu', 'pkudzu']}],
  [29173, {mainName: 'The Energizer', altNames: ['Energizador']}],
  [29174, {mainName: 'Chaos Gun', altNames: ['Caos']}],
  [29175, {mainName: 'The Hunter', altNames: ['cazador']}],
  [29176, {mainName: 'Storm', altNames: ['Tormenta']}],
  [29177, {mainName: 'The Chosen', altNames: ['Elegido']}],
  [29178, {mainName: 'The Lover', altNames: ['Amante']}],
  [29179, {mainName: 'Rage', altNames: ['Rabia']}],
  [29180, {mainName: 'The Legend', altNames: ['Leyenda']}],
  [29181, {mainName: 'Zap', altNames: ['Zas']}],
  [29182, {mainName: "Rodgort's Flame", altNames: ['Llama de Rodgort', 'llama']}],
  [29183, {mainName: 'Venom', altNames: ['Veneno']}],
  [29184, {mainName: 'Howl', altNames: ['Aullido']}],
  [29185, {mainName: 'Dusk', altNames: ['Anochecer']}],
  [48917, {mainName: 'Toxic Focusing Crystal', altNames: ['Cristal']}],
  [89216, {mainName: 'Charm of Skill', altNames: ['Habilidad']}],
  [89258, {mainName: 'Charm of Potence', altNames: ['Potencia']}],
  [89103, {mainName: 'Charm of Brilliance', altNames: ['Brillantez']}],
  [89141, {mainName: 'Símbolo de mejora', altNames: ['Mejora']}],
  [89182, {mainName: 'Símbolo de dolor', altNames: ['Dolor']}],
  [89098, {mainName: 'Símbolo de control', altNames: ['Control']}],
  [74326, {mainName: 'Sello superior de Transferencia', altNames: ['Transferencia']}],
  [44944, {mainName: 'Sello superior de Estallido', altNames: ['Estallido']}],
  [24562, {mainName: 'Símbolo de Fechorias', altNames: ['Fechorias']}],
  [68436, {mainName: 'Sello superior de Fortaleza', altNames: ['Fortaleza']}],
  [48911, {mainName: 'Sello superior de Tormento', altNames: ['Tormento']}],
  [24609, {mainName: 'Sello superior de Condena', altNames: ['Condena']}],
  [44950, {mainName: 'Sello superior de Malicia ', altNames: ['Malicia']}],
  [24639, {mainName: 'Sello superior de Parálisis ', altNames: ['Paralisis']}],
  [24800, {mainName: 'Runa superior de Elementalista ', altNames: ['Elementalista']}],
  [24818, {mainName: 'Runa superior de ladrón', altNames: ['Ladrón', 'ladron']}],
  [24830, {mainName: 'Runa superior de Aventurero', altNames: ['Aventurero']}],
  [44956, {mainName: 'Runa superior de Tormento', altNames: ['Runa Tormento']}],
  [24720, {mainName: 'Runa superior de Velocidad', altNames: ['Velocidad']}],
  [24836, {mainName: 'Runa superior de Erudito', altNames: ['Erudito', 'Schoolar']}],
  [24833, {mainName: 'Runa superior del Pendenciero', altNames: ['Pendenciero']}],
  [89999, {mainName: 'Runa superior de Fuegos Artificiales', altNames: ['Fuego']}],
  [24762, {mainName: 'Runa superior del Krait', altNames: ['Krait']}],
  [24839, {mainName: 'Runa superior del agua', altNames: ['agua']}],
  [49424, {mainName: '+1 Agony Infusion', altNames: ['+1']}],
  [49428, {mainName: '+5 Agony Infusion', altNames: ['+5']}],  
  [49429, {mainName: '+6 Agony Infusion', altNames: ['+6']}],
  [49430, {mainName: '+7 Agony Infusion', altNames: ['+7']}],
  [49431, {mainName: '+8 Agony Infusion', altNames: ['+8']}],
  [49432, {mainName: '+9 Agony Infusion', altNames: ['+9']}],
  [49433, {mainName: '+10 Agony Infusion', altNames: ['+10']}],
  [49434, {mainName: '+11 Agony Infusion', altNames: ['+11']}],
  [49438, {mainName: '+15 Agony Infusion', altNames: ['+15']}],
  [49438, {mainName: '+16 Agony Infusion', altNames: ['+16']}],
  [44941, {mainName: 'Watchwork Sprocket', altNames: ['Watchwork', 'Engranaje']}],
  [73248, {mainName: 'Stabilizing Matrix', altNames: ['Matrix']}],
  [72339, {mainName: 'Sello superior de concentración', altNames: ['Vor']}],
  [48884, {mainName: 'Pristine Toxic Spore', altNames: ['Espora', 'Pristine']}],
  [92687, {mainName: 'Amalgamated Draconic Lodestone', altNames: ['Amal']}],
  [24325, {mainName: 'Destroyer Lodestone', altNames: ['Destructor']}],
  [24330, {mainName: 'Crystal Lodestone', altNames: ['Cristal']}],
  [70842, {mainName: 'Mordrem Lodestone', altNames: ['mordrem']}],
  [24340, {mainName: 'Corrupted Lodestone', altNames: ['Corrupta']}],
  [96193, {mainName: "Dragon's Wisdom", altNames: ["Sabiduría"]}],
  [95814, {mainName: "Dragon's Insight", altNames: ["Visión"]}],
  [96303, {mainName: "Dragon's Gaze", altNames: ["Mirada"]}],
  [95834, {mainName: "Dragon's Flight", altNames: ["Vuelo", ]}],
  [96915, {mainName: "Dragon's Argument", altNames: ["Argumento"]}],
  [97267, {mainName: "Dragon's Persuasion", altNames: ["Persuasión",]}],
  [96330, {mainName: "Dragon's Wing", altNames: ["Ala"]}],
  [96925, {mainName: "Dragon's Breath", altNames: ["Aliento"]}],
  [97513, {mainName: "Dragon's Voice", altNames: ["Voz"]}],
  [97449, {mainName: "Dragon's Rending", altNames: ["Desgarramiento"]}],
  [95967, {mainName: "Dragon's Claw", altNames: ["Garra"]}],
  [96357, {mainName: "Dragon's Bite", altNames: ["Mordisco"]}],
  [95920, {mainName: "Dragon's Weight", altNames: ["Peso"]}],
  [96827, {mainName: "Dragon's Tail", altNames: ["Cola"]}],
  [97691, {mainName: "Dragon's Scale", altNames: ["Escama"]}],
  [95994, {mainName: "Dragon's Fang", altNames: ["colmillo"]}],
  [100893, {mainName: "Relic of the Zephyrite", altNames: ['Zephyrite'] }],
  [100455, {mainName: 'Relic of Durability', altNames: ['Durability'] }],
  [100400, {mainName: 'Relic of the Sunless', altNames: ['Sunless'] }],
  [100579, {mainName: 'Relic of the Nightmare', altNames: ['Nightmare'] }],
  [100542, {mainName: 'Relic of the Cavalier', altNames: ['Cavalier'] }],
  [100924, {mainName: 'Relic of the Deadeye', altNames: ['Deadeye'] }],
  [100345, {mainName: 'Relic of the Daredevil', altNames: ['Daredevil'] }],
  [100148, {mainName: 'Relic of Speed', altNames: ['Speed'] }],
  [100368, {mainName: 'Relic of the Scourge', altNames: ['Scourge'] }],
  [100048, {mainName: 'Relic of the Ice', altNames: ['Ice'] }],
  [100561, {mainName: 'Relic of the Adventurer', altNames: ['Adventurer'] }],
  [100947, {mainName: 'Relic of Fireworks', altNames: ['Fireworks'] }],
  [100450, {mainName: 'Relic of the Chronomancer', altNames: ['Chronomancer'] }],
  [100739, {mainName: 'Relic of the Reaper', altNames: ['Reaper'] }],
  [100442, {mainName: 'Relic of Dwayna', altNames: ['Dwayna'] }],
  [100934, {mainName: 'Relic of the Defender', altNames: ['Defender'] }],
  [100144, {mainName: 'Relic of the Warrior', altNames: ['Warrior'] }],
  [100527, {mainName: 'Relic of the Brawler', altNames: ['Brawler'] }],
  [100219, {mainName: 'Relic of the Herald', altNames: ['Herald'] }],
  [100194, {mainName: 'Relic of the Weaver', altNames: ['Weaver'] }],
  [100625, {mainName: 'Relic of Leadership', altNames: ['Leadership'] }],
  [100693, {mainName: 'Relic of the Afflicted', altNames: ['Afflicted'] }],
  [100659, {mainName: 'Relic of the Water', altNames: ['Water'] }],
  [100090, {mainName: 'Relic of the Dragonhunter', altNames: ['Dragonhunter'] }],
  [100916, {mainName: 'Relic of the Thief', altNames: ['Thief'] }],
  [100230, {mainName: 'Relic of the Krait', altNames: ['Krait'] }],
  [100614, {mainName: 'Relic of Evasion', altNames: ['Evasion'] }],
  [100158, {mainName: 'Relic of the Mirage', altNames: ['Mirage'] }],
  [100849, {mainName: 'Relic of the Aristocracy', altNames: ['Aristocracy'] }],
  [100429, {mainName: 'Relic of Mercy', altNames: ['Mercy'] }],
  [100453, {mainName: 'Relic of the Firebrand', altNames: ['Firebrand'] }],
  [100385, {mainName: 'Relic of the Centaur', altNames: ['Centaur'] }],
  [100448, {mainName: 'Relic of the Citadel', altNames: ['Citadel'] }],
  [100580, {mainName: 'Relic of the Necromancer', altNames: ['Necromancer'] }],
  [100794, {mainName: 'Relic of Resistance', altNames: ['Resistance'] }],
  [99965, {mainName: 'Relic of the Flock', altNames: ['Flock'] }],
  [100031, {mainName: 'Relic of the Monk', altNames: ['Monk'] }],
  [100390, {mainName: 'Relic of Antitoxin', altNames: ['Antitoxin'] }],
  [100411, {mainName: 'Relic of the Trooper', altNames: ['Trooper'] }],
  [35986, {mainName:  'Bazar', altNames: ['express']}],
  [36038, {mainName:  'Trick-or-Treat Bag', altNames: ['tot']}],
  [99956, {mainName:  'Enchanted Music Box', altNames: ['music']}],
  [96088, {mainName:  'Memory of Aurene', altNames: ['Aurene', 'Recuerdo de Aurene']}],
  [71581, {mainName:  'Memory of Battle', altNames: ['Memoria', 'Memoria de Batalla', 'WvW']}],
  [77604, {mainName:  'Wintersday Gift', altNames: ['Navidad', 'regalos', 'gift']}],
  [83410, {mainName:  'Supreme Rune of Holding', altNames: ['Holding', 'sujecion', 'Supreme']}],
  [8920, {mainName:  'Heavy Loot Bag', altNames: ['Saco de botín pesado  ', 'Loot', 'Heavy']}],
  [70820, {mainName:  'Shard of Glory', altNames: ['Gloria', 'Esquirla de gloria  ', 'PvP']}],
  [68646, {mainName: 'Divine Lucky Envelope', altNames: ['DLE', 'Sobre de la suerte divino']}]
]);


const excludedLegendaryItems = new Set([96978, 96722]);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('item')
    .setDescription('Muestra el precio y la imagen de un objeto.')
    .addStringOption(option =>
      option.setName('objeto')
        .setDescription('ID o nombre del objeto para obtener el precio y la imagen.')
        .setRequired(true)),
  
  async execute(interaction) {
    const input = interaction.options.getString('objeto');
    let objetoId = null;

    // Verifica si el input es un número (ID) o una cadena (nombre)
    if (!isNaN(input)) {
      objetoId = parseInt(input);
    } else {
      objetoId = findObjectIdByName(input);
    }

    try {
      // Verifica si se encontró la ID del objeto
      if (!objetoId || !itemsMap.has(objetoId)) {
        await interaction.reply('No se encontró el objeto con ese ID o nombre.');
        return;
      }

      // Realiza la solicitud a la API para obtener el precio del objeto
      const response = await axios.get(`https://api.guildwars2.com/v2/commerce/prices/${objetoId}`);
      const objeto = response.data;

      // Verifica si el objeto tiene información válida y precios de venta
      if (objeto && objeto.sells && objeto.buys) {
        const precioVenta = objeto.sells.unit_price;
        const precioCompra = objeto.buys.unit_price;

        // Realiza una segunda solicitud a la API para obtener los detalles del objeto, incluido su nombre, rareza e imagen
        const responseDetails = await axios.get(`https://api.guildwars2.com/v2/items/${objetoId}?lang=es`);
        const objetoDetails = responseDetails.data;

        // Obtiene el nombre, la rareza y la imagen del objeto
        const nombreObjeto = objetoDetails.name;
        const rarezaObjeto = objetoDetails.rarity;
        const imagenObjeto = objetoDetails.icon;

        // Calcula el precio al 85% si el objeto es legendary, de lo contrario, calcula al 90%
        const descuento = rarezaObjeto === 'Legendary' && !excludedLegendaryItems.has(objetoId) ? 0.85 : 0.9;
        const precioDescuento = Math.floor(precioVenta * descuento);

        // Calcula la cantidad de oro, plata y cobre para los precios
        const calcularMonedas = (precio) => {
          const oro = Math.floor(precio / 10000);
          const plata = Math.floor((precio % 10000) / 100);
          const cobre = precio % 100;
          return `${oro} <:gold:1134754786705674290> ${plata} <:silver:1134756015691268106> ${cobre} <:Copper:1134756013195661353>`;
        };

        // Calcula el número de ectos requeridos si el objeto es de rareza "Legendary"
        let ectosRequeridos = null;
        let numStacksEctos = null;
        let ectosAdicionales = null;
        if (rarezaObjeto === 'Legendary') {
          const precioEcto = await getPrecioEcto();
          if (precioEcto !== null) {
            ectosRequeridos = Math.ceil(precioDescuento / (precioEcto * 0.9)); // Ectos al 90% del precioDescuento
            numStacksEctos = Math.floor(ectosRequeridos / 250); // Número de stacks de ectos
            ectosAdicionales = ectosRequeridos % 250; // Ectos adicionales
          }
        }

        // Crea el mensaje de tipo Embed con los precios y el número de ectos requeridos
        let description = `Precio de venta (Sell): ${calcularMonedas(precioVenta)}\n` +
          `Precio de compra (Buy): ${calcularMonedas(precioCompra)}`;

        description += `\n\n**Precio al ${descuento * 100}%**: ${calcularMonedas(precioDescuento)}`;

        if (rarezaObjeto === 'Legendary' && !excludedLegendaryItems.has(objetoId) && ectosRequeridos !== null) {
          description += `\n\n**Ectos a dar/recibir**: ${numStacksEctos} stack${numStacksEctos === 1 ? '' : 's'} y ${ectosAdicionales} adicionales (Total: ${ectosRequeridos} <:glob:1134942274598490292>)`;
        }

        const ltcLink = `https://www.gw2bltc.com/en/item/${objetoId}`;
        const iconURL = await getIconURL(objetoId);

        
        const embed = {
          title: `Precio del objeto: ${nombreObjeto}`,
          description: description,
          color: 0x00ffff, // Color del borde del Embed (opcional, puedes cambiarlo o quitarlo)
          thumbnail: { url: `${iconURL}` },
          fields: [
            {
              name: 'Enlace a GW2BLTC',
              value: `${ltcLink}`,
            },
            ],
        };

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply('El objeto no tiene un precio de venta válido en la API.');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud a la API:', error.message);
      await interaction.reply('¡Ups! Hubo un error al obtener el precio del objeto desde la API.');
    }
  },
};

 async function getIconURL(objetoId) {
    try {
      const response = await axios.get(`https://api.guildwars2.com/v2/items/${objetoId}`);
      const objetoDetails = response.data;
      return objetoDetails.icon;
    } catch (error) {
      console.error('Error al obtener la URL del ícono desde la API:', error.message);
      return null;
    }
  }

// Función para obtener el precio de los ectos
async function getPrecioEcto() {
  try {
    const response = await axios.get('https://api.guildwars2.com/v2/commerce/prices/19721');
    const ecto = response.data;
    return ecto.sells.unit_price;
  } catch (error) {
    console.error('Error al obtener el precio de los ectos desde la API:', error.message);
    return null;
  }
}

// Función para encontrar la ID del objeto por nombre
function findObjectIdByName(name) {
  for (const [id, item] of itemsMap) {
    if (item.mainName.toLowerCase() === name.toLowerCase() || item.altNames.some(altName => altName.toLowerCase() === name.toLowerCase())) {
      return id;
    }
  }
  return null;
}function findObjectIdByName(name) {
  for (const [id, item] of itemsMap) {
    const mainName = item.mainName.toLowerCase();
    if (mainName === name.toLowerCase() || (item.altNames && item.altNames.some(altName => altName.toLowerCase() === name.toLowerCase()))) {
      return id;
    }
  }
  return null;
}