import { QuestionCircleFilled } from '@ant-design/icons';


const TollTip = ({ style = {} }) => {
    return (<QuestionCircleFilled style={{ fontSize: '16px', color: '#08c', ...style }} />);
}

export {
    TollTip
};