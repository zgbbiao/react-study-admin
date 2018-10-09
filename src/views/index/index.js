import React, { Component } from 'react';
import { Layout } from 'antd';
import Crumbs  from '@/components/crumbs'
import MyHeader  from '@/components/header'
import MyMain  from '@/components/main'
import MyTabs  from '@/components/tabs.js'
import MySlider  from '@/components/slider'
import { connect  } from 'react-redux'
import { mapIndex } from '@/reducer/connect'
import './index.css'
class Index extends Component {
    state = {
        currentPage: '',
        openPages: []
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }
    onTabClick = (activeKey) => {
        // if (activeKey !== this.state.currentPage && activeKey === 'home') {
        //     this.props.history.push('/app/home');
        //     return;
        // }
        // if (activeKey !== this.state.currentPage) {
        //     this.props.history.push(MenuToRouter[activeKey]);
        // }
    }
    render() {
        let { routes, headerData } = this.props
        console.log(this.props)
        let { tabs } = headerData
        return (
            <Layout>
                <MySlider></MySlider>
                <Layout>
                    <MyHeader></MyHeader>
                    <Crumbs></Crumbs>
                    { tabs &&
                    <MyTabs routes={routes}></MyTabs>
                    }
                    {!tabs &&
                    <MyMain routes={routes}></MyMain>
                    }
                </Layout>
            </Layout>
        );
    }
}

export default connect(mapIndex.mapStateToProps)(Index);