export interface Currency {
  id: string;
  name: string;
}

export interface Platform {
  id: string;
  name: string;
  allowedActions?: string[];
  forbiddenActions?: string[];
  allowedCurrencies?: string[];
  forbiddenCurrencies?: string[];
}

export interface Action {
  id: string;
  name: string;
}

export interface Wallet {
  id: string;
  platformId: string;
  currencyId: string;
}

export interface Routes {
  [id: string]: Route;
}

export interface Route {
  id: string;
  name: string;
  ingredientList: Ingredient[];
  approveCount?: number;
  lastApproveTime?: number;
  disapproveCount?: number;
  lastDisapproveTime?: number;
}

export type IngredientType = "wallet" | "action";

export interface Ingredient {
  id: string;
  unitId: string;
  type: IngredientType;
}

export type LinkStatus = "active" | "inactive";
export type LinkMode = "readonly" | "editable";

export interface Link {
  id: string;
  name?: string;
  duration?: number;
  durationUnit?: number;
  costFix?: number;
  costCurrencyId?: string;
  costPercentage?: number;
  sourcePlatformId?: string;
  destPlatformId?: string;
  sourceCurrencyId?: string;
  destCurrencyId?: string;
  actionId?: string;
  status?: LinkStatus;
  author?: string;
  mode?: LinkMode;
}

export interface PotentialLink extends Link {
  index?: number;
  routeId?: string;
}

export interface AppData {
  currencies: Currency[];
  platforms: Platform[];
  actions: Action[];
  links: Link[];
  wallets: Wallet[];
  walletOrder: string[];
  routes: Routes;
  routeOrder: string[];
}
