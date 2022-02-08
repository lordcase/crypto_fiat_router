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
    { id: "SEPA", name: "SEPA transfer" },
    { id: "SWIFT", name: "SWIFT transfer" },
    { id: "CRYPTOTX", name: "CRYPTO transfer" },
    { id: "EXCHANGE", name: "Exchange" },
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
  recipes: {
    recipe_GGUBbciNODYsieVAv5qzb: {
      id: "recipe_GGUBbciNODYsieVAv5qzb",
      name: "kettoooo",
      ingredientList: [],
    },
    recipe_111BbciNODYsieVAv5qzb: {
      id: "recipe_111BbciNODYsieVAv5qzb",
      name: "egggy",
      ingredientList: [],
    },
  },
  recipeOrder: ["recipe_GGUBbciNODYsieVAv5qzb", "recipe_111BbciNODYsieVAv5qzb"],
};

export default initialData;
