import React, { useEffect, useState, useContext } from 'react';
import { Tabs, Statistic, Card, Row, Col, Checkbox, Button, Input, Collapse, Empty, Typography, Popover, Form, InputNumber, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SendOutlined, QuestionOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { openNotificationWithIcon } from '../alert/alert';
import SendMessageUi from '../send-message/SendMessageUi';
import { store } from '../../redux/store.js';

import { get, post } from "../../helpers/service";
import { set as localStorageSet, get as localStorageGet } from "../../helpers/local-storage";
const { Panel } = Collapse;

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Text } = Typography;

const defaultState = {
    kafkaHost: 'localhost:9092',
    connectTimeout: 10000,
    requestTimeout: 30000,
    autoConnect: true,
    connectRetryOptions: {},
    idleConnection: 5,
    reconnectOnIdle: true,
    maxAsyncRequests: 10
    // pending sslOptions,sasl
};

function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
}

function Login({ socket }) {
    const [isConnectionTest, setConnectionTest] = useState(false);
    const [form] = Form.useForm();
    const history = useHistory();
    const { dispatch } = useContext(store);
    useEffect(() => {
        form.setFieldsValue(defaultState);
        if (localStorageGet('connection')) {
            console.log(localStorageGet('selectedTopics'), '.....');
            if (localStorageGet('selectedTopics')) {

                dispatch({ type: 'UPDATE_SELECTED_TOPICS', payload: localStorageGet('selectedTopics') });
            }
            history.push({
                pathname: "/dashboard",
                state: {},
            });
        }
    }, []);

    const connect = (value) => {
        console.log(value, '........value');
        post({ url: "/kafka-admin/connect", data: value }).then(({ data: list }) => {
            if (list.error) {
                openNotificationWithIcon('error', JSON.stringify(list.error), 'Connection failed.');
            } else {
                const message = !isConnectionTest ? 'You are successfully connected with Kafka server.' : 'We are successfully stablish connection to Kafka server.'
                openNotificationWithIcon('success', '', message);
                if (!isConnectionTest) {
                    form.setFieldsValue(defaultState);
                    localStorageSet('connection', value);
                    dispatch({
                        type: 'UPDATE_LOGIN_STATUS',
                        payload: true
                    });
                    history.push({
                        pathname: "/dashboard",
                        state: {},
                    });
                }
            }



        });
    }

    const onFinish = (values) => {
        console.log(values);
    };
    const handleCancel = () => {
        // setShowUi(false);
    }
    const catchForm = (name, value) => {
        console.log(name, value, '...');
        // setForm(old => ({ ...old, [name]: value }));
    };

    const setDefault = () => {
        form.setFieldsValue(defaultState);
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const submitForm = (isTest = false) => {
        setConnectionTest(isTest);
        form.submit();
    };

    return (
        <div style={{
            position: "absolute",
            left: '30%',
            top: '20%',
            transform: 'translate(-50 %, -50 %)',
            padding: '50px',
            paddingTop: '20px',
            backgroundColor: 'white',
            // margin: '50px',
            width: '750px',
            paddingBottom: '20px',
            paddingRight: '20px'
        }} >
            <h1 style={{ textAlign: 'center', marginBottom: '5px' }}>Kafka Client Login details</h1>
            <p style={{ textAlign: 'center', marginBottom: '50px' }}>Please do not change defaults values if you are not aware with</p>




            <Form
                name="addTopic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: false }}
                onFinish={connect}
                // onFinishFailed={onFailed}
                form={form}
            >

                <Form.Item
                    name="kafkaHost" label="Kafka Host"
                    tooltip={{
                        title: 'Enter your Host url with port.',
                        icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                    }}
                    rules={[{ required: true, message: 'Please enter Host!' }]}
                >
                    <Input style={{ width: '90%' }} />
                </Form.Item>

                <Form.Item
                    name="connectTimeout" label="Connect Timeout"
                    rules={[{ required: true, message: 'Please enter Connect Timeout!' }]}
                    tooltip={{
                        title: 'Enter Connect Timeout.',
                        icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                    }}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    name="requestTimeout" label="Request Timeout"
                    tooltip={{
                        title: 'Enter how many Replica you want.',
                        icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                    }}
                    rules={[{ required: true, message: 'Please enter number of Replication Factor!' }]}
                >
                    <InputNumber />
                </Form.Item>


                <Form.Item
                    name="idleConnection" label="Idle Connection"
                    tooltip={{
                        title: 'Enter how many Replica you want.',
                        icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                    }}
                    rules={[{ required: true, message: 'Please enter number of Replication Factor!' }]}
                >
                    <InputNumber />
                </Form.Item>


                <Form.Item
                    name="maxAsyncRequests" label="Max Async Requests"
                    tooltip={{
                        title: 'Enter how many Replica you want.',
                        icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                    }}
                    rules={[{ required: true, message: 'Please enter number of Replication Factor!' }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item name="autoConnect" valuePropName="checked" wrapperCol={{ offset: 6, span: 16 }}>
                    <Checkbox name="autoConnect">Auto Connect</Checkbox>
                </Form.Item>

                <Form.Item name="reconnectOnIdle" valuePropName="checked" wrapperCol={{ offset: 6, span: 16 }}>
                    <Checkbox name="reconnectOnIdle">Reconnect OnIdle</Checkbox>
                </Form.Item>

                {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 6, span: 16 }}>
                    <Checkbox>Reconnect OnIdle</Checkbox>
                </Form.Item> */}


                {/* <Row>
                    <Col span={8}>
                        <Checkbox checked={form.autoConnect}
                            onChange={(e) => updateCheckbox(e, 'autoConnect')}>Auto Connect</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox checked={form.reconnectOnIdle}
                            onChange={(e) => updateCheckbox(e, 'reconnectOnIdle')}>Reconnect OnIdle</Checkbox>
                    </Col>
                </Row> */}

            </Form>






            {/* <Form {...layout} name="nest-messages" onFinish={onFinish}>

                <Form.Item name="kafkaHost" label="Kafka Host">
                    <Input onChange={e => catchForm('kafkaHost', e.target.value)} value={form.kafkaHost} />
                    <Tooltip title="prompt text" placement="right">
                        <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                    </Tooltip>
                </Form.Item>

                <Form.Item name="connectTimeout" label="Connect Timeout" rules={[{ type: 'number', min: 0, max: 99 }]}>
                    <InputNumber onChange={e => catchForm('connectTimeout', e)} value={form.connectTimeout} />
                    <Tooltip title="prompt text" placement="right">
                        <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                    </Tooltip>
                </Form.Item>

                <Form.Item name="requestTimeout" label="Request Timeout" rules={[{ type: 'number', min: 0, max: 99 }]}>
                    <InputNumber onChange={e => catchForm('requestTimeout', e)} value={form.requestTimeout} />
                    <Tooltip title="prompt text" placement="right">
                        <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                    </Tooltip>
                </Form.Item>

                <Form.Item name="idleConnection" label="Idle Connection" rules={[{ type: 'number', min: 0, max: 99 }]}>
                    <InputNumber onChange={e => catchForm('idleConnection', e)} value={form.idleConnection} />
                    <Tooltip title="prompt text" placement="right">
                        <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                    </Tooltip>
                </Form.Item>

                <Form.Item name="maxAsyncRequests" label="Max Async Requests" rules={[{ type: 'number', min: 0, max: 99 }]}>
                    <InputNumber onChange={e => catchForm('maxAsyncRequests', e)} value={form.maxAsyncRequests} />
                    <Tooltip title="prompt text" placement="right">
                        <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                    </Tooltip>
                </Form.Item>



                <Row>
                    <Col span={8}>
                        <Checkbox checked={form.autoConnect}
                            onChange={(e) => updateCheckbox(e, 'autoConnect')}>Auto Connect</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox checked={form.reconnectOnIdle}
                            onChange={(e) => updateCheckbox(e, 'reconnectOnIdle')}>Reconnect OnIdle</Checkbox>
                    </Col>
                </Row>


            </Form> */}


            <Button type="primary" onClick={() => submitForm(false)}
                htmlType="submit" style={{ float: 'right', marginTop: '30px', marginLeft: '20px' }}>
                <b>Connect</b>
            </Button>
            <Button type="primary" onClick={() => submitForm(true)}
                htmlType="submit" style={{ float: 'right', marginLeft: '20px', marginTop: '30px' }}>
                <b>Test Connection</b>
            </Button>
            <Button type="primary" onClick={setDefault}
                htmlType="submit" style={{ float: 'right', marginTop: '30px' }}>
                <b>Reset Connection</b>
            </Button>
        </div >
    );
}

export default Login;
