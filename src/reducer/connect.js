import { action_slidecollapsed, routerConfig, action_login } from '@/reducer/action.js'
import http from '@/api/http.js'
import { receive } from '@/reducer/actionCreate.js'
import { ACTION_LOGIN, ACTION_REGISTER } from '@/reducer/action.js'

export const mapStateToProps = (state) => {
    console.log(state)
    return {slidecollapsed:  state.slidecollapsed,
        isSlide: false,
    }
}
export const mapDispatchToProps = (dispatch) => {
    return {onSlidecollapsed: () => dispatch(action_slidecollapsed), getRouterConfig: () => {
            return dispatch(routerConfig)
        }, toggleSlide: () => {
        dispatch({type: action_slidecollapsed.type})
    }}
}

export const crumbsMap = {
    mapStateToProps (state) {
        return { routerConfig: state.routerConfig }
    },
    mapDispatchToProps (dispatch) {
        return {getRouterConfig: () => {
                return dispatch(routerConfig)
            }}
    }
}
function fetchPosts(url, actionType, subreddit, data) {
    return dispatch => {
        dispatch(receive(actionType, subreddit, '暂无数据'))
        return http.post(url, data)
            .then(res => {
                dispatch(receive(actionType, subreddit, res))
            })
    }
}
export const mapReigster = {
    mapStateToProps (state) {
        return state.getReigster || state
    },
    mapDispatchToProps (dispatch) {
        return {hanleRegister: (data) => {
                return dispatch(fetchPosts('/register', ACTION_REGISTER,'reigsterData', data))
            },
            handleLogin: (data) => {
                return dispatch(fetchPosts('/login', ACTION_REGISTER, 'loginData', data))
            }
        }
    }
}

export const mapLogin = {
    mapStateToProps (state) {
        return state.getLogin
    },
    mapDispatchToProps (dispatch) {
        return {handleLogin: (data) => {
                return dispatch(fetchPosts('/login', ACTION_LOGIN, 'loginData', data))
            }}
    }
}
