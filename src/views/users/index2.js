import React from 'react'
import TableComponent from '@/components/table/table.js'
import { Icon, Popconfirm, Divider } from 'antd';
import { getUserList, editUserList, deleteUserList, addUsersList } from '@/api/request.js'
import { tableMix } from "@/components/table/mix";
import AddModel from '@/views/users/add'
import EditableContext from '@/components/table/EditableContext'

class Users extends React.Component {
    constructor (props) {
        super(props)
        tableMix.methods.setThis(tableMix, this)
        this.state = {
            ...tableMix.state, columns: this.columns()
        }
    }
    componentDidMount () {
        // 重写分页方法。
        let { pagination } = this.state
        pagination.onShowSizeChange = (current, pageSize) => {
            console.log(current, pageSize);
            pagination.current = current
            pagination.pageSize = pageSize
            this.handleUserList({
                page: pagination.current,
                pageSize: pagination.pageSize
            })
            this.setState({
                pagination: pagination
            })
        }
        pagination.onChange = (page, pageSize) => {
            pagination.current = page
            pagination.pageSize = pageSize
            this.onGetUserList()
            this.setState({
                pagination: pagination
            })
        }
        this.state.handleAdd = this.handleAdd
        this.setState({
            pagination: pagination
        })
        this.onGetUserList()
    }
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
        },
            {
                title: '用户描述',
                dataIndex: 'description',
                key: 'description',
                editable: true,
            },
            {
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
    }
    handleAdd  = async () => {
        this.setState({
            modelVisible: true
        })
    }
    addUserList = async (data) => {
        // let data = {}
        // let num = Math.floor(Math.random()*10000 - 1000)
        // data = {
        //     key: num,
        //     username: `add ${num}`,
        //     phone: 18817844785,
        //     email: "1031516418@qq.com"
        // }
        let res = await addUsersList(data)
        this.setState({
            modelLoading: false,
            modelVisible: false
        })
        if (res.code === 200) {
            this.onGetUserList()
        }
    }
    handleUserList = async (obj = {page: 1}) => {
        this.setState((prevState ) => ({
            loading: true
        }))
        let data = await getUserList({
            ...obj
        })
        let { pagination } = this.state
        pagination.pageSize = obj.pageSize ? obj.pageSize : pagination.pageSize
        pagination.total = data.data.total || 0
        this.setState((prevState ) => ({
            data: data.data ? data.data.data : [],
            loading: false,
            pagination: pagination
        }))
    }

    onGetUserList () {
        this.handleUserList({
            page: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize
        })
    }
    save(form, key) {
        form.validateFields(async (error, row) => {
            if (error) {
                return;
            }
            let data = await editUserList(row)
            if (data.code === 200) {
                this.onGetUserList()
            }
            this.setState({ editingKey: '' });
        });
    }
    async onDelete (record, index) {
        let data = await deleteUserList(record)
        if (data.code === 200) {
            this.setState({ deleteIndex: record.key});
            this.onGetUserList()
        }
    }
    render () {
        let state = this.state
        let { modelVisible, modelLoading } = state
        return (
            <div>
                <AddModel modelVisible={modelVisible} modelLoading={modelLoading} addUserList={this.addUserList}></AddModel>
                <TableComponent {...state}></TableComponent>
            </div>
        )
    }
}
export default Users