const { SlashCommandBuilder } = require('discord.js');
const { getGw2ApiData } = require('../utility/api.js'); // Ajusta la ruta según tu estructura de archivos

module.exports = {
  data: new SlashCommandBuilder()
    .setName('t6')
    .setDescription('Calcula el precio total de los materiales T6.'),

  async execute(interaction) {
    const itemIds = [24295, 24358, 24351, 24357, 24289, 24300, 24283, 24277];
    const stackSize = 250;

    try {
      let totalPrecioVenta = 0;

      // Llama a la función para obtener el precio de venta de cada objeto
      await Promise.all(itemIds.map(async (itemId) => {
        const objeto = await getGw2ApiData(`commerce/prices/${itemId}`, 'es');
        if (objeto && objeto.sells) {
          totalPrecioVenta += objeto.sells.unit_price * stackSize;
        }
      }));

      // Calcula el 90% del precio total
      const precioTotal90 = totalPrecioVenta * 0.9;

      // Agrega el ID del objeto de ectos al arreglo de itemIds y realiza el cálculo del precio de ectos al 90%
      const ectosId = 19721;
      const ectosObjeto = await getGw2ApiData(`commerce/prices/${ectosId}`, 'es');
      let precioEctos90 = 0;
      if (ectosObjeto && ectosObjeto.sells) {
        precioEctos90 = ectosObjeto.sells.unit_price * 0.9; // No multiplica por stackSize aquí
      }

      // Calcula la cantidad de ectos a dar/recibir
      const cantidadEctos = Math.ceil(precioTotal90 / precioEctos90);

      // Calcula el número de monedas (oro, plata y cobre) y agrega los emotes correspondientes
      const calcularMonedas = (precio) => {
        const oro = Math.floor(precio / 10000);
        const plata = Math.floor((precio % 10000) / 100);
        const cobre = precio % 100;
        return `${oro} <:gold:1134754786705674290> ${plata} <:silver:1134756015691268106> ${cobre} <:Copper:1134756013195661353>`;
      };

      // Calcula la cantidad de stacks y ectos adicionales
      const numStacksEctos = Math.floor(cantidadEctos / stackSize);
      const ectosAdicionales = cantidadEctos % stackSize;
      const ectosRequeridos = cantidadEctos > 0 ? cantidadEctos : 0;

      const embed = {
        title: 'Precio total de los materiales T6',
        description: `El precio total al 100% de los materiales T6 es: ${calcularMonedas(totalPrecioVenta)}.\nEl precio total al 90% de los materiales T6 es: ${calcularMonedas(precioEctos90.toFixed(0))}.\n\n**Ectos a dar/recibir**: ${numStacksEctos} stack${numStacksEctos === 1 ? '' : 's'} y ${ectosAdicionales} adicionales (Total: ${ectosRequeridos} <:glob:1134942274598490292>)`,
        color: 0xffc0cb, // Color del borde del Embed (opcional, puedes cambiarlo o quitarlo)
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error.message);
      await interaction.reply('¡Ups! Hubo un error al calcular el precio total de los materiales T6.');
    }
  },
};
