import React, { FC, useState } from 'react';
import { Form, Input, Button,  Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { startLogin } from '../store/auth/action';
const { Title } = Typography;


const LoginPage: FC = () => {

    const dispatch = useDispatch();
    const [loading, setloading] = useState(false);

    const onFinish = async (values: any) => {
        setloading(true);
        const { email, password } = values;
        await dispatch(startLogin(email, password));
        setloading(false);
    };

    return (
        <>
            <Title level={ 1 }>Iniciar Sesión</Title>

            <Form
                name="normal_login"
                className="login-form"
                onFinish={ onFinish }
                // initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Form.Item
                    name="email"
                    rules={[                
                        { 
                            required: true, 
                            message: 'Por favor ingresa tu usuario' 
                        }
                    ]}
                >
                    <Input 
                        type="text" 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Usuario" 
                    />
                </Form.Item>
        
                <Form.Item
                    name="password"
                    rules={[{ 
                            required: true, 
                            message: 'Por favor ingresa tu contraseña' 
                        }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Contraseña"
                    />
                </Form.Item>
                
                {/* <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                </Form.Item> */}

                <Form.Item>
                    <Button loading={ loading } type="primary" htmlType="submit" className="login-form-button" block>
                        Ingresar
                    </Button>
                    O 
                    <Link to="/auth/register" > registrate!</Link>
                </Form.Item>
            </Form>
        </>
       
    )
}

export default LoginPage;