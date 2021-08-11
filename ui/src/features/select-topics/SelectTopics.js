import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Input, InputNumber, Tooltip, Select, Tag } from 'antd';
import { post } from "../../helpers/service";
import { QuestionOutlined } from '@ant-design/icons';
import { store } from '../../redux/store.js';
import { set as localStorageSet } from "../../helpers/local-storage";

const defaultState = {
    partition: 1,
    replicationFactor: 1,
    topic: '',
};
const SelectTopics = ({ showUi, setShowUi }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form, setForm] = useState({ ...defaultState });
    const [selectList, setSelectList] = useState([]);

    const { state: { topics, selectedTopicsNames }, dispatch } = useContext(store);


    // useEffect(() => {
    //     console.log(Object.keys(selectedTopics), 'popopopopopopopopopopo-----------------------');
    //     if (selectedTopics) {
    //         setSelectList(Object.keys(selectedTopics));
    //     }
    // }, []);


    const sendMessage = () => {
        // console.log(form, '.....form');
        // post({ url: `/kafka-admin/add-topic`, data: { ...form } }).then(({ data: list }) => {
        //     console.log(list, '.....messahe');
        //     setForm(defaultState);
        //     // console.log(list[1])
        //     // setTopicList(list[1]['metadata']);
        // });
        // selectList
        const selected = {};
        selectList.forEach(key => {
            if (topics[key]) {
                selected[key] = topics[key];
            }
        });
        console.log(selected, '...selected');
        dispatch({ type: 'UPDATE_SELECTED_TOPICS', payload: selected });
        localStorageSet('selectedTopics', selected);
        setShowUi(false);
    }

    const layout = {
        labelCol: { span: 3 },
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
    const handleCancel = () => {
        setShowUi(false);
    }
    const catchForm = (name, value) => {
        console.log(name, value, '...');
        setForm(old => ({ ...old, [name]: value }));
    };

    const options = [{ value: 'gold' }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];

    const onChange = (data) => {
        console.log(data, '.....data');
        setSelectList(data);
    }

    useEffect(() => {
        //const { topics } = state;
        console.log(topics, '.....state.topics-=-=-=-==-==-=-=-');
        // setSelectList(Object.keys(topics).map((value) => ({ value })));
    }, []);

    function tagRender(props) {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = event => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                // color={value}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 5, fontSize: '16px' }}
            >
                {label}
            </Tag>
        );
    }


    return (
        <>
            <Modal title="Select Topics" visible={showUi}
                onCancel={handleCancel}
                width={1000}
                footer={[
                    <Button type="primary" htmlType="submit" onClick={sendMessage}>
                        Show on Dashboard
                    </Button>
                ]}
            >
                <Select
                    mode="multiple"
                    showArrow
                    onChange={onChange}
                    tagRender={tagRender}
                    defaultValue={selectedTopicsNames}
                    style={{ width: '100%' }}
                    options={Object.keys(topics).map((value) => ({ value }))}
                />
            </Modal>
        </>
    );
};

export default SelectTopics;