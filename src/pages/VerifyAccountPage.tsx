import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { startVerifyToken } from '../store/auth/action';

const VerifyAccountPage: FC = () => {

    const dispatch = useDispatch();

    const params: any = useParams();

    const { token } = params;

    useEffect(() => {

        dispatch(startVerifyToken(token));

    }, [token, dispatch]);

    return (
        <div>
        </div>
    )
}

export default VerifyAccountPage;