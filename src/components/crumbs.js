import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux'
import { crumbsMap } from "../reducer/connect";
import { filterData, deleObj, deepFlatten } from '@/utils/index.js'

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
        routerConfig = routerConfig.menus;
        breadcrumbNameMap = (Array.isArray(routerConfig) && deepFlatten(routerConfig)) || []
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            let ItemName = Array.isArray(breadcrumbNameMap) && breadcrumbNameMap.map(item =>
                    (item.path === url) ? item.name : ''
                )
            ItemName = ItemName.join('')
            return (
            ItemName && (<Breadcrumb.Item key={url}>
                    <Link to={url}>
                        {ItemName}
                    </Link>
            </Breadcrumb.Item>) || ''
            );
        });
        return (
            <div className="my-breadcrumb">
                <Breadcrumb>
                    {extraBreadcrumbItems}
                </Breadcrumb>
            </div>
        )
    }
}

export default connect(crumbsMap.mapStateToProps, crumbsMap.mapDispatchToProps)(withRouter(Crumbs));