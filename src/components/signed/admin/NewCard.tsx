import React, { useContext, useEffect, useState } from 'react';
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
    Image,
    message,
    Divider,
    Space
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import useHideMenu from '../../../hooks/useHideMenu';
import { RootState } from '../../../store';
import { startAddNewCard, loadCardUpdating, startUpdateCard, startLoadCard } from '../../../store/card/action';
import { useHistory, useParams } from 'react-router';


import '../../../css/new-card.css'
import { RaceCard } from '../../../store/description/types';
import { MenuContext } from '../../../context/MenuContext';
import { Card } from '../../../store/card/types';

const { Title } = Typography;
const { TextArea } = Input;

interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
};

const NewCard = () => {

    const { collapsedMenu } = useContext(MenuContext);

    useHideMenu(false, 'cards', collapsedMenu);

    const params: any = useParams();

    const dispatch = useDispatch();

    const { cardUpdating, cards } = useSelector((state: RootState) => state.cards);

    const [fields, setFields] = useState<FieldData[]>([]);

    const [checkIsMachinery, setCheckIsMachinery] = useState<boolean>(false);
    const [checkIsUnique, setCheckIsUnique] = useState<boolean>(false);
    const [disableMachinery, setDisableMachinery] = useState<boolean>(true);
    const [fileList, setFileList] = useState<any>();
    const [editionName, setEditionName] = useState<string>('');
    const [races, setRaces] = useState<RaceCard[]>([]);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);

    const { types, frecuencies, editions } = useSelector((state: RootState) => state.description);    

    const history = useHistory();

    useEffect(() => {
        async function getFromAPI() {
            await dispatch(startLoadCard());
            await dispatch(loadCardUpdating(params.id));
        }

        if (params.id && params.id !== 'undefined') {
            if (cards.length === 0) {
                getFromAPI();
            } else {
                dispatch(loadCardUpdating(params.id));   
            }
        }

    }, [params.id, dispatch, cards.length]);

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
            }];

            setFields(fields);
            if (cardUpdating.isMachinery) setDisableMachinery(false);
            setCheckIsMachinery(cardUpdating.isMachinery);
            setCheckIsUnique(cardUpdating.isUnique);
            setEditionName(cardUpdating.edition);
        }

    }, [cardUpdating]);

    const onFinish = async (values: any) => {
        let formData = new FormData();

        let armTypeId;

        for (const type of types) {
            if (type.name === 'Arma') {
                armTypeId = type.id;
                break;
            }
        }        

        for (let key in values) {
            if (values[key] || values['strength'] === 0 ) formData.append(key, values[key]);                  
        }     
        
        if (values.type !== armTypeId){
            formData.append('isMachinery', 'false');
        } else if (checkIsMachinery) {
            formData.append('isMachinery', 'true');
        }

        if (checkIsUnique) {
            formData.append('isUnique', 'true');
        } else {
            formData.append('isUnique', 'false');
        }

        setLoadingSave(true)

        if (!cardUpdating) {      
            
            if (!fileList) {
                message.error('Debe adjuntar una imagen');
                return;
            }

            formData.append('files[]', fileList);
            await dispatch(startAddNewCard(formData));
            history.replace(`/cards`);

        } else {

            if (fileList){

                const isJPG = fileList.type === 'image/jpeg' || fileList.type === 'image/png';
    
                if (!isJPG) {
                    message.error('Solo se pueden subir imágenes');
                    return;
                }
    
                formData.append('files[]', fileList);
    
            }

            await dispatch(startUpdateCard(cardUpdating?.id as string, formData));
              
        }

        setLoadingSave(false);

    };

    const handleChangeType = (id: string) => {
        for (const type of types) {
            if (id === type.id && type.name === 'Arma') {
                setDisableMachinery(false);
            } else {
                setDisableMachinery(true);
                setCheckIsMachinery(false)
            }
        }
    };

    const handleSwitchMaquinery = (checked: boolean) => {
        setCheckIsMachinery(checked);
    };

    const handleSwitchUnique = (checked: boolean) => {
        setCheckIsUnique(checked);
    };

    const handleEdition = (editionId: string) => {
        
        for (const edition of editions) {
            if (edition.id === editionId) {
                setEditionName(edition.name);
                setRaces(edition.races);
                break;
            }
        }

        setFields([{name: 'race', value: ''}]);
        
    };

    const back = () => {
        history.push('/cards');
    };

    const nextCard = () => {
        const index = cards.findIndex((card: Card) => params.id === card.id);
        if (index < cards.length) {
            const nextId = cards[index + 1].id;
            history.push(`/cards/${nextId}/edit`)
        }
    };

    const prevCard = () => {
        const index = cards.findIndex((card: Card) => params.id === card.id);
        if (index >= 0) {
            const nextId = cards[index - 1].id;
            history.push(`/cards/${nextId}/edit`)
        }
    }

    return (
        <>
            <Tooltip title="Volver al listado">
                <Button onClick={ back } type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
            </Tooltip>

            <Divider />

            <Title level={ 1 }>{!cardUpdating ?  'Crear Carta' : 'Modificar Carta'}</Title>

            {
                cardUpdating && (
                    <Space>
                        <Button onClick={ prevCard } type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
                        <Button onClick={ nextCard } type="primary" shape="circle" icon={<ArrowRightOutlined />} />
                    </Space>
                )
            }
            
            
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
                    <Switch disabled={ disableMachinery } onChange={ handleSwitchMaquinery } checked={ checkIsMachinery }/>
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
                        frecuencies.length > 0 && frecuencies.map(frecuency => (
                            <Select.Option key={ frecuency.id } value={ frecuency.id }>{ frecuency.name }</Select.Option>
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
                            listHeight={300}
                            style={{ width: "100%" }}
                            onChange={ handleEdition }
                        
                        >
                        {
                            editions.length > 0 && editions.map(edition => (
                                <Select.Option key={ edition.id } value={ edition.id }>{ edition.name }</Select.Option>
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
                            editionName && races.map(race => (
                                <Select.Option key={ race.id } value={ race.id }>{ race.name }</Select.Option>
                            ))                            
                        }                    
                        
                    </Select>
                </Form.Item>

                <Form.Item label="Coste" name="cost">
                    <InputNumber style={{width: '100%'}} min={ 0 } />
                </Form.Item>

                <Form.Item label="Fuerza" name="strength">
                    <InputNumber style={{width: '100%'}} min={ 0 } />
                </Form.Item>

                <Form.Item label="¿Es única?" valuePropName="isUnique">
                    <Switch checked={ checkIsUnique } onChange={ handleSwitchUnique }/>
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
                        <Button type="dashed" disabled={ fileList } > {!cardUpdating?.img ? 'Selecciona una imagen' : 'Imagen de la BD'}</Button>
                    </Upload> 
                    
                </Form.Item>   

                <Form.Item className="label-custom" label="preview">
                    { cardUpdating && !fileList && (<Image   
                                            width={200}
                                            src={ cardUpdating.img }
                                        />)
                    }
                </Form.Item>
            
                <Form.Item className="label-custom" label="." >
                    <Button loading={ loadingSave } type="primary"  htmlType="submit" className="login-form-button" block>
                        {!cardUpdating ? 'Crear' : 'Modificar' }
                    </Button>
                </Form.Item>
            </Form>            
        </>
    )
}

export default NewCard;