import { AppData } from "./common/types";

const initialData: AppData = {
  currencies: [
    { id: "USD", name: "USD" },
    { id: "EUR", name: "EUR" },
    { id: "BTC", name: "BTC" },
    { id: "HUF", name: "HUF" },
  ],
  platforms: [
    { id: "REVOLUT", name: "Revolut" },
    { id: "KRAKEN", name: "Kraken" },
    { id: "BINANCE", name: "Binance" },
    { id: "CITYBANK", name: "City Bank" },
  ],
  actions: [
    { id: "action_SEPA", name: "SEPA transfer" },
    { id: "action_SWIFT", name: "SWIFT transfer" },
    { id: "action_ERC20", name: "ERC20 transfer" },
    { id: "action_BEP20", name: "BEP20 transfer" },
    { id: "action_BEP2", name: "BEP2 transfer" },
    { id: "action_EXCHANGE", name: "Exchange" },
  ],
  links: {},
  blocks: {
    block_8a9bFlLdYQ_GViANVHVj8: {
      id: "block_8a9bFlLdYQ_GViANVHVj8",
      name: "asd",
      duration: 9900,
      durationUnit: 60,
      costFix: 0,
      wallet1Id: "wallet_555iiiiNODYsieVAv5555",
      wallet2Id: "wallet_666iiiiNODYsieVAv5666",
      linkId: "action_BEP2",
    },
    block_cGRbn85wsFZ2Uwim5Pgf1: {
      id: "block_cGRbn85wsFZ2Uwim5Pgf1",
      name: "adfadsf",
      duration: 5,
      durationUnit: 1,
      costFix: 10,
      wallet1Id: "wallet_666iiiiNODYsieVAv5666",
      wallet2Id: "wallet_555iiiiNODYsieVAv5555",
      linkId: "action_BEP2",
    },
  },
  blockOrder: [],
  wallets: [
    {
      id: "wallet_111iiiiNODYsieVAv5111",
      platformId: "BINANCE",
      currencyId: "BTC",
    },
    {
      id: "wallet_222iiiiNODYsieVAv5222",
      platformId: "BINANCE",
      currencyId: "EUR",
    },
    {
      id: "wallet_333iiiiNODYsieVAv5333",
      platformId: "KRAKEN",
      currencyId: "BTC",
    },
    {
      id: "wallet_444iiiiNODYsieVAv5444",
      platformId: "KRAKEN",
      currencyId: "EUR",
    },
    {
      id: "wallet_555iiiiNODYsieVAv5555",
      platformId: "REVOLUT",
      currencyId: "EUR",
    },
    {
      id: "wallet_666iiiiNODYsieVAv5666",
      platformId: "REVOLUT",
      currencyId: "HUF",
    },
  ],
  walletOrder: [],
  filters: {
    startPlatform: [],
    endPlatform: [],
    startCurrency: [],
    endCurrency: [],
  },
  routes: {
    "route_A871AiCeVZI9z4kA-fZMk": {
      id: "route_A871AiCeVZI9z4kA-fZMk",
      name: "yello",
      approveCount: 0,
      disapproveCount: 0,
      blockList: ["block_8a9bFlLdYQ_GViANVHVj8", "block_cGRbn85wsFZ2Uwim5Pgf1"],
    },
  },
  routeOrder: ["route_A871AiCeVZI9z4kA-fZMk"],
};

export default initialData;
