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
  State,
  Platform,
  Currency,
} from "./common/types";
import Hide from "./common/Hide";

function App() {
  useEffect(() => {
    console.log("rerendeeeer");
  });

  const [appState, setAppState] = useState<AppData>(initialData);
  const [newStateUnitPlatform, setNewStateUnitPlatform] = useState<string>(
    initialData.platforms[0].id
  );
  const [newStateUnitCurrency, setNewStateUnitCurrency] = useState<string>(
    initialData.currencies[0].id
  );
  const [newRecipeName, setNewRecipeName] = useState<string>("");
  const [addStateUnitPopupVisibility, setAddStateUnitPopupVisibility] =
    useState<boolean>(false);
  const [createLinkWarningVisibility, setCreateLinkWarningVisibility] =
    useState<boolean>(true);
  const [createLinkPopupVisibility, setCreateLinkPopupVisibility] =
    useState<boolean>(true);
  const [addRecipePopupVisibility, setAddRecipePopupVisibility] =
    useState<boolean>(true);
  const [potentialLinkData, setPotentialLinkData] = useState<Link>({
    id: "",
    name: "",
  });

  const addState = () => {
    const newState: State = {
      id: nanoid(),
      platformId: newStateUnitPlatform,
      currencyId: newStateUnitCurrency,
    };
    setAppState((prev) => ({
      ...prev,
      states: prev.states ? [...prev.states, newState] : [newState],
    }));
  };

  const addRecipe = () => {
    const newId = `recipe_${nanoid()}`;
    setAppState((prev) => ({
      ...prev,
      recipes: {
        ...prev.recipes,
        [newId]: { id: newId, name: newRecipeName, ingredientList: [] },
      },
    }));
    setAppState((prev) => ({
      ...prev,
      recipeOrder: [...(prev.recipeOrder || []), newId],
    }));
  };

  const getUnitTypeById = (id: string): "state" | "link" => {
    return getStateById(id) ? "state" : "link";
  };

  const getStateOrActionById = (id: string): State | Action | undefined => {
    return getStateById(id) || getLinkById(id);
  };

  const getStateById = (id: string): State | undefined => {
    return appState.states?.find((state) => state.id === id);
  };

  const getLinkById = (id: string): Link | undefined => {
    return appState.links?.find((link) => link.id === id);
  };

  const selectPlatform = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = event.target.value;
    setNewStateUnitPlatform(value);
  };
  const selectCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = event.target.value;
    setNewStateUnitCurrency(value);
  };
  const changeRecipeName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    setNewRecipeName(value);
  };
  const getPlatformByIngredientId = (id: string | undefined): Platform => {
    const ingredient: State | undefined = appState.states?.find(
      (state) => state.id === id
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
    const ingredient: State | undefined = appState.states.find(
      (state) => state.id === id
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

  const onDragUpdate = (data: any) => {
    console.log(data);
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
      ingredientList[index - 1]?.type === "state" &&
      ingredientList[index]?.type === "state"
    ) {
      console.log("ezzazz");
      setCreateLinkWarningVisibility(false);
    } else {
      setCreateLinkWarningVisibility(true);
    }
  };
  const onDragEnd = (data: any) => {
    const { source, destination, reason, draggableId } = data;
    if (!destination) return;
    if (reason !== "DROP") return;
    if (destination.droppableId.includes("recipe")) {
      const destId = destination.droppableId;
      const currentRecipe = appState.recipes[destId];
      if (source.droppableId === "states") {
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
        const ingredientList =
          appState.recipes[destination.droppableId].ingredientList;
        if (
          ingredientList[index - 1]?.type === "state" &&
          ingredientList[index]?.type === "state"
        ) {
          const sourcePlatform = getPlatformByIngredientId(
            ingredientList[index - 1]?.id
          );
          const destPlatform = getPlatformByIngredientId(
            ingredientList[index]?.id
          );
          const sourceCurrency = getCurrencyByIngredientId(
            ingredientList[index - 1]?.id
          );
          const destCurrency = getCurrencyByIngredientId(
            ingredientList[index]?.id
          );
          setPotentialLinkData({
            id: nanoid(),
            name: "",
            sourcePlatformId: sourcePlatform.id,
            destPlatformId: destPlatform.id,
            sourceCurrencyId: sourceCurrency.id,
            destCurrencyId: destCurrency.id,
            actionId: draggableId,
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
        <CreateLinkPopover>
          <CreateLinkContent>
            <div>id: {potentialLinkData.id}</div>
            <div>
              name: <input />
            </div>
            <div>source platform:{potentialLinkData.sourcePlatformId}</div>
            <div>dest platform:{potentialLinkData.destPlatformId}</div>
            <div>source currency:{potentialLinkData.sourceCurrencyId}</div>
            <div>dest currency:{potentialLinkData.destCurrencyId}</div>
            <div>action id:{potentialLinkData.actionId}</div>
            <div>
              duration: <input />{" "}
              <select>
                <option>seconds</option>
                <option>minutes</option>
                <option>hours</option>
                <option>days</option>
              </select>
            </div>
            <button onClick={() => setCreateLinkPopupVisibility(true)}>
              X
            </button>
          </CreateLinkContent>
        </CreateLinkPopover>
      </Hide>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <Container>
          <StateContainer>
            <Title>States</Title>
            <button
              onClick={() => setAddStateUnitPopupVisibility((prev) => !prev)}
            >
              Add new +
            </button>
            <Hide when={addStateUnitPopupVisibility}>
              <StateAdderPopup>
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
                <button onClick={addState}>Add </button>
              </StateAdderPopup>
            </Hide>
            <Droppable
              droppableId="states"
              direction="horizontal"
              // isDropDisabled={true}
            >
              {(provided) => (
                <States {...provided.droppableProps} ref={provided.innerRef}>
                  {appState.states?.map((stateUnit, index) => (
                    <Draggable
                      draggableId={stateUnit.id}
                      index={index}
                      key={stateUnit.id}
                    >
                      {(provided) => (
                        <StateUnit
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          {stateUnit.id} <br /> {stateUnit.platformId} <br />
                          {stateUnit.currencyId}
                        </StateUnit>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </States>
              )}
            </Droppable>
          </StateContainer>
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
                <StateAdderPopup>
                  Name:
                  <input onChange={changeRecipeName} value={newRecipeName} />
                  <br />
                  <button onClick={addRecipe}>Add </button>
                </StateAdderPopup>
              </Hide>
            </div>
            {appState.recipeOrder?.map((recipeId) => (
              <Droppable
                droppableId={recipeId}
                direction="horizontal"
                key={recipeId}
              >
                {(provided) => (
                  <Recipe {...provided.droppableProps} ref={provided.innerRef}>
                    <RecipeName>{`${
                      appState.recipes[recipeId].name
                    }(${getPlatformNameByIngredientId(
                      appState.recipes[recipeId]?.ingredientList[0]?.unitId
                    )}(${getCurrencyNameByIngredientId(
                      appState.recipes[recipeId]?.ingredientList[0]?.unitId
                    )}) - ${getPlatformNameByIngredientId(
                      appState.recipes[recipeId]?.ingredientList?.at(-1)?.unitId
                    )}(${getCurrencyNameByIngredientId(
                      appState.recipes[recipeId]?.ingredientList?.at(-1)?.unitId
                    )}))`}</RecipeName>
                    {appState.recipes[recipeId].ingredientList?.map(
                      (ingredient, index) => (
                        <Draggable
                          draggableId={ingredient.id}
                          index={index}
                          key={ingredient.id}
                        >
                          {(provided) => {
                            return (
                              <IngredientUnit
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                {ingredient.id} <br /> {ingredient.unitId}{" "}
                                <br />
                                {
                                  getStateById(ingredient.unitId)?.[
                                    "platformId"
                                  ]
                                }{" "}
                                <br />
                                {
                                  getStateById(ingredient.unitId)?.[
                                    "currencyId"
                                  ]
                                }
                              </IngredientUnit>
                            );
                          }}
                        </Draggable>
                      )
                    )}

                    {provided.placeholder}
                  </Recipe>
                )}
              </Droppable>
            ))}
          </RecipeContainer>
        </Container>
      </DragDropContext>
    </div>
  );
}
export default App;

const CreateLinkPopover = styled.div`
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
const CreateLinkContent = styled.div``;

const Container = styled.div`
  display: grid;
  grid-template-rows: 200px 70px 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "states actions" "filters filters" "recipes recipes";
  & > * {
    border: 1px solid black;
  }
`;

const FilterContainer = styled.div`
  grid-area: filters;
`;
const StateContainer = styled.div`
  grid-area: states;
`;
const ActionContainer = styled.div`
  grid-area: actions;
`;
const Actions = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;
const States = styled.div`
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
const StateUnit = styled(Unit)``;
const IngredientUnit = styled(Unit)``;
const ActionUnit = styled(Unit)``;

const StateAdderPopup = styled.div`
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
const Recipe = styled.div`
  display: flex;
  position: relative;
  min-width: 100px;
  min-height: 100px;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px 10px 10px;
  margin: 5px 0;
  background-color: lightgreen;
`;
