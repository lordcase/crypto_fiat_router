import styled from "styled-components";

export const Title = styled.h3`
  margin: 5px;
`;

export const Small = styled.span`
  font-size: 0.75rem;
`;
export const Tiny = styled.span`
  font-size: 0.5rem;
`;

export const Unit = styled.div`
  padding: 5px;
  background: lightgray;
  border-radius: 5px;
  border: 1px solid gray;
  text-align: center;
  margin: 0 7px;
  min-width: 110px;
`;

export const TopRightButtonContainer = styled.div`
  position: absolute;
  right: 8px;
  display: flex;
  gap: 3px;
  & > button:hover {
    background-color: #f6abb6;
    cursor: pointer;
    border: 1px solid;
    margin: 1px;
  }
`;
