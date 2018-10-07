# 一步一步构件react后台系统6 之 用户列表


## 给后台新增几个接口

- routes/users.js

*获取分页数据*


第一次调用接口的时候， 先新增数据， 之后每次从这里面拿出数据。
一般列表接口  都有以下几个变量
这里根据 页码和每页条数拿到请求的数据并返回回去。
total 总条数
page  页码
pageSize  每页条数
data: []  数据列表

```

router.get('/userslist', function (ctx, next) {
    // 从上下文中直接获取
    let ctx_query = ctx.query;
    let ctx_querystring = ctx.querystring;
    let page = ctx_query.page
    let data = global.Gdata
    let num = ctx_query.pageSize || 10
    let total = data.length - 1;
    if (data.length === 0) {
        for (let i = 0; i <= 100; i++) {
            data.push({
                key: i,
                username: `John${i}`,
                phone: `1881678249${i}`,
                email: `1031516418${i}@qq.com`,
                description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
            });
        }
        total = data.length-1;
    }
    let res_data = []
    let index = page*num/1 - num+1
    res_data = data.slice(index, Math.floor(index) + Math.floor(num))
    console.log(index, index+num);
    console.log(res_data.length)
    if (page <= 0) {
        ctx.body = {
            code: 0,
            data: {
                total: total,
                data: res_data,
                page: ctx_query.page,
                pageSize: num
            },
            message: 'page必须大于等于1'
        }
        return false;
    }
    if (page > Math.ceil(total/num)) {
        ctx.body = {
            code: 0,
            data: {
                total: total,
                data: res_data,
                page: ctx_query.page,
                pageSize: num
            },
            message: 'page必须小于最大页值'
        }
        return false;
    }
    ctx.body = {
        code: 200,
        data: {
            total: total,
            data: res_data,
            page: ctx_query.page,
            pageSize: num
        }
    }
})

```

修改用户列表
```

router.put('/userslist', function (ctx, next) {
    let body = ctx.request.body
    let username = body.username;
    let email = body.email;
    let phone = body.phone;
    let data = global.Gdata
    for (var key in data) {
        var value = data[key]
        if (value.username === username) {
            data[key] = {...data[key], ...body}
            ctx.body = {
                code: 200,
                message: "修改成功"
            }
            global.Gdata = data
            return false
        }
    }
    ctx.body = {
        code: 0,
        message: "修改失败"
    }
})

```


删除用户数据
```
router.delete('/userslist', function (ctx, next) {
    let body = ctx.request.body
    let username = body.username;
    let email = body.email;
    let phone = body.phone;
    let data = global.Gdata
    for (var key in data) {
        var value = data[key]
        if (value.username === username) {
            data.splice(key, 1)
            ctx.body = {
                code: 200,
                message: "删除成功"
            }
            global.Gdata = data
            return false
        }
    }
    ctx.body = {
        code: 0,
        message: "删除失败"
    }
})
```

新增用户
```
router.post('/userslist', function (ctx, next) {
    let body = ctx.request.body
    let username = body.username;
    let email = body.email;
    let phone = body.phone;
    console.log(body)
    global.Gdata.push(body)
    ctx.body = {
        code: 200,
        message: "添加成功"
    }
})
```

- app.js

新增全局变量

```
global.Gdata = [];
```

## 新增react用户列表页面。

- conponents/table/table.js
这里将用户列表单独提出来了。 如果有哪里不合理的， 以后可以在修改， 当然提出来的好处就是， 一个页面不会有太多内容， 显得臃肿难看

