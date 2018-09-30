import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect  } from 'react-redux'
import Crumbs  from '@/components/crumbs'
import MyHeader  from '@/components/header'
import MyMain  from '@/components/main'
import MySlider  from '@/components/slider'
import './index.css'
const { Header } = Layout;

class Index extends Component {
    render() {
        return (
            <Layout>
                <MySlider></MySlider>
                <Layout>
                    <MyHeader></MyHeader>
                    <Crumbs></Crumbs>
                    <MyMain></MyMain>
                </Layout>
            </Layout>
        );
    }
}

export default Index;