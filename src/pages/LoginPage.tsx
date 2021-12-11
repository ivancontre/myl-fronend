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
        const { email, password } = values;
        await dispatch(startLogin(email, password, setloading))
    };
    

    return (
        <>
            <Title level={ 2 }>Iniciar Sesión</Title>

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
                    rules={[
                        { 
                            required: true, 
                            message: 'Por favor ingresa tu contraseña' 
                        },
                        {  
                            min: 6, 
                            message: 'La contraseña debe tener a lo menos 6 caracteres' 
                        }
                    
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Contraseña"
                    />
                </Form.Item>

                <Form.Item>
                    <Button loading={ loading } type="primary" htmlType="submit" className="login-form-button" block style={{marginBottom: 20}}>
                        Ingresar
                    </Button>

                    <p>¿No tienes cuenta? <Link to="/auth/register"> registrate aquí</Link></p>
                    <p>¿Olvidaste tu contraseña? <Link to="/auth/recovery-password"> recupérala aquí</Link></p>                  
                    
                </Form.Item>
            </Form>
        </>
       
    )
}

export default LoginPage;