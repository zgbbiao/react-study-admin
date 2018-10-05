import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
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
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        let { loginData }  = this.props;
        if (typeof loginData === 'object' && loginData.code === 200) {
            sessionStorage.setItem('isAuthenticated', true)
        }
        let isAuthenticated  = sessionStorage.getItem('isAuthenticated')
        // 判断是否登录，
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
                                    <Link to="/register">还没有账号？ 去注册</Link>
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
