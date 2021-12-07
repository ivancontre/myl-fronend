import { Col, Layout, Row } from 'antd';
import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

import '../css/auth.css';
import RegisterPage from '../pages/RegisterPage';

const { Content } = Layout;

export const AuthRouter: FC = () => {
    return (

        <Layout className="site-layout">
            <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                }}
            >
                <div style={{ padding: 24 }}>
                    <Row justify="space-around" align="middle">
                        <Col xs={ 24 } sm= { 12 } md={ 9 } lg={ 9 } xl={ 6 } >
                            <Switch>

                                <Route exact path="/auth/login" component={ LoginPage } />

                                <Route exact path="/auth/register" component={ RegisterPage } />

                                <Redirect to="/auth/login" />

                            </Switch>

                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
            
    )
};