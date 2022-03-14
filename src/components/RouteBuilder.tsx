import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Title, TopRightButtonContainer } from "../common/styles";
import { AppData, RouteBuilderState, Wallet } from "../common/types";
import Block from "./Block";

const RouteBuilder = ({
  appState,
  routeBuilderState,
  setRouteBuilderState,
  getWalletById,
  saveRoute,
}: Props) => {
  const compareWallets = (id1: string, id2: string): number => {
    return id1 === id2 ? 1 : 0;
  };
  const resetBuilder = () => {
    setRouteBuilderState({
      currentRouteId: `route_${nanoid()}`,
      currentRouteName: "",
      routeBlockIds: [],
      blockDict: {},
    });
  };
  const [compatibilityMatrix, setCompatibilityMatrix] = useState<
    Array<Array<number>>
  >([]);
  const [routeIsValid, setRouteIsValid] = useState(true);
  useEffect(() => {
    setRouteIsValid(true);
    const getBlock = (id: string) =>
      appState.blocks[routeBuilderState.blockDict[id]];
    if (routeBuilderState.routeBlockIds.length === 0) {
      setRouteIsValid(false);
      return;
    }
    setCompatibilityMatrix(
      routeBuilderState.routeBlockIds.reduce(
        (acc: number[][], curr, index, array) => {
          if (index === 0) {
            if (!array[index + 1]) {
              return [[1, 1]];
            } else {
              const wallet2Id = getBlock(curr).wallet2Id as string;
              const wallet1Id = getBlock(array[index + 1]).wallet1Id as string;
              const result = compareWallets(wallet2Id, wallet1Id);
              if (result !== 1) setRouteIsValid(false);
              return [[1, result]];
            }
          } else if (index === array.length - 1) {
            const wallet1Id = getBlock(array[index - 1]).wallet2Id as string;
            const wallet2Id = getBlock(curr).wallet1Id as string;
            const result = compareWallets(wallet2Id, wallet1Id);
            if (result !== 1) setRouteIsValid(false);
            return [...acc, [result, 1]];
          } else {
            const wallet1Id = getBlock(array[index - 1]).wallet2Id as string;
            const wallet2Id = getBlock(curr).wallet1Id as string;
            const wallet3Id = getBlock(curr).wallet2Id as string;
            const wallet4Id = getBlock(array[index + 1]).wallet1Id as string;
            const result1 = compareWallets(wallet2Id, wallet1Id);
            const result2 = compareWallets(wallet3Id, wallet4Id);
            if (result1 !== 1 || result2 !== 1) setRouteIsValid(false);

            return [...acc, [result1, result2]];
          }
        },
        []
      )
    );
  }, [appState, routeBuilderState]);

  const delBlock = (id: string): void => {
    setRouteBuilderState((prev) => {
      const newRouteBlockIds = prev.routeBlockIds.filter(
        (blockId) => blockId !== id
      );
      const { [id]: deleted, ...newBlockDict } = prev.blockDict;
      return {
        ...prev,
        routeBlockIds: newRouteBlockIds,
        blockDict: newBlockDict,
      };
    });
  };
  return (
    <>
      <Title>
        RouteBuilder (
        {appState.routeOrder.includes(routeBuilderState.currentRouteId)
          ? `existing route: ${
              appState.routes[routeBuilderState.currentRouteId].name
            }`
          : "new route"}
        ) Name:{" "}
        <input
          type="text"
          value={routeBuilderState.currentRouteName}
          onChange={(event) =>
            setRouteBuilderState((prev) => ({
              ...prev,
              currentRouteName: (event.target as HTMLInputElement).value,
            }))
          }
        />
      </Title>
      <Droppable droppableId="routeBuilder" direction="horizontal">
        {(provided) => (
          <Container ref={provided.innerRef}>
            {routeBuilderState.routeBlockIds.length < 1 ? (
              <Placeholder>Drag Blocks here</Placeholder>
            ) : (
              routeBuilderState.routeBlockIds.map((id, index) => (
                <Draggable draggableId={id} index={index} key={id}>
                  {(provided) => (
                    <Bla
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <TopRightButtonContainer>
                        <button onClick={() => delBlock(id)}>x</button>
                      </TopRightButtonContainer>
                      <Block
                        appState={appState}
                        block={
                          appState.blocks[
                            routeBuilderState.blockDict[id] as any
                          ]
                        }
                        getWalletById={getWalletById}
                        classes={compatibilityMatrix[index]}
                      ></Block>
                    </Bla>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
      <ControlsContainer>
        <button disabled={!routeIsValid} onClick={() => saveRoute("overwrite")}>
          SAVE ROUTE
        </button>
        <button disabled={!routeIsValid} onClick={() => saveRoute("clone")}>
          SAVE A COPY
        </button>
        <button onClick={resetBuilder}>RESET ROUTE</button>
      </ControlsContainer>
    </>
  );
};

export default RouteBuilder;

const Bla = styled.div`
  border: 1px solid;
  padding: 5px;
  position: relative;
  background: lightgrey;
`;

const ControlsContainer = styled.div`
  padding-top: 8px;
  display: flex;
  gap: 8px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  flex-wrap: wrap;
  row-gap: 15px;
  gap: 5px;
  background: #659dbd;
  min-height: 80px;
`;
const Placeholder = styled.div`
  display: flex;
  align-items: center;
  color: #5d5c61;
`;

type Props = {
  appState: AppData;
  routeBuilderState: RouteBuilderState;
  setRouteBuilderState: React.Dispatch<React.SetStateAction<RouteBuilderState>>;
  getWalletById(id: string): Wallet | undefined;
  saveRoute(mode: string): void;
};
