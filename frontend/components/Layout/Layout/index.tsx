import React, { ReactNode, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { TailSpin } from "react-loader-spinner";
import { useRouter } from "next/router";
import Flex from "../../Primitives/Flex";
import { REFRESH_TOKEN_ERROR } from "../../../utils/constants";
import SpinnerPage from "../../Loading/SpinnerPage";
import { BOARDS_ROUTE, DASHBOARD_ROUTE } from "../../../utils/routes";
import { Container } from "./styles";
import Sidebar from "../../Sidebar";
import DashboardLayout from "../DashboardLayout";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession({ required: true });

  const router = useRouter();

  const isDashboard = router.pathname === DASHBOARD_ROUTE;
  const isBoards = router.pathname === BOARDS_ROUTE;

  if (session?.error === REFRESH_TOKEN_ERROR) {
    signOut({ callbackUrl: "/" });
  }

  const renderMain = useMemo(() => {
    if (!session) return null;
    return (
      <DashboardLayout
        firstName={session.user.firstName}
        isDashboard={isDashboard}
        isBoards={isBoards}
      >
        {children}
      </DashboardLayout>
    );
  }, [children, isBoards, isDashboard, session]);

  if (!session) return <SpinnerPage />;

  return (
    <>
      <Container>
        <Sidebar
          firstName={session.user.firstName}
          lastName={session.user.lastName}
          email={session.user.email}
          strategy={session.strategy}
        />
        {renderMain}
      </Container>
      {!session && (
        <Flex css={{ height: "100vh", width: "100%" }}>
          <Flex css={{ position: "absolute", top: "40%", left: "55%" }}>
            <TailSpin height={150} width={150} />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Layout;