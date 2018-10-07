import React from 'react'
import { Table, Icon, Switch, Radio, Form, Divider, Button } from 'antd';
import EditableTable from '@/components/table/EditableTable.js'
const FormItem = Form.Item;



const expandedRowRender = record => <p>{record.description}</p>;
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const scroll = { y: 240 };
const pagination = { position: 'bottom' };

class TableComponent extends React.Component {
    constructor(props){
        super(props)
        let defaultState = {
            showEditTable: false,
            bordered: false,
            loading: false,
            pagination,
            size: 'default',
            expandedRowRender: undefined,
            title: undefined,
            showHeader,
            footer,
            rowSelection: undefined,
            scroll: undefined,
            hasData: true,
            deleteIndex: -1,
            editingKey: undefined
        }
        this.state = {...defaultState, ...this.props}
    }

    handleToggle = (prop) => {
        return (enable) => {
            this.setState({ [prop]: enable });
        };
    }

    handleSizeChange = (e) => {
        this.setState({ size: e.target.value });
    }

    handleExpandChange = (enable) => {
        this.setState({ expandedRowRender: enable ? expandedRowRender : undefined });
    }

    handleTitleChange = (enable) => {
        this.setState({ title: enable ? title : undefined });
    }

    handleHeaderChange = (enable) => {
        this.setState({ showHeader: enable ? showHeader : false });
    }

    handleFooterChange = (enable) => {
        this.setState({ footer: enable ? footer : undefined });
    }

    handleRowSelectionChange = (enable) => {
        this.setState({ rowSelection: enable ? {} : undefined });
    }

    handleScollChange = (enable) => {
        this.setState({ scroll: enable ? scroll : undefined });
    }

    handleDataChange = (hasData) => {
        this.setState({ hasData });
    }

    handlePaginationChange = (e) => {
        const { value } = e.target;
        this.setState({
            pagination: value === 'none' ? false : { position: value },
        });
    }
    handleAdd = () => {
        typeof this.props.handleAdd === 'function' && this.props.handleAdd()
        let { data } = this.props;
        this.setState({
            data: data
        });
    };

    render() {
        const state = {...this.state, ...this.props}
        let { data,  columns, showEditTable, deleteIndex, editingKey, handleAdd} = state
        return (
            <div>
                {showEditTable && <div className="components-table-demo-control-bar">
                    <Form layout="inline">
                        <FormItem label="Bordered">
                            <Switch checked={state.bordered} onChange={this.handleToggle('bordered')} />
                        </FormItem>
                        <FormItem label="loading">
                            <Switch checked={state.loading} onChange={this.handleToggle('loading')} />
                        </FormItem>
                        <FormItem label="Title">
                            <Switch checked={!!state.title} onChange={this.handleTitleChange} />
                        </FormItem>
                        <FormItem label="Column Header">
                            <Switch checked={!!state.showHeader} onChange={this.handleHeaderChange} />
                        </FormItem>
                        <FormItem label="Footer">
                            <Switch checked={!!state.footer} onChange={this.handleFooterChange} />
                        </FormItem>
                        <FormItem label="Expandable">
                            <Switch checked={!!state.expandedRowRender} onChange={this.handleExpandChange} />
                        </FormItem>
                        <FormItem label="Checkbox">
                            <Switch checked={!!state.rowSelection} onChange={this.handleRowSelectionChange} />
                        </FormItem>
                        <FormItem label="Fixed Header">
                            <Switch checked={!!state.scroll} onChange={this.handleScollChange} />
                        </FormItem>
                        <FormItem label="Has Data">
                            <Switch checked={!!state.hasData} onChange={this.handleDataChange} />
                        </FormItem>
                        <FormItem label="Size">
                            <Radio.Group size="default" value={state.size} onChange={this.handleSizeChange}>
                                <Radio.Button value="default">Default</Radio.Button>
                                <Radio.Button value="middle">Middle</Radio.Button>
                                <Radio.Button value="small">Small</Radio.Button>
                            </Radio.Group>
                        </FormItem>
                        <FormItem label="Pagination">
                            <Radio.Group
                                value={state.pagination ? state.pagination.position : 'none'}
                                onChange={this.handlePaginationChange}
                            >
                                <Radio.Button value="top">Top</Radio.Button>
                                <Radio.Button value="bottom">Bottom</Radio.Button>
                                <Radio.Button value="both">Both</Radio.Button>
                                <Radio.Button value="none">None</Radio.Button>
                            </Radio.Group>
                        </FormItem>
                    </Form>
                </div>}
                {typeof handleAdd === 'function' && <Button className="editable-add-btn mb-s" onClick={this.handleAdd}>Add</Button>}
                <EditableTable {...state} columns={columns} data={state.hasData ? data : null} rowClassName={(record, index) => {
                    if (deleteIndex === record.key) return 'animated zoomOutLeft min-black';
                    return 'animated fadeInRight';
                }}></EditableTable>
            </div>
        );
    }
}

export default TableComponent