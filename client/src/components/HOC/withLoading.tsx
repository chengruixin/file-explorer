import { CircularProgress } from '@material-ui/core'

function withLoading(WrappedComponent: any) {
    return (props: any) => {
        const { isLoading } = props
        return isLoading ? (
            <CircularProgress {...props} />
        ) : (
            <WrappedComponent {...props} />
        )
    }
}

export default withLoading;
