import React, { useContext } from 'react';
import { store } from '../../redux/store.js';
import { Spin } from 'antd';

const Loading = (props) => {
    const globalState = useContext(store);
    const { state: { loading } } = globalState;
    return (
        <Spin size="large" tip="Loading..." spinning={loading}>
            {props.children}
        </Spin>
    );
};

export default Loading;