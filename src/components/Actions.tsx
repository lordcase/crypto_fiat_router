import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Title, Unit } from "../common/styles";
import { AppData } from "../common/types";

const Actions = ({ appState, createLinkWarningVisibility }: Props) => {
  return (
    <>
      <Title>Actions</Title>
      {/* {JSON.stringify(appState)} */}
      <Droppable droppableId="actions" direction="horizontal">
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {/* {JSON.stringify(snapshot)} */}
            {appState.actions.map((action, index) => (
              <Draggable draggableId={action.id} index={index} key={action.id}>
                {(provided, snapshot) => (
                  <ActionUnit
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    {action.name}
                    <Indicator
                      hide={createLinkWarningVisibility || !snapshot.isDragging}
                    >
                      !DROP TO LINK!
                    </Indicator>
                  </ActionUnit>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </>
  );
};

export default Actions;

type Props = {
  appState: AppData;
  createLinkWarningVisibility: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const ActionUnit = styled(Unit)``;

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
