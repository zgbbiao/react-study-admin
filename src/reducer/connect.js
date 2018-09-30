import { action_slidecollapsed, routerConfig } from '@/reducer/action.js'

export const mapStateToProps = (state) => {
    return {slidecollapsed:  state.slidecollapsed}
}
export const mapDispatchToProps = (dispatch) => {
    return {onSlidecollapsed: () => dispatch(action_slidecollapsed)}
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