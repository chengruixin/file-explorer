import { CircularProgress } from '@material-ui/core'

function withLoading(WrappedComponent) {
    return (props) => {
        const { isLoading } = props
        return isLoading ? (
            <CircularProgress {...props} />
        ) : (
            <WrappedComponent {...props} />
        )
    }
}

export default withLoading;
