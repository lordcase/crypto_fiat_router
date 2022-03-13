import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import {
  checkNumericInputValue,
  sanitizeNumericInput,
} from "../common/helpers";
import {
  Droppable,
  Draggable,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { Title, Tiny, Unit } from "../common/styles";
import {
  Action,
  AppData,
  Block,
  DurationUnits,
  PotentialLink,
  Wallet,
} from "../common/types";

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
  getWalletById,
  getActonById,
  addBlock,
}: Props) => {
  const setBlockName = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setBlockState((prev) => ({ ...prev, name: event.target.value }));
  const setBlockDuration = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    checkNumericInputValue(event.target.value) &&
      setBlockState((prev) => ({
        ...prev,
        duration: sanitizeNumericInput(event.target.value),
      }));
  };
  const setBlockDurationUnit = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    checkNumericInputValue(event.target.value) &&
      setBlockState((prev) => ({
        ...prev,
        durationUnit: sanitizeNumericInput(event.target.value),
      }));
  };
  const setBlockCost = (event: React.ChangeEvent<HTMLInputElement>): void => {
    checkNumericInputValue(event.target.value) &&
      setBlockState((prev) => ({
        ...prev,
        costFix: sanitizeNumericInput(event.target.value),
      }));
  };

  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
  useEffect(() => {
    if (
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
  }, [blockState]);

  return (
    <Container>
      <div>
        <Title>BlockCreator</Title>
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
      <CreateLinkInlineContainer>
        <div>ID: </div>
        <div>
          <Tiny>{blockState.id}</Tiny>
        </div>
        <div>Name:</div>
        <div>
          <input value={blockState.name} onChange={setBlockName} />
        </div>
        <div>Cost:</div>
        <div>
          <input
            value={blockState.costFix}
            data-field="costFix"
            onChange={setBlockCost}
          />
        </div>
        <div>duration:</div>
        <div>
          <input
            value={blockState.duration}
            data-field="duration"
            onChange={setBlockDuration}
            size={5}
          />
          <select
            value={blockState.durationUnit}
            onChange={setBlockDurationUnit}
            data-field="durationUnit"
          >
            {Object.entries(DurationUnits).map(([key, value]) => (
              <option value={key} key={key}>
                {value}
              </option>
            ))}

            {/* <option value="1">seconds</option>
            <option value="60">minutes</option>
            <option value="3600">hours</option>
            <option value="86400">days</option> */}
          </select>
        </div>
      </CreateLinkInlineContainer>
      <ButtonsContainer>
        <button onClick={addBlock} disabled={isCreateButtonDisabled}>
          Save
        </button>
        <button
          onClick={() =>
            setBlockState({
              id: `block_${nanoid()}`,
              name: "",
              duration: 3,
              costFix: 0,
            })
          }
        >
          Reset
        </button>
      </ButtonsContainer>
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
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
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
const CreateLinkInlineContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  & > div {
    background-color: gray;
    padding: 2px;
  }
  & > div > input {
    background-color: #659dbd;
  }
`;
