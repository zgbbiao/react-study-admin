import React from 'react';
import { Route } from "react-router-dom";
// 渲染当前组件
export const RouteWithSubRoutes = route => (
    <Route
        path={route.path}
        exact={route.exact}
        render={props =>{
            return (
                <route.component {...props} routes={route.routes} />
            )
        }}
    />
);
// 循环渲染当前路由数组中一维数组中的组件
export const RenderRoutes = ({routes}) => {return (routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />))};