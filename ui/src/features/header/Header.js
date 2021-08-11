import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Input, InputNumber, Tooltip, Layout, Select, Tag } from 'antd';
import { useHistory } from "react-router-dom";
import { post } from "../../helpers/service";
import { AppstoreAddOutlined, PlusCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import CreateTopics from '../create-topics/CreateTopics';
import SelectTopics from '../select-topics/SelectTopics';
import { store } from '../../redux/store.js';
import { removeAll } from "../../helpers/local-storage";
import { set as localStorageSet, get as localStorageGet } from "../../helpers/local-storage";
const { Header } = Layout;


const HeaderUi = () => {
    const [showUi, setShowUi] = useState(false);
    const [showSelectUi, setShowSelectUi] = useState(false);
    const options = [{ value: 'gold' }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];
    const history = useHistory();
    // const { state } = useContext(store);
    const globalState = useContext(store);
    const { dispatch, state: { isLogin } } = globalState;


    function tagRender(props) {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = event => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color={value}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 3 }}
            >
                {label}
            </Tag>
        );
    }

    const logout = () => {
        removeAll();
        dispatch({
            type: 'UPDATE_LOGIN_STATUS',
            payload: false
        });
        dispatch({
            type: 'UPDATE_SELECTED_TOPICS',
            payload: {}
        });
        history.push({
            pathname: "/",
            state: {},
        });
    }

    return (
        <Header>
            <div style={{ float: 'left' }}>
                <img src='/logo.png' style={{ width: '20%' }} alt="image" />
            </div>
            <div style={{ float: 'right' }}>
                {/* <Select
                    mode="multiple"
                    showArrow
                    tagRender={tagRender}
                    defaultValue={['gold', 'cyan']}
                    style={{ width: '100%' }}
                    options={options}
                /> */}

                {/* <span style={{ marginTop: '30px' }}>
                    <Button
                        type="danger"
                        onClick={() => setShowSelectUi(true)}
                        shape="circle" icon={<PlusCircleOutlined />}
                        style={{ marginLeft: '10px', float: 'right' }}
                    />

                    <Button
                        type="primary"
                        onClick={() => setShowUi(true)}
                        shape="circle" icon={<AppstoreAddOutlined />}
                        style={{ marginLeft: '10px', float: 'right' }}
                    />

                    <Button
                        type="primary"
                        onClick={() => logout()}
                        shape="circle" icon={<LogoutOutlined />}
                        style={{ marginLeft: '10px', float: 'right' }}
                    />
                </span> */}
                {isLogin && <>
                    <Button type="primary" ghost icon={<PlusCircleOutlined />} onClick={() => setShowSelectUi(true)}>
                        Select Topic
                </Button>
                    <Button style={{ marginLeft: '20px' }} type="primary" ghost icon={<AppstoreAddOutlined />} onClick={() => setShowUi(true)}>
                        Add Topic
                </Button>
                    <Button style={{ marginLeft: '20px' }} type="danger"
                        ghost icon={<LogoutOutlined />}
                        onClick={() => logout()}>
                        Logout
                </Button>
                </>}
            </div>
            <CreateTopics showUi={showUi} setShowUi={setShowUi} />
            <SelectTopics showUi={showSelectUi} setShowUi={setShowSelectUi} />
        </Header>
    );
};

export default HeaderUi;