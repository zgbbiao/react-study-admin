import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import { connect  } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '@/reducer/connect'
import { filterData } from '@/utils/index.js'
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
        let { slidecollapsed, toggleSlide, isSlide } = this.props
        slidecollapsed = filterData(slidecollapsed, 'slidecollapsed')
        console.log(this.props)
        return (
            <div>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={ slidecollapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                </Header>
                <span onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); toggleSlide() }}>toggleSlide</span>
            </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyHeader);