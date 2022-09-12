import React, { useEffect } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import PropTypes from 'prop-types';

type ProtectedRouteProps = RouteProps & {
    isAuthenticated: boolean;
};

export const PrivateRouter: React.FC<ProtectedRouteProps> = ({isAuthenticated, component, ...rest}: ProtectedRouteProps) => {

    
    localStorage.openpages = Date.now();

    const onLocalStorageEvent = (e: StorageEvent) => {

        if(e.key === 'openpages'){
            localStorage.page_available = Date.now();
        }

        if(e.key === 'page_available') {
            
            alert('Ya posees una pestaña abierta con la aplicación. Esta pestaña se cerrará...');
            const win = window.open("about:blank", "_self");
            win?.close();            
        }
    };

    useEffect(() => {
        window.addEventListener('storage', onLocalStorageEvent, false);

        return () => {
            window.removeEventListener("storage", onLocalStorageEvent);
        };

    }, []);

    // const onOrientationChange = async (e: any) => {
    //     console.log(window.screen.orientation)
    //     if (window.screen.orientation.angle === 0) {
    //         console.log('to landscape')
    //         await window.screen.orientation.lock('landscape');
    //     }
    // }


    // useEffect(() => {
    //     window.addEventListener('orientationchange', onOrientationChange, false);

    //     return () => {
    //         window.removeEventListener("orientationchange", onOrientationChange);
    //     };

    // }, []);

    const handleWindowSizeChange = () => {
        const width = window.innerWidth;

        if (width <= 768) {
            console.log('is mobile')
            window.screen.orientation.lock('landscape');
            return true
        }
        console.log('is browser')
        return false;
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange, false);

        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };

    }, []);


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