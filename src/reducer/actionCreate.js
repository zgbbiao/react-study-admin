import { ACTION_LOGIN } from '@/reducer/action.js'

export const receiveLogin = ( dataName, data) => {
    return {
        type: ACTION_LOGIN,
        [dataName]: data
    }
}