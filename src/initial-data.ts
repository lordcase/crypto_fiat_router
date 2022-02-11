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
    { id: "action_CRYPTOTX", name: "CRYPTO transfer" },
    { id: "action_EXCHANGE", name: "Exchange" },
  ],
  links: [
    {
      id: "sYaOHj0UEgXMHTRPZEs2Q",
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
      id: "GGUBbciNODYZAvVAv5qzb",
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
  wallets: [],
  walletOrder: [],
  recipes: {
    recipe_GGUBbciNODYsieVAv5qzb: {
      id: "recipe_GGUBbciNODYsieVAv5qzb",
      name: "Sample recipe",
      ingredientList: [],
      approveCount: 0,
      disapproveCount: 0,
    },
  },
  recipeOrder: ["recipe_GGUBbciNODYsieVAv5qzb"],
};

export default initialData;
