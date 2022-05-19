import { styled } from "../../stitches.config";

const SidebarStyled = styled("aside", {
  width: "256px",
  height: "100vh",

  /**
   * Position fixed
   * to avoid scrolls
   */
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,

  backgroundColor: "$primary800",
});

export { SidebarStyled };
