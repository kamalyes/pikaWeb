import React, {useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Form, Upload, Cascader} from 'antd';
import ProForm, {ProFormCascader, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import {connect} from 'umi';
import styles from './BaseView.less';
import city from '../../../../utils/cities'

const validatorPhone = (rule, value, callback) => {
  callback();
}; // 头像组件 方便以后独立，增加裁剪之类的功能

const AvatarView = ({avatar, dispatch}) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar"/>
    </div>
    <Upload showUploadList={false} customRequest={fileData => {
      dispatch({
        type: 'user/avatar',
        payload: {
          file: fileData.file,
        }
      })
    }} fileList={[]}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined/>
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView = ({user, loading, dispatch}) => {
  const {currentUser} = user;
  const [form] = Form.useForm();
  const [location,setLocation]=useState([]);
  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    }

    return '';
  };

  const handleFinish = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'user/updateUser',
      payload: {
        ...values,
        location:location.join(','),
      },
    })
    dispatch({
      type: 'user/fetchCurrent'
    })
  };
  const onChange = (value, selectedOptions) => {
    setLocation(value);
    console.log(value, selectedOptions);
  }

  const filter = (inputValue, path) => {
    return path.some(option => option.label.indexOf(inputValue) > -1);
  }

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{...currentUser, mobile: currentUser?.mobile}}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="username"
                label="用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的用户名!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="mobile"
                label="手机号"
                placeholder="输入手机号后可接收钉钉/企业微信通知哦"
                rules={[
                  {
                    required: false,
                    message: '请输入您的手机号!',
                  },
                  {
                    validator: validatorPhone,
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="plane"
                label="座机"
              />
              <ProFormText
                width="md"
                name="user_alias"
                label="用户花名"
              />
              <ProFormSelect
                width="md"
                name="gender"
                label="性别"
                options={[
                  {label: '未知', value: 0},
                  {label: '男', value: 1},
                  {label: '女', value: 2},
                ]}
                fieldProps={{
                  optionItemRender(item) {
                    return item.label;
                  },
                }}
                placeholder="请选择您的性别!"
                rules={[{required: true, message: '请选择您的性别!'}]}
              />
              <Cascader
                style={{ width: '100%', marginBottom: '20px'}}
                name="location"
                label="所在城市名称"
                options={city}
                onChange={onChange}
                placeholder="请选择省市区籍贯"
                showSearch={filter}
                defaultValue={currentUser.location.split(',')}
              />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} dispatch={dispatch}/>
          </div>
        </>
      )}
    </div>
  );
};

export default connect(({user}) => ({user}))(BaseView);
