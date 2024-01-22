const { SlashCommandBuilder } = require('discord.js');
const { getGw2ApiData } = require('../utility/api.js'); // Ajusta la ruta según tu estructura de archivos

module.exports = {
  data: new SlashCommandBuilder()
    .setName('t5') 
    .setDescription('Calcula el precio total de los materiales T5.'), 

  async execute(interaction) {
    const itemIds = [24294, 24341, 24350, 24356, 24288, 24299, 24282]; 
    const stackSize = 250;

    try {
      let totalPrecioVenta = 0;

      // Llama a la función para obtener el precio de venta de cada objeto
      await Promise.all(itemIds.map(async (itemId) => {
        if (itemId === 24276) {
          return; // Ignora el item 24276
        }

        const objeto = await getGw2ApiData(`commerce/prices/${itemId}`, 'es');
        if (objeto && objeto.sells) {
          totalPrecioVenta += objeto.sells.unit_price * stackSize;
        }
      }));

      // Calcula el 90% del precio total
      const precioTotal90 = totalPrecioVenta * 0.9;

      // Calcula el número de monedas (oro, plata y cobre) y agrega los emotes correspondientes
      const calcularMonedas = (precio) => {
        const oro = Math.floor(precio / 10000);
        const plata = Math.floor((precio % 10000) / 100);
        const cobre = precio % 100;
        return `${oro} <:gold:1134754786705674290> ${plata} <:silver:1134756015691268106> ${cobre} <:Copper:1134756013195661353>`;
      };

      const embed = {
        title: 'Precio total de los materiales T5',
        description: `El precio total al 100% de los materiales T5 (excepto el item Montón de polvo incandescente) es: ${calcularMonedas(totalPrecioVenta)}.\nEl precio total al 90% de los materiales T5 (excepto el item Montón de polvo incandescente) es: ${calcularMonedas(precioTotal90.toFixed(0))}.`,
        color: 2593204, // Color del borde del Embed (opcional, puedes cambiarlo o quitarlo)
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error.message);
      await interaction.reply('¡Ups! Hubo un error al calcular el precio total de los materiales T5.');
    }
  },
};
