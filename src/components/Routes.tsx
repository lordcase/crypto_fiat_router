import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import Hide from "../common/Hide";
import { Title, Tiny, Small, Unit } from "../common/styles";
import { AppData, Link, Wallet } from "../common/types";

const Routes = ({
  appState,
  setAddRoutePopupVisibility,
  addRoutePopupVisibility,
  changeRouteName,
  newRouteName,
  addRoute,
  calculateTotalRouteDuration,
  getCurrencyNameByIngredientId,
  getPlatformNameByIngredientId,
  getWalletById,
  getLinkById,
  approveRoute,
  disapproveRoute,
}: Props) => {
  return (
    <>
      <Title>Routes</Title>
      <div>
        <button onClick={() => setAddRoutePopupVisibility((prev) => !prev)}>
          Add new +
        </button>
        <Hide when={addRoutePopupVisibility}>
          <UnitAdderPopup>
            Name:
            <input onChange={changeRouteName} value={newRouteName} />
            <br />
            <button onClick={addRoute}>Add </button>
          </UnitAdderPopup>
        </Hide>
      </div>
      {appState.routeOrder?.map((routeId) => (
        <div key={`a${routeId}`}>
          <Droppable droppableId={routeId} direction="horizontal" key={routeId}>
            {(provided) => (
              <Route {...provided.droppableProps} ref={provided.innerRef}>
                <RouteName>
                  {`${
                    appState.routes[routeId].name
                  }(${getPlatformNameByIngredientId(
                    appState.routes[routeId]?.ingredientList[0]?.unitId
                  )}(${getCurrencyNameByIngredientId(
                    appState.routes[routeId]?.ingredientList[0]?.unitId
                  )}) -> ${getPlatformNameByIngredientId(
                    appState.routes[routeId]?.ingredientList?.at(-1)?.unitId
                  )}(${getCurrencyNameByIngredientId(
                    appState.routes[routeId]?.ingredientList?.at(-1)?.unitId
                  )}))`}{" "}
                  Total duration: {calculateTotalRouteDuration(routeId)}
                </RouteName>
                {appState.routes[routeId].ingredientList?.map(
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
                              getWalletById(ingredient.unitId)?.["platformId"]
                            }{" "}
                            <br />
                            {getWalletById(ingredient.unitId)?.["currencyId"]}
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
                                  {getLinkById(ingredient.unitId)?.["duration"]}
                                </div>
                                <div>
                                  Cost:
                                  {getLinkById(ingredient.unitId)?.["costFix"]}
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
              </Route>
            )}
          </Droppable>
          <RouteMeta>
            <div>
              Approve: {appState.routes[routeId]?.approveCount}
              <button onClick={() => approveRoute(routeId)}>👍</button>
            </div>
            <div>
              Disapprove: {appState.routes[routeId]?.disapproveCount}
              <button onClick={() => disapproveRoute(routeId)}>👎</button>
            </div>
          </RouteMeta>
        </div>
      ))}
    </>
  );
};

export default Routes;

type Props = {
  appState: AppData;
  setAddRoutePopupVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  addRoutePopupVisibility: boolean;
  changeRouteName(event: React.ChangeEvent<HTMLInputElement>): void;
  newRouteName: string;
  addRoute(): void;
  calculateTotalRouteDuration(routeId: string): number;
  getCurrencyNameByIngredientId(id: string | undefined): string;
  getPlatformNameByIngredientId(id: string | undefined): string;
  getWalletById(id: string): Wallet | undefined;
  getLinkById(id: string): Link | undefined;
  approveRoute(routeId: string): void;
  disapproveRoute(routeId: string): void;
};

const UnitAdderPopup = styled.div`
  /* position: absolute;*/
  z-index: 10;
`;

const RouteName = styled.h5`
  margin: 5px;
  position: absolute;
  display: inline-block;
  top: 1px;
`;
const RouteMeta = styled.div`
  background-color: gray;
  display: flex;
  gap: 30px;
  padding-left: 15px;
  color: white;
`;

const Route = styled.div`
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

const IngredientWallet = styled(Unit)``;
const IngredientAction = styled(Unit)`
  z-index: 2;
  display: flex;
  margin-left: 0;
  margin-right: 0;
`;

const Arrow = styled.div`
  align-self: center;
  transform: scaleY(11);
  position: relative;
  top: -15px;
`;
