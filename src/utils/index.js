export const filterData = (state, stateName) => (typeof state ==='object' ? state[stateName] : state)

export const deleObj = (obj, key) => {
    let obj2 = Object.assign({}, obj)
    delete obj2[key]
    return obj2
}

export const validatorPhone = function () {
    return (rule, value, callback) => {
        const form = this.props.form;
        if (value && !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(form.getFieldValue('phone'))) ) {
            callback('请输入正确的手机号码');
        } else {
            callback();
        }
    }
}