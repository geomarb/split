import { styled } from "@stitches/react";
import React from "react";
import Flex from "../components/Primitives/Flex";
// eslint-disable-next-line import/no-unresolved
import SelectBox from "../components/Primitives/Select";

const MainContainer = styled(Flex, {
  width: "$580",
  height: "800px",
  padding: "25px 32px 25px",
  backgroundColor: "white",
  border: " 1px solid #CBD2D9",
});

const Testes2 = () => {
  return (
    <MainContainer>
      <SelectBox id="2" type="hour" title="To" />
      <SelectBox id="4" type="times" title="Select time unit" />
    </MainContainer>
  );
};

export default Testes2;
