# 一步一步构件react后台系统3 之登录页面

## 使用node自己搭建几个虚拟接口

1.  生成项目

``` 
    node -v > 8 // 依赖需要
   npm install -g koa
 npm install -g koa-generator
```
生成项目
```
koa2 koa2-demo2
进入项目，并安装依赖库
 cd koa2-demo2 && npm install
 npm run start 启动项目
```

2.  使用热刷新

``` 
npm i nodemon  -g
nodemon bin/www
```


3.  添加cors 反向代理


- app.js
``` 
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
// CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
// 下面以koa2-cors为例，  //+
const cors = require('koa2-cors');  //+
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'html'
}))
//实现跨域  // +
app.use(cors({
    origin: function(ctx) {
        if (ctx.url === '/test') {
            return false;
        }
        return '*';
        // return "http://116.196.97.115/";
        // return "http://localhost:3000"
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

```

4. 添加登录接口


- routes/index.js
添加接口 `router.post('/login'....` 并验证
``` 
const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/login', async (ctx, next) => {
    let body = ctx.request.body
    let username = body.username;
    let password = body.password;
    console.log(body)
    if( username === "admin" && password.toString() === "123456" ) {
        ctx.body = {
            code: 200,
            message: "登录成功",
            username
        }
    }
    else {
        ctx.body = {
            code: 0,
            message: "登录失败",
        }
    }
})
module.exports = router

```

 登录接口完成， 请求接口（localhost:4000/login）(这里端口被我修改成4000))， 就可以看到 返回的数据了。

5. 修改端口
- bin/www
``` 
var port = normalizePort(process.env.PORT || '4000');
```


 ## 登录页面
 
 使用上面的登录接口， 现在我们就可以来进行数据请求了， 先做一个登录页面吧。
 1. 修改页面
 - 修改 views/login/index.js
 ```
 import React, { Component } from 'react';
 import { Row, Col } from 'antd';
 import './index.css'
 import http from '@/api/http.js'
 import {connect} from "react-redux";
 import { Form, Icon, Input, Button, Checkbox } from 'antd';
 import { action_login } from '@/reducer/action.js' 
 import { loginRequest, receiveLogin } from '@/reducer/actionCreate.js' 
 const FormItem = Form.Item;
 
 class Login extends React.Component {
     handleSubmit = (e) => {
         e.preventDefault();
         this.props.form.validateFields((err, values) => {
             if (!err) {
                 console.log('Received values of form: ', values);
                 this.props.handleLogin(values)  // 拿到注入的事件， 进行请求
             }
         });
     }
     render() {
         const { getFieldDecorator } = this.props.form;
         console.log(this.props)
         return (
             <div className="login">
                 <div className="login-form">
                     <Form onSubmit={this.handleSubmit} className="login-form">
                         <FormItem>
                             {getFieldDecorator('username', {
                                 rules: [{ required: true, message: '用户名为admin!' }],
                             })(
                                 <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                             )}
                         </FormItem>
                         <FormItem>
                             {getFieldDecorator('password', {
                                 rules: [{ required: true, message: '密码为123456!' }],
                             })(
                                 <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                             )}
                         </FormItem>
                         <FormItem>
                             <Row gutter={24}>
                                 <Col span={12}>
                             {getFieldDecorator('remember', {
                                 valuePropName: 'checked',
                                 initialValue: true,
                             })(
                                 <Checkbox>记住密码</Checkbox>
                             )}
                                 </Col>
                                 <Col span={12} className="tr">
                                 <a className="login-form-forgot" href="">忘记密码</a>
                                 </Col>
                             </Row>
                         </FormItem>
                         <FormItem>
                             <Row gutter={24}>
                                     <Col span={6}>
                                         <Button type="primary" htmlType="submit" className="login-form-button">
                                             登录
                                         </Button>
                                     </Col>
                                 <Col span={18} className="tr">
                                     <a href="">还没有账号？ 去注册</a>
                                 </Col>
                             </Row>
                         </FormItem>
                     </Form>
                 </div>
             </div>
         );
     }
 }
 
 function fetchPosts(subreddit, data) {  
     return dispatch => {
         dispatch(receiveLogin(subreddit, { isLoading: true, message: ''正在请求数据 }))  // 切换数据
         return http.post(`/login`, data)  // 请求数据， 登录接口
             .then(res => {
                 dispatch(receiveLogin(subreddit, res)) // 切换数据
             })
     }
 }
 export const loginMap = {
     mapStateToProps (state) {
         return state.getLogin  // 返回注入的数据
     },
     mapDispatchToProps (dispatch) {
         return {handleLogin: (data) => {
             return dispatch(fetchPosts('loginData', data)) // dispatch切换store
         }}
     }
 }
 
 
 
 export default connect(loginMap.mapStateToProps, loginMap.mapDispatchToProps)(Form.create()(Login));
 // export default connect(loginMap.mapStateToProps, loginMap.mapDispatchToProps)(Login);


```

