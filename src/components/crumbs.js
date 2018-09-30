import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux'
import { crumbsMap } from "../reducer/connect";
import { filterData } from '@/utils/index.js'
const deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v));
let breadcrumbNameMap = []

class Crumbs extends Component {
    componentDidMount () {
        this.onTrun()
    }
    onTrun () {}
    render() {
        let { location, getRouterConfig, routerConfig } = this.props
        routerConfig = filterData(routerConfig, 'routerConfig')
        this.onTrun = getRouterConfig
        routerConfig = (typeof routerConfig === 'object' && Object.values(routerConfig)) || []
        breadcrumbNameMap = (Array.isArray(routerConfig) && deepFlatten(routerConfig)) || []
        var newBreadcrumbNameMap = breadcrumbNameMap.filter((item, i) => {
            if (item.path === location.pathname) {
                return item
            }
        })
        return (
            <div className="my-breadcrumb">
                <Breadcrumb>
                    {getBreadCurmbs(newBreadcrumbNameMap)}
                </Breadcrumb>
            </div>
        )
    }
}

const getBreadCurmbs  = (newBreadcrumbNameMap, arr = []) => {
    return arr = newBreadcrumbNameMap.map(item => {
        arr.push(
            <Breadcrumb.Item key={item.path}>
                <Link to={item.path}>
                    {item.name}
                </Link>
            </Breadcrumb.Item>
        )
        {
            Array.isArray(item.routes) && item.routes.length > 0 && getBreadCurmbs(item.routes, arr)
        }
        return arr
    })
}
export default connect(crumbsMap.mapStateToProps, crumbsMap.mapDispatchToProps)(withRouter(Crumbs));