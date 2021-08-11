import {
    notification
} from 'antd';


const openNotificationWithIcon = (type, message, title) => {
    notification[type]({
        message: title,
        description: message
    });
};

export {
    openNotificationWithIcon
};