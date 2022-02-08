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

export interface State {
  id: string;
  platformId: string;
  currencyId: string;
}

export interface Recipes {
  [id: string]: Recipe;
}

export interface Recipe {
  id: string;
  name: string;
  ingredientList: Ingredient[];
}

export type IngredientType = "state" | "action";

export interface Ingredient {
  id: string;
  unitId: string;
  type: IngredientType;
  index: number;
}

export type LinkStatus = "active" | "inactive";
export type LinkMode = "readonly" | "editable";

export interface Link {
  id: string;
  name: string;
  duration?: number;
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

export interface AppData {
  currencies: Currency[];
  platforms: Platform[];
  actions: Action[];
  links?: Link[];
  states?: State[];
  stateOrder?: string[];
  recipes: Recipes;
  recipeOrder?: string[];
}
