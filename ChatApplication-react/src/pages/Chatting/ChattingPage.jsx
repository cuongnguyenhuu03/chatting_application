import React, { useCallback, useEffect, useState } from 'react';
import './style.scss';
import avatarUser from '../../assets/avt/avt.png';
import SockJS from "sockjs-client/dist/sockjs"
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import { getUsersActive } from '../../services/userService';
import _ from 'lodash';
import { SendOutlined } from '@ant-design/icons';

const ChattingPage = () => {
    const [userName, setUserName] = useState(localStorage?.getItem('username') ?? '');
    const [stompClient, setStompClient] = useState(null);
    const [usersActive, setUsersActive] = useState([]);
    const [userSelected, setUserSelected] = useState({});
    const [inputMessage, setInputMessage] = useState('');

    const onMessageReceived = () => {

    }

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



    const [messages, setMessages] = useState([
        { type: 'sender', content: 'Hello' },
        { type: 'receiver', content: 'Good morning' },
        { type: 'sender', content: 'Hello' }, { type: 'sender', content: 'Hello' },
        { type: 'receiver', content: 'Good morning' }, { type: 'receiver', content: 'Good morning' }, { type: 'receiver', content: 'Good morning' },
    ]);



    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && stompClient) {
            const chatMessage = {
                senderId: userName,
                recipientId: userSelected?.email,
                content: inputMessage.trim(),
                timestamp: new Date()
            };
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessages([...messages, { type: 'sender', content: inputMessage.trim() }]);
            setInputMessage('');
        }


    };

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
                                    onChange={(e) => setInputMessage(e.target.value)}
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