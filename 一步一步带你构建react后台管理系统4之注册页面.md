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

2.

