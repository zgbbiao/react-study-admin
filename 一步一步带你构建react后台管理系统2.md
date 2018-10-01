# 一步步带你构建react后台系统2

继续之前的思路，  先设计页面， 这里我是按照  https://admiring-dijkstra-34cb29.netlify.com/#/app/dashboard/index  里面的页面来设计

```
- 首页
- UI
   - 按钮
   - 图标
- 动画
- 表格
```

暂时先按照这个思路做

我们先把路由配置出来先

1. 修改路由配置
```
import React from 'react'
import Login from '@/views/login/index'
import Index from '@/views/index/index'
import { RenderRoutes } from '@/router/utils'

const Test = () => <h3>test</h3>
const Ui = ({routes}) => (<div>
    <h3>Ui
    </h3>
</div>)
const Button = () => <h3>Button</h3>
const Icon = () => <h3>Icon</h3>
const Animation = () => <h3>Animation</h3>
const From = () => <h3>From</h3>


export const menus = [    // 菜单相关路由
    { path: '/index/UI', name: 'UI', icon:'video-camera', component: Ui , routes: [
            {path: '/index/UI/button', name: '按钮', icon: 'video-camera', component: Button },
            {path: '/index/UI/Icon', name: '图标', icon: 'video-camera', component: Icon }
        ]
    },
    { path: '/index/animation', name: '动画', icon: 'video-camera', component: Animation },
    { path: '/index/form', name: '表格', icon: 'video-camera', component: From },
]
export const main = [
    { path: '/login', exact: true, name: '登录', component: Login },
    { path: '/', exact: true,  name: '首页', Redirect: '/index'},  // +-
    {  // +
        path: '/index', name: '首页', component: Index,  // 这里exact!=true， 因为需要模糊匹配， 然后下一级才能匹配到这个路由，才能继续往下寻找组件
        routes: menus
    }
]

export const routerConfig =  {
    main, menus
}
```
按照设计的组件， 先把路由表设计出来。
这里修改了 path="/"的路由配置， 改成重定向的方式， 然后添加了一个首页的路由（path="/index"）

然后添加 menus 路由配置， 并把 menus路由配置作为一个侧边栏菜单设计，  同时， 侧边栏菜单的路由需要在右边显示， 因此需要把这个menus路由配置放进首页路由配置（main[path="/index"].routes）里面。 这样， 在 RouteWithSubRoutes 组件里面的 `<route.component {...props} routes={route.routes} />` 会把子路由数组给传递给子路由， 因此每一个子组件都可以接收到由父组件传递过来的路由表。

同时， 这里添加了几个临时的组件， 因为是临时的， 暂时就放在router/index文件里面。

还有， 这里的路由配置添加了一个重定向的功能， 因此需要修改渲染组件

- router/utils

```
import { Route, Link, Redirect } from "react-router-dom";  // +-
// 渲染当前组件
export const RouteWithSubRoutes = route => (
    <Route
        path={route.path}
        exact={route.exact}
        render={props =>{
            return (
                route &&( route.Redirect ? (<Redirect to={route.Redirect}></Redirect>) :  // +-
                (<route.component {...props} routes={route.routes} />))
            )
        }}
    />
);
```

这里添加了重定向功能， 引入重定向组件， 判断是否有路由， 如果有，并且有重定向， 则进行重定向， 否则直接渲染组件。

2. 修改src/components/slider.js文件

```
import React, { Component } from 'react';
import { Menu } from 'antd';
import {Layout} from "antd/lib/index";
import { mapStateToProps, mapDispatchToProps } from '@/reducer/connect'
import {connect} from "react-redux";
import { filterData } from '@/utils/index.js'
import { menus as menusConfig } from '@/router/index'
import { OldSchoolMenuLink } from '@/router/utils'
import slideMenu from '@/components/slideMenu'
const { Sider } = Layout;

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
```
这里需要把 menusConfig 菜单路由拿出来， 然后进行渲染，  这里自定义了一个菜单组件 `slideMenu`

3. 添加 components/slideMenu

