import React from "react";
import styled from "styled-components";

const Overlay = (props: { children: React.ReactNode }) => {
  return <OverlayConteiner>{props.children}</OverlayConteiner>;
};

export default Overlay;

const OverlayConteiner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(90, 90, 90, 0.2);
  z-index: 2;
  display: flex;
  flex-direction: rows;
  justify-content: center;
  align-items: center;
`;
