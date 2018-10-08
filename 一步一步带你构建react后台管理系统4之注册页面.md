# 一步一步构件react后台系统4 之注册页面

## 添加注册页面

1. 添加页面

- views/register/index
这里依然采用ant里面的Form注册组件
其他新增的或修改的会打上标记， 没打标记的， 都是ant的form注册组件
```
import React from 'react'   // +
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import { validatorPhone } from '@/utils/index'  // +
import './index.css'  // +
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: []
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    }
    // 获取验证码， 传递给父组件
    getCaptcha = (e) => {  // +
        var num = Math.floor(Math.random()*10000)
        this.props.handleCaptcha(num)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));
        // +- 里面的组件都修改了。
        return (
            <div className="register">
                <div className="register-form">
                <Form onSubmit={this.handleSubmit} >
                    <FormItem
                        {...formItemLayout}
                        label="用户别名"
                    >
                        {getFieldDecorator('username', {
                            rules: [{
                                message: '请输入用户名称',
                            }, {
                                required: true, message: '用户名称必填',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入用户密码!',
                            }, {
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码"
                    >
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: '请验证密码',
                            }, {
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input type="password" onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                    >
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: '请输入正确的手机号码' },
                                {validator: validatorPhone.bind(this)()} //  + 添加了验证手机正则
                            ],
                        })(
                            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="验证码"
                        extra="点击获取验证码， 验证码将会自动填写"
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ required: true, message: '请输入正确的验证码' }],
                                })(
                                    <Input disabled/>  // +  只读
                                )}
                            </Col>
                            <Col span={12}>
                                <Button onClick={this.getCaptcha}>获取验证码</Button>   // +- 添加验证码事件
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span> 电子邮箱</span>
                        )}
                    >
                        {getFieldDecorator('email', {
                            rules: [{ required: false, message: '请输入电子邮箱', whitespace: true }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">注册</Button>
                    </FormItem>
                </Form>
                </div>
            </div>
        );
    }
}

// 当input发生改变时， 调用父传递过来的事件。
const onFieldsChange = (props, changeFields) => {
    props.onChange(changeFields)
}
// 接受到值， 并注入Form组件内
const mapPropsToFields = props => {
    let captcha = props.captcha
    captcha && captcha.value && captcha.errors && delete captcha.errors  // 当存在值的时候， 删除errors
    return {
        username: Form.createFormField({
            ...props.username,
        }),
        password: Form.createFormField({
            ...props.password
        }),
        confirm: Form.createFormField({
            ...props.confirm
        }),
        phone: Form.createFormField({
            ...props.phone
        }),
        captcha: Form.createFormField({
            ...props.captcha
        }),
        email: Form.createFormField({
            ...props.email
        })
    }
}
// value改变事件
const onValuesChange = (_, values) => {
}

const WrappedRegistrationForm = Form.create({onFieldsChange, mapPropsToFields, onValuesChange})(RegistrationForm);

// 传递参数给form组件
class Register extends React.Component {
    state = {
        fields: {
            username: {
                value: '我是useranme默认值'
            }
        }
    }
    // 当input的value发生改变， 就改变值，
    handleFormChange = (changedFields) => {
        this.setState(({fields}) => {
            return {
                fields: {...fields, ...changedFields}
            }
        })
    }
    // 点击获取验证码事件。
    handleCaptcha = (captchaValue) => {
        this.setState(({fields}) => {
            let captcha = { // 合并captcha对象， 修改value
                ...((typeof fields.captcha === 'object') ? fields.captcha : {}),
                value: captchaValue
            }
            return {
                fields: {...fields, captcha}
            }
        })
    }
    render () {
        let fields = this.state.fields
        return (
            <div>
                <WrappedRegistrationForm {...fields} onChange={this.handleFormChange} handleCaptcha={this.handleCaptcha}></WrappedRegistrationForm>
            </div>
        )
    }
}

export default Register
```

- views/register/index.css

```
.register {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    height: 100%;
    background: #f3f3f3;
}
.register>.register-form {
    width: 60%;
    height: auto;
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
- utils/index

```
export const validatorPhone = function () {
    return (rule, value, callback) => {
        const form = this.props.form;
        if (value && !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(form.getFieldValue('phone'))) ) {
            callback('请输入正确的手机号码');  <Link to="/register">还没有账号？ 去注册</Link>
        } else {
            callback();
        }
    }
}
```

- views/login/index.js

添加一个注册入口
```
  <Link to="/register">还没有账号？ 去注册</Link>