这里拿的同样是ant里面的table表格组件里面的内容， 这里选择的是可以手动开关某些功能的那个表格组件。
```
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
        let defaultState = {  // 定义默认值， 这里都是某些开关属性，是要注入到table组件内部的属性。
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
        this.state = {...defaultState, ...this.props}  // 因为当前页面同样是组件， 因此父组件可能会传递参数过来， 这里使用父组件传递的参数覆盖当前默认参数。
    }

    handleToggle = (prop) => {  // 都是table组件以及写好的方法
        return (enable) => {
            this.setState({ [prop]: enable });
        };
    }

    handleSizeChange = (e) => { // 都是table组件以及写好的方法
        this.setState({ size: e.target.value });
    }

    handleExpandChange = (enable) => { // 都是table组件以及写好的方法
        this.setState({ expandedRowRender: enable ? expandedRowRender : undefined });
    }

    handleTitleChange = (enable) => { // 都是table组件以及写好的方法
        this.setState({ title: enable ? title : undefined });
    }

    handleHeaderChange = (enable) => { // 都是table组件以及写好的方法
        this.setState({ showHeader: enable ? showHeader : false });
    }

    handleFooterChange = (enable) => { // 都是table组件以及写好的方法
        this.setState({ footer: enable ? footer : undefined });
    }

    handleRowSelectionChange = (enable) => { // 都是table组件以及写好的方法
        this.setState({ rowSelection: enable ? {} : undefined });
    }

    handleScollChange = (enable) => { // 都是table组件以及写好的方法
        this.setState({ scroll: enable ? scroll : undefined });
    }

    handleDataChange = (hasData) => { // 都是table组件以及写好的方法
        this.setState({ hasData });
    }

    handlePaginationChange = (e) => { // 都是table组件以及写好的方法
        const { value } = e.target;
        this.setState({
            pagination: value === 'none' ? false : { position: value },
        });
    }
    handleAdd = () => {  // 自定义方法，  新增数据方法。
        typeof this.props.handleAdd === 'function' && this.props.handleAdd()
        let { data } = this.props;
        this.setState({
            data: data
        });
    };

    render() {
        const state = {...this.state, ...this.props} // 合并state 与 props方法， 这样可以监听props变化
        let { data,  columns, showEditTable, deleteIndex, editingKey, handleAdd} = state
        return (
            <div>
                {showEditTable && <div className="components-table-demo-control-bar">  // 判断是否暂时手动开关table功能。
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
                {typeof handleAdd === 'function' && <Button className="editable-add-btn mb-s" onClick={this.handleAdd}>Add</Button>} // 新增数据按钮
                <EditableTable {...state} columns={columns} data={state.hasData ? data : null} rowClassName={(record, index) => {  // 列表组件 将state数据全部传入子组件， 设置动画， 注入数据等操作。
                    if (deleteIndex === record.key) return 'animated zoomOutLeft min-black';
                    return 'animated fadeInRight';
                }}></EditableTable>
            </div>
        );
    }
}

export default TableComponent
```

- components/table/EditableTable

表格组件，
这个组件使用的是table中可编辑组件
```
import React from 'react'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import EditableContext from '@/components/table/EditableContext'
import EditableFormRow from '@/components/table/EditableFormRow'
import EditableCell from '@/components/table/EditableCell'

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...this.props };  // 接收到父组件传递过来的数据， 并给state继承
    }

    isEditing = (record, editingKey) => {   // table可编辑组件中自带方法
        return record.key === editingKey;
    };

    edit(key) { // table可编辑组件中自带方法
        this.setState({ editingKey: key });
    }

    save(form, key) {  // table可编辑组件中自带方法
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ data: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
    }

    cancel = () => { // table可编辑组件中自带方法
        this.setState({ editingKey: '' });
    };

    render() {
        const components = {  // table可编辑组件中自带
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        let state = {...this.state, ...this.props}  // 合并数据
        let { data,  columns, rowClassName, handleAdd, editingKey} = state
        columns = columns.map((col) => {  // 根据表格头内的数据， 判断当前列是否可编辑。
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record =>{
                    return ({
                    record,
                    inputType: col.dataIndex === 'phone' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record, editingKey),
                })},
            };
        });
        // 将父组件注入的数据全部注入到table 这样就可以通过父组件来控制当前组件的子组件功能的开关了。
        return (
            <Table
                {...state}
                components={components}
                dataSource={data}
                rowClassName={rowClassName}
                columns={columns}
            />
        );
    }
}

export default EditableTable
```

- components/table/EditableFormRow

ant可编辑组件中自带的， 经过拆分放在这个文件夹内
```
import React from 'react'
import EditableContext from '@/components/table/EditableContext'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
export default EditableFormRow
```
- components/table/EditableCell


ant可编辑组件中自带的， 经过拆分放在这个文件夹内
```
import React from 'react'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import EditableContext from '@/components/table/EditableContext'

const FormItem = Form.Item;

class EditableCell extends React.Component {
    getInput = () => {  // 自带方法   判断数据类型， 返回输入组件
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    render() {
        let {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {  // 注意，  dataIndex 必须存在， 刻在cloums表格头数据内设置。
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

export default EditableCell
```

- components/table/editableContext
ant可编辑组件自带， 经过拆分放到该文件夹。
```
import React from 'react'
const EditableContext = React.createContext();
export default EditableContext
```

- components/table/mix

这个文件在table组建中， 是非常重要的一个文件， 里面放着一些数据， 主要用来操作表格。

*记住以下几点*
```
- methods内的方法， 全部注入到react组件的this内。
- state内的方法， 全部注入到react组件的this.state内。
- 里面的方法， 可在react组件重写， 以达到需要的功能
```

