# 一步一步构件react后台系统 9 之  tab切换

## 先看看效果

可以看到， 在面包屑下面多了个tab栏

![tabs.png](https://upload-images.jianshu.io/upload_images/13943027-1374d73cd665982d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



## 思路

之前看到别人的后台系统， 有一个tab， 来记录所有跳转过的页面， 我就在想， 该怎么做？

然后看了一下别人的代码。
原理是这样的。

做一个tab,  然后点击导航的时候， 我们的props就会发生改变，  componentWillReceiveProps 方法就会被调用， 然后就在里面监听， 判断当前页面在不在tab面板里面， 如果不在，则拿到当前页面路径到路由表里面进行寻找， 找到对应的对象并提取出来， 然后加入到所有tabs数组里面， 并在组件里面进行渲染。

在路由配置里面， 有component属性的， 里面保存着组件， 直接把这个渲染在tab的面板里面就可以了。


## 开始动手

1. 先贴出components/tabs.js完整代码
```
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
```
2. 查看细节

- props 改变的时候， 会触发
```
    // props 更新时调用
    componentWillReceiveProps (nextProps) {
        this.addRouteToAllTabPans(nextProps)
    }
```

-  判断 点击的是当前tab页面， 则不做反应， 如果点击的是index页面， 同样不做反应。
-  使用some判断当前路径是否已经存在 openPages（tabs数组）里面，
- 如果不存在，  从路由表里面提取出改路径的路由对象， 并添加到openPages里面。 同时修改 currentPage当前路由对象
```
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
```

-  在这里， 就是循环渲染了。
-  <page.component routes={routes}></page.component>    这个就是路由对象的组件， 直接在TabPane里面渲染出来。
```
 {this.state.openPages.map(page => {
                         return <TabPane forceRender tab={page.name} closable={page.closable} key={page.path}>
                            <page.component routes={routes}></page.component>
                        </TabPane>
                    })}
```

 大概完成思路就是这样。


## 完善

这里我把切换功能放在了header上面。 可以根据自己的选择需要或不需要tab

1. 修改components/header.js

因为menu的点击事件放在了menu标签上面， 而点击的时候， 可以拿到menuItem中的key
因此， 我们进行判断， 如果是tabs， 我们就触发事件
```
    handleClick = (e) => {
        if (e.key === 'tabs') {
            this.changeTabs()
        } else {
            this.setState({
                current: e.key,
            });
        }
    }
```
切换 tabs状态
```
    changeTabs = (obj) => {
        this.props.toggleTabs({
                tabs: !this.props.headerData.tabs
            })
    }
```
我们的tabs需要在header组件与 index组件里面使用， 因此不能单纯的只是放在当前页面，  需要用redux进行管理。

2. 修改 reducer/connect

修改 mapLogout，
```
export const mapLogout = {
    mapStateToProps: (state) => {
        return { headerData: { }, ...state.slidecollapsed}
    },
    mapDispatchToProps: (dispatch) => {
        return {onSlidecollapsed: () => dispatch(action_slidecollapsed), getRouterConfig: () => {
                return dispatch(routerConfig)
            }, toggleSlide: () => {
                dispatch({type: action_slidecollapsed.type})
            },
            onLogout: (data) => {
                return dispatch(fetchPosts('/logout', action_slidecollapsed.type, 'logoutData', data))
            },
            toggleTabs: (data) => {  // 添加切换tab的函数
                console.log(data);
                dispatch(receive(action_slidecollapsed.type,  'headerData', {
                    ...data
                }))
            }
        }
    }
}
```

修改rudexs.js
以前的数据， 是用redux里面控制， 现在我们要改成传参的形式。
```
const slidecollapsedFuc = (state = { slidecollapsed: false }, action) => {
    switch (action.type) {
        case SLIDECOLLAPSED:
            return Object.assign({}, state, action)
        default:
            return state
    }
}
```

components/header
添加 changeTabs 方法 。    render 里面引入 headerData 数据， 然后添加MenuItem标签
```
    changeTabs = (obj) => {
        this.props.toggleTabs({
                tabs: !this.props.headerData.tabs
            })
    }



            let { slidecollapsed, headerData, toggleSlide, toggleTabs } = this.props
            let { tabs } = headerData

                   <Menu.Item key="tabs">
                                            <Icon type="notification" /> {tabs ? '隐藏tabs' : '显示tabs'}
                                    </Menu.Item>
```

这样， 点击头部的'隐藏tabs'按钮的时候，就会进行切换，文字。


- 修改views/index/index
添加引入
添加方法和属性
添加this.props.headerData
判断tabs 进行显示隐藏。
```
import MyTabs  from '@/components/tabs.js'
import MySlider  from '@/components/slider'
import { connect  } from 'react-redux'
import { mapIndex } from '@/reducer/connect'

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

            let { routes, headerData } = this.props
            console.log(this.props)
            let { tabs } = headerData


                                { tabs &&
                                <MyTabs routes={routes}></MyTabs>
                                }
                                {!tabs &&
                                <MyMain routes={routes}></MyMain>
                                }

                                export default connect(mapIndex.mapStateToProps)(Index);
```

- redcer/connect
添加 mapIndex方法。
```
export const mapIndex = {
    mapStateToProps: (state) => {
        return { headerData: { }, ...state.slidecollapsed}
    },
    mapDispatchToProps: (dispatch) => {
        return {
            toggleTabs: (data) => {
                console.log(data);
                dispatch(receive(action_slidecollapsed.type,  'headerData', {
                    ...data
                }))
            }
        }
    }
}
```

-  utils/index 内添加方法

先从面包屑组件里面提取 deepFlatten 到公共方法， 然后 添加removeArrItem
```

export const deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : ( typeof v === 'object' ? (Array.isArray(v.routes) ? deepFlatten(v.routes.concat(deleObj(v, 'routes'))) : v) : v )));

// 删除数组某项元素

export const removeArrItem = (arr, validFunx) => {
    arr.splice(arr.findIndex(item => validFunx(item)), 1)
    return arr
}
```
