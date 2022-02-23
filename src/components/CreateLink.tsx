import React from "react";
import { Tiny } from "../common/styles";
import { PotentialLink } from "../common/types";

const CreateLink = ({
  potentialLinkData,
  changePotentialLinkData,
  setCreateLinkPopupVisibility,
  addLink,
}: Props) => {
  return (
    <>
      <div>id: </div>
      <div>
        <Tiny>{potentialLinkData.id}</Tiny>
      </div>
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
          size={5}
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
    </>
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
