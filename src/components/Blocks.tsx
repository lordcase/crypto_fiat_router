import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Title, TopRightButtonContainer, Unit } from "../common/styles";
import { AppData, Wallet } from "../common/types";
import Block from "./Block";

const Blocks = ({ appState, getWalletById, editBlock }: Props) => {
  return (
    <>
      <Title>Blocks</Title>
      <Droppable droppableId="blocks" direction="horizontal">
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {Object.entries(appState.blocks).map(([blockId, block], index) => (
              <Draggable draggableId={blockId} key={blockId} index={index}>
                {(provided) => (
                  <BlockContainer
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <TopRightButtonContainer>
                      <button onClick={() => editBlock(blockId)}>✏️</button>
                    </TopRightButtonContainer>
                    <Block
                      block={block}
                      appState={appState}
                      getWalletById={getWalletById}
                    ></Block>
                  </BlockContainer>
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

export default Blocks;

type Props = {
  appState: AppData;
  getWalletById(id: string): Wallet | undefined;
  editBlock(id: string): void;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const BlockContainer = styled(Unit)`
  background: rgba(235, 235, 235, 1);
  position: relative;
`;
