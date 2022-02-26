import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Title, Unit } from "../common/styles";
import { AppData } from "../common/types";

const Actions = ({ appState }: Props) => {
  return (
    <>
      <Title>Actions</Title>
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
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  flex-wrap: wrap;
  row-gap: 15px;
`;

const ActionUnit = styled(Unit)``;
