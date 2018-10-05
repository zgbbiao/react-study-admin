# 一步一步构件react后台系统5 之 退出登录

## 退出登录

1. 后台添加退出接口

- routes/index.js
直接提示退出成功
```
router.post('/logout', async (ctx, next) => {
    let body = ctx.request.body
    let username = body.username;
    ctx.body = {
        code: 200,
        message: "退出成功"
    }
})
```

2. 修改react后台系统页面

- components/header.js
```
import React, { Component } from 'react';
import { Layout, Menu, Icon, Badge } from 'antd';
import { connect  } from 'react-redux'
import { mapLogout } from '@/reducer/connect'  // +-
import { filterData } from '@/utils/index.js'
import { Redirect } from "react-router-dom";
const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class MyHeader extends Component {
    constructor(props){
        super(props)
        this.state = {
            onSlidecollapsed: this.props.onSlidecollapsed,
            current: 'mail',
            isAuthenticated: true  // +
        };
    }
    toggle = () => {
        this.state.onSlidecollapsed()
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    logout = (e) => { // +
        this.props.onLogout({})  // 退出登录， 如果是正常项目中， 应该会传递一些数据过去，这里没有用户数据， 因此传递个空对象
        sessionStorage.removeItem('isAuthenticated')  // 发出退出请求后， 直接退出， 无需等待后台返回响应。
        this.setState({
            isAuthenticated: false // 判断是否登录
        })
    }
    render() {
        let { slidecollapsed, toggleSlide, isSlide } = this.props
        slidecollapsed = filterData(slidecollapsed, 'slidecollapsed')
        let avater = '@/logo.svg'
        console.log(this.props)
        if (!this.state.isAuthenticated ) {  // 退出后就重定向
            return <Redirect to="/login" />;
        }
        return (
            <div>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={ slidecollapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    // + 添加菜单组件

                    <Menu
                        onClick={this.handleClick}
                        selectedKeys={[this.state.current]}
                        mode="horizontal"
                    >
                        <Menu.Item key="1">
                            <Badge count={25} overflowCount={10} style={{marginLeft: 10}}>
                                <Icon type="notification" />
                            </Badge>
                        </Menu.Item>
                        <SubMenu title={<span className="avatar"><img src={avater} alt="头像" /><i className="on bottom b-white" /></span>}>
                            <MenuItemGroup title="用户中心">
                                <Menu.Item key="setting:1">你好 -</Menu.Item>
                                <Menu.Item key="setting:2">个人信息</Menu.Item>
                                <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                            </MenuItemGroup>
                            <MenuItemGroup title="设置中心">
                                <Menu.Item key="setting:3">个人设置</Menu.Item>
                                <Menu.Item key="setting:4">系统设置</Menu.Item>
                            </MenuItemGroup>
                        </SubMenu>
                    </Menu>
                </Header>

            </div>
        )
    }
}
export default connect(mapLogout.mapStateToProps, mapLogout.mapDispatchToProps)(MyHeader);  // +-
```

- reducer/connect.js

删除掉原本的两个方法， 改成对象形式。
```
export const mapLogout = {
    mapStateToProps: (state) => {
        var slidecollapsed = {
            slidecollapsed: state.slidecollapsed,
            isSlide: false
        }
        return {...state.slidecollapsed, ...slidecollapsed}
    },
    mapDispatchToProps: (dispatch) => {
        return {onSlidecollapsed: () => dispatch(action_slidecollapsed), getRouterConfig: () => {
                return dispatch(routerConfig)
            }, toggleSlide: () => {
                dispatch({type: action_slidecollapsed.type})
            },
            onLogout: (data) => { // + 添加退出事件。
                return dispatch(fetchPosts('/logout', action_slidecollapsed.type, 'logoutData', data))
            }
        }
    }
}
```

- 修改了上边的mapLogout， 需要把header与slider组件也修改一下。

- conponents/header
```
export default connect(mapLogout.mapStateToProps, mapLogout.mapDispatchToProps)(MyHeader);  // +-
```

- componets/slider.js

```
import { mapLogout } from '@/reducer/connect'
export default connect(mapLogout.mapStateToProps, mapLogout.mapDispatchToProps)(MySlider);
```


改好了，  现在点击退出登录， 就退出成功了。

