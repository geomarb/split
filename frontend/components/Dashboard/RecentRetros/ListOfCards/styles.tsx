import { styled } from "../../../../stitches.config";
import Flex from "../../../Primitives/Flex";

const ListContainer = styled(Flex, {
  mt: "$24",
  pr: "$10",
  maxHeight: "calc(100vh - 400px)",
  overflowY: "auto",
});

export { ListContainer };
