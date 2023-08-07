import type { FC, ReactNode, CSSProperties } from 'react'
import React, { memo, Suspense, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import {
  AppstoreOutlined,
  MailOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button,Modal  } from 'antd';
interface IProps {
  children?: ReactNode
}
const RouterToCH=new Map([['user',"用户"],['user/index',"用户列表"],['learn',"学习"],['dept/index',"部门列表"],['dept',"部门"],['learn/index',"学习列表"]]);
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  // getItem('首页', 'user/', <PieChartOutlined />),
  getItem('用户管理', 'user', <MailOutlined />, [
    getItem('用户列表', 'user/index'),
  ]),
  getItem('学习管理', 'learn', <MailOutlined />, [
    getItem('学习列表', 'learn/index'),
  ]),
  getItem('部门管理', 'dept', <AppstoreOutlined />, [
    getItem('部门列表', 'dept/index'),
    // getItem('Submenu', 'sub4', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ]),
];
const Users: FC<IProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items2, setItems2]:[any,any] = useState([
    {
      title: '管理界面',
    },
    {
      title: "用户",
    },
    {title: "用户列表"}]);
  const allImg = [require('../../assets/img/YiPostLogo.jpg'), require('../../assets/img/YiPostIcon.jpg')];
  const [logoImg, setlogoImg] = useState(0);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  function setBread(keypath: Array<any>) {
    setItems2([{title: '管理界面'},{title: RouterToCH.get(keypath[1])},{title: RouterToCH.get(keypath[0])}]);
  }
  const navigate = useNavigate();
  const onClickRouter: MenuProps['onClick'] = (e) => {
    setBread(e.keyPath)
    const toRouter = `${e.key}`
    navigate(toRouter, { replace: false })
  };
  const maxLayStyle: CSSProperties = {
    minHeight: "100vh"
  }
  return (
    <Layout style={maxLayStyle}>
      <Sider trigger={null} style={{ background: colorBgContainer }} collapsible collapsed={collapsed} >
        <div className='logoDiv' style={{ width: '100%' }}>
          <img style={{ width: '100%' }} src={allImg[logoImg]} alt="" />
        </div>
        <Menu
          onClick={onClickRouter}
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          theme="dark"
          style={{ height: '100%', borderRight: 0, padding: "10px 0" }}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              setCollapsed(!collapsed);
              setlogoImg(logoImg ? 0 : 1)
            }}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Breadcrumb style={{ margin: '20px 16px' }} items={items2}></Breadcrumb>
        </Header>
        <Content
          style={{
            padding: 15,
            margin: 10,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Suspense fallback="Loading...">
            <Outlet></Outlet>
          </Suspense>
        </Content>
      </Layout>
    </Layout>

  );
}

export default memo(Users)
