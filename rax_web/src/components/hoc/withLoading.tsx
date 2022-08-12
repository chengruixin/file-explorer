import { CircularProgress } from '@mui/material';
import React from 'react';

function withLoading(WrappedComponent: typeof React.Component) {
    return (props: any) => {
        const { isLoading } = props
        return isLoading ? (
            <CircularProgress { ...props } />
        ) : (
            <WrappedComponent { ...props } />
        );
    }
}

export default withLoading;
