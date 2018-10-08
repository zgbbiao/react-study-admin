# 手摸手带你撸react后台管理系统
## 项目地址：

[react后台系统](https://github.com/zgbbiao/react-study-admin)
[node后台](https://github.com/zgbbiao/react-stdy-admin-node)

## 创建项目
使用create-react-app脚手架创建

```
 npm install -g create-react-app yarn
 create-react-app antd-demo
 cd antd-demo
 yarn start
```

## 依赖模块
- react 16.5.2
- react-router
- react-rudex
- rudex

## 先搭建目录结构

```
- src/api  存放请求以及相关接口的地方
- src/components  存放组件
- src/reducer   // 存放reducer
- src/router 存放路由
- src/utils  存放公共方法
- src/views  存放页面
```

##  规划页面， 划分组件
首先是登录页, 其实是首页，
而其他页面都在首页下面

**页面**
```
- 登录页面
- 首页
```

**组件**

```
- 首页内的组件
   - 侧边导航栏
   - 头部 信息栏
   - 面包屑
   - 内容页面
```

## 划分完毕， 按照页面建立路由

/src/router/index.js
```
import Login from '@/views/login/index'
import Index from '@/views/index/index'

export const main = [
    { path: '/login', name: '登录', component: Login },
    { path: '/', exact: true,  name: '首页', component: Index }
]

export const menus = [    // 菜单相关路由
]

export const routerConfig =  {
    main, menus
}
```

## 记得把编辑器设置成支撑jsx语法的

webstrom的设置方法

- file -> settings ->  languages & Frameworks  -> javascript  ->  选择react JSX

## 路由建立完毕， 这时候可以按照路由新建react的页面啦

- src/views/login/index.js
页面不必多复杂， 简单点就好，先把框架搭建出来
```
import React, { Component } from 'react';
class Login extends Component {
    render() {
        return (
            <div>
                Login
            </div>
        )
    }
}
export default Login;
```

- src/views/index/index.js

```
import React, { Component } from 'react';
class Index extends Component {
    render() {
        return (
            <div>
                index
            </div>
        )
    }
}
export default Index;
```

## 弄完后， 修改一下webpack配置吧，

```
npm run eject  先把配置显示出来
打开 config/webpack.config.dev.js， 然后找到 resolve.alias 添加 `  '@': paths.appSrc` 配置吧， 作用是以后凡是src文件目录 都用 ‘@’来替代
module.exports = {
resolve: {
    alias: {
       '@': paths.appSrc
    }
}

```

 改完后 重启一下

 ```
 重启报错
 internal/modules/cjs/loader.js:596
     throw err;
 Error: Cannot find module 'chalk'

 npm i chalk
 好了 可以用了
 ```

## 路由建立完毕了，  就开始搭建路由框架吧

1. 添加路由库

```
npm i -D react-router react-router-dom
```

- app.js
导入路由库， 导入路由配置， 导入路由工具
```
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { main as mainConfig } from './router/index'
import { RenderRoutes } from './router/utils'
```
**修改标签**
 *添加Router标签*
 *添加RenderRoutes组件*
```
class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
              <RenderRoutes routes={mainConfig}></RenderRoutes>
          </div>
        </Router>
    );
  }
}
```

2. utils
- 添加 RenderRoutes组件
这个组件的作用 就是循环渲染当前数组下的一维数组的内容， 将他以标签的形式展现出来，
- RouteWithSubRoutes  是显示路由的组件，  这里你展示内容的一个标签即可
```
比如这个路由数组
const  routes= [
                   { path: '/login', name: '登录', component: Login },
                   { path: '/', exact: true,  name: '首页', component: Index,
                        routes: [
                            path: '/a', name: 'a', component: PageA,
                            path: '/b', name: 'b', component: PageB
                        ]
                   }
               ]
// 循环渲染当前路由数组中一维数组中的组件
export const RenderRoutes = ({routes}) => {return (routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />))};
也就是说， 这里只渲染这个数组的一唯数组， routes下面的routes数组是不会继续渲染的
```

- 添加 RouteWithSubRoutes组件

```
根据路由信息 例如：
const route = {path: '/login', name: '登录', component: Login}
Route 是渲染路由的标签 exact是否严格匹配， render是自定义渲染内容， 返回要渲染的标签， 这里拿出route.component（Login）组件进行渲染。
别忘记， 如果有子路有的话， 需要把子路由也传递过去， routes={route.routes}, 方便下面的组件可以拿到这些信息进行渲染
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
```


3.  可以看到页面了哦， 这时候最简单的路由功能以及实现
输入 http://localhost:3000 到浏览器，  可以看到 Index
输入 http://localhost:3000/login 到浏览器，  可以看到 login

##  改造Index页面
login页面暂且不管， 无非就是一个Login + 两个Input + 一个Button的事情， 这里先继续吧整体框架架构完成
下面图片截图来源自： https://github.com/yezihaohao/react-admin
![后台系统主页面架构.png](https://upload-images.jianshu.io/upload_images/13943027-64601eeaa65fefe0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个页面被我分成了四块，侧边栏一块， 头部信息栏一块， 面包屑一块， 内容展示区一块。
这里先不做具体功能， 先把页面分块和组件做出来先

1. 先把组件做出来

- src/components/crumbs
```
import React, { Component } from 'react';
class Crumbs extends Component {
    render() {
        return (
            <div>
                crumbs
            </div>
        )
    }
}
export default Crumbs;
```

- src/components/header
```
import React, { Component } from 'react';
class MyHeader extends Component {
    render() {
        return (
            <div>
                Header
            </div>
        )
    }
}
export default MyHeader;
```

- src/components/main
```
import React, { Component } from 'react';
class MyMain extends Component {
    render() {
        return (
            <div>
                main
            </div>
        )
    }
}
export default MyMain;
```
- src/components/slider

```
import React, { Component } from 'react';
class MySlider extends Component {
    render() {
        return (
            <div>
                slider
            </div>
        )
    }
}
export default MySlider;
```

2. 做出组件后， 然后需要引入ant
但是引入ant 又需要按需加载怎么办？

在[ant文档](https://ant.design/docs/react/use-with-create-react-app-cn) 里面可以找到， 但是这个方法仅限于还没有 yarn run eject 出配置文件之前。
当 yarn run eject 出配置文件之后， 该怎么办呢？
别慌， 下面有方法

- 添加插件 yarn add babel-plugin-import --save-dev  yarn add antd --save-dev
- 在congif文件夹下webpack.config.dev.js第147行添加代码*别找错了*
```
options: {
   +        plugins: [
   +             [‘import‘, [{ libraryName: "antd", style: ‘css‘ }]],
   +          ],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
            },
```

|
|
|  具体细节
--------->

```
{
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
            plugins: [
               ['import', [{ libraryName: "antd", style: 'css' }]],
              ],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
            },
          },
```

- 在config文件下webpack.config.prod.js第154行添加
重复上一步操作

4. 在views/index/index 页面引入 ant组件试一下是否成功

```
import React, { Component } from 'react';
import { Button }  from 'antd'
class Index extends Component {
    render() {
        return (
            <div>
                index
                <Button>sdfdssdf</Button>
            </div>
        )
    }
}
export default Index;
```

##  改在index页面2
代码中， 用 + 表示新增，  - 表示减少，  +-表示修改
1. 改在组件

改造组件前， 先找到对应页面的组件
[ant.designUI组件](https://ant.design/components/layout-cn/)

然后找到layout组件， 从里面拿出代码 ![layout组件]
![layout组件.png](https://upload-images.jianshu.io/upload_images/13943027-1e3891d64035bc97.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 记住， import必须在所有业务代码前面执行， 如果爆出下面的Bug， 请修改Impot顺序

```
Import in body of module; reorder to top import/first
import 必须在其它所有业务代码前面（eslint 暴出）
```

3. 也把rudex一起引入了吧
- react-redux 是react的一个库
- rudex 是js库
```
npm i react-redux redux -D
```

4. 修改app.js
```
import React, { Component } from 'react';
import { createStore } from 'redux'  //+
import { Provider } from 'react-redux' //+
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import { main as mainConfig } from './router/index'
import { RenderRoutes } from './router/utils'
import { slidecollapsed } from '@/reducer/reduxs' //+
const store = createStore(slidecollapsed) // +
class App extends Component {
    render() {
        return (
            <Provider store={store}>  // +
                    <Router>
                        <div className="App">
                            <RenderRoutes routes={mainConfig}></RenderRoutes>
                        </div>
                    </Router>
            </Provider> // +
        );
    }
}

export default App

```

5. 添加 ruducer/reduxs.js
- 用来实现业务逻辑功能， 创建store的rudex
```
const SLIDECOLLAPSED = 'slidecollapsed'
export const slidecollapsed = (state = { slidecollapsed: false }, action) => {
    const slidecollapsed = state.slidecollapsed
    switch (action.type) {
        case SLIDECOLLAPSED:
            return Object.assign({}, state, {
                slidecollapsed: !slidecollapsed
            })
        default:
            return state
    }
}
```

6. 添加reducer/connect.js

- 添加页面中connect的参数（注入到页面中的属性和事件）
```
let action_slidecollapsed = {type: 'slidecollapsed'}
export const mapStateToProps = (state) => {
    return {slidecollapsed: state.slidecollapsed}
}
export const mapDispatchToProps = (dispatch) => {
    return {onSlidecollapsed: () => dispatch(action_slidecollapsed)}
}

```

7. 修改views/index/index.js

```
import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd'; // +
import { connect, Provider  } from 'react-redux' // +
import Crumbs  from '@/components/crumbs' // +
import MyHeader  from '@/components/header' // +
import MyMain  from '@/components/main' // +
import MySlider  from '@/components/slider' // +
import { mapStateToProps, mapDispatchToProps } from '@/reducer/connect' // +
const { Header, Content } = Layout; // +

class Index extends Component {
    constructor(props){ // +
        super(props) // +
        this.state = { // +
            onSlidecollapsed: this.props.onSlidecollapsed // +
        }; // +
    }

    toggle = () => {  // +-
        this.state.onSlidecollapsed()
    }

    render() {
        const { slidecollapsed } = this.props // +
        return (
            <Layout>
                <MySlider></MySlider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={ slidecollapsed ? 'menu-unfold' : 'menu-fold'}   // +-
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                        Content
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);  // +-
```
上面代码中， 先拿到redux注入到组件的事件 并修改toggle方法
```
      this.state = { // +
            onSlidecollapsed: this.props.onSlidecollapsed // +
        }; // +

           toggle = () => {  // +-
                this.state.onSlidecollapsed()
            }
```

然后拿到注入的属性
```
    const { slidecollapsed } = this.props // +
```

然后把属性放进Icon里面
```
 <Icon
                            className="trigger"
                            type={ slidecollapsed ? 'menu-unfold' : 'menu-fold'}   // +-
                            onClick={this.toggle}
                        />
```

8. components/slider.js

```
import React, { Component } from 'react';
import { Menu, Icon } from 'antd'; // +
import {Layout} from "antd/lib/index"; // +
import { mapStateToProps, mapDispatchToProps } from '@/reducer/connect' // +
import {connect} from "react-redux"; // +
const { Sider } = Layout; // +
class MySlider extends Component {
    render() {
        const { slidecollapsed } = this.props // +
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={ slidecollapsed } // +-
            >
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Icon type="user" />
                        <span>nav 1</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="video-camera" />
                        <span>nav 2</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="upload" />
                        <span>nav 3</span>
                    </Menu.Item>
                </Menu>
            </Sider>

        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MySlider); // +-
```

9. 继续把header组件分开
- components/header.js
```
import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import { connect  } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '@/reducer/connect'
const { Header } = Layout;
class MyHeader extends Component {
    constructor(props){
        super(props)
        this.state = {
            onSlidecollapsed: this.props.onSlidecollapsed
        };
    }
    toggle = () => {
        this.state.onSlidecollapsed()
    }
    render() {
        const { slidecollapsed } = this.props
        return (
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={ slidecollapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                </Header>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyHeader);
```
- 修改views/index/index.js

```
import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect  } from 'react-redux'
import Crumbs  from '@/components/crumbs'
import MyHeader  from '@/components/header'
import MyMain  from '@/components/main'
import MySlider  from '@/components/slider'
import { mapStateToProps, mapDispatchToProps } from '@/reducer/connect' // -
import './index.css'
const { Header, Content } = Layout;

class Index extends Component {
    render() {
        return (
            <Layout>
                <MySlider></MySlider>
                <Layout>
                    <MyHeader></MyHeader>  // +-
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                        Content
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index); // -
export default Index; // +
```

10. 把内容面包屑组件加进去

- 修改 components/crumbs.js
```
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux'
import { crumbsMap } from "../reducer/connect";
import { filterData } from '@/utils/index.js'
const deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v));
let breadcrumbNameMap = []

class Crumbs extends Component {
    componentDidMount () {  //页面渲染完毕后调用
        this.onTrun()
    }
    onTrun () {}
    render() {
        let { location, getRouterConfig, routerConfig } = this.props
        routerConfig = filterData(routerConfig, 'routerConfig')
        this.onTrun = getRouterConfig  // 在页面刷新时不可调用， 需要页面渲染完毕时调用
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
```

这里使用了react-redux进行存储路由表， 然后切换action拿到路由信息并注入到props内，  通过props 拿到数据后进一步处理， 把几个路由表合并， 随后遍历路由内的子路由，并渲染出面包屑组件

- 修改reducer/connect.js

```
import { action_slidecollapsed, routerConfig } from '@/reducer/action.js'

export const mapStateToProps = (state) => {
    return {slidecollapsed:  state.slidecollapsed}
}
export const mapDispatchToProps = (dispatch) => {
    return {onSlidecollapsed: () => dispatch(action_slidecollapsed)}
}

export const crumbsMap = {
    mapStateToProps (state) {
        return { routerConfig: state.routerConfig }
    },
    mapDispatchToProps (dispatch) {
        return {getRouterConfig: () => {
                return dispatch(routerConfig)
            }}
    }
}
```

- 添加reducer/action.js

```
export const SLIDECOLLAPSED = 'slidecollapsed'
export const ROUTERCONFIG = 'routerconfig'
export const action_slidecollapsed = {type: SLIDECOLLAPSED}
export const routerConfig = { type: ROUTERCONFIG }
```

- 修改reducer/reduxs.js

```
import { combineReducers } from 'redux';
import { routerConfig as myRouterConfig } from '@/router/index'
import {SLIDECOLLAPSED, ROUTERCONFIG} from '@/reducer/action.js'
const slidecollapsedFuc = (state = { slidecollapsed: false }, action) => {
    switch (action.type) {
        case SLIDECOLLAPSED:
            return Object.assign({}, state, {
                slidecollapsed: !state.slidecollapsed
            })
        default:
            return state
    }
}

const getRouterConfig = (state = { routerConfig: [] }, action) => {
    switch (action.type) {
        case ROUTERCONFIG:
            return  Object.assign({}, state, {
                routerConfig: myRouterConfig
            })
        default:
            return state
    }
}

export const allReducer = combineReducers({
    slidecollapsed: slidecollapsedFuc, routerConfig: getRouterConfig
})
```

- 因为将 reducer拆分， 因此需要使用combineReducers， 而使用combineReducers会将原本的数据包装多一层， 因此需要进一步修改代码

- 添加/utils/index.js
```
export const filterData = (state, stateName) => (typeof state ==='object' ? state[stateName] : state)
```

- 修改components/crumbs.js

```
        let { location, getRouterConfig, routerConfig } = this.props
        routerConfig = filterData(routerConfig, 'routerConfig') // 这里需要将数据过滤一层， 因为reducer的名称 我都是按照下面变量来取的， 因此判断他们是否有下一层变量， 如果有，则拿下一层的， 如果没有， 则拿第一层的。
```

- 修改components/header.js

```
        let { slidecollapsed } = this.props
        slidecollapsed = filterData(slidecollapsed, 'slidecollapsed')
```

- 修改components/slider.js

```
        let { slidecollapsed } = this.props
        slidecollapsed =  filterData(slidecollapsed, 'slidecollapsed')
```

11. 现在可以看到效果了


![面包屑完成.png](https://upload-images.jianshu.io/upload_images/13943027-f110068901942101.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 这里我在路由配置上添加了一个临时页面，
```
const Test = () => <h3>test</h3>
export const main = [
    { path: '/login', name: '登录', component: Login },
    { path: '/', exact: true,  name: '首页', component: Index,
        routes: [
            {path: '/test', name: '测试页面', component: Test }
        ]
    }
]
```

## 继续把main组件给拆分

- components/main.js
```
import React, { Component } from 'react';
import {Layout} from "antd/lib/index";

const { Content } = Layout;
class MyMain extends Component {
    render() {
        return (
            <div>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    Content
                </Content>
            </div>
        )
    }
}
export default MyMain;
```

- views/index/index.js

```
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
```

现在， react的大体框架已经搭建完毕。