import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { withErrorBoundary } from 'react-error-boundary';
import ErrorComponent from '../components/Common/ErrorComponent.jsx';
import { WrapperContainLeftRight, WrapperContainerRight, WrapperFormContainer } from '../pages/Login/style.js';
import { Image } from 'antd';

const LayoutAuth = ({ children = <> </> }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = 'Login page';
    }, []);

    return (
        <WrapperFormContainer>
            <WrapperContainLeftRight>
                {children}
                <WrapperContainerRight>
                    <Image src={''} preview={false} alt={'img_login'} height={'203px'} width={'203px'}
                        style={{ borderRadius: '50%', border: '1px solid #ccc', }} />
                    <h4 style={{ color: 'rgb(10, 104, 255)', fontSize: '18px', fontWeight: '500', lineHeight: '24px', cursor: 'pointer', }}
                        onClick={() => navigate('/')}>
                        Shopping at MobileStore
                    </h4>
                </WrapperContainerRight>
            </WrapperContainLeftRight>
        </WrapperFormContainer>
    );
};

export default withErrorBoundary(LayoutAuth, { FallbackComponent: ErrorComponent });