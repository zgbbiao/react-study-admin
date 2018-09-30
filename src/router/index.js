import React from 'react'
import Login from '@/views/login/index'
import Index from '@/views/index/index'
const Test = () => <h3>test</h3>
const Ui = () => <h3>Ui</h3>
const Button = () => <h3>Button</h3>
const Icon = () => <h3>Icon</h3>
const Animation = () => <h3>Animation</h3>
const From = () => <h3>From</h3>
export const main = [
    { path: '/login', name: '登录', component: Login },
    { path: '/', exact: true,  name: '首页', component: Index,
        routes: [
            {path: '/test', name: '测试页面', component: Test }
        ]
    }
]

export const menus = [    // 菜单相关路由
    { path: '/UI', name: 'UI', icon:'video-camera', component: Ui , routes: [
            {path: '/UI/button', name: '按钮', icon: 'video-camera', component: Button },
            {path: '/UI/Icon', name: '图标', icon: 'video-camera', component: Icon }
        ]
    },
    { path: '/animation', name: '动画', icon: 'video-camera', component: Animation },
    { path: '/form', name: '表格', icon: 'video-camera', component: From },
]

export const routerConfig =  {
    main, menus
}