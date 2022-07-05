import {Badge, Tag, Tooltip} from 'antd';
import {BellOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import {connect, history} from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import Version from "@/components/Drawer/Version";
// import wechat from '@/assets/wechat.png';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight = (props) => {
  const {theme, layout} = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const [visible, setVisible] = useState(false);
  const {noticeCount} = props.global;

  return (
    <div className={className}>
      <Version visible={visible} setVisible={setVisible}/>
      {/*<Tooltip title="联系作者">*/}
      {/*  <a*/}
      {/*    onClick={() => {*/}
      {/*      Modal.info({*/}
      {/*        title: '联系作者',*/}
      {/*        width: 600,*/}
      {/*        style: {*/}
      {/*          marginTop: -80,*/}
      {/*        },*/}
      {/*        bodyStyle: {*/}
      {/*          marginLeft: 0,*/}
      {/*        },*/}
      {/*        content: (*/}
      {/*          <div style={{textAlign: 'left'}}>*/}
      {/*            <img height={540} width={480} src={wechat} alt=""/>*/}
      {/*          </div>*/}
      {/*        )*/}
      {/*      })*/}
      {/*    }}*/}
      {/*    style={{*/}
      {/*      color: '#52c41a',*/}
      {/*    }}*/}
      {/*    className={styles.action}*/}
      {/*  >*/}
      {/*    <WechatOutlined style={{fontSize: 16}}/>*/}
      {/*  </a>*/}
      {/*</Tooltip>*/}
      <Tooltip title="消息中心">
        <a
          onClick={() => {
            history.push("/notification")
          }}
          style={{
            color: 'inherit',
          }}
          className={styles.action}
        >
          <Badge showZero={false} size="small" count={noticeCount}>
            <BellOutlined style={{fontSize: 16}}/>
          </Badge>
        </a>
      </Tooltip>
      <Tooltip title="使用文档">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://kamalyes.github.io/pikaDoc"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined style={{fontSize: 16}}/>
        </a>
      </Tooltip>
      <Avatar menu/>
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </div>
  );
};

export default connect(({settings, global}) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  global,
}))(GlobalHeaderRight);
