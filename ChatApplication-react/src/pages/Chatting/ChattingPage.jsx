import React, { useCallback, useEffect, useState } from 'react';
import './style.scss';
import avatarUser from '../../assets/avt/avt.png';
import SockJS from "sockjs-client/dist/sockjs"
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import { getAllMessages, getUsersActive } from '../../services/userService';
import _, { result } from 'lodash';
import { SendOutlined } from '@ant-design/icons';

const ChattingPage = () => {
    const [userName, setUserName] = useState(localStorage?.getItem('username') ?? '');
    const [stompClient, setStompClient] = useState(null);
    const [usersActive, setUsersActive] = useState([]);
    const [userSelected, setUserSelected] = useState({});
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        setMessages(prevMessages => [...prevMessages, { type: 'receiver', content: message?.content }])
    };

    const fetchUsersActive = useCallback(async () => {
        try {
            const res = await getUsersActive();
            if (res?.ec === 200) {
                const filterUsers = res.dt.filter(item => item.email !== localStorage.getItem('username'));
                setUsersActive(filterUsers);
            } else {
                toast.error(res?.em ?? 'Fetching users active failed!');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }, []);

    const buildDataMessage = (dataMessages = []) => {
        if (!dataMessages?.length) return;
        const userId = +localStorage.getItem('id');
        const results = dataMessages.map(data => ({
            type: data?.sender?.id === userId ? 'sender' : 'receiver',
            content: data?.content,
        }));
        setMessages(results);
        return results;
    };

    const fetchAllMessages = useCallback(async () => {
        try {
            const res = await getAllMessages(Number(localStorage.getItem('id')), +userSelected?.id);
            if (res?.ec === 200) {
                buildDataMessage(res?.dt ?? []);
            } else {
                toast.error(res?.em ?? 'Fetching users active failed!');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }, [+userSelected?.id]);

    useEffect(() => {
        let client = null;

        if (userName) {
            // Kết nối SockJS và STOMP
            const socket = new SockJS('http://localhost:8080/ws');
            client = Stomp.over(socket);

            client.connect({}, () => {
                client.subscribe(`/user/${userName}/queue/messages`, onMessageReceived);
                // register the connected user
                client.send("/app/user.addUser",
                    {},
                    JSON.stringify({ email: userName, status: "ONLINE" })
                );
                setStompClient(client);
                fetchUsersActive();
            }, (error) => {
                console.error('Connection error:', error);
            });
        }

        // Cleanup connection khi component unmount
        return () => {
            if (client) {
                client.disconnect(() => {
                    console.log('Disconnected from WebSocket');
                });
            }
        };
    }, [userName]);

    useEffect(() => {
        if (stompClient && userSelected?.id)
            fetchAllMessages();
    }, [stompClient, userSelected?.id]);

    // Tối ưu hóa khi thay đổi giá trị trong input
    const handleInputChange = useCallback((e) => {
        setInputMessage(e.target.value);
    }, []); // Giữ nguyên hàm này để tránh re-render không cần thiết

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && stompClient) {
            const receiver = {
                id: userSelected?.id
            };
            const sender = {
                id: Number(localStorage.getItem('id'))
            };
            const chatMessage = {
                sender,
                receiver,
                content: inputMessage.trim(),
                timestamp: new Date()
            };
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessages(prevMessages => [...prevMessages, { type: 'sender', content: inputMessage.trim() }]);
            setInputMessage('');
        }
    };

    console.log('RENDER');
    return (
        <div className="container" id="chat-page">
            <div className="list-user">
                {usersActive?.length > 0 && usersActive.map(user => (
                    <li className="list-user-item" key={user?.email} onClick={() => setUserSelected(user)} >
                        <img className="list-user-avt" src={avatarUser} alt="User Avatar" />
                        <div className="list-user-name">{user?.email}</div>
                    </li>
                ))}
            </div>

            {!_.isEmpty(userSelected) &&
                <div className="message-container">
                    <div className="message-header-container">
                        <div className="message-header">
                            <div className="message-header-name">{userSelected?.email ?? ''}</div>
                            <img
                                className="message-header-avt"
                                src={avatarUser}
                                alt="Huu Cuong Avatar"
                                height="40"
                                width="40"
                            />
                        </div>
                    </div>

                    <div className="message-content-container" id="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} style={{ marginLeft: message.type === 'sender' ? 'auto' : '0px' }}
                                className={`message-${message.type} message-content`}>
                                <span>{message.content}</span>
                            </div>
                        ))}
                    </div>

                    <div className="message-form-container">
                        <form id="messageForm" name="messageForm" onSubmit={handleSendMessage}>
                            <div className="message-input">
                                <input
                                    type="text"
                                    id="message"
                                    placeholder="Type your message..."
                                    value={inputMessage}
                                    onChange={handleInputChange} // Sử dụng hàm này để tối ưu hóa
                                />
                                <SendOutlined style={{ fontSize: '20px', cursor: 'pointer', color: '#999999' }} />
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
};

export default ChattingPage;
