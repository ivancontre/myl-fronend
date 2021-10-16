import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    HashRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom';
import { RootState } from '../store';
import { startChecking } from '../store/auth/action';
//import Match from '../pages/Match';
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

    if (checking) {
        return (<h1>Espere...</h1>)
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