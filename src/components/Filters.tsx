import React, { useState } from "react";
import styled from "styled-components";
import { Title } from "../common/styles";
import { AppData, FilterBlocks } from "../common/types";

const Filters = ({ appState, setAppState }: Props) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  return (
    <Container>
      <Title>
        Filters
        <Control onClick={() => setIsFiltersOpen((prev) => !prev)}>
          {isFiltersOpen ? "▲" : "▼"}
        </Control>
      </Title>
      {isFiltersOpen && (
        <FiltersBody>
          <FilterBlock>
            Start currencies:
            {appState.currencies.map((currency) => (
              <Checkbox
                key={currency.id}
                filterId={currency.id}
                filterBlock="startCurrency"
                appState={appState}
                setAppState={setAppState}
              >
                {currency.name}
              </Checkbox>
            ))}
          </FilterBlock>
          <FilterBlock>
            Start Platforms:
            {appState.platforms.map((platform) => (
              <Checkbox
                key={platform.id}
                filterId={platform.id}
                filterBlock="startPlatform"
                appState={appState}
                setAppState={setAppState}
              >
                {platform.name}
              </Checkbox>
            ))}
          </FilterBlock>
          <FilterBlock>
            End currencies:
            {appState.currencies.map((currency) => (
              <Checkbox
                key={currency.id}
                filterId={currency.id}
                filterBlock="endCurrency"
                appState={appState}
                setAppState={setAppState}
              >
                {currency.name}
              </Checkbox>
            ))}
          </FilterBlock>
          <FilterBlock>
            End Platforms:
            {appState.platforms.map((platform) => (
              <Checkbox
                key={platform.id}
                filterId={platform.id}
                filterBlock="endPlatform"
                appState={appState}
                setAppState={setAppState}
              >
                {platform.name}
              </Checkbox>
            ))}
          </FilterBlock>
        </FiltersBody>
      )}
    </Container>
  );
};

const Checkbox = ({
  filterId,
  filterBlock,
  appState,
  setAppState,
  children,
}: CheckboxProps) => (
  <label>
    <input
      type="checkbox"
      checked={appState.filters[filterBlock].includes(filterId)}
      onChange={() =>
        setAppState((prev) => ({
          ...prev,
          filters: {
            ...prev.filters,
            [filterBlock]:
              prev.filters[filterBlock].indexOf(filterId) === -1
                ? [...(prev.filters[filterBlock] as []), filterId]
                : prev.filters[filterBlock].filter((c) => c !== filterId),
          },
        }))
      }
    ></input>
    {children}
  </label>
);

export default Filters;

const Container = styled.div``;
const Control = styled.div`
  display: inline-block;
`;
const FiltersBody = styled.div`
  display: flex;
  gap: 100px;
`;
const FilterBlock = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

type Props = {
  appState: AppData;
  setAppState: React.Dispatch<React.SetStateAction<AppData>>;
};

type CheckboxProps = {
  filterId: string;
  filterBlock: FilterBlocks;
  appState: AppData;
  setAppState: React.Dispatch<React.SetStateAction<AppData>>;
  children?: React.ReactNode;
};
