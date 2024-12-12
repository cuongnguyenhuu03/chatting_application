import React, { useEffect, useState } from 'react';
import { WrapperContainerLeft, WrapperHeader, WrapperTextLight } from './style';
import { InputForm } from '../../components/Input';
import { Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ButtonComponent from '../../components/Button/ButtonComponent.jsx';
import { postLogin } from '../../services/userService';
import { jwtDecode } from 'jwt-decode';
import LayoutAuth from '../../layout/LayoutAuth';
import axios from 'axios';

const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.title = 'MobileStore - Sign In';

        return () => {
            setEmail('');
            setPassword('');
        };
    }, []);

    const checkDisabledButton = () => {
        if (email.trim() || password.trim())
            return false;
        return true;
    }

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra email có được điền hay không
        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = 'Invalid email format.';
            }
        }

        // Kiểm tra password có được điền hay không
        if (!password.trim()) {
            newErrors.password = 'Password is required.';
        }

        // Cập nhật trạng thái lỗi
        setErrors(newErrors);

        // Trả về kết quả validate
        return Object.keys(newErrors).length === 0;
    };

    const submitLoginForm = async () => {
        if (validateForm()) {
            try {
                const res = await postLogin({ email, password });
                if (res) {
                    const { userName } = jwtDecode(res?.dt);
                    if (userName) {
                        localStorage.setItem('username', userName)
                        localStorage.setItem('access_token', res?.dt);
                        navigate('/chatting');
                    }
                    else toast.error('Login failed')
                }
            } catch (error) {
                console.log('Error login:', error);
                toast.error(error.message);
            }
        }
    };

    return (
        <LayoutAuth>
            <WrapperContainerLeft >
                <WrapperHeader>Welcome,</WrapperHeader>
                <p style={{ fontSize: '16px' }}>Sign in or Sign up</p>
                <Form onFinish={submitLoginForm}>
                    <div style={{ marginBottom: '10px' }}>
                        <InputForm
                            type="email"
                            placeholder="Type your email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ borderColor: errors.email ? 'red' : undefined }}
                        />
                        {errors.email && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.email}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <InputForm
                            type="password"
                            placeholder="Type password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="password"
                            style={{ borderColor: errors.password ? 'red' : undefined }}
                        />
                        {errors.password && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.password}</p>}
                    </div>

                    <ButtonComponent type={'submit'} disabled={checkDisabledButton()} text={'Sign in'} />

                </Form>
                <p><WrapperTextLight>Forgotten password?</WrapperTextLight> </p>
                <p style={{ margin: '0px' }}>Don't have an account? <WrapperTextLight onClick={() => navigate('/sign-up')}>Register</WrapperTextLight></p>
            </WrapperContainerLeft>
        </LayoutAuth>
    );
};

export default SignInPage;