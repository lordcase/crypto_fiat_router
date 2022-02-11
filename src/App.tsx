import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import initialData from "./initial-data";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import {
  Action,
  AppData,
  Link,
  Wallet,
  Platform,
  Currency,
  PotentialLink,
  IngredientType,
} from "./common/types";
import Hide from "./common/Hide";

function App() {
  useEffect(() => {
    // console.log("rerendeeeer");
    // console.log(appState);
  });

  const [appState, setAppState] = useState<AppData>(initialData);
  const [newWalletUnitPlatform, setNewWalletUnitPlatform] = useState<string>(
    initialData.platforms[0].id
  );
  const [newWalletUnitCurrency, setNewWalletUnitCurrency] = useState<string>(
    initialData.currencies[0].id
  );
  const [newRecipeName, setNewRecipeName] = useState<string>("");
  const [addWalletUnitPopupVisibility, setAddWalletUnitPopupVisibility] =
    useState<boolean>(true);
  const [createLinkWarningVisibility, setCreateLinkWarningVisibility] =
    useState<boolean>(true);
  const [createLinkPopupVisibility, setCreateLinkPopupVisibility] =
    useState<boolean>(true);
  const [addRecipePopupVisibility, setAddRecipePopupVisibility] =
    useState<boolean>(true);
  const [potentialLinkData, setPotentialLinkData] = useState<PotentialLink>({
    id: "",
    name: "",
  });

  const addWallet = () => {
    const newWallet: Wallet = {
      id: nanoid(),
      platformId: newWalletUnitPlatform,
      currencyId: newWalletUnitCurrency,
    };
    setAppState((prev) => ({
      ...prev,
      wallets: prev.wallets ? [...prev.wallets, newWallet] : [newWallet],
    }));
  };

  const addRecipe = () => {
    const newId = `recipe_${nanoid()}`;
    setAppState((prev) => ({
      ...prev,
      recipes: {
        ...prev.recipes,
        [newId]: {
          id: newId,
          name: newRecipeName,
          approveCount: 0,
          disapproveCount: 0,
          ingredientList: [],
        },
      },
    }));
    setAppState((prev) => ({
      ...prev,
      recipeOrder: [...(prev.recipeOrder || []), newId],
    }));
  };

  const addLink = () => {
    // console.log(potentialLinkData);
    const { id, duration, durationUnit, name, costFix } = potentialLinkData;
    const newLink: Link = {
      id: id,
      name: name,
      duration: duration,
      costFix: costFix,
      durationUnit: durationUnit,
    };
    if (potentialLinkData.recipeId) {
      setAppState((prev) => {
        const recipe = prev.recipes[potentialLinkData.recipeId || 0];
        const ingredientList = recipe.ingredientList;
        const index = potentialLinkData
          ? potentialLinkData.index
            ? potentialLinkData.index
            : 0
          : 0;
        const newIngredientList = [
          ...ingredientList.slice(0, index),
          {
            id: nanoid(),
            type: "action" as IngredientType,
            unitId: id,
          },
          ...ingredientList.slice(potentialLinkData.index),
        ];
        const newRecipe = { ...recipe, ingredientList: newIngredientList };
        return {
          ...prev,
          links: [...prev.links, newLink],
          recipes: { ...prev.recipes, [recipe.id]: newRecipe },
        };
      });
    }
    setCreateLinkPopupVisibility(true);
  };

  const getUnitTypeById = (id: string): "wallet" | "link" => {
    return getWalletById(id) ? "wallet" : "link";
  };

  const getWalletById = (id: string): Wallet | undefined => {
    return appState.wallets?.find((wallet) => wallet.id === id);
  };

  const getLinkById = (id: string): Link | undefined => {
    return appState.links?.find((link) => link.id === id);
  };

  const selectPlatform = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = event.target.value;
    setNewWalletUnitPlatform(value);
  };
  const selectCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = event.target.value;
    setNewWalletUnitCurrency(value);
  };
  const changeRecipeName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    setNewRecipeName(value);
  };
  const approveRecipe = (recipeId: string) => {
    setAppState((prev) => {
      const recipe = appState.recipes[recipeId];
      const newRecipe = {
        ...recipe,
        approveCount: recipe.approveCount ? recipe.approveCount + 1 : 1,
      };
      return { ...prev, recipes: { ...prev.recipes, [recipeId]: newRecipe } };
    });
  };

  const disapproveRecipe = (recipeId: string) => {
    setAppState((prev) => {
      const recipe = appState.recipes[recipeId];
      const newRecipe = {
        ...recipe,
        disapproveCount: recipe.disapproveCount
          ? recipe.disapproveCount + 1
          : 1,
      };
      return { ...prev, recipes: { ...prev.recipes, [recipeId]: newRecipe } };
    });
  };

  const getPlatformByIngredientId = (id: string | undefined): Platform => {
    const ingredient: Wallet | undefined = appState.wallets?.find(
      (wallet) => wallet.id === id
    );

    const platform: Platform | undefined =
      ingredient &&
      appState.platforms.find(
        (platform) => platform.id === ingredient.platformId
      );
    return platform || { id: "", name: "" };
  };
  const getPlatformNameByIngredientId = (id: string | undefined): string => {
    const platform = getPlatformByIngredientId(id);
    return platform?.name || "";
  };
  const getCurrencyByIngredientId = (id: string | undefined): Currency => {
    const ingredient: Wallet | undefined = appState.wallets.find(
      (wallet) => wallet.id === id
    );

    const currency: Currency | undefined =
      ingredient &&
      appState.currencies.find(
        (currency) => currency.id === ingredient.currencyId
      );
    return currency || { id: "", name: "" };
  };

  const getCurrencyNameByIngredientId = (id: string | undefined): string => {
    const currency = getCurrencyByIngredientId(id);
    return currency?.name || "";
  };
  const changePotentialLinkData = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ): void => {
    const field = event.target.dataset["field"] as string;
    setPotentialLinkData((prev) => ({ ...prev, [field]: event.target.value }));
  };
  const calculateTotalRecipeDuration = (recipeId: string) => {
    console.log("whoa");

    const links = appState.recipes[recipeId].ingredientList.filter(
      (ingredient) => ingredient.type === "action"
    );
    const duration: number = links.reduce((acc, curr, index) => {
      console.log(
        "heyy",
        index,
        acc,
        appState.links.find((link) => link.id === curr.unitId)?.["duration"]
      );
      const currUnit = appState.links.find((link) => link.id === curr.unitId);
      return currUnit ? (currUnit.duration ? currUnit.duration : 0) : 0;
    }, 0);
    return duration;
  };
  const onDragUpdate = (data: any) => {
    // console.log(data);
    if (!data.destination) {
      setCreateLinkWarningVisibility(true);
      return;
    }
    if (!appState.recipes[data.destination.droppableId]?.ingredientList) {
      setCreateLinkWarningVisibility(true);
      return;
    }
    const ingredientList =
      appState.recipes[data.destination.droppableId]?.ingredientList;
    const index = data.destination.index;
    if (
      data.draggableId.search("action") !== -1 &&
      ingredientList &&
      ingredientList[index - 1]?.type === "wallet" &&
      ingredientList[index]?.type === "wallet"
    ) {
      setCreateLinkWarningVisibility(false);
    } else {
      setCreateLinkWarningVisibility(true);
    }
  };
  const onDragEnd = (data: any) => {
    const { source, destination, reason, draggableId } = data;
    if (!destination) return;
    if (reason !== "DROP") return;
    const destId = destination.droppableId;
    if (destination.droppableId.includes("recipe")) {
      const currentRecipe = appState.recipes[destId];
      if (source.droppableId === "wallets") {
        const newId = nanoid();
        setAppState((prev) => ({
          ...prev,
          recipes: {
            ...prev.recipes,
            [destId]: {
              ...prev.recipes[destId],
              ingredientList: [
                ...currentRecipe.ingredientList?.slice(0, destination.index),
                {
                  id: newId,
                  unitId: draggableId,
                  type: getUnitTypeById(draggableId),
                },
                ...currentRecipe.ingredientList?.slice(destination.index),
              ],
            },
          },
        }));
      } else if (source.droppableId === "actions") {
        const { index } = destination;
        const action = appState.actions.find(
          (action) => action.id === draggableId
        );
        const ingredientList =
          appState.recipes[destination.droppableId].ingredientList;
        if (
          ingredientList[index - 1]?.type === "wallet" &&
          ingredientList[index]?.type === "wallet"
        ) {
          const sourcePlatform = getPlatformByIngredientId(
            ingredientList[index - 1]?.unitId
          );
          const destPlatform = getPlatformByIngredientId(
            ingredientList[index]?.unitId
          );
          const sourceCurrency = getCurrencyByIngredientId(
            ingredientList[index - 1]?.unitId
          );
          const destCurrency = getCurrencyByIngredientId(
            ingredientList[index]?.unitId
          );
          setPotentialLinkData({
            id: nanoid(),
            name: action?.name,
            sourcePlatformId: sourcePlatform.id,
            destPlatformId: destPlatform.id,
            sourceCurrencyId: sourceCurrency.id,
            destCurrencyId: destCurrency.id,
            actionId: draggableId,
            recipeId: destId,
            index: index,
          });
          setCreateLinkPopupVisibility(false);
        }
      } else if (source.droppableId === destination.droppableId) {
        setAppState((prev) => {
          const step1 = [
            ...currentRecipe.ingredientList.slice(0, source.index),
            ...currentRecipe.ingredientList.slice(source.index + 1),
          ];
          const step2 = [
            ...step1.slice(0, destination.index),
            {
              id: draggableId,
              unitId: prev.recipes[destId].ingredientList.find(
                (ingredient) => ingredient.id === draggableId
              )?.unitId,
              type: getUnitTypeById(draggableId),
            },
            ...step1.slice(destination.index),
          ];
          return {
            ...prev,
            recipes: {
              ...prev.recipes,
              [destId]: { ...prev.recipes[destId], ingredientList: step2 },
            },
          };
        });
      }
    }
  };

  return (
    <div>
      <Hide when={createLinkPopupVisibility}>
        <CreateLinkOverlay>
          <CreateLinkContent>
            <CloseButtonContainer>
              <button onClick={() => setCreateLinkPopupVisibility(true)}>
                X
              </button>
            </CloseButtonContainer>
            <CreateLinkData>
              <div>id: </div>
              <div>{potentialLinkData.id}</div>
              <div>name: </div>
              <div>
                <input
                  value={potentialLinkData.name}
                  onChange={changePotentialLinkData}
                  data-field="name"
                />
              </div>
              <div>source platform:</div>
              <div>{potentialLinkData.sourcePlatformId}</div>
              <div>dest platform:</div>
              <div>{potentialLinkData.destPlatformId}</div>
              <div>source currency:</div>
              <div>{potentialLinkData.sourceCurrencyId}</div>
              <div>dest currency:</div>
              <div>{potentialLinkData.destCurrencyId}</div>
              <div>action id:</div>
              <div>{potentialLinkData.actionId}</div>
              <div>Cost:</div>
              <div>
                <input
                  value={potentialLinkData.costFix}
                  data-field="costFix"
                  onChange={changePotentialLinkData}
                />
              </div>
              <div>duration:</div>
              <div>
                <input
                  value={potentialLinkData.duration}
                  data-field="duration"
                  onChange={changePotentialLinkData}
                />
                <select
                  value={potentialLinkData.durationUnit}
                  onChange={changePotentialLinkData}
                  data-field="durationUnit"
                >
                  <option value="1">seconds</option>
                  <option value="60">minutes</option>
                  <option value="3600">hours</option>
                  <option value="86400">days</option>
                </select>
              </div>
            </CreateLinkData>
            <div style={{ textAlign: "center", paddingTop: "10px" }}>
              <button onClick={() => addLink()}>Add Link</button>
            </div>
          </CreateLinkContent>
        </CreateLinkOverlay>
      </Hide>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <Container>
          <WalletContainer>
            <Title>Wallets</Title>
            <button
              onClick={() => setAddWalletUnitPopupVisibility((prev) => !prev)}
            >
              Add new +
            </button>
            <Hide when={addWalletUnitPopupVisibility}>
              <UnitAdderPopup>
                Platform:
                <select onChange={selectPlatform}>
                  {appState.platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
                <br />
                Currency:
                <select onChange={selectCurrency}>
                  {appState.currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name}
                    </option>
                  ))}
                </select>
                <br />
                <button onClick={addWallet}>Add </button>
              </UnitAdderPopup>
            </Hide>
            <Droppable
              droppableId="wallets"
              direction="horizontal"
              // isDropDisabled={true}
            >
              {(provided) => (
                <Wallets {...provided.droppableProps} ref={provided.innerRef}>
                  {appState.wallets?.map((walletUnit, index) => (
                    <Draggable
                      draggableId={walletUnit.id}
                      index={index}
                      key={walletUnit.id}
                    >
                      {(provided) => (
                        <WalletUnit
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Tiny>{walletUnit.id}</Tiny> <br />{" "}
                          {walletUnit.platformId} <br />
                          {walletUnit.currencyId}
                        </WalletUnit>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Wallets>
              )}
            </Droppable>
          </WalletContainer>
          <ActionContainer>
            <Title>Actions</Title>
            <Droppable droppableId="actions" direction="horizontal">
              {(provided) => (
                <Actions ref={provided.innerRef} {...provided.droppableProps}>
                  {/* {JSON.stringify(snapshot)} */}
                  {appState.actions.map((action, index) => (
                    <Draggable
                      draggableId={action.id}
                      index={index}
                      key={action.id}
                    >
                      {(provided, snapshot) => (
                        <ActionUnit
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          {action.name}
                          <Indicator
                            hide={
                              createLinkWarningVisibility ||
                              !snapshot.isDragging
                            }
                          >
                            !DROP TO LINK!
                          </Indicator>
                        </ActionUnit>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Actions>
              )}
            </Droppable>
          </ActionContainer>
          <FilterContainer>
            <Title>Filters</Title>
          </FilterContainer>
          <RecipeContainer>
            <Title>Recipes</Title>
            <div>
              <button
                onClick={() => setAddRecipePopupVisibility((prev) => !prev)}
              >
                Add new +
              </button>
              <Hide when={addRecipePopupVisibility}>
                <UnitAdderPopup>
                  Name:
                  <input onChange={changeRecipeName} value={newRecipeName} />
                  <br />
                  <button onClick={addRecipe}>Add </button>
                </UnitAdderPopup>
              </Hide>
            </div>
            {appState.recipeOrder?.map((recipeId) => (
              <div key={`a${recipeId}`}>
                <Droppable
                  droppableId={recipeId}
                  direction="horizontal"
                  key={recipeId}
                >
                  {(provided) => (
                    <Recipe
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <RecipeName>
                        {`${
                          appState.recipes[recipeId].name
                        }(${getPlatformNameByIngredientId(
                          appState.recipes[recipeId]?.ingredientList[0]?.unitId
                        )}(${getCurrencyNameByIngredientId(
                          appState.recipes[recipeId]?.ingredientList[0]?.unitId
                        )}) -> ${getPlatformNameByIngredientId(
                          appState.recipes[recipeId]?.ingredientList?.at(-1)
                            ?.unitId
                        )}(${getCurrencyNameByIngredientId(
                          appState.recipes[recipeId]?.ingredientList?.at(-1)
                            ?.unitId
                        )}))`}{" "}
                        Total duration: {calculateTotalRecipeDuration(recipeId)}
                      </RecipeName>
                      {appState.recipes[recipeId].ingredientList?.map(
                        (ingredient, index) => (
                          <Draggable
                            draggableId={ingredient.id}
                            index={index}
                            key={ingredient.id}
                          >
                            {(provided) => {
                              return ingredient.type === "wallet" ? (
                                <IngredientWallet
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <Tiny>
                                    {ingredient.id} <br /> {ingredient.unitId}
                                  </Tiny>
                                  <br />
                                  {
                                    getWalletById(ingredient.unitId)?.[
                                      "platformId"
                                    ]
                                  }{" "}
                                  <br />
                                  {
                                    getWalletById(ingredient.unitId)?.[
                                      "currencyId"
                                    ]
                                  }
                                </IngredientWallet>
                              ) : (
                                <IngredientAction
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <Arrow>&lt;</Arrow>
                                  <div>
                                    <Tiny>
                                      {ingredient.id} <br /> {ingredient.unitId}
                                    </Tiny>
                                    <br />
                                    <div>
                                      {getLinkById(ingredient.unitId)?.["name"]}
                                    </div>
                                    <Small>
                                      <div>
                                        Duration:
                                        {
                                          getLinkById(ingredient.unitId)?.[
                                            "duration"
                                          ]
                                        }
                                      </div>
                                      <div>
                                        Cost:
                                        {
                                          getLinkById(ingredient.unitId)?.[
                                            "costFix"
                                          ]
                                        }
                                      </div>
                                    </Small>
                                  </div>
                                  <Arrow>&gt;</Arrow>
                                </IngredientAction>
                              );
                            }}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </Recipe>
                  )}
                </Droppable>
                <RecipeMeta>
                  <div>
                    Approve: {appState.recipes[recipeId]?.approveCount}
                    <button onClick={() => approveRecipe(recipeId)}>👍</button>
                  </div>
                  <div>
                    Disapprove: {appState.recipes[recipeId]?.disapproveCount}
                    <button onClick={() => disapproveRecipe(recipeId)}>
                      👎
                    </button>
                  </div>
                </RecipeMeta>
              </div>
            ))}
          </RecipeContainer>
        </Container>
      </DragDropContext>
    </div>
  );
}
export default App;

const CreateLinkOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(90, 90, 90, 0.2);
  z-index: 2;
  display: flex;
  flex-direction: rows;
  justify-content: center;
  align-items: center;
`;
const CreateLinkContent = styled.div`
  background-color: rgba(90, 90, 90, 0.8);
  padding: 10px;
  border-radius: 5px;
  color: white;
  position: relative;
`;
const CloseButtonContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  display: inline-block;
`;

const CreateLinkData = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 5px 10px;
  padding-top: 10px;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 200px 30px 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "wallets actions" "filters filters" "recipes recipes";
  & > * {
    border: 1px solid black;
  }
`;

const FilterContainer = styled.div`
  grid-area: filters;
`;
const WalletContainer = styled.div`
  grid-area: wallets;
`;
const ActionContainer = styled.div`
  grid-area: actions;
`;
const Actions = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;
const Wallets = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;
interface IndicatorProps {
  hide: boolean;
}
const Indicator = styled.div<IndicatorProps>`
  height: 30px;
  overflow: hidden;
  text-align: center;
  color: green;
  visibility: ${(props) => (props.hide ? "hidden" : "visible")};
`;

const Unit = styled.div`
  padding: 5px;
  background: lightgray;
  border-radius: 5px;
  border: 1px solid gray;
  text-align: center;
  margin: 0 7px;
`;
const WalletUnit = styled(Unit)``;
const IngredientWallet = styled(Unit)``;
const IngredientAction = styled(Unit)`
  z-index: 2;
  display: flex;
  margin-left: 0;
  margin-right: 0;
`;
const ActionUnit = styled(Unit)``;
const Arrow = styled.div`
  align-self: center;
  transform: scaleY(11);
  position: relative;
  top: -15px;
`;

const UnitAdderPopup = styled.div`
  /* position: absolute;*/
  z-index: 10;
`;

const Title = styled.h3`
  margin: 5px;
`;
const RecipeContainer = styled.div`
  grid-area: recipes;
  position: relative;
`;
const RecipeName = styled.h5`
  margin: 5px;
  position: absolute;
  display: inline-block;
  top: 1px;
`;
const RecipeMeta = styled.div`
  background-color: gray;
  display: flex;
  gap: 30px;
  padding-left: 15px;
  color: white;
`;

const Recipe = styled.div`
  display: flex;
  position: relative;
  min-width: 100px;
  min-height: 100px;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px 10px 10px;
  margin: 5px 0 0;
  background-color: lightgreen;
`;

const Small = styled.span`
  font-size: 0.75rem;
`;
const Tiny = styled.span`
  font-size: 0.5rem;
`;
