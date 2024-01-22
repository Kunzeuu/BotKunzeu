const { SlashCommandBuilder } = require('discord.js');
const { getGw2ApiData } = require('../utility/api.js'); // Ajusta la ruta según tu estructura de archivos

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poder')
    .setDescription('Calcula el precio total de una lista de materiales.'),

  async execute(interaction) {
    const materials = [
      { name: 'Vicious Claw', itemId: 24351, stackSize: 100 },
      { name: 'Large Claw', itemId: 24350, stackSize: 250 },
      { name: 'Sharp Claw', itemId: 24349, stackSize: 50 },
      { name: 'Claw', itemId: 24348, stackSize: 50 },
      { name: 'Armored Scale', itemId: 24289, stackSize: 100 },
      { name: 'Large Scale', itemId: 24288, stackSize: 250 },
      { name: 'Smooth Scale', itemId: 24287, stackSize: 50 },
      { name: 'Scale', itemId: 24286, stackSize: 50 },
      { name: 'Ancient Bone', itemId: 24358, stackSize: 100 },
      { name: 'Large Bone', itemId: 24341, stackSize: 250 },
      { name: 'Heavy Bone', itemId: 24345, stackSize: 50 },
      { name: 'Bone', itemId: 24344, stackSize: 50 },
      { name: 'Vicious Fang', itemId: 24357, stackSize: 100 },
      { name: 'Large Fang', itemId: 24356, stackSize: 250 },
      { name: 'Sharp Fang', itemId: 24355, stackSize: 50 },
      { name: 'Fang', itemId: 24354, stackSize: 50 },
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
        description: `El precio total al 100% de Don de poder condensado es: ${calcularMonedas(totalPrecioVenta)}.\nEl precio total al 90% de los Don de poder condensado es: ${calcularMonedas(precioTotal90.toFixed(0))}.`,
        color: 7154499, // Color del borde del Embed (opcional, puedes cambiarlo o quitarlo)
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error.message);
      await interaction.reply('¡Ups! Hubo un error al calcular el precio total de los materiales.');
    }
  },
};
