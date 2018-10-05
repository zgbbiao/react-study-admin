import { ACTION_LOGIN, ACTION_REGISTER } from '@/reducer/action.js'

export const receiveLogin = (dataName, data) => {
    return {
        type: ACTION_LOGIN,
        [dataName]: data
    }
}

export const receive = ( typeName, dataName, data) => {
    return {
        type: typeName,
        [dataName]: data
    }
}