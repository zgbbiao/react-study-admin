import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import {Layout} from "antd/lib/index";
import { mapStateToProps, mapDispatchToProps } from '@/reducer/connect'
import {connect} from "react-redux";
import { filterData } from '@/utils/index.js'
import { menus as menusConfig } from '@/router/index'
import { OldSchoolMenuLink } from '@/router/utils'
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const slideMenu = (routes) => Array.isArray(routes) && routes.map(item => (
    (!Array.isArray(item.routes) &&   <Menu.Item key={item.path}><OldSchoolMenuLink route={item}></OldSchoolMenuLink></Menu.Item>) || (
        <SubMenu key={item.path} title={<Menu.Item key={item.path}><OldSchoolMenuLink route={item}></OldSchoolMenuLink></Menu.Item>}>
            {slideMenu(item.routes)}
        </SubMenu>)
    )
);
class MySlider extends Component {
    render() {
        let { slidecollapsed } = this.props
        slidecollapsed =  filterData(slidecollapsed, 'slidecollapsed')
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={ slidecollapsed }
            >
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    {slideMenu(menusConfig)}
                </Menu>
            </Sider>

        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MySlider);