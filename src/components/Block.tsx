import React from "react";
import styled from "styled-components";
import { Tiny } from "../common/styles";
import { AppData, Wallet, Block as BlockData } from "../common/types";
import IngredientBody from "./IngredientBody";

const Block = ({ appState, getWalletById, block, classes }: Props) => {
  return (
    <div>
      {" "}
      <Tiny>{block.name}</Tiny>
      <Ingredients>
        <IngredientBody
          appState={appState}
          type="wallet"
          ingredientId={block.wallet1Id as string}
          getWalletById={getWalletById}
          className={classes ? classes[0] : ""}
        ></IngredientBody>
        <IngredientBody
          appState={appState}
          type="link"
          ingredientId={block.linkId as string}
          getWalletById={getWalletById}
          className=""
        ></IngredientBody>
        <IngredientBody
          appState={appState}
          type="wallet"
          ingredientId={block.wallet2Id as string}
          getWalletById={getWalletById}
          className={classes ? classes[1] : ""}
        ></IngredientBody>
      </Ingredients>
    </div>
  );
};

export default Block;

type Props = {
  appState: AppData;
  block: BlockData;
  getWalletById(id: string): Wallet | undefined;
  classes?: string[];
};

const Ingredients = styled.div`
  display: flex;
  flex-direction: columns;
`;
