import React from 'react'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import EditableContext from '@/components/table/EditableContext'
import EditableFormRow from '@/components/table/EditableFormRow'
import EditableCell from '@/components/table/EditableCell'

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...this.props };
    }

    isEditing = (record, editingKey) => {
        return record.key === editingKey;
    };

    edit(key) {
        this.setState({ editingKey: key });
    }

    save(form, key) {
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

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        let state = {...this.state, ...this.props}
        let { data,  columns, rowClassName, handleAdd, editingKey} = state
        columns = columns.map((col) => {
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