import {PageContainer} from "@ant-design/pro-layout";
import {connect, useParams} from 'umi';
import React, {useEffect, useState} from "react";
import {Badge, Button, Card, Col, Descriptions, Dropdown, Empty, Form, Menu, Row, Spin, Tag, Tooltip} from "antd";
import TestCaseEditor from "@/components/TestCase/TestCaseEditor";
import TestResult from "@/components/TestCase/TestResult";
import {CONFIG} from "@/consts/config";
import {IconFont} from "@/components/Icon/IconFont";
import ConstructorModal from "@/components/TestCase/ConstructorModal";
import "./TestCaseComponent.less";
import {DownOutlined, EditOutlined, PlayCircleOutlined} from "@ant-design/icons";
import common from "@/utils/common";
import auth from "@/utils/auth";
import UserLink from "@/components/Button/UserLink";
import TestCaseBottom from "@/components/TestCase/TestCaseBottom";
import noResult from '@/assets/no_data.svg';
import NoPermission from '@/assets/no_permission.svg';


const TestCaseComponent = ({loading, dispatch, user, testcase, gconfig}) => {
  const params = useParams();
  const directory_id = params.directory;
  const {case_id} = params;
  const {
    directoryName,
    caseInfo,
    outParameters,
    editing,
    casePermission,
    constructRecord,
    constructorModal,
  } = testcase;
  const {envList} = gconfig;
  const {userMap} = user;
  const [resultModal, setResultModal] = useState(false);
  const [testResult, setTestResult] = useState({});
  const [form] = Form.useForm();
  const [constructorForm] = Form.useForm();
  const [body, setBody] = useState('');
  const [bodyType, setBodyType] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [formData, setFormData] = useState([]);
  const [suffix, setSuffix] = useState(false);

  const fetchTestCaseInfo = () => {
    if (case_id) {
      dispatch({
        type: 'testcase/queryTestcase',
        payload: {
          caseId: case_id,
        }
      })
    }
  }

  useEffect(() => {
    dispatch({
      type: 'testcase/queryTestcaseDirectory',
      payload: {
        directory_id,
      }
    })

    // ??????????????????
    dispatch({
      type: 'gconfig/fetchEnvList',
      payload: {
        page: 1,
        size: 1000,
        exactly: true // ????????????
      }
    })

    dispatch({
      type: 'user/fetchUserList'
    })

    fetchTestCaseInfo();

  }, [])

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(caseInfo);
    setHeaders(common.parseHeaders(caseInfo.request_headers))
    setBody(caseInfo.body);
    setBodyType(caseInfo.body_type)
  }, [caseInfo, editing])


  const load = !!(loading.effects['testcase/queryTestcaseDirectory']
    || loading.effects['testcase/queryTestcase']
    || loading.effects['testcase/fetchUserList'])

  const getTag = tag => {
    if (tag === null) {
      return '???'
    }
    if (typeof tag === 'object') {
      return tag.length > 0 ? tag.map(v => <Tag
        style={{marginRight: 8}}
        color='blue'>{v}</Tag>) : '???'
    }
    return tag ? tag.split(',').map(v => <Tag
      style={{marginRight: 8}}
      color='blue'>{v}</Tag>) : '???'
  }

  const filterOutParameters = () => {
    return outParameters.filter(v => {
      if (v.id) {
        return true;
      }
      if (v.source === 4) {
        return v.name;
      }
      return v.match_index && v.name && v.expression;
    })

  }

  const onSubmit = async (isCreate = false) => {
    const values = await form.validateFields()
    const params = {
      ...values,
      request_type: parseInt(values.request_type, 10),
      status: parseInt(values.status, 10),
      tag: values.tag ? values.tag.join(',') : null,
      directory_id,
      body_type: bodyType,
      request_headers: common.translateHeaders(headers),
      body: bodyType === 2 ? JSON.stringify(formData) : body,
      out_parameters: filterOutParameters(),
    };
    if (!editing && !isCreate) {
      params.priority = caseInfo.priority;
      params.name = caseInfo.name;
      params.status = caseInfo.status;
      params.tag = caseInfo.tag !== null ? typeof caseInfo.tag === 'object' ?
        caseInfo.tag.join(',') : caseInfo.tag ? caseInfo.tag : null : null;
      params.request_type = caseInfo.request_type;
    }
    if (caseInfo.id) {
      // ???????????????case
      params.id = caseInfo.id;
      dispatch({
        type: 'testcase/updateTestcase',
        payload: params,
      })
    } else {
      // ???????????????Case
      dispatch({
        type: 'testcase/insertTestcase',
        payload: params,
      })
    }
  }

  // ??????????????????
  const onExecuteTestCase = async env => {
    const res = await dispatch({
      type: 'testcase/onExecuteTestCase',
      payload: {case_id, env}
    })
    if (res.code===200) {
      setResultModal(true);
      setTestResult(res.data);
    }
  }

  const menu = envList.length === 0 ? <Card>
    <div>
      <Empty image={noResult} imageStyle={{height: 90, width: 90, margin: '0 auto'}}
             description={<p>?????????????????????, ???<a href="/#/config/environment" target="_blank">????????????</a>?</p>}/>
    </div>

  </Card> : <Menu>
    {envList.map(item => <Menu.Item key={item.id} onClick={async () => {
      await onExecuteTestCase(item.id)
    }}>
      <a>{item.name}</a>
    </Menu.Item>)}
  </Menu>

  const getTagArray = () => {
    if (caseInfo.tag === null || caseInfo.tag === "") {
      return []
    }
    if (typeof caseInfo.tag === 'object') {
      return caseInfo.tag;
    }
    return caseInfo.tag.split(",")


  }

  return (
    <PageContainer title={false} breadcrumb={null}>

      <TestResult width={1000} modal={resultModal} setModal={setResultModal} response={testResult}
                  caseName={caseInfo.name} single={false}/>

      <Spin spinning={load} tip="???????????????" indicator={<IconFont type="icon-loading1" spin style={{fontSize: 32}}/>}
            size="large">
        {
          !case_id ? <TestCaseEditor directoryId={directory_id} create={true} form={form} body={body} setBody={setBody}
                                     headers={headers} setHeaders={setHeaders} onSubmit={onSubmit}
                                     setBodyType={setBodyType} bodyType={bodyType}
            /> :

            casePermission ? <Row>
              <Col span={24}>
                <ConstructorModal width={1050} modal={constructorModal} setModal={e => {
                  dispatch({type: 'testcase/save', payload: {constructorModal: e}})
                }} caseId={case_id} form={constructorForm} record={constructRecord}
                                  fetchData={fetchTestCaseInfo} suffix={suffix}/>
                {
                  editing ? <TestCaseEditor directoryId={directory_id} form={form} body={body} setBody={setBody}
                                            caseId={case_id} formData={formData} setFormData={setFormData}
                                            bodyType={bodyType} setBodyType={setBodyType} setSuffix={setSuffix}
                                            headers={headers} setHeaders={setHeaders} onSubmit={onSubmit}/> :
                    <Card style={{margin: -8}} bodyStyle={{padding: 24}} size="small" title={
                      <span>{directoryName} {caseInfo.name ? ` / ${caseInfo.name}` : ''} {CONFIG.CASE_TYPE[caseInfo.case_type]}</span>}
                          extra={<div>
                            <Button onClick={() => {
                              dispatch({
                                type: 'testcase/save',
                                payload: {
                                  editing: true,
                                  caseInfo: {
                                    ...caseInfo,
                                    status: caseInfo.status.toString(),
                                    request_type: caseInfo.request_type.toString(),
                                    tag: getTagArray()
                                  },
                                  activeKey: '3',
                                }
                              })
                            }} style={{borderRadius: 16}}><EditOutlined/> ??????</Button>
                            <Dropdown overlay={menu}>
                              <Button type="primary" style={{marginLeft: 8, borderRadius: 16}}
                                      loading={loading.effects['testcase/onExecuteTestCase']}
                                      onClick={e => {
                                        e.stopPropagation()
                                      }}><PlayCircleOutlined/> ??????<DownOutlined/></Button>
                            </Dropdown>
                          </div>}>
                      <Descriptions column={4}>
                        <Descriptions.Item label='????????????'><a>{caseInfo.name}</a></Descriptions.Item>

                        <Descriptions.Item
                          label='????????????'>{CONFIG.REQUEST_TYPE[caseInfo.request_type]}</Descriptions.Item>
                        <Descriptions.Item label='??????url' span={2} style={{
                          fontSize: 14,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          <Tooltip title={caseInfo.url}>
                            <a href={caseInfo.url}>{caseInfo.url}</a>
                          </Tooltip>
                        </Descriptions.Item>
                        <Descriptions.Item label='????????????'>
                          {CONFIG.REQUEST_METHOD[caseInfo.request_method]}
                        </Descriptions.Item>
                        <Descriptions.Item label='????????????'>{<Tag
                          color={CONFIG.CASE_TAG[caseInfo.priority]}>{caseInfo.priority}</Tag>}</Descriptions.Item>
                        <Descriptions.Item label='????????????'>{
                          <Badge {...CONFIG.CASE_BADGE[caseInfo.status]} />}</Descriptions.Item>
                        <Descriptions.Item label='????????????'>{
                          <div style={{textAlign: 'center'}}>
                            {getTag(caseInfo.tag)}
                          </div>
                        }</Descriptions.Item>
                        <Descriptions.Item
                          label='?????????'><UserLink size={16} user={userMap[caseInfo.create_emp_no]}/></Descriptions.Item>
                        <Descriptions.Item
                          label='?????????'><UserLink size={16} user={userMap[caseInfo.update_emp_no]}/></Descriptions.Item>
                        <Descriptions.Item label='????????????'>{caseInfo.create_date}</Descriptions.Item>
                        <Descriptions.Item label='????????????'>{caseInfo.update_date}</Descriptions.Item>
                      </Descriptions>
                      <TestCaseBottom setSuffix={setSuffix} headers={headers} setHeaders={setHeaders}
                                      body={body} setBody={setBody} case_id={case_id} formData={formData}
                                      setFormData={setFormData} bodyType={bodyType} form={form}
                                      setBodyType={setBodyType} onSubmit={onSubmit}
                      />
                    </Card>
                }
              </Col>
            </Row> : <Empty description="?????????????????????????????????????????????????????????????????????" image={NoPermission} imageStyle={{height: 400}}/>
        }
      </Spin>


    </PageContainer>
  )
}

export default connect((
  {
    user, testcase, loading, gconfig
  }
) => (
  {
    testcase, user,  loading, gconfig
  }
))(TestCaseComponent);
