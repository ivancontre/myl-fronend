import React, { FC } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import '../../css/detail.css';
import { Col, Image, Row } from 'antd';
import { TypeCard } from '../../store/description/types';

const Detail: FC = () => {

    const { cardSelected } = useSelector((state: RootState) => state.match);    
    const { types } = useSelector((state: RootState) => state.description);   

    const getTypeName = (typeId: string) => {
        const type = types.find((card: TypeCard) => card.id === typeId);

        if (type) {
            return type.name;
        }

        return '';
    };

    return (
        <Row className="content-detail">
            <Col span={20}>
                <div className="title-card"><strong>{`${cardSelected?.name} (${getTypeName(cardSelected?.type as string)})`}</strong></div>
                    <p>
                        {cardSelected?.strength && (<span><strong>Fuerza:</strong> {cardSelected?.strength }</span>)}
                        {cardSelected?.cost && (<span className="span-cost"><strong>Coste:</strong> {cardSelected?.cost}</span>)}
                    </p>
                <p>{cardSelected?.ability}</p>
            </Col>
            <Col span={4} className="detail-img">
                <Image
                    height={ 'auto' }
                    src={ cardSelected?.img }
                />  
            </Col>
        </Row>
    )
}

export default Detail;