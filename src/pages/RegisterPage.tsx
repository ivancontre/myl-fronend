import React, { useState } from 'react';
import { Form, Input, Button,  Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { startRegister } from '../store/auth/action';
const { Title } = Typography;

const RegisterPage = () => {

    const dispatch = useDispatch();
    const [loading, setloading] = useState(false);

    const onFinish = async (values: any) => {
        setloading(true);
        const { email, password, name, lastname, username } = values;
        
        await dispatch(startRegister(name, lastname, email, username, password));
        setloading(false);

    };


    return (
        <>
            <Title level={ 1 }>Registro</Title>

            <Form
                name="normal_login"
                className="login-form"
                onFinish={ onFinish }
                autoComplete="off"
            >
                <Form.Item
                    
                    name="name"
                    rules={[{
                            required: true,
                            message: 'Por favor ingrese su nombre'
                        }
                    ]}
                >
                    <Input 
                        type="text" 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Nombre" 
                    />
                
                </Form.Item>

                <Form.Item
                    
                    name="lastname"
                    rules={[{
                            required: true,
                            message: 'Por favor ingrese su apellido'
                        }
                    ]}
                >
                    <Input 
                        type="text" 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Apellido" 
                    />
                
                </Form.Item>

                <Form.Item
                    
                    name="email"
                    rules={[{
                            type: 'email',
                            message: 'Correo inválido',
                        },
                        { 
                            required: true, 
                            message: 'Por favor ingresa tu correo' 
                        }]}
                >
                    <Input 
                        type="text" 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Correo" 
                    />
                </Form.Item>

                <Form.Item
                    
                    name="username"
                    rules={[{
                            required: true,
                            message: 'Por favor ingrese su nombre de usuario'
                        }
                    ]}
                >
                    <Input 
                        type="text" 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Nombre de usuario" 
                    />
                
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                    hasFeedback
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Contraseña"
                    />
                </Form.Item>

                <Form.Item
                    name="password2"
                    rules={[
                        {
                          required: true,
                          message: 'Por favor confirma tu contraseña!',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Las 2 contraseñas deben ser iguales'));
                          },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Repetir contraseña"
                    />
                </Form.Item>
                
                {/* <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                </Form.Item> */}

                <Form.Item>
                    <Button loading={ loading } type="primary" htmlType="submit" className="login-form-button" block>
                        Aceptar
                    </Button>
                    O 
                    <Link to="/auth/login" > inicia sesión!</Link>
                </Form.Item>
            </Form>
        </>
        
    )
}

export default RegisterPage