```
import React from 'react'
import { Icon, Popconfirm, Divider } from 'antd';
import EditableContext from '@/components/table/EditableContext'
import { editUserList } from '@/api/request.js'

let tableMixNativ = {
    state: {  // 将表格默认属性提取出来，
        showEditTable: false,  // 自定义属性， 是否显示可编辑表格功能。
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
        editingKey: undefined,  // 当前正在编辑的表格行的key,
        modelVisible: false  //  新增数据弹出框是否显示
    },
    methods: {
        pagination () {  // 获取分页数据。 里面返回分页的一些数据
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
        columns () { // 获取表格头数据，
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
                    if (_self.isEditing(record)) {  // 根据是否正在编辑中的行，  显示对应的组件
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
        handleEdit (record) {return () => {  // 设置编辑中的行，存储取来。
            this.setState({ editingKey: record.key });
        }},
        save(form, key) {  // 编辑完后，保存数据
            form.validateFields(async (error, row) => {
                if (error) {
                    return;
                }
                this.setState({ editingKey: '' });
            });
        },
        cancel () {  // 取消编辑
            this.setState({ editingKey: '' });
        },
        onDelete (record, index) {  // 删除数据
            console.log(this)
            const data = [...this.state.data];
            data.splice(index, 1);
            this.setState({ deleteIndex: record.key});
            setTimeout(() => {
                this.setState({ data })
            }, 500);
        },
        isEditing (record) { // 是否正在编辑中
            return record.key === this.state.editingKey;
        },
        handleAdd () { // 添加数据
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
        setThis (a, b) { // 设置当前对象的this
            var obj = a.methods
            for (var key in obj) {
                var value = obj[key]
                if (typeof value === 'function') {
                    if (!b[key]) {  // 当React组件没有这个方法， 则继承
                        b[key] = value.bind(b)
                    }
                }
            }
            tableMixNativ.state.pagination = b.pagination(b)  // 提取数据注入到当前对象的state内。
            tableMixNativ.state.columns = b.columns(b)    // 提取数据注入到当前对象的state内。
            tableMixNativ.state.handleAdd = b.handleAdd     // 修改state， 继承自react组件
            Object.setPrototypeOf(a, b)
        }
    }
}


export const tableMix =  {...tableMixNativ}
```

- views/users/index.js

这里就是调用各个组件， 并传递组件的数据。
这里需要重写继承的属性和方法， 以达到自己想要的功能。
通过modelVisible， modelLoading 控制添加组件的请求状态和显示状态
```
import React from 'react'
import TableComponent from '@/components/table/table.js'
import { Icon, Popconfirm, Divider } from 'antd';
import { getUserList, editUserList, deleteUserList, addUsersList } from '@/api/request.js'  // 请求数据的方法
import { tableMix } from "@/components/table/mix";
import AddModel from '@/views/users/add'

class Users extends React.Component {
    constructor (props) {
        super(props)
        tableMix.methods.setThis(tableMix, this) // 修改 tableMix 的数据。
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
        // 修改state.handleAdd属性方法。
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
    // 调用新增数据接口。 修改model状态
    addUserList = async (data) => {
        let res = await addUsersList(data)
        this.setState({
            modelLoading: false,
            modelVisible: false
        })
        if (res.code === 200) {
            this.onGetUserList()
        }
    }
    // 封装提取数据接口的方法。
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
    // 重写修改保存方法
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
    // 重写删除方法
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
                <AddModel modelVisible={modelVisible} modelLoading={modelLoading} addUserList={this.addUserList}></AddModel>  // 显示新增数据组件
                <TableComponent {...state}></TableComponent>  // table组件
            </div>
        )
    }
}
export default Users
```

- views/users/add.js

这里是新增数据组件

请注意下马几个react声明周期

```
    // componentWillReceiveProps  props 更新时调用
    //  是否重新渲染， 当state 与 props改变时调用
    // shouldComponentUpdate(nextProps, nextState)

    // 组件更新时调用
    // componentWillUpdata(nextProps, nextState)
    // 组件更新完毕后调用
    // componentDidUpdate()
    // 组件卸载时调用
    // componentWillUnmount()
    // 组件渲染之后调用，只调用一次。
    // componentDidMount
```

