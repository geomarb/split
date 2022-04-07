import * as React from "react";
import Text from "./Text";
import AlertIcon from "../icons/toast/alert";
import InfoAlertIcon from "../icons/toast/infoAlert";
import Flex from "./Flex";
import { styled } from "../../stitches.config";

interface AlertBoxProps {
  type: "warning" | "info";
  title?: string;
  text: string;
}

const AlertStyle = styled(Flex, {
  padding: "16px 40px",
  height: "fit-content",
  alignItems: "center",
  border: "1px solid",
  borderRadius: "$12",
  boxShadow: "0px 1px 4px rgba(18, 25, 34, 0.05)",
  boxSizing: "border-box",
});

const AlertText = styled(Flex, {
  display: "flex",
  alignItems: "flex-start",
  padding: "0px",
  marginLeft: "$24",
  gap: "$4",
});

const AlertIconStyle = styled(Flex, {});

const AlertBox: React.FC<AlertBoxProps> = ({ type, title, text }) => {
  AlertBox.defaultProps = { title: undefined };
  const isWarning = type === "warning";

  return (
    <AlertStyle
      css={{
        backgroundColor: isWarning ? "$dangerLightest" : "$infoLightest",
        border: isWarning ? "1px solid $colors$highlight4Base" : "1px solid $colors$infoBase",
      }}
    >
      <AlertIconStyle> {isWarning ? <AlertIcon /> : <InfoAlertIcon />}</AlertIconStyle>
      <AlertText direction="column">
        {!!title && <Text heading="5">{title}</Text>}

        <Text size="sm">{text}</Text>
      </AlertText>
    </AlertStyle>
  );
};

export default AlertBox;