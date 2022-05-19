import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";

const Container = styled(Flex, {
  maxHeight: "100vh",
  width: "calc(100% - 256px)",

  overflow: "hidden",

  marginLeft: "auto",
  padding: "$64 $48 $24 $48",
});

export { Container };
