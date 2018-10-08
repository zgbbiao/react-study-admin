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
