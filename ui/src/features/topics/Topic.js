import React, { useEffect, useState, useContext } from 'react';
import { Tabs, Statistic, Skeleton, Result, notification, Tag, Button, Input, Collapse, Empty, Typography, Popover } from 'antd';
import { CheckCircleTwoTone, SyncOutlined, SendOutlined, ReloadOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import SendMessageUi from '../send-message/SendMessageUi';
import { store } from '../../redux/store.js';
import { set as localStorageSet, get as localStorageGet } from "../../helpers/local-storage";
import { get, post } from "../../helpers/service";
const { Panel } = Collapse;

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Text } = Typography;


function Topic({ socket }) {
    const [topicList, setTopicList] = useState({});
    const [message, setMessage] = useState('');
    const [defaultActiveTopic, setDefaultActiveTopic] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [activeTopic, setActiveTopic] = useState('');
    const [showSendMessage, setShowSendMessage] = useState(false);
    const [loadMessage, setLoadMessage] = useState(true);

    const history = useHistory();
    const globalState = useContext(store);
    const { dispatch, state: { selectedTopics } } = globalState;
    // console.log(globalState, '.....globalState=>>>>>>>>>'); // this will return { color: red }


    useEffect(() => {
        dispatch({
            type: 'UPDATE_LOGIN_STATUS',
            payload: true
        });
        console.log('selectedTopics change..............');
        // dispatch({ type: 'UPDATE_SELECTED_TOPICS', payload: selectedTopics });
        setTimeout(
            () => {
                console.log('enter timeout...')
                const [getFistKey = null] = Object.keys(selectedTopics);
                if (getFistKey) {
                    setDefaultActiveTopic(getFistKey);
                    getMessage({ topic: getFistKey, partition: Object.keys(selectedTopics[getFistKey]).length });
                }

            }, 800);
        // setActiveTopic();
    }, [selectedTopics]);

    useEffect(() => {

        if (localStorageGet('connection')) {
            if (localStorageGet('selectedTopics')) {
                dispatch({ type: 'UPDATE_SELECTED_TOPICS', payload: localStorageGet('selectedTopics') });
            }
        } else {
            history.push({
                pathname: "/",
                state: {},
            });
        }


        getAllTopics();
        socket.on("receiveMessage", (data) => {
            // console.log('receiveMessage', data);
            setMessageList(old => {
                const newArr = [...old];
                // newArr.unshift(data);
                newArr.push(data);
                newArr.sort((a, b) => (a.offset > b.offset) ? -1 : ((b.offset > a.offset) ? 1 : 0))

                return [...new Set(newArr)];
            });
        });
    }, []);

    const getAllTopics = () => {
        get({ url: "/kafka-admin/topics-list", dispatch }).then(({ data: list }) => {
            const topic = Object.keys(list[1]['metadata'])[0];
            setActiveTopic(topic);
            console.log(list)
            console.log(list[1])
            setTopicList(list[1]['metadata']);
            dispatch({ type: 'UPDATE_TOPICS', payload: list[1]['metadata'] });
            // dispatch({ type: 'UPDATE_LOADING_STATUS', payload: false });

            // setTimeout(
            //     () => {
            //         console.log('enter timeout.....', selectedTopics)
            //         if (Object.keys(localStorageGet('selectedTopics')).length > 0) {
            //             const [key] = Object.keys(localStorageGet('selectedTopics'));
            //             getMessage({ topic: key, partition: Object.keys(localStorageGet('selectedTopics')[key]).length });
            //         }
            //     },
            //     900
            // );

        });
    }

    const deleteTopic = ({ topic }) => {
        // console.log(topic.topic, '...topic');
        get({ url: `/kafka-admin/delete-topics/${topic}`, dispatch }).then(({ data }) => {

        });
    }

    const openNotificationWithIcon = type => {
        notification[type]({
            message: 'Notification Title',
            description:
                'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        });
    };

    const getMessage = ({ topic, partition }) => {
        console.log(topic, partition, '.....messahe');
        // const { [activeTopic]: { partitionOld = 0 } } = topicList;
        const data = {
            add: { topic, partition },
            // leave: { topicOld: activeTopic, partitionOld: partitionOld }
        };

        if (topic === activeTopic) {
            data.leave = {};
        }

        post({ url: `/kafka-admin/get-message`, data, dispatch }).then(({ data: list }) => {
            console.log(list, '.....messahe');
            setMessageList([]);
            setActiveTopic(topic);
            setLoadMessage(false);
            // console.log(list[1])
            // setTopicList(list[1]['metadata']);
        });
    }

    const sendMessage = ({ topic, partition }) => {
        setShowSendMessage(true);
    }

    const hideModel = () => {
        console.log('hideModel2');
        setShowSendMessage(false);
    }

    const genExtra = (tag) => (
        <Tag color="#87d068">
            <b>P{tag}</b>
        </Tag>
    );


    const getRandomColor = () => {
        const colorArr = ['magenta', "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];
        colorArr.sort(() => .5 - Math.random());
        return colorArr[0];
    }

    const getColor = (key) => {
        const colorArr = { leader: "green", replicas: 'blue', isr: 'volcano' };
        return colorArr[key];
    }

    function topicChanged(key) {
        console.log('topicChanged  call');
        setDefaultActiveTopic(key);
        console.log(key, selectedTopics[key], Object.keys(selectedTopics[key]), '.........key');
        const partition = Object.keys(selectedTopics[key]).length;
        getMessage({ topic: key, partition });
    }

    const partitionDetails = (partitionData) => {
        const data = partitionData;
        delete data.topic;
        delete data.partition;
        return (
            <div>
                {Object.keys(partitionData).map((tag, tagIndex) => (
                    <div style={{ marginTop: '10px' }}>
                        <span style={{ marginRight: '15px' }}><b>{tag.toUpperCase()} : </b></span>
                        {Array.isArray(partitionData[tag]) ?
                            partitionData[tag].map((val) => (
                                <Tag style={{ width: '60px', fontSize: '16px', float: 'right', textAlign: 'center' }} key={val} color={getColor(tag)}>
                                    <b>{val}</b>
                                </Tag>)) :
                            <Tag style={{ width: '60px', fontSize: '16px', float: 'right', textAlign: 'center' }} key={partitionData[tag]} color={getColor(tag)}>
                                <b>{partitionData[tag]}</b>
                            </Tag>
                        }
                    </div>))}
            </div>
        )
    };

    const printJson = (msg) => {
        try {
            const data = JSON.stringify(JSON.parse(msg.value), null, 2);
            msg.value = data;
            return JSON.stringify(JSON.parse(data), null, 2);
        } catch (err) {
            return JSON.stringify(msg, null, 2);
        }
    }

    const messageHeaderText = (msg) => {
        try {
            JSON.parse(msg.value);
            const data = { ...msg };
            data.value = '...';
            return JSON.stringify(data, null, 2);
        } catch (err) {
            return JSON.stringify(msg, null, 2);
        }
    }

    const topicRemove = (key) => {
        console.log('topicRemove.....', key)
    }

    console.log(defaultActiveTopic, '....defaultActiveTopic');
    return (
        <div style={{ padding: '30px' }} >

            {Object.keys(selectedTopics).length === 0 && <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                    height: 60,
                }}
                description={
                    <span>
                        <h3>You don't have active topics. You can Select your topic or Create new topic</h3>
                    </span>
                }
            >
                <Button type="primary">Select Topics</Button>
            </Empty>}

            {Object.keys(selectedTopics).length > 0 && <Tabs tabPosition="left"
                onChange={topicChanged}
                activeKey={defaultActiveTopic}
                onEdit={topicRemove}
            >
                {Object.keys(selectedTopics).map((item, index) => (
                    <TabPane tab={item.toUpperCase()} key={item}>

                        {/* <Button
                        type="danger"
                        onClick={() => deleteTopic(selectedTopics[item][0])}
                        shape="circle" icon={<DeleteOutlined />}
                        style={{ marginLeft: '10px', float: 'right' }}
                    />

                    <Button
                        type="primary"
                        onClick={() => setShowSendMessage(true)}
                        shape="circle" icon={<SendOutlined />}
                        style={{ marginLeft: '10px', float: 'right' }}
                    />

                    <Button
                        type="primary"
                        onClick={() => getMessage(selectedTopics[item][0])}
                        shape="circle" icon={<ReloadOutlined />}
                        style={{ marginLeft: '10px', float: 'right' }}
                    /> */}

                        {/* <Button style={{ marginLeft: '10px', float: 'right' }}
                            onClick={() => deleteTopic(selectedTopics[item][0])}
                            type="danger" ghost icon={<DeleteOutlined />}>
                            Delete Topic
                    </Button> */}
                        <Button type="primary" icon={<SendOutlined />} onClick={() => setShowSendMessage(true)}
                            style={{ float: 'right', marginLeft: '10px' }}>
                            New Message
                    </Button>
                        <Button type="primary" icon={<ReloadOutlined />} onClick={() => topicChanged(item)}
                            style={{ float: 'right' }}>
                            Refresh
                    </Button>

                        <Text keyboard style={{ marginRight: '20px' }}><b>Topic : {activeTopic}</b></Text>
                        {selectedTopics && Object.keys(selectedTopics[item]).map((tag, tagIndex) =>
                            (<Popover placement="bottom" content={() => partitionDetails(selectedTopics[item][tag])} title="Partition details">
                                <Tag key={tagIndex} color="#87d068">
                                    <b>Partition {tag}</b>
                                </Tag></Popover>)
                        )}

                        <div style={{ marginTop: '25px', height: '800px', overflow: 'scroll' }}>
                            {!messageList.length &&
                                <>
                                    <h1 style={{ textAlign: 'center' }}>
                                        {
                                            loadMessage ?
                                                <>
                                                    <SyncOutlined spin /> We are fetching data from Kafka!
                                                    <Skeleton loading={true} active /><Skeleton loading={true} active />
                                                    <Skeleton loading={true} active /><Skeleton loading={true} active />
                                                    <Skeleton loading={true} active /><Skeleton loading={true} active />
                                                </>
                                                : <>
                                                    <Result
                                                        status="success"
                                                        title="Successfully Connect from Kafka!"
                                                        subTitle="Whenever new message will broadcast in this topic. List automatically show your message"
                                                    // extra={[
                                                    //     <Button type="primary" key="console">
                                                    //         Go Console
                                                    //     </Button>,
                                                    //     <Button key="buy">Buy Again</Button>,
                                                    // ]}
                                                    />
                                                </>
                                        }
                                    </h1>
                                </>
                            }
                            {(messageList.length !== 0) && <Collapse defaultActiveKey={['1']} >
                                {messageList.map((msg, tagIndex) => (
                                    <Panel header={messageHeaderText(msg)} key={tagIndex + 1} extra={genExtra(msg.partition)}>
                                        <pre>{printJson(msg)}</pre>
                                    </Panel>
                                ))}
                            </Collapse>}
                        </div>
                    </TabPane>
                ))}
            </Tabs>}

            <SendMessageUi
                showSendMessageUi={showSendMessage}
                selectedTopics={selectedTopics}
                activeTopic={activeTopic}
                setShowSendMessage={hideModel} />
        </div>
    );
}

export default Topic;
