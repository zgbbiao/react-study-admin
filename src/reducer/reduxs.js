import { combineReducers } from 'redux';
import { routerConfig as myRouterConfig } from '@/router/index'
import {SLIDECOLLAPSED, ROUTERCONFIG} from '@/reducer/action.js'
const slidecollapsedFuc = (state = { slidecollapsed: false }, action) => {
    switch (action.type) {
        case SLIDECOLLAPSED:
            return Object.assign({}, state, {
                slidecollapsed: !state.slidecollapsed
            })
        default:
            return state
    }
}

const getRouterConfig = (state = { routerConfig: [] }, action) => {
    switch (action.type) {
        case ROUTERCONFIG:
            return  Object.assign({}, state, {
                routerConfig: myRouterConfig
            })
        default:
            return state
    }
}

export const allReducer = combineReducers({
    slidecollapsed: slidecollapsedFuc, routerConfig: getRouterConfig
})