```

- router/index.js

别忘了， 添加到路由配置里面
注意:  这里添加了一个meta对象， 用来自定义一些参数。
@params: isAuth<boolean> 是否不需要验证（是否登录）
```
import React from 'react'
import Login from '@/views/login/index'
import Index from '@/views/index/index'
import Register from '@/views/register/index' // +
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
            {path: '/index/UI/button', name: '按钮', icon: 'video-camera', component: Button },
            {path: '/index/UI/Icon', name: '图标', icon: 'video-camera', component: Icon }
        ]
    },
    { path: '/index/animation', name: '动画', icon: 'video-camera', component: Animation },
    { path: '/index/form', name: '表格', icon: 'video-camera', component: From },
]
// isAuth 表示不用验证是否登录
export const main = [
    { path: '/login', exact: true, name: '登录', component: Login, meta: { // +-
            isAuth: true
        } },
    { path: '/register', exact: true, name: '注册', component: Register, meta: { // +
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
```

- router/utils.js

修改渲染组件，
当路径是 不需要验证是否登录的页面 的时候， 就不进行判断是否重定向到登录页面了。
```
// 渲染当前组件
export const RouteWithSubRoutes = route => (<Route
        path={route.path}
        exact={route.exact}
        render={props =>{
           var isAuthenticated  = sessionStorage.getItem('isAuthenticated')
            if ( !(typeof route.meta === 'object' && route.meta.isAuth) && !isAuthenticated ) {  // +-
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

就这样， 页面做好了。

[查看github代码](https://github.com/zgbbiao/react-study-admin)
切换Log 到
`添加注册页面， 修改路由配置， 修改路由渲染组件， 修改重定向登录规则`
即可看到当前代码。

2.  添加后台接口

注册页面做好了， 但是需要后台接口， 这里添加后台接口。
先打开后台项目。

修改package.json  添加打开项目快捷方式
```
"nodemon": "nodemon bin/www"  // +
```

然后运行项目

```
npm run nodemon
```

- 修改routes/index.js

// 添加接口
```
const utils = require ('../utils/index')
let { isEmpty }  = utils

router.post('/register', async (ctx, next) => {
    let body = ctx.request.body
    let username = body.username;
    let password = body.password;
    let captcha = body.captcha;
    let phone = body.phone;
    console.log(body)
    if (isEmpty(username)) {
        ctx.body = {
            code: 0,
            message: "用户名不能为空",
        }
    }
    else if (isEmpty(password)) {
        ctx.body = {
            code: 0,
            message: "密码不能为空",
        }
    }
    else if (isEmpty(captcha)) {
        ctx.body = {
            code: 0,
            message: "验证码不能为空",
        }
    }
    else if (isEmpty(phone)) {
        ctx.body = {
            code: 0,
            message: "手机号码不能为空",
        }
    } else {
        ctx.body = {
            code: 200,
            message: "注册成功",
        }
    }
})
```

- /utils/index.js

新增工具
```
const isEmpty = (text) => {
    if (text) {
        return false
    }
    return true
}
module.exports = {
    isEmpty
}
```

好了 后台接口做好了。

3. 添加接口请求

- views/register/index
这里把 connect 的参数都放到connect里面，  因为（每次都需要引用action ，太过繁琐，放到一个页面统一管理也很方便）
`this.props.hanleRegister(values)` 执行传递过来的接口事件
```
import {connect} from "react-redux";  // +
import { mapReigster } from '@/reducer/connect.js' // +
handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.hanleRegister(values)  // +
            }
        });
    }


const WrappedRegistrationForm = connect( mapReigster.mapStateToProps, mapReigster.mapDispatchToProps )(Form.create({onFieldsChange, mapPropsToFields, onValuesChange})(RegistrationForm));  // +-
```

- reducer/connect.js

这里把创建action创建函数都封装起来`import { receive } from '@/reducer/actionCreate.js' `
封装一个`fetchPosts`事件， 用来请求数据并切换数据。
添加 mapReigster
添加 mapLogin （这里顺便把登录里面的connect参数也提取出来了）
```
import { action_slidecollapsed, routerConfig, action_login } from '@/reducer/action.js'
import http from '@/api/http.js'  // +
import { receive } from '@/reducer/actionCreate.js' // +
import { ACTION_LOGIN, ACTION_REGISTER } from '@/reducer/action.js' // +

export const mapStateToProps = (state) => {
    console.log(state)
    return {slidecollapsed:  state.slidecollapsed,
        isSlide: false,
    }
}
export const mapDispatchToProps = (dispatch) => {
    return {onSlidecollapsed: () => dispatch(action_slidecollapsed), getRouterConfig: () => {
            return dispatch(routerConfig)
        }, toggleSlide: () => {
        dispatch({type: action_slidecollapsed.type})
    }}
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
@params: url<string> 接口路径
@params: actionType<string> action.type
@params: subreddit<string> 数据名称
@params: data<object> 数据

function fetchPosts(url, actionType, subreddit, data) { // +
    return dispatch => {
        dispatch(receive(actionType, subreddit, '暂无数据'))
        return http.post(url, data)
            .then(res => {
                dispatch(receive(actionType, subreddit, res))
            })
    }
}
// 注册
export const mapReigster = {
    mapStateToProps (state) {
        return state.getReigster || state
    },
    mapDispatchToProps (dispatch) {
        return {hanleRegister: (data) => {
                return dispatch(fetchPosts('/register', ACTION_REGISTER,'reigsterData', data))
            }}
    }
}
// 登录
export const mapLogin = {
    mapStateToProps (state) {
        return state.getLogin
    },
    mapDispatchToProps (dispatch) {
        return {handleLogin: (data) => {
                return dispatch(fetchPosts('/login', ACTION_LOGIN, 'loginData', data))
            }}
    }
}


```

- reducer/actionCreate.js

```
import { ACTION_LOGIN, ACTION_REGISTER } from '@/reducer/action.js'

export const receiveLogin = (dataName, data) => {
    return {
        type: ACTION_LOGIN,
        [dataName]: data
    }
}
// 封装个通用的 actionCreate
export const receive = ( typeName, dataName, data) => {
    return {
        type: typeName,
        [dataName]: data
    }
}
```

- reducer/action.js

添加action
```
export const SLIDECOLLAPSED = 'slidecollapsed'
export const ROUTERCONFIG = 'routerConfig'
export const ACTION_LOGIN = 'getLogin'
export const ACTION_REGISTER = 'ACTION_REGISTER'  // +
export const action_slidecollapsed = {type: SLIDECOLLAPSED}
export const routerConfig = { type: ROUTERCONFIG }
export const action_login = { type: ACTION_LOGIN }
export const action_register = { type: ACTION_REGISTER } // +
```

- api/http.js

修改http.js， 添加响应提示
```
import axios from 'axios'
import { message } from 'antd';
let loadingInstance = {
    close: () =>{}
}
// process.env.NODE_ENV === 'production' ? 'http://123.207.49.214:8028' : 'http://123.207.49.214:8028'
// 创建axios实例
const service = axios.create({
    baseURL: "http://localhost:4000", // api的base_url
    timeout: 5000, // 请求超时时间
    //设置默认请求头，使post请求发送的是formdata格式数据// axios的header默认的Content-Type好像是'application/json;charset=UTF-8',我的项目都是用json格式传输，如果需要更改的话，可以用这种方式修改
    // headers: {
    // "Content-Type": "application/x-www-form-urlencoded"
    // },
    // withCredentials: true, // 允许携带cookie
})
function cloneLoading () {
    loadingInstance.close()
}

// request拦截器
service.interceptors.request.use(config => {
    return config
}, error => {
    cloneLoading()
    // Do something with request error
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        cloneLoading()
        if (response.data && response.data.code === 0) {
            message.error(response.data.message, 1.5)
        } else if (response.data && response.data.code === 200) {
            message.success(response.data.message, 1.5)
        }
        return response.data
    }, error => {
        console.log('err' + error)// for debug
        cloneLoading()
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.desc = '请求错误'
                    break;
                case 401:
                    error.desc = '未授权，请登录'
                    break;
                case 403:
                    error.desc = '拒绝访问'
                    break;
                case 404:
                    error.desc = `请求地址出错: ${error.response.config.url}`
                    break;
                case 408:
                    error.desc = '请求超时'
                    break;
                case 500:
                    error.desc = '服务器内部错误'
                    break;
                case 501:
                    error.desc = '服务未实现'
                    break;
                case 502:
                    error.desc = '网关错误'
                    break;
                case 503:
                    error.desc = '服务不可用'
                    break;
                case 504:
                    error.desc = '网关超时'
                    break;
                case 505:
                    error.desc = 'HTTP版本不受支持'
                    break;
            }
            message.error(error.desc)
        }
        return Promise.reject(error)
    })

export default service


```

- views/login/index.js
既然提取了login的 connect参数，  这里就要修改 login页面
删除 fetchPosts， loginMap
```
import { mapLogin } from '@/reducer/connect.js'


export default connect(mapLogin.mapStateToProps, mapLogin.mapDispatchToProps)(Form.create()(Login)); // +
function fetchPosts(subreddit, data) { // -
    return dispatch => {
        dispatch(receiveLogin(subreddit, '暂无数据'))
        return http.post(`/login`, data)
            .then(res => {
                dispatch(receiveLogin(subreddit, res))
            })
    }
}
export const loginMap = { // -
    mapStateToProps (state) {
        return state.getLogin
    },
    mapDispatchToProps (dispatch) {
        return {handleLogin: (data) => {
            return dispatch(fetchPosts('loginData', data))
        }}
    }
}
```

- reducer/reduxs.js
新增 ACTION_REGISTER， getReigster与导出 新的allReducer
```
import {SLIDECOLLAPSED, ROUTERCONFIG, ACTION_LOGIN, ACTION_REGISTER} from '@/reducer/action.js'
const getReigster = (state = {}, action) => {
    switch (action.type) {
        case ACTION_REGISTER:
            return {...state, ...action}
        default :
            return state
    }
}

export const allReducer = combineReducers({
    slidecollapsed: slidecollapsedFuc, routerConfig: getRouterConfig, getLogin: getLoginFun, getReigster
})
```

 这样， 就修改完成了。

4. 验证接口是否成功

之前在http.js修改了提示， 不管请求成功或是失败， 都会有弹框出来提示。
当然， 也可以查看内容是否注入到组件内
在register组件内， 在render内打印出 this.pros出来，
还记得我们再 connect.js内添加的内容么？
```
    mapDispatchToProps (dispatch) {
        return {hanleRegister: (data) => {
                return dispatch(fetchPosts('/register', ACTION_REGISTER,'reigsterData', data))
            }}
    }
```
这里的`reigsterData`就是注入到组件内的内容。 查看是否有该内容， 如果有， 查看是否是请求后的返回值。
里面包含这个参数， 表示注册成功。
```
{
    regsterData: {
        code : 200
        message : "注册成功"
    }
}
```

5. 注册完毕后， 自动登录

- 修改 reducer/connect.js

添加 handleLogin 登录事件
```
export const mapReigster = {
    mapStateToProps (state) {
        return state.getReigster || state
    },
    mapDispatchToProps (dispatch) {
        return {hanleRegister: (data) => {
                return dispatch(fetchPosts('/register', ACTION_REGISTER,'reigsterData', data))
            },
            handleLogin: (data) => {
                return dispatch(fetchPosts('/login', ACTION_REGISTER, 'loginData', data))
            }
        }
    }
}
```
- views/register/index.js

```
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        formValue: [],  // 添加保存内容
        isLoginLoading: false // 添加是否已经请求
    };

        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    this.props.hanleRegister(values)
                    this.setState({  // 注册完毕， 保存内容，并修改状态。
                        formValue: values,
                        isLoginLoading: false
                    })
                }
            });
        }
        // render内
        let { reigsterData, loginData } = this.props  // 新增注入的数据
        // 注册成功， 自动登录
        if (typeof reigsterData === 'object' && reigsterData.code === 200) {
            if (!this.state.isLoginLoading) { // 判断是否已经请求过，
                this.props.handleLogin(this.state.formValue) // 请求登录。
                this.setState({
                    isLoginLoading: true
                })
            }
            if (typeof loginData === 'object' && loginData.code === 200) { // 登录成功， 跳转页面。
                sessionStorage.setItem('isAuthenticated', true)
                let from = {}
                from.pathname = '/';
                return <Redirect to={from} />;
            }
        }
```

 这样， 注册与注册完毕后自动登录就已经完成。

需要注意的是， 这里是自己写的一个后台，  登录账号与密码已经写死， admin   123456，  所以， 这里注册的时候， 虽然随便输入什么都能够注册成功， 但是登陆的时候， 只有admin  123456才能够登录成功。

