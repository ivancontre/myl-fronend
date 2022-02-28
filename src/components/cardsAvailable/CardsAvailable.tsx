import { Alert, Button, Drawer } from 'antd';
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { startLoadEraCardsAvailable } from '../../store/description/action';
import { EditionCard, EraCard } from '../../store/description/types';


const CardsAvailable: FC = () => {


    const { cardsAvailabe } = useSelector((state: RootState) => state.description);

    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        
        dispatch(startLoadEraCardsAvailable());

    }, [dispatch]);



  return (
      <>
        
        <Button type="link" onClick={showDrawer} block size='large'>
            Ver cartas disponibles
        </Button>

        <Alert message="Para una mejor experiencia use Google Chrome :)" type='warning' closable showIcon></Alert>

        <Drawer title="Eras y ediciones disponibles:" placement="right" onClose={onClose} visible={visible}>
            
            <>
                <ul>
                    {
                        cardsAvailabe.map((era: EraCard) => {
                            return <li key={era.id}>
                                    {era.name}
                                    <ul>
                                        {
                                            era.editions.map((edition: EditionCard) => {
                                                return <li key={edition.id}>{edition.name}</li>
                                            })
                                        }
                                    </ul>
                                
                                </li>
                        })
                    }
                </ul>
            </>
        </Drawer>


       
        
      </>
  )
}

export default CardsAvailable;