```
import React from 'react'
import { Modal, Button, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, AutoComplete } from 'antd';
import { validatorPhone } from '@/utils/index'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;


class MyForm extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: this.props.loading
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.addUserList(values)  // 通过验证后， 调用父组件传递的调用数据接口。
                this.setState({  // 修改组件状态
                    loading: true
                })
            }
        });
    }
    // 当props更新， 修改props属性。
    componentWillReceiveProps (nextProps) {
        this.setState({
            loading: nextProps.loading
        })
        if (!nextProps.visible) {  // 当组件隐藏， 重置表单
            this.props.form.resetFields()
        }
    }
    render () {
        const { getFieldDecorator } = this.props.form;
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
        let {loading} = this.state
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="用户名称"
                >
                    {getFieldDecorator('username', {
                        rules: [{
                             message: '请输入用户名称',
                        }, {
                            required: true, message: '请输入用户名称',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="用户邮箱"
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '请输入用户邮箱',
                        }, {
                            required: true, message: '请输入用户邮箱',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机号码"
                >
                    {getFieldDecorator('phone', {
                        rules: [{
                            validator: validatorPhone.bind(this)()
                        }, {
                            required: true, message: '请输入手机号码',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
                </FormItem>
            </Form>
        )
    }
}
const ModelForm = Form.create()(MyForm)  // form表单与model分开。


class AddModel extends React.Component {
    state = {
        loading: this.props.modelVisible,
        visible: this.props.modelVisible,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {  // 当提交的时候， 显示loading
        this.setState({ loading: true });
        // setTimeout(() => {
        //     this.setState({ loading: false, visible: false });
        // }, 3000);
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }
    // props 更新时调用, 这样实时监听父组件传递过来的属性， 然后传递给子组件。
    componentWillReceiveProps (nextProps) {
        this.setState({
            visible: nextProps.modelVisible,
            loading: nextProps.modelLoading
        })
    }
    render() {
        const { visible, loading } = this.state;
        let { addUserList } = this.props
        console.log(loading)
        return (
            <div>
                <Modal
                    visible={visible}
                    title="Title"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}  // 设置为null 不显示footer
                >
                    <ModelForm loading={loading} visible={visible} addUserList={addUserList} ></ModelForm>
                </Modal>
            </div>
        );
    }
}
export default AddModel
```

## 添加数据请求方法

像之前把请求直接写在页面中， 是一个不太好的行为，
如果我们把接口地址全部提取出来， 放到一个文件夹内， 这样方便修改与后面的维护

- api/api.js
```
export const usersList = '/users/userslist';
export const usersListPut = '/users/userslist';
export const usersListDelete = '/users/userslist';
export const usersListPost = '/users/userslist';

```

- api/request.js

把请求的方法全部放入到这个文件内。
好处
```
- 不用每个页面都引入 http.js   api.js文件了
- 方便统一管理
- 里面的功能单一， 几乎不用怎么修改， 哪怕是修改提交数据， 也是在页面中修改。
- 后期借口多了，  会发现很多重复的， 可以再次提取封装。 （当前接口请求少， 不用理会， 可后期封装）
```

```
import instance from './http.js'
import { usersList, usersListPut, usersListDelete, usersListPost } from "./api";

export const getUserList = (params) => {
    return instance.get(usersList, {
        params: params
    })
}
export const editUserList = (data) => {
    return instance.put(usersListPut, data)
}
export const deleteUserList = (data) => {
    return instance.delete(usersListDelete, {
        data
    })
}

export const addUsersList = (data) => {
    return instance.post(usersListPost, data)
}

```

## 引入资源文件。

这个表格使用了动画，因此引入文件
- app.css

```
@import './assets/css/animate.css';
```

## 修改路由配置

```
import React from 'react'
import Login from '@/views/login/index'
import Index from '@/views/index/index'
import User from '@/views/users/index.js'  // 引入文件


export const menus = [    // 菜单相关路由
    { path: '/index/UI', name: 'UI', icon:'video-camera', component: Ui , routes: [
            {path: '/index/UI/users', name: '用户列表', icon: 'video-camera', component: User },  // 其他不动， 把这个路由修改成用户列表即可
            {path: '/index/UI/Icon', name: '图标', icon: 'video-camera', component: Icon }
        ]
    },
    { path: '/index/animation', name: '动画', icon: 'video-camera', component: Animation },
    { path: '/index/form', name: '表格', icon: 'video-camera', component: From },
]
```

## 完成

这里， 我们的table封装就弄好了， 虽然看起来文件很多， 但是用起来却很方便， 各种功能不用再次写一遍， 只需要重写需要修改的方法便可以达到再次利用。  后期主要修改clomus与data数据， 里面的各种功能都可通过开关控制。 是不是很方便？

## 验证是否table组件是否可重用

- views/users/index2.js
复制index.js内容到index2内
添加this.cloums方法, 这个方法是从Mix拷贝过来的，  添加             {
                                                     title: '用户描述',
                                                     dataIndex: 'description',
                                                     key: 'description',
                                                     editable: true,
                                                 },  表格头

我们后台生成数据的时候， 是带有description属性的。  我们这不做多修改， 添加这个数据九号。


```
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
```

继承的时候， 重写数据。
```
       this.state = {
            ...tableMix.state, columns: this.columns()
        }
```

- route/index.js

把 index 换成index2 ，  无缝对接。
```
import User from '@/views/users/index2.js'
```

而添加功能， 需要自己添加多一个Input， 其他可不变。 这里就不进行演示了。