```
import React from 'react';
import { Menu } from 'antd';
import { OldSchoolMenuLink } from '@/router/utils'
const SubMenu = Menu.SubMenu;
const myMenu = (item) => <Menu.Item key={item.path}><OldSchoolMenuLink route={item}></OldSchoolMenuLink></Menu.Item>
const slideMenu = (routes) => Array.isArray(routes) && routes.map(item => (  // 这里循环渲染路由
        (!Array.isArray(item.routes) &&  myMenu(item) ) || (    // 判断是否有子路由， 如果有， 则按照二级菜单的方式渲染， 否则直接渲染一级菜单
            <SubMenu key={item.path} title={(<OldSchoolMenuLink route={item}></OldSchoolMenuLink>)}>
                {slideMenu(item.routes)}  // 因为这里需要循环渲染， 因此携程函数式组件更为便捷
            </SubMenu>)
    )
);
export default slideMenu
```

4. 修改router/utils.js

```
import React from 'react';
import { Icon } from 'antd';
import { Route, Link } from "react-router-dom";
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

// - children  返回当前路径， 会与当前route组件进行匹配， 如果匹配， 则返回当了路径match， 否则返回Null
/*
* 有时您需要渲染路径是否与位置匹配。在这些情况下，您可以使用儿童道具功能。它的工作方式与渲染完全相同，只是它会被调用，无论是否匹配。子渲染道具接收与组件和渲染方法相同的所有路径道具，除非路径无法匹配URL，否则匹配为空。这允许您根据路径是否匹配动态调整UI。如果路线匹配，我们在这里添加一个活动类
* */
export const OldSchoolMenuLink = ({ route }) => (
    <Route
        path={route.path}
        exact={route.exact}
        children={({ match }) => {
            return (
                <div className={match ? "active" : ""}>
                    <Icon type={route.icon}/>
                    <Link to={route.path}>{route.name}</Link>
                </div>
            )
        }}
    />
);
```
这里修改了 这个组件的传参方式， 不在零零散散的传递进来， 而是以对象的方式传递。
```
export const OldSchoolMenuLink = ({ route }) => (
```

 修改了这个组件，  那么 `SlideMenu`组件中的OldSchoolMenuLink调用与传参也需要更改一下

 ```
<OldSchoolMenuLink route={item}></OldSchoolMenuLink>
 ```

 现在 ， 我们的侧边栏就已经完成。

## 渲染侧边栏右侧内容组件

渲染完侧边栏后， 这里需要按照我们点击的侧边栏， 把右侧的内容也显示出来。

1. 修改view/index/index.js
```
import React, { Component } from 'react';
import { Layout } from 'antd';
import Crumbs  from '@/components/crumbs'
import MyHeader  from '@/components/header'
import MyMain  from '@/components/main'
import MySlider  from '@/components/slider'
import './index.css'

class Index extends Component {
    render() {
        let { routes } = this.props  // +
        return (
            <Layout>
                <MySlider></MySlider>
                <Layout>
                    <MyHeader></MyHeader>
                    <Crumbs></Crumbs>
                    <MyMain routes={routes}></MyMain> // +-
                </Layout>
            </Layout>
        );
    }
}

export default Index;
```

在这里， 我们上面提到过 （在 RouteWithSubRoutes 组件里面的 `<route.component {...props} routes={route.routes} />` 会把子路由数组给传递给子路由， 因此每一个子组件都可以接收到由父组件传递过来的路由表。）， 因此， 这里也可以用拿到当前的路由表， 因为MyMain是Index的一个组件， 因此需要把路由表传到这个组件内。

2. components/main.js
```
import React, { Component } from 'react';
import {Layout} from "antd/lib/index";
import { RenderRoutes } from '@/router/utils' // +
const { Content } = Layout;

class MyMain extends Component {
    render() {
        let { routes } = this.props;
        return (
            <div>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    <RenderRoutes routes={routes}></RenderRoutes>  // +
                </Content>
            </div>
        )
    }
}
export default MyMain;
```

这里我们添加了一个渲染路由组件（Route）的组件。

添加完毕后， 就可以点击我们的左侧一级菜单（侧边栏），  右边的内容也跟着变化。

3.  给二级菜单添加组件。

二级菜单都是在一级菜单下面， 因此也应该包含在一级菜单的组件内部。

因为我们的二级菜单都是临时新建的， 暂时保存在router/index.js内， 因此我们再这里面修改即可
这里修改Ui组件。 添加一个渲染路由配置数组的组件功能。
```
const Ui = ({routes}) => (<div>
    <h3>Ui
    </h3>
    <RenderRoutes routes={routes}></RenderRoutes>  // 按照当前路由配置的数组进行渲染
</div>)
```

这样 就可以看到， 点击侧边栏， 右侧的内容会跟着点击那个菜单而进行变化了。