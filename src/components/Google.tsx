import React, { FC } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';


const Google: FC = () => {

    const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {

    };

    const onFailure = (error: any) => {

    };

    return (
        <div>
            <GoogleLogin
                clientId="578007993116-fgnnph081695j1aasgtgogtev1kru7cb.apps.googleusercontent.com"
                buttonText="Inicia con Google"
                onSuccess={ onSuccess }
                onFailure={ onFailure }
                cookiePolicy={'single_host_origin'}
            />
            
        </div>
    )
}

export default Google;