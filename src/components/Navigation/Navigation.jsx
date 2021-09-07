import { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, StarOutlined, BookOutlined } from "@ant-design/icons";
import "./Navigation.css";
import { useHistory, useLocation } from "react-router-dom";
import Routes from "../../Util/Routes";
import { useAuthStore } from "../../store/AuthStore";
import useSelectors from "../../Util/hooks/selector";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function Navigation() {
  const { isLoggedIn } = useSelectors();

  const logout = useAuthStore((state) => state.logout);

  const { push } = useHistory();
  const { pathname } = useLocation();
  let menuKey = pathname.split("/")[1]
    ? pathname.split("/")[1]
    : "authentication";
  switch (menuKey) {
    case "authentication":
      break;
    case "events":
      menuKey = "eventsMenu";
      break;
    case "bookings":
      menuKey = "bookingsMenu";
      break;
    default:
      break;
  }

  const signOut = () => {
    logout();
    push("/authentication/signin");
  };

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((prev) => !prev);
  return (
    <Layout className="layout">
      <Sider collapsible collapsed={collapsed} onCollapse={toggle}>
        {!collapsed && (
          <div className="logo">
            <h3>{collapsed ? "Zvents👌" : "ZeeVents👌"}</h3>
          </div>
        )}
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[menuKey]}>
          <SubMenu
            key="authentication"
            icon={<UserOutlined />}
            title="Authentication"
          >
            {!isLoggedIn && (
              <>
                <Menu.Item
                  key="signin"
                  onClick={() => push("/authentication/signin")}
                >
                  Sign in
                </Menu.Item>
                <Menu.Item
                  key="signup"
                  onClick={() => push("/authentication/signup")}
                >
                  Sign up
                </Menu.Item>
              </>
            )}
            {isLoggedIn && (
              <Menu.Item key="signout" onClick={signOut}>
                Sign out
              </Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="eventsMenu" icon={<StarOutlined />} title="Events">
            <Menu.Item key="events" onClick={() => push("/events")}>
              Events
            </Menu.Item>
            <Menu.Item
              key="createEvent"
              onClick={() => push("/events/create-new")}
            >
              Create Event
            </Menu.Item>
          </SubMenu>
          <SubMenu key="bookingsMenu" icon={<BookOutlined />} title="Bookings">
            <Menu.Item key="bookEvents" onClick={() => push("/events")}>
              Book Events
            </Menu.Item>
            <Menu.Item key="bookings" onClick={() => push("/bookings")}>
              Your Bookings
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div className="logo">
            <h3>{pathname.split("/")[1].toUpperCase()}</h3>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflowY: "scroll",
          }}
        >
          <Routes />
        </Content>
      </Layout>
    </Layout>
  );
}
export default Navigation;
