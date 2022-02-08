import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import initialData from "./initial-data";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { Action, AppData, Link, State } from "./common/types";
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
    useState<boolean>(true);
  const [addRecipePopupVisibility, setAddRecipePopupVisibility] =
    useState<boolean>(true);
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
  const onDragStart = (data: any) => {};
  const onDragEnd = (data: any) => {
    const { source, destination, reason, draggableId } = data;
    if (!destination) return;
    if (reason !== "DROP") return;
    if (destination.droppableId.includes("recipe")) {
      const destId = destination.droppableId;
      const currentRecipe = appState.recipes[destId];
      if (source.droppableId === "states" || source.droppableId === "actions") {
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
      } else if (source.droppableId === destination.droppableId) {
        console.log(destId, draggableId);
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
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
                Platform:{" "}
                <select onChange={selectPlatform}>
                  {appState.platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
                <br />
                Currency:{" "}
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
              {(provided1) => (
                <States {...provided1.droppableProps} ref={provided1.innerRef}>
                  {appState.states?.map((stateUnit, index) => (
                    <Draggable
                      draggableId={stateUnit.id}
                      index={index}
                      key={stateUnit.id}
                    >
                      {(provided2) => (
                        <StateUnit
                          {...provided2.draggableProps}
                          {...provided2.dragHandleProps}
                          ref={provided2.innerRef}
                        >
                          {stateUnit.id} <br /> {stateUnit.platformId} <br />
                          {stateUnit.currencyId}
                        </StateUnit>
                      )}
                    </Draggable>
                  ))}
                  {provided1.placeholder}
                </States>
              )}
            </Droppable>
          </StateContainer>
          <ActionContainer>
            <Title>Links</Title>
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
                  Name:{" "}
                  <input onChange={changeRecipeName} value={newRecipeName} />
                  <br />
                  <button onClick={addRecipe}>Add </button>
                </StateAdderPopup>
              </Hide>
            </div>
            {appState.recipeOrder?.map((recipeId) => (
              <Droppable
                droppableId={appState.recipes[recipeId].id}
                direction="horizontal"
              >
                {(provided3) => (
                  <Recipe
                    {...provided3.droppableProps}
                    ref={provided3.innerRef}
                  >
                    <RecipeName>{appState.recipes[recipeId].name}</RecipeName>
                    {appState.recipes[recipeId].ingredientList?.map(
                      (ingredient, index) => (
                        <Draggable
                          draggableId={ingredient.id}
                          index={index}
                          key={ingredient.id}
                        >
                          {(provided4) => {
                            return (
                              <StateUnit
                                {...provided4.draggableProps}
                                {...provided4.dragHandleProps}
                                ref={provided4.innerRef}
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
                              </StateUnit>
                            );
                          }}
                        </Draggable>
                      )
                    )}

                    {provided3.placeholder}
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
const States = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const StateUnit = styled.div`
  padding: 5px;
  background: lightgray;
  border-radius: 5px;
  border: 1px solid gray;
  text-align: center;
  margin: 0 7px;
`;
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
