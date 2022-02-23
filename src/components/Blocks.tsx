import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Tiny, Title, Unit } from "../common/styles";
import { AppData, Link, Wallet } from "../common/types";
import IngredientBody from "./IngredientBody";

const Blocks = ({ appState, getWalletById, getLinkById }: Props) => {
  return (
    <>
      <Title>Blocks</Title>
      <Droppable droppableId="blocks" direction="horizontal">
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {Object.entries(appState.blocks).map(([blockId, block], index) => (
              <Draggable draggableId={blockId} key={blockId} index={index}>
                {(provided) => (
                  <Block
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <Tiny>{block.name}</Tiny>
                    <Ingredients>
                      <IngredientBody
                        type="wallet"
                        ingredientId={block.wallet1Id as string}
                        getWalletById={getWalletById}
                        getLinkById={getLinkById}
                      ></IngredientBody>
                      <IngredientBody
                        type="link"
                        ingredientId={block.linkId as string}
                        getWalletById={getWalletById}
                        getLinkById={getLinkById}
                      ></IngredientBody>
                      <IngredientBody
                        type="wallet"
                        ingredientId={block.wallet2Id as string}
                        getWalletById={getWalletById}
                        getLinkById={getLinkById}
                      ></IngredientBody>
                    </Ingredients>
                  </Block>
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
  getLinkById(id: string): Link | undefined;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const Block = styled(Unit)`
  background: rgba(235, 235, 235, 1);
`;

const Ingredients = styled.div`
  display: flex;
  flex-direction: columns;
`;
