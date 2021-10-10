import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

export const AuthRouter: FC = () => {
    return (
            <Switch>

                <Route exact path="/auth/login" component={ Login } />

                <Route exact path="/auth/register" component={ Register } />

                <Redirect to="/auth/login" />

            </Switch>
    )
};