import { nanoid } from "nanoid";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
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
  routeBuilderState.routeBlockIds.map((id, index) => {
    console.log(id);
    console.log(routeBuilderState.blockDict[id]);
    console.log();
    return "";
  });
  return (
    <>
      <Title>RouteBuilder</Title>
      <></>
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
                    <Block
                      appState={appState}
                      block={
                        appState.blocks[routeBuilderState.blockDict[id] as any]
                      }
                      getWalletById={getWalletById}
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

const Bla = styled.div``;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  flex-wrap: wrap;
  row-gap: 15px;
`;

type Props = {
  appState: AppData;
  routeBuilderState: RouteBuilderState;
  setRouteBuilderState: React.Dispatch<React.SetStateAction<RouteBuilderState>>;
  getWalletById(id: string): Wallet | undefined;
};
