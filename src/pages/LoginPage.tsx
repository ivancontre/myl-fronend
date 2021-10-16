import React, { FC } from 'react';
import { Form, Input, Button,  Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { startLogin } from '../store/auth/action';
const { Title } = Typography;


const LoginPage: FC = () => {

    const dispatch = useDispatch();

    const onFinish = (values: any) => {

        console.log(values)
        
        const { email, password } = values;

        
        dispatch(startLogin(email, password));

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
                    rules={[{
                            type: 'email',
                            message: 'Correo inválido',
                        },                        
                        { 
                            required: true, 
                            message: 'Por favor ingresa tu correo' 
                        }
                    ]}
                >
                    <Input 
                        type="text" 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Correo" 
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
                    <Input
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
                    <Button type="primary" htmlType="submit" className="login-form-button" block>
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