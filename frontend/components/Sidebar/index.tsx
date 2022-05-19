import Header from "./partials/Header";
import SideBarContent from "./partials/Content";
import { SidebarStyled } from "./styles";

type SideBarProps = {
  firstName: string;
  lastName: string;
  email: string;
  collapsed?: boolean;
  strategy: string;
};

const Sidebar: React.FC<SideBarProps> = ({ firstName, lastName, email, strategy, collapsed }) => {
  Sidebar.defaultProps = { collapsed: false };
  return (
    <SidebarStyled>
      <Header firstName={firstName} lastName={lastName} email={email} />
      <SideBarContent strategy={strategy} />
    </SidebarStyled>
  );
};

export default Sidebar;
