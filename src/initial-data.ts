import { AppData } from "./common/types";

const initialData: AppData = {
  currencies: [
    { id: "USD", name: "USD" },
    { id: "EUR", name: "EUR" },
    { id: "BTC", name: "BTC" },
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
  links: [
    {
      id: "link_sYaOHj0UEgXMHTRPZEs2Q",
      name: "",
      duration: 360,
      costFix: 100,
      costCurrencyId: "EUR",
      costPercentage: 0.3,
      sourcePlatformId: "REVOLUT",
      destPlatformId: "KRAKEN",
      sourceCurrencyId: "EUR",
      destCurrencyId: "EUR",
      actionId: "SEPA",
      status: "active",
      author: "",
      mode: "editable",
    },
    {
      id: "link_GGUBbciNODYZAvVAv5qzb",
      name: "",
      duration: 3600,
      costFix: 30,
      costCurrencyId: "EUR",
      costPercentage: 0.3,
      sourcePlatformId: "KRAKEN",
      sourceCurrencyId: "EUR",
      destCurrencyId: "BTC",
      destPlatformId: "KRAKEN",
      actionId: "EXCHANGE",
      status: "active",
      author: "",
      mode: "editable",
    },
  ],
  blocks: {},
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
  routes: {
    route_GGUBbciNODYsieVAv5qzb: {
      id: "route_GGUBbciNODYsieVAv5qzb",
      name: "Sample route",
      ingredientList: [],
      approveCount: 0,
      disapproveCount: 0,
    },
  },
  routeOrder: ["route_GGUBbciNODYsieVAv5qzb"],
};

export default initialData;
