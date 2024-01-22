const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { getGw2ApiData } = require('../utility/api.js'); // Adjust the path according to your file structure

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ectos')
    .setDescription('Muestra el precio de venta y compra de Ectos.')
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de Ectos para calcular el precio.')
        .setRequired(true)),
  async execute(interaction) {
    const cantidadEctos = interaction.options.getInteger('cantidad');

    if (cantidadEctos <= 0) {
      await interaction.reply('La cantidad de Ectos debe ser mayor que 0.');
      return;
    }

    try {
      const precioEcto = await getPrecioEcto();
      const precioCompra = await getPrecioCompra();
      const cantidadEnMercado = await getCantidadEnMercado();


      if (precioEcto !== null && precioCompra !== null) {
        const precioTotal = cantidadEctos * precioEcto * 0.9;
        const precioEcto90 = Math.floor(precioEcto * 0.9);

        const calcularMonedas = (precio) => {
          const oro = Math.floor(precio / 10000);
          const plata = Math.floor((precio % 10000) / 100);
          const cobre = parseInt(precio % 100);
          return `${oro} <:gold:1134754786705674290> ${plata} <:silver:1134756015691268106> ${cobre} <:Copper:1134756013195661353>`;
        };

        let description = `Precio de venta de 1 Ecto: ${calcularMonedas(precioEcto)}`;
        description += `\nPrecio de compra de 1 Ecto: ${calcularMonedas(precioCompra)}`;
        description += `\n\n**Precio Ecto al 90%: ${calcularMonedas(precioEcto90)}**`;
        description += `\n\n\n**_Precio de ${cantidadEctos} Ectos al 90%: ${calcularMonedas(precioTotal)}_**`;
        description += `\n\n**Cantidad en el mercado: ${cantidadEnMercado} unidades**`;



        const ltcLink = `https://www.gw2bltc.com/en/item/19721`;
        const iconURL = await getIconURL('https://api.guildwars2.com/v2/items/19721');    

        const embed = {
          title: `Precio de venta de Ectos`,
          description: description,
          color: 0xffff00,
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
        await interaction.reply('No se pudo obtener el precio de venta o compra de 1 Ecto desde la API.');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud a la API:', error.message);
      await interaction.reply('¡Ups! Hubo un error al obtener el precio de venta o compra de Ectos desde la API.');
    }
  },
};

async function getIconURL(objetoId) {
  try {
    const response = await axios.get(objetoId);
    const objetoDetails = response.data;
    return objetoDetails.icon;
  } catch (error) {
    console.error('Error al obtener la URL del ícono desde la API:', error.message);
    return null;
  }
}

async function getCantidadEnMercado() {
  try {
    const response = await axios.get('https://api.guildwars2.com/v2/commerce/prices/19721');
    const mercado = response.data;

    if (mercado && mercado.sells && mercado.buys) {
      const cantidadSells = mercado.sells.quantity;
     // const cantidadBuys = mercado.buys.quantity;
      return cantidadSells;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la cantidad en el mercado de Ectoplasmas desde la API:', error.message);
    return null;
  }
}

async function getPrecioEcto() {
  try {
    const response = await axios.get('https://api.guildwars2.com/v2/commerce/prices/19721');
    const ecto = response.data;
    return ecto.sells.unit_price;
  } catch (error) {
    console.error('Error al obtener el precio de venta de 1 Ecto desde la API:', error.message);
    return null;
  }
}

async function getPrecioCompra() {
  try {
    const response = await axios.get('https://api.guildwars2.com/v2/commerce/prices/19721');
    const ecto = response.data;
    return ecto.buys.unit_price;
  } catch (error) {
    console.error('Error al obtener el precio de compra de 1 Ecto desde la API:', error.message);
    return null;
  }
}
