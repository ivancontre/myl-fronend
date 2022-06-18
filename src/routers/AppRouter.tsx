import { Spin } from 'antd';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom';
import { RootState } from '../store';
import { startChecking } from '../store/auth/action';
import { startLoadEditionCard, startLoadEraCard, startLoadFrecuencyCard, startLoadRaceCard, startLoadTypeCard } from '../store/description/action';
import { AuthRouter } from './AuthRouter';
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';
import { SingedRouter } from './SingedRouter';

const AppRouter: FC = () => {

    const dispatch = useDispatch();

    const { checking, logged } = useSelector((state: RootState) => state.auth);    

    useEffect(() => {
        dispatch(startChecking());
    }, [dispatch])

    useEffect(() => {
        
        if (logged) {
            dispatch(startLoadTypeCard());
            dispatch(startLoadFrecuencyCard());
            dispatch(startLoadRaceCard());
            dispatch(startLoadEditionCard());
            dispatch(startLoadEraCard());
            //dispatch(startLoadCard());
        }
        
    }, [dispatch, logged]);

    if (checking) {
        return (
            <Spin size="large" />
        )
    }

    return (
        
        <Router>
            <div>
                <Switch>
                    <PublicRouter isAuthenticated={ logged } component={ AuthRouter } path="/auth" />

                    <PrivateRouter isAuthenticated={ logged } component={ SingedRouter } path="/" />

                    <Redirect to="/auth/login" />

                </Switch>
            </div>
        </Router>    
        
    )
}

export default AppRouter;