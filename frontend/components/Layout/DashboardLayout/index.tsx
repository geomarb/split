import Link from "next/link";
import React from "react";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import Icon from "../../icons/Icon";
import { AddNewBoardButton, Main } from "./styles";

type DashboardLayoutProps = {
  children: React.ReactNode;
  firstName: string;
  isDashboard: boolean;
  isBoards: boolean;
};

const DashboardLayout = (props: DashboardLayoutProps) => {
  const { children, firstName, isDashboard, isBoards } = props;

  return (
    <Main justify="between" gap="36">
      <Flex direction="column" css={{ gap: "$40", width: "100%" }}>
        <Flex justify="between">
          {isDashboard && <Text heading="1">Welcome, {firstName}</Text>}
          {isBoards && <Text heading="1">Boards</Text>}
          <Link href="/boards/new">
            <AddNewBoardButton size={isDashboard ? "sm" : "md"}>
              <Icon name="plus" css={{ color: "white" }} />
              Add new board
            </AddNewBoardButton>
          </Link>
        </Flex>
        {children}
      </Flex>
      {/* {isDashboard && <CalendarBar />} */}
    </Main>
  );
};

export default DashboardLayout;
