import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import initialData from "./initial-data";
import { DragDropContext } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import {
  AppData,
  Link,
  Wallet,
  Platform,
  Currency,
  PotentialLink,
  Block,
  Action,
  RouteBuilderState,
} from "./common/types";
import { Title } from "./common/styles";
import CreateLink from "./components/CreateLink";
import Actions from "./components/Actions";
import Wallets from "./components/Wallets";
import Routes from "./components/Routes";
import BlockCreator from "./components/BlockCreator";
import Blocks from "./components/Blocks";
import RouteBuilder from "./components/RouteBuilder";

function App() {
  useEffect(() => {
    // console.log("rerendeeeer");
    console.log(appState);
  });

  const [appState, setAppState] = useState<AppData>(initialData);
  const [newWalletUnitPlatform, setNewWalletUnitPlatform] = useState<string>(
    initialData.platforms[0].id
  );
  const [newWalletUnitCurrency, setNewWalletUnitCurrency] = useState<string>(
    initialData.currencies[0].id
  );
  const [newRouteName, setNewRouteName] = useState<string>("");
  const [addWalletUnitPopupVisibility, setAddWalletUnitPopupVisibility] =
    useState<boolean>(true);
  const [addRoutePopupVisibility, setAddRoutePopupVisibility] =
    useState<boolean>(true);
  const emptyPotentialLink: PotentialLink = {
    id: nanoid(),
    name: "",
    costFix: "",
    duration: 1,
    durationUnit: 1,
  };
  const emptyBlock: Block = {
    id: `block_${nanoid()}`,
    name: "",
  };
  const defaultRouteBuilderState: RouteBuilderState = {
    routeBlockIds: [],
    blockDict: {},
  };
  const [potentialLinkData, setPotentialLinkData] =
    useState<PotentialLink>(emptyPotentialLink);
  const [blockState, setBlockState] = useState<Block>(emptyBlock);
  const [routeBuilderState, setRouteBuilderState] = useState<RouteBuilderState>(
    defaultRouteBuilderState
  );

  const addWallet = () => {
    const newWallet: Wallet = {
      id: `wallet_${nanoid()}`,
      platformId: newWalletUnitPlatform,
      currencyId: newWalletUnitCurrency,
    };
    setAppState((prev) => ({
      ...prev,
      wallets: prev.wallets ? [...prev.wallets, newWallet] : [newWallet],
    }));
  };

  const saveRoute = () => {
    const newId = `route_${nanoid()}`;
    setAppState((prev) => ({
      ...prev,
      routes: {
        ...prev.routes,
        [newId]: {
          id: newId,
          name: newRouteName,
          approveCount: 0,
          disapproveCount: 0,
          blockList: [],
        },
      },
    }));
    setAppState((prev) => ({
      ...prev,
      routeOrder: [...(prev.routeOrder || []), newId],
    }));
  };

  const addLink = () => {
    const { id, duration, durationUnit, name, costFix } = potentialLinkData;
    const newLink: Link = {
      id: id,
      name: name,
      duration: duration,
      costFix: costFix,
      durationUnit: durationUnit,
      // setCreateLinkPopupVisibility(true);
    };
    if (potentialLinkData.routeId) {
      setAppState((prev) => {
        return {
          ...prev,
          links: { ...prev.links, [newLink.id]: newLink },
          // routes: { ...prev.routes, [route.id]: newRoute },
        };
        // const route = prev.routes[potentialLinkData.routeId || 0];
        // const blockList = route.blockList;
        // const index = potentialLinkData
        //   ? potentialLinkData.index
        //     ? potentialLinkData.index
        //     : 0
        //   : 0;
        // const newIngredientList = [
        //   ...blockList.slice(0, index),
        //   {
        //     id: nanoid(),
        //     type: "action" as IngredientType,
        //     unitId: id,
        //   },
        //   ...ingredientList.slice(potentialLinkData.index),
        // ];
        // const newRoute = { ...route, ingredientList: newIngredientList };
      });
    }
  };

  const addBlock = () => {
    addLink();
    setAppState((prev) => ({
      ...prev,
      blocks: { ...prev.blocks, [potentialLinkData.id]: blockState },
    }));
    setPotentialLinkData(emptyPotentialLink);
    setBlockState(emptyBlock);
  };
  // const getUnitTypeById = (id: string): "wallet" | "link" => {
  //   return getWalletById(id) ? "wallet" : "link";
  // };

  const getWalletById = (id: string): Wallet | undefined => {
    return appState.wallets?.find((wallet) => wallet.id === id);
  };

  const getActonById = (id: string): Action | undefined => {
    return appState.actions?.find((action) => action.id === id);
  };

  const selectPlatform = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = event.target.value;
    setNewWalletUnitPlatform(value);
  };
  const selectCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = event.target.value;
    setNewWalletUnitCurrency(value);
  };
  const changeRouteName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    setNewRouteName(value);
  };
  const approveRoute = (routeId: string) => {
    setAppState((prev) => {
      const route = appState.routes[routeId];
      const newRoute = {
        ...route,
        approveCount: route.approveCount ? route.approveCount + 1 : 1,
      };
      return { ...prev, routes: { ...prev.routes, [routeId]: newRoute } };
    });
  };

  const disapproveRoute = (routeId: string) => {
    setAppState((prev) => {
      const route = appState.routes[routeId];
      const newRoute = {
        ...route,
        disapproveCount: route.disapproveCount ? route.disapproveCount + 1 : 1,
      };
      return { ...prev, routes: { ...prev.routes, [routeId]: newRoute } };
    });
  };

  const getPlatformByIngredientId = (id: string | undefined): Platform => {
    const ingredient: Wallet | undefined = appState.wallets?.find(
      (wallet) => wallet.id === id
    );

    const platform: Platform | undefined =
      ingredient &&
      appState.platforms.find(
        (platform) => platform.id === ingredient.platformId
      );
    return platform || { id: "", name: "" };
  };
  const getPlatformNameByIngredientId = (id: string | undefined): string => {
    const platform = getPlatformByIngredientId(id);
    return platform?.name || "";
  };
  const getCurrencyByIngredientId = (id: string | undefined): Currency => {
    const ingredient: Wallet | undefined = appState.wallets.find(
      (wallet) => wallet.id === id
    );

    const currency: Currency | undefined =
      ingredient &&
      appState.currencies.find(
        (currency) => currency.id === ingredient.currencyId
      );
    return currency || { id: "", name: "" };
  };

  const getCurrencyNameByIngredientId = (id: string | undefined): string => {
    const currency = getCurrencyByIngredientId(id);
    return currency?.name || "";
  };
  const changePotentialLinkData = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ): void => {
    const field = event.target.dataset["field"] as string;
    if (event.target.dataset["field"] === "duration") {
      setPotentialLinkData((prev) => ({
        ...prev,
        [field]: parseInt(event.target.value),
      }));
    } else {
      setPotentialLinkData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
  };
  const calculateTotalRouteDuration = (routeId: string) => {
    const links = appState.routes[routeId].blockList.map((blockId) => {
      const block: Block = appState.blocks[blockId];
      const linkId = block.linkId as string;
      return appState.links[linkId] as Link;
    });
    const duration: number = links.reduce((acc, curr, index) => {
      console.log(typeof acc);
      return acc + (curr.duration ? curr.duration : 0);
    }, 0);
    return duration;
  };
  const smartSplice = (
    array: (string | number | {})[],
    insertable: {} | string | number,
    index: number
  ): (string | number | {})[] => {
    console.log(array, insertable, index);
    console.log([...array.slice(0, index), insertable, ...array.slice(index)]);

    return [...array.slice(0, index), insertable, ...array.slice(index)];
  };
  // const onDragUpdate = (data: any) => {
  //   // console.log(data);
  //   const ingredientList =
  //     appState.routes[data.destination.droppableId]?.ingredientList;
  //   const index = data.destination.index;
  //   if (
  //     data.draggableId.search("action") !== -1 &&
  //     ingredientList &&
  //     ingredientList[index - 1]?.type === "wallet" &&
  //     ingredientList[index]?.type === "wallet"
  //   ) {
  //     setCreateLinkWarningVisibility(false);
  //   } else {
  //     setCreateLinkWarningVisibility(true);
  //   }
  // };

  const onDragEnd = (data: any) => {
    const { source, destination, reason, draggableId } = data;
    if (!destination) return;
    if (reason !== "DROP") return;
    const destId = destination.droppableId;
    // if (destination.droppableId.includes("route_")) {
    //   return;
    //   const currentRoute = appState.routes[destId];
    //   if (source.droppableId === "blocks") {
    //     setAppState((prev) => ({
    //       ...prev,
    //       routes: {
    //         ...prev.routes,
    //         [destId]: {
    //           ...prev.routes[destId],
    //           blockList: [
    //             ...currentRoute.blockList?.slice(0, destination.index),
    //             draggableId,
    //             ...currentRoute.blockList?.slice(destination.index),
    //           ],
    //         },
    //       },
    //     }));
    // } else if (source.droppableId === "actions") {
    //   const { index } = destination;
    //   const action = appState.actions.find(
    //     (action) => action.id === draggableId
    //   );
    //   const ingredientList =
    //     appState.routes[destination.droppableId].ingredientList;
    //   if (
    //     ingredientList[index - 1]?.type === "wallet" &&
    //     ingredientList[index]?.type === "wallet"
    //   ) {
    //     const sourcePlatform = getPlatformByIngredientId(
    //       ingredientList[index - 1]?.unitId
    //     );
    //     const destPlatform = getPlatformByIngredientId(
    //       ingredientList[index]?.unitId
    //     );
    //     const sourceCurrency = getCurrencyByIngredientId(
    //       ingredientList[index - 1]?.unitId
    //     );
    //     const destCurrency = getCurrencyByIngredientId(
    //       ingredientList[index]?.unitId
    //     );
    //     setPotentialLinkData({
    //       id: `link_${nanoid()}`,
    //       name: action?.name,
    //       sourcePlatformId: sourcePlatform.id,
    //       destPlatformId: destPlatform.id,
    //       sourceCurrencyId: sourceCurrency.id,
    //       destCurrencyId: destCurrency.id,
    //       actionId: draggableId,
    //       routeId: destId,
    //       index: index,
    //       duration: 0,
    //       costFix: "",
    //     });
    //     setCreateLinkPopupVisibility(false);
    //   }
    // } else if (source.droppableId === destination.droppableId) {
    //   setAppState((prev) => {
    //     const step1 = [
    //       ...currentRoute.ingredientList.slice(0, source.index),
    //       ...currentRoute.ingredientList.slice(source.index + 1),
    //     ];
    //     const step2 = [
    //       ...step1.slice(0, destination.index),
    //       {
    //         id: draggableId,
    //         unitId: prev.routes[destId].ingredientList.find(
    //           (ingredient) => ingredient.id === draggableId
    //         )?.unitId,
    //         type: getUnitTypeById(draggableId),
    //       },
    //       ...step1.slice(destination.index),
    //     ];
    //     return {
    //       ...prev,
    //       routes: {
    //         ...prev.routes,
    //         [destId]: { ...prev.routes[destId], ingredientList: step2 },
    //       },
    //     };
    //   });
    // }
    if (destination.droppableId.includes("routeBuilder")) {
      if (source.droppableId !== "blocks") return;
      const newRouteBlickId = nanoid();
      const newBlockIds = smartSplice(
        routeBuilderState.routeBlockIds,
        newRouteBlickId,
        destination.index
      );
      console.log(routeBuilderState);
      console.log({
        ...routeBuilderState,
        routeBlockIds: newBlockIds,
        blockDict: {
          ...routeBuilderState.blockDict,
          [newRouteBlickId]: draggableId,
        },
      });

      setRouteBuilderState(
        (prev) =>
          ({
            ...prev,
            routeBlockIds: newBlockIds,
            blockDict: { ...prev.blockDict, [newRouteBlickId]: draggableId },
          } as RouteBuilderState)
      );
    } else if (destination.droppableId.includes("blockCreatorWallet")) {
      if (source.droppableId === destination.droppableId) return;
      const [propertyName1, propertyName2] =
        destination.droppableId === "blockCreatorWallet1"
          ? ["wallet1Id", "wallet2Id"]
          : ["wallet2Id", "wallet1Id"];
      if (source.droppableId === "wallets") {
        setBlockState((prev) => ({ ...prev, [propertyName1]: draggableId }));
      } else if (source.droppableId.includes("blockCreatorWallet")) {
        setBlockState((prev) => ({
          ...prev,
          [propertyName1]: prev[propertyName2 as keyof typeof blockState],
          [propertyName2]: "",
        }));
      }
    } else if (destination.droppableId.includes("blockCreatorAction")) {
      console.log();

      if (source.droppableId === destination.droppableId) return;
      if (source.droppableId === "actions") {
        setBlockState((prev) => ({ ...prev, linkId: draggableId }));
      }
    } else {
      return;
    }
  };
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          <WalletContainer>
            <Wallets
              appState={appState}
              setAddWalletUnitPopupVisibility={setAddWalletUnitPopupVisibility}
              addWalletUnitPopupVisibility={addWalletUnitPopupVisibility}
              selectPlatform={selectPlatform}
              selectCurrency={selectCurrency}
              addWallet={addWallet}
            />
          </WalletContainer>
          <ActionsContainer>
            <Actions appState={appState} />
          </ActionsContainer>

          <BlockCreatorContainer>
            <BlockCreator
              appState={appState}
              blockState={blockState}
              setBlockState={setBlockState}
              getActonById={getActonById}
              getWalletById={getWalletById}
              addBlock={addBlock}
              potentialLinkData={potentialLinkData}
            >
              <CreateLinkInlineContainer>
                <CreateLink
                  potentialLinkData={potentialLinkData}
                  changePotentialLinkData={changePotentialLinkData}
                ></CreateLink>
              </CreateLinkInlineContainer>
            </BlockCreator>
          </BlockCreatorContainer>
          <BlocksContainer>
            <Blocks appState={appState} getWalletById={getWalletById} />
          </BlocksContainer>
          <RouteBuilderContainer>
            <RouteBuilder
              appState={appState}
              getWalletById={getWalletById}
              routeBuilderState={routeBuilderState}
              setRouteBuilderState={setRouteBuilderState}
            />
          </RouteBuilderContainer>
          <FilterContainer>
            <Title>Filters</Title>
          </FilterContainer>
          <RouteContainer>
            <Routes
              appState={appState}
              setAddRoutePopupVisibility={setAddRoutePopupVisibility}
              addRoutePopupVisibility={addRoutePopupVisibility}
              changeRouteName={changeRouteName}
              newRouteName={newRouteName}
              calculateTotalRouteDuration={calculateTotalRouteDuration}
              getCurrencyNameByIngredientId={getCurrencyNameByIngredientId}
              getPlatformNameByIngredientId={getPlatformNameByIngredientId}
              getWalletById={getWalletById}
              approveRoute={approveRoute}
              disapproveRoute={disapproveRoute}
            ></Routes>
          </RouteContainer>
        </Container>
      </DragDropContext>
    </div>
  );
}
export default App;

const RouteContainer = styled.div`
  grid-area: routes;
  position: relative;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 200px 158px 155px 175px 30px 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "wallets actions" "blockCreator blockCreator" "blocks blocks" "routeBuilder routeBuilder" "filters filters" "routes routes";
  & > * {
    border: 1px solid black;
  }
`;

const FilterContainer = styled.div`
  grid-area: filters;
`;
const BlocksContainer = styled.div`
  grid-area: blocks;
`;
const BlockCreatorContainer = styled.div`
  grid-area: blockCreator;
`;
const RouteBuilderContainer = styled.div`
  grid-area: routeBuilder;
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

const WalletContainer = styled.div`
  grid-area: wallets;
`;
const ActionsContainer = styled.div`
  grid-area: actions;
`;
