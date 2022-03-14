import type { NextPage } from "next";
import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/signUp/SignUpTabContent";
import TroubleLogin from "../components/auth/TroubleLogin";
import Banner from "../components/Primitives/Banner";
import Flex from "../components/Primitives/Flex";
import { TabsRoot, TabsList, TabsTrigger } from "../components/Primitives/Tab";
import Text from "../components/Primitives/Text";
import { styled } from "../stitches.config";

const CenteredContainer = styled(Flex, {
  position: "absolute",
  top: "$202",
  right: "$162",
  boxSizing: "border-box",
  "@media (max-height: 1023px)": {
    top: "calc((100vh - 710px) / 2)",
  },
  "&:focus": { outline: "none" },
});

const MainContainer = styled(Flex, {
  height: "100vh",
  width: "100vw",
  position: "relative",
  backgroundColor: "$black",
  backgroundImage: "url(background.svg)",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

const BannerContainer = styled(Flex, {
  mt: "$74",
  ml: "$62",
  size: "fit-content",
});

const Home: NextPage = () => {
  const [showTroubleLogin, setShowTroubleLogin] = useState(false);
  return (
    <MainContainer>
      <BannerContainer>
        <Banner />
      </BannerContainer>
      <CenteredContainer>
        {!showTroubleLogin && (
          <TabsRoot defaultValue="login">
            <TabsList aria-label="Login or register">
              <TabsTrigger value="login">
                <Text heading="4">Log in</Text>
              </TabsTrigger>
              <TabsTrigger value="register">
                <Text heading="4">Sign up</Text>
              </TabsTrigger>
            </TabsList>
            <RegisterForm />
            <LoginForm setShowTroubleLogin={setShowTroubleLogin} />
          </TabsRoot>
        )}
        {showTroubleLogin && <TroubleLogin setShowTroubleLogin={setShowTroubleLogin} />}
      </CenteredContainer>
    </MainContainer>
  );
};

export default Home;
