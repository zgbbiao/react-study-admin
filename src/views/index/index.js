import React, { Component } from 'react';
import { Layout } from 'antd';
import Crumbs  from '@/components/crumbs'
import MyHeader  from '@/components/header'
import MyMain  from '@/components/main'
import MySlider  from '@/components/slider'
import './index.css'

class Index extends Component {
    render() {
        let { routes } = this.props
        console.log(this.props)
        return (
            <Layout>
                <MySlider></MySlider>
                <Layout>
                    <MyHeader></MyHeader>
                    <Crumbs></Crumbs>
                    <MyMain routes={routes}></MyMain>
                </Layout>
            </Layout>
        );
    }
}

export default Index;