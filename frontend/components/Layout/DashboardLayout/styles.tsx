import { styled } from "../../../stitches.config";
import Button from "../../Primitives/Button";
import Flex from "../../Primitives/Flex";

const AddNewBoardButton = styled(Button, "a", {
  width: "fit-content",
  display: "flex",
  position: "relative",
  height: "$48",
  fontWeight: "$medium !important",
  lineHeight: "$20 !important",
});

const Main = styled("main", Flex, { width: "100%", height: "100%" });

export { AddNewBoardButton, Main };
