import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Input, InputNumber, Tooltip, notification } from 'antd';
import { store } from '../../redux/store.js';
import { openNotificationWithIcon } from '../alert/alert';
import { TollTip } from '../helpers/utils-components';
import { post, get } from "../../helpers/service";
import { QuestionOutlined, QuestionCircleFilled } from '@ant-design/icons';

const defaultState = {
    partition: 1,
    replicationFactor: 1,
    topic: '',
};
const CreateTopics = ({ showUi, setShowUi }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [form, setForm] = useState({ ...defaultState });
    const [form] = Form.useForm();

    const globalState = useContext(store);
    const { dispatch } = globalState;

    useEffect(() => {
        console.log('useEffect call.........', defaultState)
        form.setFieldsValue(defaultState);
    }, [showUi, form]);

    const sendMessage = (values) => {
        post({ url: `/kafka-admin/add-topic`, data: { ...values } }).then(({ data: list }) => {
            if (list.error) {
                openNotificationWithIcon('error', list.error, 'Save Topic Failed.');
            } else {
                openNotificationWithIcon('success', 'You can select your Topic in Select Topic section.', 'Topic created successfully.');
                form.setFieldsValue(defaultState);
                setShowUi(false);
                getAllTopics();
            }
        }).catch((error) => {
            openNotificationWithIcon('error', 'Oops something went wrong', 'Save Topic Failed.');
        });
    }

    const getAllTopics = () => {
        get({ url: "/kafka-admin/topics-list", dispatch }).then(({ data: list }) => {
            dispatch({ type: 'UPDATE_TOPICS', payload: list[1]['metadata'] });
        });
    }

    const onFailed = (values) => {
        try {
            console.log(values);
        } catch (err) {

        }

    };

    const handleCancel = () => {
        setShowUi(false);
        form.resetFields();
        form.setFieldsValue(defaultState);
    }

    const submitForm = () => {
        form.submit();
    };


    return (
        <>
            <Modal title="Create New Topic" visible={showUi}
                onCancel={handleCancel}
                width={800}
                footer={[
                    <Button type="primary" htmlType="submit" onClick={submitForm}>
                        Create Topic
                    </Button>
                ]}
            >


                <Form
                    name="addTopic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: false }}
                    onFinish={sendMessage}
                    // onFinishFailed={onFailed}
                    form={form}
                >

                    <Form.Item
                        label="Topic Name"
                        name="topic"
                        tooltip={{
                            title: 'Enter no. of Partitions you want.',
                            icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                        }}
                        rules={[{ required: true, message: 'Please enter Topic Name!' }]}
                    >
                        <Input style={{ width: '90%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Partitions"
                        name="partition"
                        rules={[{ required: true, message: 'Please enter number of Partitions!' }]}
                        tooltip={{
                            title: 'Enter no. of Partitions you want.',
                            icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                        }}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        label="Replication Factor"
                        name="replicationFactor"
                        tooltip={{
                            title: 'Enter how many Replica you want.',
                            icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                        }}
                        rules={[{ required: true, message: 'Please enter number of Replication Factor!' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Form>




                {/* <Form
                    {...layout}
                    name="nest-messages"
                    onFinish={onFinish}
                    onFinishFailed={onFinish}
                >

                    <Form.Item
                        name="topic" label="Topic"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input onChange={e => catchForm('topic', e.target.value)} value={form.key} />
                        <Tooltip title="prompt text" placement="right">
                            <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                        </Tooltip>
                    </Form.Item>

                    <Form.Item name="partition" label="Partitions"
                        rules={[{ required: true, type: 'number', min: 0, max: 99, message: 'Please input your username!' }]}
                    >
                        <InputNumber onChange={e => catchForm('partition', e)} value={form.partition} />
                        <Tooltip title="prompt text" placement="right">
                            <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                        </Tooltip>
                    </Form.Item>

                    <Form.Item name="replicationFactor" label="Replication Factor"
                        rules={[{ required: true, type: 'number', min: 0, max: 99, message: 'Please input your username!' }]}
                    >
                        <InputNumber onChange={e => catchForm('replicationFactor', e)} value={form.replicationFactor} />
                        <Tooltip title="prompt text" placement="right">
                            <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                        </Tooltip>
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>

                </Form> */}
            </Modal>
        </>
    );
};

export default CreateTopics;