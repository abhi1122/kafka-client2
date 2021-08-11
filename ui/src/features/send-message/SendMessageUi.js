import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, InputNumber, Tooltip, Select } from 'antd';
import { post } from "../../helpers/service";
import { openNotificationWithIcon } from '../alert/alert';
import { QuestionOutlined, QuestionCircleFilled } from '@ant-design/icons';
const { Option } = Select;

const defaultState = {
    partition: 0,
    attributes: 0,
    messages: '',
    key: ''
};
const SendMessageUi = ({ showSendMessageUi, activeTopic, setShowSendMessage, selectedTopics = {} }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [form, setForm] = useState({ ...defaultState });
    const [form] = Form.useForm();


    useEffect(() => {
        // showSendMessageUi ? showModal() : handleCancel();
        form.setFieldsValue(defaultState);
    }, [showSendMessageUi]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        console.log('cal.....');
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        //setIsModalVisible(false);
        setShowSendMessage(false);
        form.resetFields();
        form.setFieldsValue(defaultState);
    };

    const sendMessage = (values) => {
        console.log(values, '.....form');
        post({ url: `/kafka-admin/sent-message`, data: { ...values, topic: activeTopic } }).then(({ data: list }) => {
            console.log(list, '.....messahe');
            //form.setFieldsValue(defaultState);
            // setForm(defaultState);
            // console.log(list[1])
            // setTopicList(list[1]['metadata']);
            if (list.error) {
                openNotificationWithIcon('error', list.error, 'Send Message Failed.');
            } else {
                openNotificationWithIcon('success', 'You can see your message list.', 'Message sent successfully.');
                form.setFieldsValue(defaultState);
                setShowSendMessage(false);
            }
        });
    }

    const submitForm = () => {
        form.submit();
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    /* eslint-enable no-template-curly-in-string */
    const onFinish = (values) => {
        console.log(values);
    };

    const catchForm = (name, value) => {
        console.log(name, value, '...');
        // setForm(old => ({ ...old, [name]: value }));
    };

    return (
        <>
            <Modal title={`Send message to ${activeTopic}`} visible={showSendMessageUi}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={[
                    <Button type="primary" htmlType="submit" onClick={submitForm}>
                        Send Message
                    </Button>
                ]}
            >

                <Form {...layout}
                    onFinish={sendMessage}
                    form={form} name="nest-messages">

                    <Form.Item
                        label="Partitions"
                        name="partition"
                        rules={[{ required: true, message: 'Please enter number of Partitions!' }]}
                        tooltip={{
                            title: 'Enter no. of Partitions you want.',
                            icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                        }}
                    >
                        <Select
                            placeholder="Select Partition"
                            style={{ width: '30%' }}
                        // onChange={onGenderChange}
                        // allowClear
                        >
                            {selectedTopics && selectedTopics[activeTopic] && Object.keys(selectedTopics[activeTopic]).map((value) => (<Option value={value}>{value}</Option>))};

                        </Select>
                    </Form.Item>


                    <Form.Item
                        label="Attributes"
                        name="attributes"
                        tooltip={{
                            title: 'Enter no. of Attributes.',
                            icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                        }}
                        rules={[{ required: true, message: 'Please enter Attributes!' }]}
                    >
                        <Input style={{ width: '30%' }} />
                    </Form.Item>


                    <Form.Item
                        label="Key"
                        name="key"
                        tooltip={{
                            title: 'String or buffer, only needed when using keyed partitioner',
                            icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                        }}
                    // rules={[{ required: true, message: 'Please enter number of Replication Factor!' }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="Message"
                        name="messages"
                        tooltip={{
                            title: 'Enter your message (multi messages should be a array, single message can be just a string or a KeyedMessage instance)',
                            icon: <QuestionCircleFilled style={{ fontSize: '16px', color: '#08c' }} />
                        }}
                        rules={[{ required: true, message: 'Please enter Message!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>



                </Form>





                {/* <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                    <Form.Item name="partition" label="Partition" rules={[{ type: 'number', min: 0, max: 99 }]}>
                        <InputNumber onChange={e => catchForm('partition', e)} value={form.partition} />
                        <Tooltip title="prompt text" placement="right">
                            <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                        </Tooltip>
                    </Form.Item>
                    <Form.Item name="attributes" label="Attributes" rules={[{ type: 'number', min: 0, max: 99 }]}>
                        <InputNumber onChange={e => catchForm('attributes', e)} value={form.attributes} />
                        <Tooltip title="prompt text" placement="right">
                            <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                        </Tooltip>
                    </Form.Item>
                    <Form.Item name="key" label="Key" rules={[{ type: 'number', min: 0, max: 99 }]}>
                        <Input onChange={e => catchForm('key', e.target.value)} value={form.key} />
                        <Tooltip title="prompt text" placement="right">
                            <QuestionOutlined style={{ fontSize: '14px', color: '#08c', marginLeft: '5px' }} />
                        </Tooltip>
                    </Form.Item>
                    <Form.Item name="messages" label="Messages">
                        <Input.TextArea onChange={e => catchForm('messages', e.target.value)} />
                    </Form.Item>
                </Form> */}



            </Modal>
        </>
    );
};

export default SendMessageUi;