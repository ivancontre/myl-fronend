import React, { FC, useContext, useEffect, useState } from 'react';
import { Form, Input, Button,  Typography, Switch, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';
import { MenuContext } from '../../../context/MenuContext';
import useHideMenu from '../../../hooks/useHideMenu';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { startSetUpdateDataAction } from '../../../store/auth/action';

const { Title } = Typography;

interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
};


const Account: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    const { collapsedMenu } = useContext(MenuContext);

    const { name, lastname, username, email, id } = useSelector((state: RootState) => state.auth);

    useHideMenu(false, path, collapsedMenu);

    const dispatch = useDispatch();

    const [loading, setloading] = useState(false);
    const [fields, setFields] = useState<FieldData[]>([]);
    const [showSectionPassword, setShowSectionPassword] = useState(false);

    useEffect(() => {
        
        const fields = [{
            name: 'name',
            value: name
        },{
            name: 'lastname',
            value: lastname
        },{
            name: 'username',
            value: username
        },{
            name: 'email',
            value: email
        },{
            name: 'password',
            value: ''
        },{
            name: 'password2',
            value: ''
        },{
            name: 'password3',
            value: ''
        }];

        setFields(fields);

    }, [name, lastname, username, email]);


    const onFinish = async (values: any) => {

        setloading(true);

        await dispatch(startSetUpdateDataAction(id as string, {
            name: values.name,
            lastname: values.lastname,
            password: values.password,
            password2: values.password2
        }));

        message.success('Actualizado correctamente');

        setloading(false);
    };

    const onChangeSwitch = (checked: boolean) => {
        setShowSectionPassword(checked);

        if (!checked) {

            setFields([{
                name: 'password',
                value: ''
            },{
                name: 'password2',
                value: ''
            },{
                name: 'password3',
                value: ''
            }]);
        }
    };

    return (
        <>
            <Title level={ 1 }>Mis datos</Title>

            <Form
                labelCol={{ span: 7}}
                wrapperCol={{ span: 9 }}
                layout="horizontal"
                autoComplete="off"
                onFinish={ onFinish }
                fields={ fields }
            >
                <Form.Item
                    label="Nombres" 
                    name="name"
                    rules={[{
                            required: true,
                            message: 'Por favor ingrese su nombre'
                        }
                    ]}
                >
                    <Input 
                        type="text" 
                        prefix={<SmileOutlined className="site-form-item-icon" />} 
                        placeholder="Nombre" 
                    />
                
                </Form.Item>

                <Form.Item
                    label="Apellidos"     
                    name="lastname"
                    rules={[{
                            required: true,
                            message: 'Por favor ingrese su apellido'
                        }
                    ]}
                >
                    <Input 
                        type="text" 
                        prefix={<SmileOutlined className="site-form-item-icon" />} 
                        placeholder="Apellido" 
                    />
                
                </Form.Item>

                <Form.Item                    
                    label="Correo" 
                    name="email"
                >
                    <Input 
                        type="text" 
                        prefix={<MailOutlined className="site-form-item-icon" />} 
                        placeholder="Correo" 
                        disabled
                    />
                </Form.Item>

                <Form.Item            
                    label="Nombre usuario"         
                    name="username"
                >
                    <Input 
                        type="text" 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Nombre de usuario" 
                        maxLength={ 15 }
                        disabled
                    />
                
                </Form.Item>               

                <Form.Item
                    label="Contraseña actual"
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
                        placeholder="Contraseña actual"

                    />
                </Form.Item>

                <Form.Item
                    label="Cambiar contraseña"
                    name="switch" 
                    valuePropName="checked"
                >
                    <Switch onChange={ onChangeSwitch }/>
                </Form.Item>

                {
                    showSectionPassword && (
                        <div>                         

                            <Form.Item
                                label="Nueva contraseña"
                                name="password2"
                                rules={[
                                    {   
                                        required: showSectionPassword, 
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
                                    placeholder="Nueva contraseña"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Repetir contraseña"
                                name="password3"
                                rules={[
                                    {
                                        required: showSectionPassword,
                                        message: 'Por favor confirma tu contraseña!',
                                    },
                                    { 
                                        min: 6, 
                                        message: 'La contraseña debe tener a lo menos 6 caracteres' 
                                    },
                                    ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password2') === value) {
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
                        </div>
                    )
                }

                <Form.Item className="label-custom" label="." >
                    <Button loading={ loading } type="primary" htmlType="submit" className="login-form-button" block style={{marginBottom: 20}}>
                        Actualizar
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default Account;