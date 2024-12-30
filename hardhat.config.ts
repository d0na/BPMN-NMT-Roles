import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  gasReporter: {
    enabled: true,
    currency: "USD", // Puoi specificare anche ETH
    outputFile: "gas-report.txt", // Nome del file di output
    noColors: true, // Rimuove i colori per rendere il file più leggibile
    // coinmarketcap: "<API_KEY>", // (Opzionale) Per ottenere i costi in USD basati sui prezzi di CoinMarketCap
},
};

export default config;