- 添加文件 src/reducer/actionCreate.js

``` 
import { ACTION_LOGIN } from '@/reducer/action.js'
@params<string>: dataName 数据名称（key）
@data<Obect>: 数据值(value)
export const receiveLogin = ( dataName, data) => {
    return {
        type: ACTION_LOGIN,
        [dataName]: data
    }
}
```

- 修改文件 src/reducer/redux.js

```
const getLoginFun = (state = { }, action) => {
    switch (action.type) {
        case ACTION_LOGIN:
            return {...state, ...action}  // 注入的内容在action内，  默认内容为state, 用action覆盖state。
        default :
            return state
    }
}
```

- 添加 views/login/index.css

```
.login {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    height: 100%;
    background: #f3f3f3;
}
.login>.login-form {
    width: 320px;
    height: 340px;
    padding: 36px;
    -webkit-box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
    background: #fff;
}

#root{
    height: 100%;
}
.App{
    height: 100%;
}
```



2. 添加资源文件

- 添加 src/assets/css/biao.min.css
这里添加个样式， 因为是随便做的项目， 就引入了一个个人的臃肿的css。

- 修改App.css
引入css文件。
```
@import './assets/css/biao.min.css';
```

3. 修改登录验证
登录验证暂时使用sessionStorage进行判断。

- router/utils.js

修改 RouteWithSubRoutes 组件
```
export const RouteWithSubRoutes = route => (<Route
        path={route.path}
        exact={route.exact}
        render={props =>{
           var isAuthenticated  = sessionStorage.getItem('isAuthenticated')
            if ( route.path !== '/login' && !isAuthenticated ) {  // 当请求的路径不是登录页面并且未登录， 跳到登录页面。 注入来源（路径）
                return <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            }
            return (
                route &&( route.Redirect ? (<Redirect to={route.Redirect}></Redirect>) :
                (<route.component {...props} routes={route.routes} />))
            )
        }}
    />
);

```

- 修改views/login/index.js

添加 Redirect组件 ，

``` 
import React, { Component } from 'react';
import { Redirect } from "react-router-dom";  // +
import { Row, Col } from 'antd';
import './index.css'
import http from '@/api/http.js'
import {connect} from "react-redux";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { action_login } from '@/reducer/action.js'
import { loginRequest, receiveLogin } from '@/reducer/actionCreate.js'
const FormItem = Form.Item;

class Login extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.handleLogin(values)
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { from } = this.props.location.state || { from: { pathname: "/" } }; // 获取来源， 当已经登录， 跳转到这个来源页面。
        let { loginData }  = this.props; // 获取登录接口后返回的数据
        if (typeof loginData === 'object' && loginData.code === 200) { // 判断是否登录成功， 
            sessionStorage.setItem('isAuthenticated', true) // 设置登录凭证
        }
        let isAuthenticated  = sessionStorage.getItem('isAuthenticated') // 获取登录凭证
        // 判断是否登录， 如果已经登录， 则进行重定向到来源页面， 如果来源页面是登录页面， 则定向到首页。
        if (isAuthenticated) {
            from.pathname = from.pathname === '/login' ? '/' :  from.pathname
            return <Redirect to={from} />;
        }
        return (
            <div className="login">
                <div className="login-form">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '用户名为admin!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '密码为123456!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Row gutter={24}>
                                <Col span={12}>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住密码</Checkbox>
                            )}
                                </Col>
                                <Col span={12} className="tr">
                                <a className="login-form-forgot" href="">忘记密码</a>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row gutter={24}>
                                    <Col span={6}>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                            登录
                                        </Button>
                                    </Col>
                                <Col span={18} className="tr">
                                    <a href="">还没有账号？ 去注册</a>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

function fetchPosts(subreddit, data) {
    return dispatch => {
        dispatch(receiveLogin(subreddit, '暂无数据'))
        return http.post(`/login`, data)
            .then(res => {
                dispatch(receiveLogin(subreddit, res))
            })
    }
}
export const loginMap = {
    mapStateToProps (state) {
        return state.getLogin
    },
    mapDispatchToProps (dispatch) {
        return {handleLogin: (data) => {
            return dispatch(fetchPosts('loginData', data))
        }}
    }
}



export default connect(loginMap.mapStateToProps, loginMap.mapDispatchToProps)(Form.create()(Login));
// export default connect(loginMap.mapStateToProps, loginMap.mapDispatchToProps)(Login);

```

在浏览器输入账号密码， 然后登录， 登录成功后， 会自动跳转到首页， 快输入locaohost:3000去试一下吧。



