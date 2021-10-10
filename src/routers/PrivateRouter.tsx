import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import PropTypes from 'prop-types';

type ProtectedRouteProps = RouteProps & {
    isAuthenticated: boolean;
};

export const PrivateRouter: React.FC<ProtectedRouteProps> = ({isAuthenticated, component, ...rest}: ProtectedRouteProps) => {

    const Component: React.ComponentType<any> = component as React.ComponentType<any>;

    return (
        <Route 
            { ...rest }

            component={ (props: RouteProps) => (

                (isAuthenticated) 
                ? (<Component { ...props } />)

                : (<Redirect to="/auth/login" />)

            )}
        
        />
    )
};

PrivateRouter.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
};