import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import {
  Droppable,
  Draggable,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { Title, Tiny, Unit } from "../common/styles";
import { Action, AppData, Block, PotentialLink, Wallet } from "../common/types";

const getColor = (snapshot: DroppableStateSnapshot, slot: string) =>
  snapshot.isDraggingOver
    ? snapshot.draggingOverWith?.includes(slot) ||
      (snapshot.draggingOverWith?.includes("bl_") && slot !== "action")
      ? "#8D8741"
      : "#C84A3A"
    : "transparent";

const BlockCreator = ({
  appState,
  blockState,
  setBlockState,
  potentialLinkData,
  getWalletById,
  getActonById,
  addBlock,
  children,
}: Props) => {
  const setBlockName = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setBlockState((prev) => ({ ...prev, name: event.target.value }));
  console.log(blockState);

  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
  useEffect(() => {
    if (
      !potentialLinkData.name ||
      !blockState.id ||
      !blockState.name ||
      !blockState.linkId ||
      !blockState.wallet1Id ||
      !blockState.wallet2Id
    ) {
      setIsCreateButtonDisabled(true);
    } else {
      setIsCreateButtonDisabled(false);
    }
  }, [blockState, potentialLinkData]);

  return (
    <Container>
      <div>
        <Title>BlockCreator</Title>
        <div>
          Name of block:
          <br />
          <input value={blockState.name} onChange={setBlockName} />
        </div>
      </div>

      <div>
        <Creator>
          <Droppable droppableId="blockCreatorWallet1" direction="horizontal">
            {(provided, snapshot) => (
              <DropBox
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  backgroundColor: getColor(snapshot, "wallet"),
                }}
              >
                {!blockState.wallet1Id && <WalletPlaceholder />}
                {blockState.wallet1Id && (
                  <Draggable draggableId={nanoid()} index={0}>
                    {(provided) => (
                      <Unit
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Tiny>{blockState.wallet1Id}</Tiny>
                        <br />
                        {
                          getWalletById(blockState.wallet1Id as string)?.[
                            "platformId"
                          ]
                        }{" "}
                        <br />
                        {
                          getWalletById(blockState.wallet1Id as string)?.[
                            "currencyId"
                          ]
                        }
                      </Unit>
                    )}
                  </Draggable>
                )}
                {provided.placeholder}
              </DropBox>
            )}
          </Droppable>
          <Droppable droppableId="blockCreatorAction" direction="horizontal">
            {(provided, snapshot) => (
              <DropBox
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  backgroundColor: getColor(snapshot, "action"),
                }}
              >
                {!blockState.linkId && <ActionPlaceholder />}
                {blockState.linkId && (
                  <Draggable draggableId={nanoid()} index={0}>
                    {(provided) => (
                      <Unit
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Tiny>{blockState.linkId}</Tiny>
                        <br />
                        {
                          getActonById(blockState.linkId as string)?.["name"]
                        }{" "}
                      </Unit>
                    )}
                  </Draggable>
                )}
                {provided.placeholder}
              </DropBox>
            )}
          </Droppable>
          <Droppable droppableId="blockCreatorWallet2" direction="horizontal">
            {(provided, snapshot) => (
              <DropBox
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  backgroundColor: getColor(snapshot, "wallet"),
                }}
              >
                {!blockState.wallet2Id && <WalletPlaceholder />}
                {blockState.wallet2Id && (
                  <Draggable draggableId={nanoid()} index={0}>
                    {(provided) => (
                      <Unit
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Tiny>{blockState.wallet2Id}</Tiny>
                        <br />
                        {
                          getWalletById(blockState.wallet2Id as string)?.[
                            "platformId"
                          ]
                        }{" "}
                        <br />
                        {
                          getWalletById(blockState.wallet2Id as string)?.[
                            "currencyId"
                          ]
                        }
                      </Unit>
                    )}
                  </Draggable>
                )}
                {provided.placeholder}
              </DropBox>
            )}
          </Droppable>
        </Creator>
      </div>
      {children}
      <button onClick={addBlock} disabled={isCreateButtonDisabled}>
        Create!
      </button>
    </Container>
  );
};

export default BlockCreator;

type Props = {
  appState: AppData;
  blockState: Block;
  setBlockState: React.Dispatch<React.SetStateAction<Block>>;
  potentialLinkData: PotentialLink;
  getWalletById(id: string): Wallet | undefined;
  getActonById(id: string): Action | undefined;
  addBlock(): void;
  children: React.ReactNode;
};

const Container = styled.div`
  display: flex;
  gap: 25px;
  padding: 0 25px;
  flex-direction: row;
  align-items: center;
`;

const DropBox = styled.div`
  border: 1px dotted black;
  position: relative;
`;

const WalletPlaceholder = styled.div`
  &:after {
    content: "Drag Wallet Here";
    position: absolute;
    top: 20px;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    color: #5d5c61;
  }
`;
const ActionPlaceholder = styled.div`
  &:after {
    content: "Drag Action Here";
    position: absolute;
    top: 20px;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    color: #5d5c61;
  }
`;
const Creator = styled.div`
  width: 450px;
  height: 120px;
  margin: 4px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #659dbd;
  padding: 0 20px;
  background: -moz-linear-gradient(45deg, transparent 10px, #659dbd 10px),
    -moz-linear-gradient(135deg, transparent 10px, #659dbd 10px),
    -moz-linear-gradient(225deg, transparent 10px, #659dbd 10px),
    -moz-linear-gradient(315deg, transparent 10px, #659dbd 10px);
  background: -o-linear-gradient(45deg, transparent 10px, #659dbd 10px),
    -o-linear-gradient(135deg, transparent 10px, #659dbd 10px),
    -o-linear-gradient(225deg, transparent 10px, #659dbd 10px),
    -o-linear-gradient(315deg, transparent 10px, #659dbd 10px);
  background: -webkit-linear-gradient(45deg, transparent 10px, #659dbd 10px),
    -webkit-linear-gradient(135deg, transparent 10px, #659dbd 10px),
    -webkit-linear-gradient(225deg, transparent 10px, #659dbd 10px),
    -webkit-linear-gradient(315deg, transparent 10px, #659dbd 10px);

  background-position: bottom left, bottom right, top right, top left;
  -moz-background-size: 50% 50%;
  -webkit-background-size: 50% 50%;
  background-size: 50% 50%;
  background-repeat: no-repeat;

  & > div {
    flex: 1;
    min-height: 100px;
  }
`;
