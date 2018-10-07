import React from 'react'
import TableComponent from '@/components/table/table.js'
import { Icon, Popconfirm, Divider } from 'antd';
import { getUserList, editUserList, deleteUserList, addUsersList } from '@/api/request.js'
import { tableMix } from "@/components/table/mix";
import AddModel from '@/views/users/add'

class Users extends React.Component {
    constructor (props) {
        super(props)
        tableMix.methods.setThis(tableMix, this)
        this.state = {
            ...tableMix.state
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