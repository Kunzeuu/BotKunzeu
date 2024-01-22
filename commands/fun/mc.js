  const { SlashCommandBuilder } = require('discord.js');
  const axios = require('axios');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('mc')
      .setDescription('Muestra el precio de venta de Monedas Místicas.')
      .addIntegerOption(option =>
        option.setName('cantidad')
          .setDescription('Cantidad de Monedas Místicas para calcular el precio.')
          .setRequired(true)),
    async execute(interaction) {
      const cantidadMonedas = interaction.options.getInteger('cantidad');
  
      if (cantidadMonedas <= 0) {
        await interaction.reply('La cantidad de Monedas Místicas debe ser mayor que 0.');
        return;
      }
  
      try {
        const precioMoneda = await getPrecioMoneda();
        const precioCompra = await getPrecioCompra();
        const cantidadEnMercado = await getCantidadEnMercado();
  
        if (precioMoneda !== null && cantidadEnMercado !== null) {
          const precioTotal = cantidadMonedas * precioMoneda * 0.9;
          const precioMoneda90 = Math.floor(precioMoneda * 0.9);
  
          const calcularMonedas = (precio) => {
            const oro = Math.floor(precio / 10000);
            const plata = Math.floor((precio % 10000) / 100);
            const cobre = parseInt(precio % 100);
            return `${oro} <:gold:1134754786705674290> ${plata} <:silver:1134756015691268106> ${cobre} <:Copper:1134756013195661353>`;
          };
  
          let description = `Precio de venta de 1 Moneda Mística: ${calcularMonedas(precioMoneda)}`;
          description += `\nPrecio de compra de 1 Moneda Mística: ${calcularMonedas(precioCompra)}`;
          description += `\n\n**Precio de Moneda Mística al 90%: ${calcularMonedas(precioMoneda90)}**`;
          description += `\n\n\n**_Precio de ${cantidadMonedas} Moneda Mística al 90%: ${calcularMonedas(precioTotal)}_**`;
          description += `\n\n**Cantidad en el mercado: ${cantidadEnMercado} unidades**`;
  
          const ltcLink = `https://www.gw2bltc.com/en/item/19976`;
          const iconURL = await getIconURL('https://api.guildwars2.com/v2/items/19976');    
  
          const embed = {
            title: `Precio de venta de Monedas Místicas`,
            description: description,
            color: 0xff0000,
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
          await interaction.reply('No se pudo obtener la información desde la API.');
        }
      } catch (error) {
        console.error('Error al realizar la solicitud a la API:', error.message);
        await interaction.reply('¡Ups! Hubo un error al obtener la información desde la API.');
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
      const response = await axios.get('https://api.guildwars2.com/v2/commerce/prices/19976');
      const mercado = response.data;
  
      if (mercado && mercado.sells && mercado.buys) {
        const cantidadSells = mercado.sells.quantity;
       // const cantidadBuys = mercado.buys.quantity;
        return cantidadSells;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la cantidad en el mercado de Monedas Místicas desde la API:', error.message);
      return null;
    }
  }
  
  async function getPrecioMoneda() {
    try {
      const response = await axios.get('https://api.guildwars2.com/v2/commerce/prices/19976');
      const moneda = response.data;
      return moneda.sells.unit_price;
    } catch (error) {
      console.error('Error al obtener el precio de venta de 1 Moneda Mística desde la API:', error.message);
      return null;
    }
  }
  
  async function getPrecioCompra() {
    try {
      const response = await axios.get('https://api.guildwars2.com/v2/commerce/prices/19976');
      const moneda = response.data;
      return moneda.buys.unit_price;
    } catch (error) {
      console.error('Error al obtener el precio de compra de 1 Ecto desde la API:', error.message);
      return null;
    }
  }
  