import React from "react";
import styled from "styled-components";
import { Small, Tiny, Unit } from "../common/styles";
import { Wallet, Link, AppData } from "../common/types";

const IngredientBody = ({
  appState,
  getWalletById,
  ingredientId,
  type,
}: Props) => {
  return type === "wallet" ? (
    <WalletContainer>
      <Tiny>{ingredientId}</Tiny>
      <br />
      {getWalletById(ingredientId)?.["platformId"]} <br />
      {getWalletById(ingredientId)?.["currencyId"]}
    </WalletContainer>
  ) : (
    <LinkContainer>
      <LeftArrow>&gt;</LeftArrow>
      <InnerContainer>
        <Tiny>{ingredientId}</Tiny>
        <br />
        <div>{appState.links[ingredientId]?.["name"]}</div>
        <Small>
          <div>
            Duration:
            {appState.links[ingredientId]?.["duration"]}
          </div>
          <div>
            Cost:
            {appState.links[ingredientId]?.["costFix"]}
          </div>
        </Small>
      </InnerContainer>
      <RightArrow>&gt;</RightArrow>
    </LinkContainer>
  );
};

export default IngredientBody;

type Props = {
  ingredientId: string;
  type: string;
  getWalletById(id: string): Wallet | undefined;
  appState: AppData;
};

const WalletContainer = styled(Unit)``;
const LinkContainer = styled(Unit)`
  display: flex;
`;

const InnerContainer = styled.div`
  flex: 1;
`;
const Arrow = styled.div`
  align-self: center;
  transform: scaleY(8);
  position: relative;
`;
const LeftArrow = styled(Arrow)`
  top: -15px;
  left: -18px;
`;
const RightArrow = styled(Arrow)`
  top: -15px;
  right: -18px;
`;
