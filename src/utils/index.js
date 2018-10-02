export const filterData = (state, stateName) => (typeof state ==='object' ? state[stateName] : state)

export const deleObj = (obj, key) => {
    let obj2 = Object.assign({}, obj)
    delete obj2[key]
    return obj2
}