# 一步一步构件react后台系统6 之 用户列表

- 修改components/table/mix.js

```
        state.modelCancel: undefined
        setThis 中添加 tableMixNativ.state.modelCancel = b.modelCancel
        methods 中添加         modelCancel () {
                                this.setState({
                                    modelVisible: false,
                                    modelLoading: false
                                })
                            }
```

- views/user/index.js

```
                <AddModel {...state} addUserList={this.addUserList}></AddModel>
```

- views/user/add

```
 handleCancel = () => {
        this.setState({ visible: false });
        typeof this.props.modelCancel === 'function' && this.props.modelCancel()
    }
```

这就好了。
验证步骤
 点击add， 关闭弹窗， 点击删除， 不会再出现弹窗了。