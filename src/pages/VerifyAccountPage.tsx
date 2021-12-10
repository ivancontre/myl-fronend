import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { startVerifyToken } from '../store/auth/action';

const VerifyAccountPage: FC = () => {

    const dispatch = useDispatch();

    const params: any = useParams();

    const history = useHistory();

    const { token } = params;
    
    useEffect(() => {

        dispatch(startVerifyToken(token, history));

    }, [token, dispatch, history]);

    return (
        <div>
        </div>
    )
}

export default VerifyAccountPage;