import { AppData } from "./common/types";

const initialDataEmpty: AppData = {
  currencies: [],
  platforms: [],
  actions: [],
  links: {},
  blocks: {},
  blockOrder: [],
  wallets: [],
  walletOrder: [],
  filters: {
    startPlatform: [],
    endPlatform: [],
    startCurrency: [],
    endCurrency: [],
  },
  routes: {},
  routeOrder: [],
};

export default initialDataEmpty;
