import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import initialData from "./initial-data";
import initialDataEmpty from "./initial-data-empty";
import { DragDropContext } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { smartSplice } from "./common/helpers";
import {
  AppData,
  Wallet,
  PotentialLink,
  Block,
  Action,
  RouteBuilderState,
} from "./common/types";
import Actions from "./components/Actions";
import Wallets from "./components/Wallets";
import Routes from "./components/Routes";
import BlockCreator from "./components/BlockCreator";
import Blocks from "./components/Blocks";
import RouteBuilder from "./components/RouteBuilder";
import Filters from "./components/Filters";

// Import Parse minified version
import Parse from "parse";

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = "XlFgDqzvZrRiQO0T5m6Z3zCgQqZ0WZ7FrFRE5doL";
const PARSE_HOST_URL = "https://parseapi.back4app.com/";
const PARSE_JAVASCRIPT_KEY = "Nvn7KB17n9KuZQ4DfTRNkPxwgNbVAiYk7KsT3VOZ";
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

function App() {
  useEffect(() => {
    console.log("appState1");
    const query = new Parse.Query("crouterState");
    query.descending("createdAt");
    // use the equalTo filter to look for user which the name is John. this filter can be used in any data type
    // run the query
    try {
      query.first().then((result) => {
        console.log(result?.attributes.appState);

        if (result) setAppState(result.attributes.appState);
      });
      console.log("appState2");
    } catch (error: any) {
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
    }
    getCurrentUser();
  }, []);

  const [appState, setAppState] = useState<AppData>(initialDataEmpty);
  // const [loginState, setLoginState] = useState({ loggedIn: false, user: {} });
  const [currentUser, setCurrentUser] = useState<Parse.Object | undefined>(
    undefined
  );
  const [newWalletUnitPlatform, setNewWalletUnitPlatform] = useState<string>(
    initialData.platforms[0].id
  );
  const [newWalletUnitCurrency, setNewWalletUnitCurrency] = useState<string>(
    initialData.currencies[0].id
  );
  const [addWalletUnitPopupVisibility, setAddWalletUnitPopupVisibility] =
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
    duration: 3,
    costFix: 0,
  };
  const defaultRouteBuilderState: RouteBuilderState = {
    routeBlockIds: [],
    blockDict: {},
    currentRouteId: `route_${nanoid()}`,
    currentRouteName: "",
  };
  const [potentialLinkData, setPotentialLinkData] =
    useState<PotentialLink>(emptyPotentialLink);
  const [blockState, setBlockState] = useState<Block>(emptyBlock);
  const [routeBuilderState, setRouteBuilderState] = useState<RouteBuilderState>(
    defaultRouteBuilderState
  );

  // const login = async function (): Promise<boolean> {
  //   const usernameValue: string = "krisz";
  //   const passwordValue: string = "hello";
  //   try {
  //     const loggedInUser: Parse.User = await Parse.User.logIn(
  //       usernameValue,
  //       passwordValue
  //     );
  //     alert(
  //       `Success! User ${loggedInUser.get(
  //         "username"
  //       )} has successfully signed in!`
  //     );
  //     const currentUser = await Parse.User.current();
  //     console.log(loggedInUser === currentUser);
  //     return true;
  //   } catch (error: any) {
  //     alert(`Error! ${error.message}`);
  //     return false;
  //   }
  // };
  const getCurrentUser = async function (): Promise<Parse.User | undefined> {
    const currentUser: Parse.User | undefined = await Parse.User.current();
    // Update state variable holding current user
    setCurrentUser(currentUser);
    return currentUser;
  };
  const saveState = async function (): Promise<boolean> {
    let state: Parse.Object = new Parse.Object("crouterState");
    state.set("appState", appState);
    try {
      await state.save();
      // Success
      alert("Success! State saved!");
      return true;
    } catch (error: any) {
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    }
  };

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

  const editBlock = (blockId: string): void => {
    setBlockState(appState.blocks[blockId]);
  };

  const editRoute = (routeId: string): void => {
    const currentRoute = appState.routes[routeId];
    const newBlockDict = currentRoute.blockList.reduce(
      (acc: { [id: string]: string }, curr) => {
        acc[nanoid()] = curr;
        return acc;
      },
      {}
    );
    setRouteBuilderState({
      blockDict: newBlockDict,
      routeBlockIds: Object.keys(newBlockDict),
      currentRouteId: routeId,
      currentRouteName: currentRoute.name,
    });
    // setRouteBuilderState({
    //   routeBlockIds: currentRoute.blockList,
    //   blockDict: currentRoute.blockList.reduce(
    //     (acc: { [id: string]: string }, curr) => {
    //       acc[nanoid()] = curr;
    //       return acc;
    //     },
    //     {}
    //   ),
    //   currentRouteId: routeId,
    //   currentRouteName: currentRoute.name,
    // });
  };
  const saveRoute = (mode: "overwrite" | "clone") => {
    var routeId: string;
    if (mode === "clone") {
      routeId = nanoid();
      setRouteBuilderState((prev) => ({ ...prev, currentRouteId: routeId }));
    } else {
      routeId = routeBuilderState.currentRouteId;
    }
    setAppState((prev) => ({
      ...prev,
      routes: {
        ...prev.routes,
        [routeId]: {
          id: routeId,
          name: routeBuilderState.currentRouteName,
          approveCount: 0,
          disapproveCount: 0,
          blockList: routeBuilderState.routeBlockIds.map(
            (id) => routeBuilderState.blockDict[id]
          ),
        },
      },
    }));
    if (!appState.routeOrder.includes(routeId)) {
      setAppState((prev) => ({
        ...prev,
        routeOrder: [...(prev.routeOrder || []), routeId],
      }));
    }
  };

  const addBlock = () => {
    setAppState((prev) => ({
      ...prev,
      blocks: { ...prev.blocks, [blockState.id]: blockState },
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

  const calculateTotalRouteDuration = (routeId: string): number => {
    const duration = appState.routes[routeId].blockList.reduce(
      (acc: number, currentBlockid: string) => {
        const currentBlock = appState.blocks[currentBlockid];
        return currentBlock.duration && currentBlock.durationUnit
          ? acc + currentBlock.duration * currentBlock.durationUnit
          : 0;
      },
      0
    );
    return duration;
  };

  // const onDragUpdate = (data: any) => {
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
    // const destId = destination.droppableId;
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
      <ControlBar>
        Current user:{" "}
        {currentUser ? currentUser.get("username") : "not logged in"}
        {/* <LoginButton onClick={login}>LOGIN!</LoginButton> */}
        <SaveButton onClick={saveState}>SAVE STATE!</SaveButton>
      </ControlBar>
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
            ></BlockCreator>
          </BlockCreatorContainer>
          <BlocksContainer>
            <Blocks
              appState={appState}
              getWalletById={getWalletById}
              editBlock={editBlock}
            />
          </BlocksContainer>
          <RouteBuilderContainer>
            <RouteBuilder
              appState={appState}
              getWalletById={getWalletById}
              routeBuilderState={routeBuilderState}
              setRouteBuilderState={setRouteBuilderState}
              saveRoute={saveRoute}
            />
          </RouteBuilderContainer>
          <FilterContainer>
            <Filters appState={appState} setAppState={setAppState}></Filters>
          </FilterContainer>
          <RouteContainer>
            <Routes
              appState={appState}
              calculateTotalRouteDuration={calculateTotalRouteDuration}
              getWalletById={getWalletById}
              getActonById={getActonById}
              approveRoute={approveRoute}
              editRoute={editRoute}
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
  grid-template-rows: 200px 158px 175px 195px minmax(40px, max-content) 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "wallets actions" "blockCreator blockCreator" "blocks blocks" "routeBuilder routeBuilder" "filters filters" "routes routes";
  & > * {
    border: 1px solid black;
  }
`;
const ControlBar = styled.div`
  display: flex;
  padding: 8px;
  gap: 8px;
  position: sticky;
  top: 0px;
  background: white;
  border-bottom: 2px solid black;
  z-index: 100;
`;

// const LoginButton = styled.button``;
const SaveButton = styled.button``;

const FilterContainer = styled.div`
  grid-area: filters;
  padding-bottom: 10px;
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

const WalletContainer = styled.div`
  grid-area: wallets;
`;
const ActionsContainer = styled.div`
  grid-area: actions;
`;
