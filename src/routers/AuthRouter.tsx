import { Col, Layout, Row, Typography } from 'antd';
import React, { FC, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

import '../css/auth.css';
import RegisterPage from '../pages/RegisterPage';
import RecoveryPasswordPage from '../pages/RecoveryPasswordPage';
import VerifyAccountPage from '../pages/VerifyAccountPage';

const { Content } = Layout;
const { Title } = Typography;

export const AuthRouter: FC = () => {

    useEffect(() => {
        document.body.classList.remove("body-signed");
        document.body.classList.add('body-auth');
    }, [])


    return (

        <Layout className="site-layout">
            <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                }}
            >
                <div style={{ padding: 24 }}>
                    <Row justify="center" align="middle">
                        <Col xs={ 24 } sm= { 12 } md={ 9 } lg={ 9 } xl={ 6 } style={{textAlign: 'center'}} >
                            <Title level={ 1 }>MyLApp</Title>
                        </Col>
                    </Row>
                    <Row justify="center" align="middle">
                        <Col xs={ 24 } sm= { 12 } md={ 9 } lg={ 9 } xl={ 6 } className="auth-content">
                            <Switch>

                                <Route exact path="/auth/verify/:token" component={ VerifyAccountPage } />

                                <Route exact path="/auth/login" component={ LoginPage } />

                                <Route exact path="/auth/register" component={ RegisterPage } />

                                <Route exact path="/auth/recovery-password" component={ RecoveryPasswordPage } />

                                <Redirect to="/auth/login" />

                            </Switch>

                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
            
    )
};