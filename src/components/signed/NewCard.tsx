import React from 'react'
import useHideMenu from '../../hooks/useHideMenu';
import {
    Form,
    Input,
    Button,
    Select,
    Typography,
    Switch,
    InputNumber,
} from 'antd';

const { Title } = Typography;
const { TextArea } = Input;


const NewCard = () => {

    useHideMenu(false, 'cards-created');

    const onFinish = (values: any) => {

        console.log(values)
        
        


    };
    
    return (
        <>
            <Title level={ 1 }>Nueva Carta</Title>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 10 }}
                layout="horizontal"
                autoComplete="off"
                onFinish={ onFinish }
            >
        
                <Form.Item label="Nombre" name="name">
                    <Input />
                </Form.Item>

                <Form.Item label="Habilidad" name="ability">
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>

                <Form.Item label="Leyenda" name="legend">
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>

                <Form.Item label="Tipo" name="type">
                    <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Frecuencia" name="frecuency">
                    <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Raza" name="race">
                    <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Coste" name="cost">
                    <InputNumber min={ 0 } />
                </Form.Item>

                <Form.Item label="Fuerza" name="strength">
                    <InputNumber min={ 1 } />
                </Form.Item>
            
                <Form.Item label="Es maquinaria" valuePropName="machinery">
                    <Switch />
                </Form.Item>

                <Form.Item label="Imagen" name="img">
                    <Input type="file" />
                </Form.Item>
            
                <Form.Item >
                    <Button type="primary" htmlType="submit" className="login-form-button" block>
                        Crear
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default NewCard
