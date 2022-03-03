import React, { useRef } from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Title, Unit } from "../common/styles";
import { AppData } from "../common/types";

const Actions = ({ appState }: Props) => {
  const reff = useRef(null);

  return (
    <>
      <Title>Actions</Title>
      <Droppable
        droppableId="actions"
        direction="horizontal"
        isDropDisabled={true}
      >
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {/* {JSON.stringify(snapshot)} */}
            {appState.actions.map((action, index) => (
              <Draggable draggableId={action.id} index={index} key={action.id}>
                {(provided, snapshot) => (
                  <DragContainer>
                    <ActionUnit
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={{
                        ...provided.draggableProps.style,
                        paddingBottom: "8px",
                        transform: snapshot.isDragging
                          ? provided.draggableProps.style?.transform
                          : "translate(0px, 0px)",
                      }}
                    >
                      {action.name}
                    </ActionUnit>
                    {snapshot.isDragging && (
                      <ActionUnit
                        style={{
                          ...provided.draggableProps.style,
                          transform: "none !important",
                          paddingBottom: "8px",
                          backgroundColor: "white",
                        }}
                      >
                        <div>{action.name}</div>
                      </ActionUnit>
                    )}
                  </DragContainer>
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

const DragContainer = styled.div`
  min-width: 142px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  flex-wrap: wrap;
  row-gap: 15px;
`;

const ActionUnit = styled(Unit)``;
