import React from 'react'
import { Icon, Popconfirm, Divider } from 'antd';
import EditableContext from '@/components/table/EditableContext'
import { editUserList } from '@/api/request.js'

let tableMixNativ = {
    state: {
        showEditTable: false,
        bordered: false,
        loading: false,
        pagination:  {},
        size: 'default',
        expandedRowRender: undefined,
        title: undefined,
        showHeader: true,
        footer: undefined,
        rowSelection: undefined,
        scroll: undefined,
        hasData: true,
        columns: [],
        data: [],
        handleAdd: false,
        editingKey: undefined,
        modelVisible: false
    },
    methods: {
        pagination () {
            return (
                { position: 'bottom',
                    onShowSizeChange: (current, pageSize) => {
                    },
                    onChange: (page, pageSize) => {
                    },
                    total: 0,
                    showSizeChanger: true,
                    pageSize: 10,
                    hideOnSinglePage: false,
                    showSizeChanger: true,
                    defaultCurrent: 1,
                    current: 1
                }
            )},
        columns () {
            let self = this;
            return ([{
                title: '用户名称',
                dataIndex: 'username',
                key: 'username',
                width: 150,
                editable: true,
                render: text => <a href="javascript:;">{text}</a>,
            }, {
                title: '手机号码',
                dataIndex: 'phone',
                key: 'phone',
                width: 150,
                editable: true,
            }, {
                title: '用户邮箱',
                dataIndex: 'email',
                key: 'email',
                editable: true,
            }, {
                title: '操作',
                key: 'action',
                dataIndex: 'action',
                width: 360,
                editable: false,
                render: function (text, record, index){
                    let _self = self
                    if (_self.isEditing(record)) {
                        return (
                            <span>
                  <EditableContext.Consumer>
                    {form => (
                        <a
                            href="javascript:;"
                            onClick={() => _self.save(form, record.key)}
                            style={{ marginRight: 8 }}
                        >
                            保存
                        </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                      title="是否取消?"
                      onConfirm={() => _self.cancel(record.key)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
                        )
                    }
                    return (
                        <span>
        <a href="javascript:;" ><Icon type="show" />查看详情</a>
        <Divider type="vertical" />
        <a href="javascript:;" onClick={_self.handleEdit(record)}><Icon type="edit" />编辑</a>
        <Divider type="vertical" />
        <a href="javascript:;">
        <Popconfirm title="确认删除?" cancelText="取消" okText="确认" onConfirm={() => _self.onDelete(record, index)}>
        <Icon type="delete" /> 删除
        </Popconfirm>
        </a>
        </span>
                    )},
            }])
        },
        handleEdit (record) {return () => {
            this.setState({ editingKey: record.key });
        }},
        save(form, key) {
            form.validateFields(async (error, row) => {
                if (error) {
                    return;
                }
                // let data = await editUserList(row)
                // if (data.code === 200) {
                //     this.handleUserList({
                //         page: this.state.pagination.current,
                //         pageSize: this.state.pagination.pageSize
                //     })
                // }
                //
                // const newData = [...this.state.data];
                // const index = newData.findIndex(item => key === item.key);

                // if (index > -1) {
                //     const item = newData[index];
                //     newData.splice(index, 1, {
                //         ...item,
                //         ...row,
                //     });
                //     this.setState({ data: newData, editingKey: '' });
                // } else {
                //     newData.push(row);
                //     this.setState({ data: newData, editingKey: '' });
                // }
                this.setState({ editingKey: '' });
            });
        },
        cancel () {
            this.setState({ editingKey: '' });
        },
        onDelete (record, index) {
            console.log(this)
            const data = [...this.state.data];
            data.splice(index, 1);
            this.setState({ deleteIndex: record.key});
            setTimeout(() => {
                this.setState({ data })
            }, 500);
        },
        isEditing (record) {
            return record.key === this.state.editingKey;
        },
        handleAdd () {
            let {data} = this.state
            let num = Math.floor(Math.random()*10000 - 1000)
            data.push({
                key: num,
                username: `add ${num}`,
                phone: 18817844785,
                email: "1031516418@qq.com"
            })
            this.setState((preState) => ({
                data: data
            }))
        },
        setThis (a, b) {
            var obj = a.methods
            for (var key in obj) {
                var value = obj[key]
                if (typeof value === 'function') {
                    if (!b[key]) {
                        b[key] = value.bind(b)
                    }
                }
            }
            tableMixNativ.state.pagination = b.pagination(b)
            tableMixNativ.state.columns = b.columns(b)
            tableMixNativ.state.handleAdd = b.handleAdd
            Object.setPrototypeOf(a, b)
        }
    }
}


export const tableMix =  {...tableMixNativ}