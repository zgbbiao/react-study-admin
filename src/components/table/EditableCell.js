import React from 'react'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import EditableContext from '@/components/table/EditableContext'

const FormItem = Form.Item;

class EditableCell extends React.Component {
    getInput = () => {
        console.log(this.props)
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
        // {getFieldDecorator(dataIndex, {
        //     rules: [{
        //         required: true,
        //         message: `Please Input ${title}!`,
        //     }],
        //     initialValue: record[dataIndex],
        // })(this.getInput())}
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
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