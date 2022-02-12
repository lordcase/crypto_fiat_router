import React from "react";
import styled from "styled-components";
import { PotentialLink } from "../common/types";

const CreateLink = ({
  potentialLinkData,
  changePotentialLinkData,
  setCreateLinkPopupVisibility,
  addLink,
}: Props) => {
  return (
    <CreateLinkContainer>
      <CloseButtonContainer>
        <button onClick={() => setCreateLinkPopupVisibility(true)}>X</button>
      </CloseButtonContainer>
      <CreateLinkData>
        <div>id: </div>
        <div>{potentialLinkData.id}</div>
        <div>name: </div>
        <div>
          <input
            value={potentialLinkData.name}
            onChange={changePotentialLinkData}
            data-field="name"
          />
        </div>
        <div>source platform:</div>
        <div>{potentialLinkData.sourcePlatformId}</div>
        <div>dest platform:</div>
        <div>{potentialLinkData.destPlatformId}</div>
        <div>source currency:</div>
        <div>{potentialLinkData.sourceCurrencyId}</div>
        <div>dest currency:</div>
        <div>{potentialLinkData.destCurrencyId}</div>
        <div>action id:</div>
        <div>{potentialLinkData.actionId}</div>
        <div>Cost:</div>
        <div>
          <input
            value={potentialLinkData.costFix}
            data-field="costFix"
            onChange={changePotentialLinkData}
          />
        </div>
        <div>duration:</div>
        <div>
          <input
            value={potentialLinkData.duration}
            data-field="duration"
            onChange={changePotentialLinkData}
          />
          <select
            value={potentialLinkData.durationUnit}
            onChange={changePotentialLinkData}
            data-field="durationUnit"
          >
            <option value="1">seconds</option>
            <option value="60">minutes</option>
            <option value="3600">hours</option>
            <option value="86400">days</option>
          </select>
        </div>
      </CreateLinkData>
      <div style={{ textAlign: "center", paddingTop: "10px" }}>
        <button onClick={() => addLink()}>Add Link</button>
      </div>
    </CreateLinkContainer>
  );
};

export default CreateLink;

type Props = {
  potentialLinkData: PotentialLink;
  changePotentialLinkData(
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ): void;
  setCreateLinkPopupVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  addLink(): void;
};

const CreateLinkContainer = styled.div`
  background-color: rgba(90, 90, 90, 0.8);
  padding: 10px;
  border-radius: 5px;
  color: white;
  position: relative;
`;
const CloseButtonContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  display: inline-block;
`;

const CreateLinkData = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 5px 10px;
  padding-top: 10px;
`;
