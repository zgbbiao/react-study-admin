import { action_slidecollapsed, routerConfig, action_login } from '@/reducer/action.js'

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

