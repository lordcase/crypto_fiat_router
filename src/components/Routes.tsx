import React from "react";
import styled from "styled-components";
import { Title, Small, Unit } from "../common/styles";
import {
  Action,
  AppData,
  DurationUnits,
  Wallet,
  Block as BlockType,
} from "../common/types";

const Routes = ({
  appState,
  newRouteName,
  calculateTotalRouteDuration,
  getWalletById,
  getActonById,
  approveRoute,
  editRoute,
  disapproveRoute,
}: Props) => {
  const displayDuration = (block: BlockType) => {
    return ` ${Math.round(
      (block.duration as number) / ((block.durationUnit as number) || 1)
    )} ${DurationUnits[block.durationUnit as 1 | 60 | 3600 | 86400] as any}`;
  };
  return (
    <>
      <Title>Routes</Title>
      {appState.routeOrder?.map((routeId) => (
        <div key={`a${routeId}`}>
          <Route>
            <RouteName>
              {`${appState.routes[routeId].name}
                  
                  Total duration: ${calculateTotalRouteDuration(routeId)} `}
              <button onClick={() => editRoute(routeId)}>Edit Route</button>
            </RouteName>
            <Unit>
              {
                getWalletById(
                  appState.blocks[appState.routes[routeId].blockList[0]]
                    .wallet1Id as string
                )?.["platformId"]
              }
              <br />
              {
                getWalletById(
                  appState.blocks[appState.routes[routeId].blockList[0]]
                    .wallet1Id as string
                )?.["currencyId"]
              }
            </Unit>
            {appState.routes[routeId].blockList?.map((blockId, index) => (
              <React.Fragment key={blockId}>
                <Arrow key={`${blockId}key2`}>&gt;</Arrow>
                <Unit key={`${blockId}2`}>
                  {" "}
                  {
                    getActonById(appState.blocks[blockId].linkId as string)?.[
                      "name"
                    ]
                  }
                  <br />
                  <Small>
                    Duration: {displayDuration(appState.blocks[blockId])}
                  </Small>
                </Unit>
                <Arrow key={`${blockId}key1`}>&gt;</Arrow>
                <Unit key={`${blockId}1`}>
                  {" "}
                  {
                    getWalletById(
                      appState.blocks[blockId].wallet2Id as string
                    )?.["platformId"]
                  }
                  <br />
                  {
                    getWalletById(
                      appState.blocks[blockId].wallet2Id as string
                    )?.["currencyId"]
                  }
                </Unit>
              </React.Fragment>
            ))}
          </Route>
          <RouteMeta>
            <div>
              Approve: {appState.routes[routeId]?.approveCount}
              <button onClick={() => approveRoute(routeId)}>👍</button>
            </div>
            <div>
              Disapprove: {appState.routes[routeId]?.disapproveCount}
              <button onClick={() => disapproveRoute(routeId)}>👎</button>
            </div>
          </RouteMeta>
        </div>
      ))}
    </>
  );
};

export default Routes;

type Props = {
  appState: AppData;
  newRouteName: string;
  calculateTotalRouteDuration(routeId: string): number;
  getWalletById(id: string): Wallet | undefined;
  getActonById(id: string): Action | undefined;
  approveRoute(routeId: string): void;
  editRoute(routeId: string): void;
  disapproveRoute(routeId: string): void;
};

const RouteName = styled.h5`
  margin: 5px;
  position: absolute;
  display: inline-block;
  top: 1px;
`;
const RouteMeta = styled.div`
  background-color: gray;
  display: flex;
  gap: 30px;
  padding-left: 15px;
  color: white;
`;

const Route = styled.div`
  display: flex;
  position: relative;
  min-width: 100px;
  min-height: 100px;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 35px 10px 10px;
  margin: 5px 0 0;
  background-color: lightgreen;
`;

const Arrow = styled.div`
  align-self: center;
  transform: scaleY(11);
  position: relative;
  top: -15px;
`;
