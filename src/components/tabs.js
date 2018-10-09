import React, { Component } from 'react';
import { Tabs  } from 'antd';
import { filterData, deleObj, deepFlatten, removeArrItem } from '@/utils/index.js'
import { main as mainConfig } from '@/router/index'
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {crumbsMap} from "@/reducer/connect";

const TabPane  = Tabs.TabPane;
class MyTabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: {},
            openPages: [],
            routerConfig: deepFlatten(mainConfig),
            mode: 'top',
        }
    }
    handleModeChange = () => {
        let mode = 'left';
        switch (this.state.mode) {
            case 'top':
                mode = 'left';
                break;
            case 'left' :
                mode = 'right';
                break;
            case 'right':
                    mode = 'bottom';
                    break;
            default:
                mode = 'top'
        }
        this.setState({ mode });
    }
    onEdit = (targetKey, action) => {
        if (action === 'remove') {
            this.removeTabs(targetKey)
        }
    }

    removeTabs = (targetKey) => {
        let openPages = removeArrItem(this.state.openPages, function(item){
            return item.path === targetKey
        })
        this.setState({
            openPages
        })
    }
    onTabClick = (activeKey) => {

    }
    componentDidMount () {
    }
    // props 更新时调用
    componentWillReceiveProps (nextProps) {
        this.addRouteToAllTabPans(nextProps)
    }
    addRouteToAllTabPans (props) {
        if (props.location.pathname !== this.state.currentPage.path && props.location.pathname !=='/index') {
            let {openPages} = this.state
            let isHasRoute = openPages.some(item =>item.path === props.location.pathname)
            if (!isHasRoute) {
                let currentRoute = this.getCurrentRoute(props.location.pathname)
                if (currentRoute) {
                    openPages.push(currentRoute)
                    this.setState({
                        openPages,
                        currentPage: currentRoute
                    })
                }
            }
        }
    }
    getCurrentRoute (path) {
        return this.state.routerConfig.filter(item => {
            if (item.path === path) return item
        })[0]
    }
    render() {
        let { location, getRouterConfig, routerConfig, routes } = this.props
        return (
            <div>
                <Tabs
                    hideAdd
                    defaultActiveKey={this.state.currentPage.path}
                    type="editable-card"
                    animated={true}
                    onEdit={this.onEdit}
                    onTabClick={this.onTabClick}
                    tabBarGutter={5}
                    hideAdd={true}
                    tabPosition={this.state.mode}
                    tabBarExtraContent={<span onClick={this.handleModeChange}>{this.state.mode}</span>}
                >
                    {this.state.openPages.map(page => {
                         return <TabPane forceRender tab={page.name} closable={page.closable} key={page.path}>
                            <page.component routes={routes}></page.component>
                        </TabPane>
                    })}
                </Tabs>
            </div>
        );
    }
}

export default connect(crumbsMap.mapStateToProps, crumbsMap.mapDispatchToProps)(withRouter(MyTabs))