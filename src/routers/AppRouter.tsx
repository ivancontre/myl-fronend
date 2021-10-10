import React, { FC } from 'react';
import {
    HashRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom';
import Match from '../pages/Match';
import { AuthRouter } from './AuthRouter';
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';
import { SingedRouter } from './SingedRouter';

const AppRouter: FC = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <PublicRouter isAuthenticated={ false } component={ AuthRouter } path="/auth" />

                    <PrivateRouter isAuthenticated={ true } component={ SingedRouter } path="/" />

                    <Redirect to="/auth/login" />

                </Switch>
            </div>
        </Router>
    )
}

export default AppRouter;