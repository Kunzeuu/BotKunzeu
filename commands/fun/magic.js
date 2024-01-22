const { SlashCommandBuilder } = require('discord.js');
const { getGw2ApiData } = require('../utility/api.js'); // Ajusta la ruta según tu estructura de archivos

module.exports = {
  data: new SlashCommandBuilder()
    .setName('magic')
    .setDescription('Calcula el precio total de una lista de materiales.'),

  async execute(interaction) {
    const materials = [
      { name: 'Vial of Powerful Blood', itemId: 24295, stackSize: 100 },
      { name: 'Vial of Potent Blood', itemId: 24294, stackSize: 250 },
      { name: 'Vial of Thick Blood', itemId: 24293, stackSize: 50 },
      { name: 'Vial of Blood', itemId: 24292, stackSize: 50 },
      { name: 'Powerful Venom Sac', itemId: 24283, stackSize: 100 },
      { name: 'Potent Venom Sac', itemId: 24282, stackSize: 250 },
      { name: 'Full Venom Sac', itemId: 24281, stackSize: 50 },
      { name: 'Venom Sac', itemId: 24280, stackSize: 50 },
      { name: 'Elaborate Totem', itemId: 24300, stackSize: 100 },
      { name: 'Intricate Totem', itemId: 24299, stackSize: 250 },
      { name: 'Engraved Totem', itemId: 24363, stackSize: 50 },
      { name: 'Totem', itemId: 24298, stackSize: 50 },
      { name: 'Pile of Crystalline Dust', itemId: 24277, stackSize: 100 },
      { name: 'Pile of Incandescent Dust', itemId: 24276, stackSize: 250 },
      { name: 'Pile of Luminous Dust', itemId: 24275, stackSize: 50 },
      { name: 'Pile of Radiant Dust', itemId: 24274, stackSize: 50 },
      // Agrega más materiales aquí con su nombre, itemId y stackSize
    ];

    try {
      let totalPrecioVenta = 0;

      // Llama a la función para obtener el precio de venta de cada objeto
      await Promise.all(materials.map(async (material) => {
        const objeto = await getGw2ApiData(`commerce/prices/${material.itemId}`, 'es');
        if (objeto && objeto.sells) {
          totalPrecioVenta += objeto.sells.unit_price * material.stackSize;
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
        title: 'Precio total del Don de poder condensado',
        description: `El precio total al 100% de Don de magia condensada es: ${calcularMonedas(totalPrecioVenta)}.\nEl precio total al 90% de los Don de magia condensada es: ${calcularMonedas(precioTotal90.toFixed(0))}.`,
        color: 4746549, // Color del borde del Embed (opcional, puedes cambiarlo o quitarlo)
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error.message);
      await interaction.reply('¡Ups! Hubo un error al calcular el precio total de los materiales.');
    }
  },
};
