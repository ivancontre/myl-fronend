import React, { useState } from 'react';
import { Form, Input, Button,  Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { startRecoveryPasswordAction } from '../store/auth/action';
const { Title } = Typography;

const RecoveryPasswordPage = () => {

    const dispatch = useDispatch();
    const [loading, setloading] = useState(false);

    const onFinish = async (values: any) => {

        setloading(true);
        const { email } = values;
        await dispatch(startRecoveryPasswordAction(email));
        setloading(false);

    };

    return (
        <>
            <Title level={ 2 }>Recuperar contraseña</Title>

            <Form
                name="normal_login"
                className="login-form"
                onFinish={ onFinish }
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
                        }]}
                >
                    <Input 
                        type="text" 
                        prefix={<MailOutlined className="site-form-item-icon" />} 
                        placeholder="Ingresa tu correo" 
                    />
                </Form.Item>

                <Form.Item>
                    <Button loading={ loading } type="primary" htmlType="submit" className="login-form-button" block style={{marginBottom: 20}}>
                        Aceptar
                    </Button>
                    <p><Link to="/auth/login">Volver al inicio de sesión</Link></p>
                    <p><Link to="/auth/register">Volver al registro</Link></p>
                </Form.Item>
            </Form>
        </>
        
    )
}

export default RecoveryPasswordPage
