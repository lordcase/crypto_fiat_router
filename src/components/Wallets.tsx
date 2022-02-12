import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Hide from "../common/Hide";
import { Tiny, Title, Unit } from "../common/styles";
import { AppData } from "../common/types";

const Wallets = ({
  appState,
  setAddWalletUnitPopupVisibility,
  addWalletUnitPopupVisibility,
  selectPlatform,
  selectCurrency,
  addWallet,
}: Props) => {
  return (
    <>
      <Title>Wallets</Title>
      <button onClick={() => setAddWalletUnitPopupVisibility((prev) => !prev)}>
        Add new +
      </button>
      <Hide when={addWalletUnitPopupVisibility}>
        <UnitAdderPopup>
          Platform:
          <select onChange={selectPlatform}>
            {appState.platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
          <br />
          Currency:
          <select onChange={selectCurrency}>
            {appState.currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.name}
              </option>
            ))}
          </select>
          <br />
          <button onClick={addWallet}>Add </button>
        </UnitAdderPopup>
      </Hide>
      <Droppable
        droppableId="wallets"
        direction="horizontal"
        // isDropDisabled={true}
      >
        {(provided) => (
          <WalletsContainer
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {appState.wallets?.map((walletUnit, index) => (
              <Draggable
                draggableId={walletUnit.id}
                index={index}
                key={walletUnit.id}
              >
                {(provided) => (
                  <WalletUnit
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <Tiny>{walletUnit.id}</Tiny> <br /> {walletUnit.platformId}{" "}
                    <br />
                    {walletUnit.currencyId}
                  </WalletUnit>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </WalletsContainer>
        )}
      </Droppable>
    </>
  );
};

export default Wallets;

type Props = {
  appState: AppData;
  setAddWalletUnitPopupVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  addWalletUnitPopupVisibility: boolean;
  selectPlatform(event: React.ChangeEvent<HTMLSelectElement>): void;
  selectCurrency(event: React.ChangeEvent<HTMLSelectElement>): void;
  addWallet(): void;
};

const UnitAdderPopup = styled.div`
  /* position: absolute;*/
  z-index: 10;
`;
const WalletsContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const WalletUnit = styled(Unit)``;
