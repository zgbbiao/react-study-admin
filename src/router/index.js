import React from 'react'
import { Login, Index, User, User2, Register } from '@/router/toComponent'
import { RenderRoutes } from '@/router/utils'
const Ui = ({routes}) => (<div>
    <h3>Ui
    </h3>
    <RenderRoutes routes={routes}></RenderRoutes>
</div>)
const Button = () => <h3>Button</h3>
const Icon = () => <h3>Icon</h3>
const Animation = () => <h3>Animation</h3>
const From = () => <h3>From</h3>


export const menus = [    // 菜单相关路由
    { path: '/index/UI', name: 'UI', icon:'video-camera', component: Ui , routes: [
            {path: '/index/UI/users', name: '用户列表1', icon: 'video-camera', component: User },
            {path: '/index/UI/users2', name: '用户列表2', icon: 'video-camera', component: User2 },
            {path: '/index/UI/Icon', name: '图标', icon: 'video-camera', component: Icon }
        ]
    },
    { path: '/index/animation', name: '动画', icon: 'video-camera', component: Animation },
    { path: '/index/form', name: '表格', icon: 'video-camera', component: From },
]
// isAuth 表示不用验证是否登录
export const main = [
    { path: '/login', exact: true, name: '登录', component: Login, meta: {
            isAuth: true
        } },
    { path: '/register', exact: true, name: '注册', component: Register, meta: {
            isAuth: true
        }  },
    { path: '/', exact: true,  name: '首页', Redirect: '/index'},
    {
        path: '/index', name: '首页', component: Index,
        routes: menus
    }
]

export const routerConfig =  {
    main, menus
}