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