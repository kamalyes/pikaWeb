import { Dropdown, Input } from 'antd';
import Cron from 'react-cron-antd';

function CronInput(props) {
    const { value, onChange } = props;

    return (
        <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            overlay={<Cron value={value} onOk={onChange} />}
        >
            <Input.Search value={value} />
        </Dropdown>
    );
}

export default CronInput;
