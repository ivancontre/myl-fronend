import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    Typography,
    Switch,
    InputNumber,
    Tooltip,
    Upload,
    Alert,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import useHideMenu from '../../../hooks/useHideMenu';
import { RootState } from '../../../store';
import { startAddNewCard, startLoadCardUpdating } from '../../../store/card/action';
import { useHistory, useParams } from 'react-router';
import { Card } from '../../../store/card/types';
import { hideSpin, showSpin } from '../../../store/spinUI/action';
import { startLoadEditionCard, startLoadFrecuencyCard, startLoadRaceCard, startLoadTypeCard } from '../../../store/description/action';

const { Title } = Typography;
const { TextArea } = Input;


interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
};

const NewCard = () => {

    useHideMenu(false, 'cards');

    const params: any = useParams();

    const dispatch = useDispatch();

    const [fields, setFields] = useState<FieldData[]>([]);

    const { cardUpdating } = useSelector((state: RootState) => state.cards);

    useEffect(() => {

        dispatch(startLoadTypeCard());
        dispatch(startLoadFrecuencyCard());
        dispatch(startLoadRaceCard());
        dispatch(startLoadEditionCard());

    }, [dispatch]);

    useEffect(() => {
        if (params.id && params.id !== 'undefined') {

            //dispatch(showSpin('Guadando carta...'));
            dispatch(startLoadCardUpdating(params.id));
            //dispatch(hideSpin());

            

        }

        if (!params.id) {
        //if (!params.id || params.id === 'undefined') {
            //dispatch(resetCardUpdating());
        }

    }, [params.id, dispatch, startLoadCardUpdating]);

    useEffect(() => {
        
        if (cardUpdating) {
            let fields = [{
                name: 'num',
                value: cardUpdating.num
            },{
                name: 'name',
                value: cardUpdating.name
            },{
                name: 'ability',
                value: cardUpdating.ability
            },{
                name: 'legend',
                value: cardUpdating.legend
            },{
                name: 'type',
                value: cardUpdating.type
            },{
                name: 'isMachinery',
                value: cardUpdating.isMachinery
            },{
                name: 'frecuency',
                value: cardUpdating.frecuency
            },{
                name: 'edition',
                value: cardUpdating.edition
            },{
                name: 'race',
                value: cardUpdating.race
            },{
                name: 'cost',
                value: cardUpdating.cost
            },{
                name: 'strength',
                value: cardUpdating.strength
            },{
                name: 'isUnique',
                value: cardUpdating.isUnique
            }]

            setFields(fields);

        }
    }, [cardUpdating])

    const { types, frecuencies, races, editions } = useSelector((state: RootState) => state.description);

    

    const history = useHistory();

    const [disableMachinery, setDisableMachinery] = useState(true);

    const [fileList, setFileList] = useState<any>()

    const onFinish = async (values: any) => {

        dispatch(showSpin('Guardando carta...'));
        let formData = new FormData();

        for (let key in values) {
            
            if (values[key]) {
                formData.append(key, values[key]);
            }
            
        }

        formData.append('files[]', fileList);

        await dispatch(startAddNewCard(formData));

        dispatch(hideSpin());

        history.replace(`/cards`);

    };

    const handleChangeType = (id: string) => {
        for (const type of types) {
            if (id === type.id && type.name === 'Arma') {
                setDisableMachinery(false);
            } else {
                setDisableMachinery(true);
            }
        }
    };

    const back = () => {
        if (cardUpdating?.id && !cardUpdating?.img) {

        }
        history.push('/cards');
    };

    return (
        <>
            <Tooltip className="actions" title="Volver al listado">
                <Button onClick={ back } type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
            </Tooltip>

            <Title level={ 1 }>{!cardUpdating ?  'Crear Carta' : 'Modificar Carta'}</Title>
            
            <Form
                labelCol={{ span: 7}}
                wrapperCol={{ span: 9 }}
                layout="horizontal"
                autoComplete="off"
                onFinish={ onFinish }
                fields={ fields }
            >
        
                <Form.Item 
                    label="Número" 
                    name="num"
                    rules={[{
                            required: true,
                            message: 'Por favor ingrese el número de la carta'
                        }
                    ]}    
                    
                >
                    <InputNumber style={{width: '100%'}} min={ 1 } />
                </Form.Item>

                <Form.Item 
                    label="Nombre" 
                    name="name"
                    rules={[{
                        required: true,
                        message: 'Por favor ingrese el nombre de la carta'
                    }
                ]}  
                
                >
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

                <Form.Item 
                    label="Tipo" 
                    name="type"
                    rules={[{
                        required: true,
                        message: 'Por favor seleccione el tipo de carta'
                        }
                    ]}  
                >
                    <Select
                        placeholder="Seleccione una opción"
                        onChange={ handleChangeType }
                        style={{ width: "100%" }}
                    
                    >
                    {
                        types.length > 0 && types.map(type => (
                            <Select.Option key={ type.id } value={ type.id }>{ type.name }</Select.Option>
                        ))
                    }                    
                        
                    </Select>
                </Form.Item>

                <Form.Item label="¿Es maquinaria?" valuePropName="isMachinery">
                    <Switch disabled={ disableMachinery } />
                </Form.Item>  

                <Form.Item 
                    label="Frecuencia" 
                    name="frecuency"
                    rules={[{
                        required: true,
                        message: 'Por favor seleccione la frecuencia de la carta'
                        }
                    ]}
                    >
                    <Select
                        placeholder="Seleccione una opción"
                        style={{ width: "100%" }}
                    
                    >
                    {
                        frecuencies.length > 0 && frecuencies.map(type => (
                            <Select.Option key={ type.id } value={ type.id }>{ type.name }</Select.Option>
                        ))
                    }                    
                    
                    </Select>
                </Form.Item>

                <Form.Item 
                    label="Edición" 
                    name="edition"
                    rules={[{
                        required: true,
                        message: 'Por favor seleccione la edición de la carta'
                        }
                    ]}
                    
                    
                    >
                    <Select
                            placeholder="Seleccione una opción"
                            style={{ width: "100%" }}
                        
                        >
                        {
                            editions.length > 0 && editions.map(type => (
                                <Select.Option key={ type.id } value={ type.id }>{ type.name }</Select.Option>
                            ))
                        }                    
                        
                    </Select>
                </Form.Item>

                <Form.Item label="Raza" name="race">
                    <Select
                            placeholder="Seleccione una opción"
                            style={{ width: "100%" }}
                        
                        >
                        {
                            races.length > 0 && races.map(type => (
                                <Select.Option key={ type.id } value={ type.id }>{ type.name }</Select.Option>
                            ))
                        }                    
                        
                    </Select>
                </Form.Item>

                <Form.Item label="Coste" name="cost">
                    <InputNumber style={{width: '100%'}} min={ 0 } />
                </Form.Item>

                <Form.Item label="Fuerza" name="strength">
                    <InputNumber style={{width: '100%'}} min={ 1 } />
                </Form.Item>

                <Form.Item label="¿Es única?" valuePropName="isUnique">
                    <Switch />
                </Form.Item>   

                <Form.Item label="Imagen">
                    <Upload
                        listType="picture"
                        multiple={ false } 
                        beforeUpload = { (file: any) => {
                                setFileList(file);
                                return false;
                            }                      
                        }
                        onRemove = { (file: any) => {
                                setFileList(null);
                            }                      
                        }
                        
                    >
                        <Button type="dashed" disabled={ fileList } >Selecciona una imagen</Button>
                    </Upload> 
                    
                </Form.Item>   
                    
            
                <Form.Item label="." >
                    <Button type="primary"  htmlType="submit" className="login-form-button" block>
                        {!cardUpdating ? 'Crear' : 'Modificar' }
                    </Button>
                </Form.Item>
            </Form>

            
        </>
    )
}

export default NewCard
