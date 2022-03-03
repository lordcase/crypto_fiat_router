import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { setOriginalNode } from "typescript";
import { Title } from "../common/styles";
import { AppData, RouteBuilderState, Wallet } from "../common/types";
import Block from "./Block";

const RouteBuilder = ({
  appState,
  routeBuilderState,
  setRouteBuilderState,
  getWalletById,
}: Props) => {
  console.log("start");
  const compareWallets = (id1: string, id2: string) => {
    return id1 === id2 ? "green" : "red";
  };
  const [compatibilityMatrix, setCompatibilityMatrix] = useState<
    Array<Array<string>>
  >([]);
  useEffect(() => {
    const getBlock = (id: string) =>
      appState.blocks[routeBuilderState.blockDict[id]];
    setCompatibilityMatrix(
      routeBuilderState.routeBlockIds.reduce(
        (acc: string[][], curr, index, array) => {
          if (index === 0) {
            if (!array[index + 1]) {
              return [["green", "green"]];
            } else {
              const wallet2Id = getBlock(curr).wallet2Id as string;
              const wallet1Id = getBlock(array[index + 1]).wallet1Id as string;
              return [["green", compareWallets(wallet2Id, wallet1Id)]];
            }
          } else if (index === array.length - 1) {
            const wallet1Id = getBlock(array[index - 1]).wallet2Id as string;
            const wallet2Id = getBlock(curr).wallet1Id as string;
            return [...acc, [compareWallets(wallet2Id, wallet1Id), "green"]];
          } else {
            const wallet1Id = getBlock(array[index - 1]).wallet2Id as string;
            const wallet2Id = getBlock(curr).wallet1Id as string;
            const wallet3Id = getBlock(curr).wallet2Id as string;
            const wallet4Id = getBlock(array[index + 1]).wallet1Id as string;
            return [
              ...acc,
              [
                compareWallets(wallet1Id, wallet2Id),
                compareWallets(wallet3Id, wallet4Id),
              ],
            ];
          }
        },
        []
      )
    );
  }, [appState, routeBuilderState]);

  const delRoute = (id: string): void => {
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
      <Title>RouteBuilder</Title>
      <Droppable droppableId="routeBuilder" direction="horizontal">
        {(provided) => (
          <Container ref={provided.innerRef}>
            {routeBuilderState.routeBlockIds.map((id, index) => (
              <Draggable draggableId={id} index={index} key={id}>
                {(provided) => (
                  <Bla
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <DelButton onClick={() => delRoute(id)}>x</DelButton>
                    <Block
                      appState={appState}
                      block={
                        appState.blocks[routeBuilderState.blockDict[id] as any]
                      }
                      getWalletById={getWalletById}
                      classes={compatibilityMatrix[index]}
                    ></Block>
                  </Bla>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
      <button>SAVE ROUTE</button>
    </>
  );
};

export default RouteBuilder;

const Bla = styled.div`
  border: 1px solid;
  padding: 5px;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  flex-wrap: wrap;
  row-gap: 15px;
  gap: 5px;
`;

const DelButton = styled.button`
  position: absolute;
  right: 8px;
  &:hover {
    background-color: #f6abb6;
    cursor: pointer;
    border: 1px solid;
  }
`;

type Props = {
  appState: AppData;
  routeBuilderState: RouteBuilderState;
  setRouteBuilderState: React.Dispatch<React.SetStateAction<RouteBuilderState>>;
  getWalletById(id: string): Wallet | undefined;
};
