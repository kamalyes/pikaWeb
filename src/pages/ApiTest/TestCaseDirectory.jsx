import {PageContainer} from "@ant-design/pro-layout";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu as AMenu,
  message,
  Modal,
  Result,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
  TreeSelect
} from "antd";
import {connect} from "umi";
import React, {memo, useEffect, useState} from "react";
import SplitPane from 'react-split-pane';
import "./TestCaseDirectory.less";
import {
  CameraTwoTone,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RocketOutlined,
  SearchOutlined
} from "@ant-design/icons";
import 'react-contexify/dist/ReactContexify.css';
import NoRecord from "@/components/NotFound/NoRecord";
import FormForModal from "@/components/PikaForm/FormForModal";
import {IconFont} from "@/components/Icon/IconFont";
import {CONFIG} from "@/consts/config";
import TestResult from "@/components/TestCase/TestResult";
import UserLink from "@/components/Button/UserLink";
import noResult from "@/assets/no_data.svg";
import UserSelect from "@/components/User/UserSelect";
import SearchTree from "@/components/Tree/SearchTree";
import ScrollCard from "@/components/Scrollbar/ScrollCard";
import emptyWork from "@/assets/empty_work.svg";
import AddTestCaseComponent from "@/pages/ApiTest/AddTestCaseComponent";
import RecorderDrawer from "@/components/TestCase/recorder/RecorderDrawer";

const {Option} = Select;


const TestCaseDirectory = ({testcase, gconfig, project, user, loading, dispatch}) => {

  const {projects, project_id} = project;
  const {envList} = gconfig;
  const {userList, userMap} = user;
  const {directory, currentDirectory, testcases, testResult, selectedRowKeys, pagination} = testcase;
  const [currentNode, setCurrentNode] = useState(null);
  const [rootModal, setRootModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [record, setRecord] = useState({});
  const [modalTitle, setModalTitle] = useState('????????????');
  const [addCaseVisible, setAddCaseVisible] = useState(false);
  const [form] = Form.useForm();
  const [resultModal, setResultModal] = useState(false);
  const [name, setName] = useState('');
  const [moveModal, setMoveModal] = useState(false);
  const [recorderModal, setRecorderModal] = useState(false);
  const [selectTree, setSelectTree] = useState(null);

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      saveCase({
        selectedRowKeys
      })
    }
  };

  const execute = async (record, env) => {
    const result = await dispatch({
      type: 'testcase/executeTestcase',
      payload: {
        case_id: record.id,
        env,
      }
    })
    if (result) {
      setResultModal(true);
      setName(record.name);
    }
  };

  const onExecute = async env => {
    const res = await dispatch({
      type: 'testcase/executeSelectedCase',
      payload: {
        case_list: selectedRowKeys,
        env,
      }
    })
    Modal.confirm({
      title: '????????????????????????, ?????????????????????????????????????',
      icon: <QuestionCircleOutlined/>,
      onOk() {
        window.open(`/#/record/list`)
      },
      onCancel() {
      },
    });
  }

  const menu = record => (
    envList.length === 0 ?
      <Card>
        <div>
          <Empty image={noResult} imageStyle={{height: 90, width: 90, margin: '0 auto'}}
                 description={<p>?????????????????????, ???<a href="/#/config/environment" target="_blank">????????????</a>?</p>}/>
        </div>
      </Card> :
      <AMenu>
        {envList.map(item => <AMenu.Item key={item.id}>
          <a onClick={async () => {
            if (record) {
              await execute(record, item.id)
            } else {
              await onExecute(item.id)
            }
          }}>{item.name}</a>
        </AMenu.Item>)}
      </AMenu>
  );

  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 49,
    },
    {
      title: "??????",
      dataIndex: "name",
      key: 'name',
      // ????????????????????????
      ellipsis: true,
    },
    {
      title: "????????????",
      dataIndex: "request_type",
      key: 'request_type',
      render: request_type => CONFIG.REQUEST_TYPE[request_type]
    },
    {
      title: "?????????",
      dataIndex: "priority",
      key: 'priority',
      width: 90,
      render: priority => <Tag color={CONFIG.CASE_TAG[priority]}>{priority}</Tag>
    },
    {
      title: "??????",
      dataIndex: "status",
      key: 'status',
      width: 110,
      render: status => <Badge {...CONFIG.CASE_BADGE[status]} />
    },
    {
      title: "?????????",
      dataIndex: "create_emp_no",
      key: 'create_emp_no',
      width: 100,
      ellipsis: true,
      render: create_emp_no => <UserLink user={userMap[create_emp_no]}/>
    },
    {
      title: "????????????",
      dataIndex: "update_date",
      key: 'update_date',
      width: 160,
    },
    {
      title: '??????',
      dataIndex: 'ops',
      width: 130,
      key: 'ops',
      render: (_, record) => <>
        <a href={`/#/apiTest/testcase/${currentDirectory[0]}/${record.id}`} target="_blank">??????</a>
        <Divider type="vertical"/>
        <Dropdown overlay={menu(record)}>
          <a onClick={e => {
            e.stopPropagation();
          }}>?????? <DownOutlined/></a>
        </Dropdown>
      </>
    }
  ]

  const listProjects = () => {
    dispatch({
      type: 'project/listProject',
    })
  }

  const listTestcaseTree = () => {
    if (project_id) {
      dispatch({
        type: 'testcase/listTestcaseDirectory',
        payload: {project_id, move: true}
      })
    }
  }

  const queryAllUser = () => {
    dispatch({
      type: 'user/fetchUserList'
    })
  }

  const listEnv = () => {
    dispatch({
      type: 'gconfig/fetchEnvList'
    })
  }

  const listTestcase = async () => {
    const values = await form.getFieldsValue();
    if (currentDirectory.length > 0) {
      dispatch({
        type: 'testcase/listTestcase',
        payload: {
          directory_id: currentDirectory[0],
          name: values.name || '',
          create_emp_no: values.create_emp_no !== null && values.create_emp_no !== undefined ? values.create_emp_no : '',
          request_type: values.request_type || '',
          priority: values.priority || '',
          status: values.status || '',
        },
      })
    }
  }

  useEffect(() => {
    listProjects();
    queryAllUser();
    listEnv();
  }, [])

  useEffect(() => {
    listTestcaseTree();
  }, [project_id])

  useEffect(async () => {
    await listTestcase();
  }, [currentDirectory])

  const save = data => {
    dispatch({
      type: 'project/save',
      payload: data,
    })
    dispatch({
      type: 'testcase/save',
      payload: {currentDirectory: []}
    })
    // ?????????id??????localStorage
    localStorage.setItem("project_id", data.project_id)
  }

  const saveCase = data => {
    dispatch({
      type: 'testcase/save',
      payload: data,
    })
  }

  const onCreateDirectory = async values => {
    const params = {
      name: values.name,
      project_id,
      parent: currentNode,
    }
    let result;
    if (record.id) {
      result = await dispatch({
        type: 'testcase/updateTestcaseDirectory',
        payload: {...params, id: record.id},
      })
    } else {
      result = await dispatch({
        type: 'testcase/insertTestcaseDirectory',
        payload: params,
      })
    }
    if (result) {
      setRootModal(false);
      saveCase({
        selectedRowKeys: []
      })
      listTestcaseTree();
    }
  }

  const onMove = async () => {
    // console.log(values,'valuessssss')
    const res = await dispatch({
      type: 'testcase/moveTestCaseToDirectory',
      payload: {
        id_list: selectedRowKeys,
        // directory_id: values.directory_id,
        directory_id: selectTree.key,
        project_id,
      },
    })
    if (res) {
      setMoveModal(false);
      saveCase({
        selectedRowKeys: []
      })
      listTestcase();
    }
  }

  const onDeleteDirectory = async key => {
    const res = await dispatch({
      type: 'testcase/deleteTestcaseDirectory',
      payload: {id: key},
    })
    if (res) {
      listTestcaseTree();
    }
  }

  const onDeleteTestcase = async () => {
    const res = await dispatch({
      type: 'testcase/deleteTestcase',
      payload: selectedRowKeys,
    })
    if (res) {
      listTestcase();
    }
  }

  const onMoveTestCase = () => {
    setMoveModal(true);
  }

  const handleItemClick = (key, node) => {
    if (key === 1) {
      // ????????????
      setCurrentNode(node.key)
      setModalTitle("????????????");
      setRecord({name: ''})
      setRootModal(true)
    } else if (key === 2) {
      setRecord({name: node.title.props.children[2], id: node.key});
      setModalTitle("????????????");
      setRootModal(true)
    } else if (key === 3) {
      Modal.confirm({
        title: '??????????????????????????????????',
        icon: <ExclamationCircleOutlined/>,
        content: '????????????????????????case???????????????????????????',
        okText: '??????',
        okType: 'danger',
        cancelText: '?????????',
        onOk() {
          onDeleteDirectory(node.key);
        },
      });
    }
  };

  const fields = [
    {
      name: 'name',
      label: '????????????',
      required: true,
      placeholder: "?????????????????????, ?????????18?????????",
      type: 'input',
    }
  ];
  const moveFields = [
    {
      name: 'directory_id',
      label: '????????????',
      required: true,
      placeholder: "??????????????????????????????",
      type: 'select',
      component: <TreeSelect onSelect={(value, node) => {
        setSelectTree(node)
      }}
                             treeData={directory} showSearch/>
    }
  ]
  const getProject = () => {
    if (projects.length === 0) {
      return 'loading...'
    }
    const filter_project = projects.filter(p => p.id === project_id)
    if (filter_project.length === 0) {
      save({project_id: projects[0].id})
      return projects[0]
    }
    return filter_project[0]
  }

  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };

  // menu
  const content = node => <AMenu>
    <AMenu.Item key="1">
      <a onClick={e => {
        e.stopPropagation();
        handleItemClick(2, node)
      }}><EditOutlined/> ????????????</a>
    </AMenu.Item>
    <AMenu.Item key="2" danger>
      <a onClick={e => {
        e.stopPropagation();
        handleItemClick(3, node)
      }}><DeleteOutlined/> ????????????</a>
    </AMenu.Item>
  </AMenu>

  const AddDirectory = <Tooltip title="????????????????????????, ??????????????????????????????">
    <a className="directoryButton" onClick={() => {
      setRootModal(true)
      setRecord({name: ''})
      setModalTitle("???????????????");
      setCurrentNode(null);
    }}>
      <PlusOutlined/>
    </a>
  </Tooltip>

  const onAddTestCase = () => {
    if (!currentDirectory[0]) {
      message.info("?????????????????????????????????~")
      return;
    }
    setAddCaseVisible(true)
    dispatch({
      type: 'testcase/save',
      payload: {
        asserts: [],
        postConstructor: [],
        preConstructor: [],
        outParameters: [{key: 0, source: 1}],
        caseInfo: {},
        testData: {},
      }
    })
  }

  const AddCaseMenu = <AMenu>
    <AMenu.Item key="1">
      <a onClick={() => {
        onAddTestCase()
      }}><RocketOutlined/> ????????????</a>
    </AMenu.Item>
    <AMenu.Item key="2">
      <a onClick={() => setRecorderModal(true)}><CameraTwoTone/> ????????????<Tag color="red" style={{
        fontSize: 12,
        margin: '0 4px',
        lineHeight: '12px',
        padding: 2
      }}>???</Tag></a>
    </AMenu.Item>
  </AMenu>

  return (
    <PageContainer title={false} breadcrumb={null} style={{margin: -8}}>
      <TestResult width={1000} modal={resultModal} setModal={setResultModal} response={testResult}
                  caseName={name} single={false}/>
      <FormForModal title="????????????" onCancel={() => setMoveModal(false)}
                    fields={moveFields} onFinish={onMove}
                    visible={moveModal} left={6} right={18} width={500} formName="move"/>
      {
        projects.length === 0 ? <Result status="404"
                                        subTitle={<span>??????????????????????????????, <a target="_blank"
                                                                       href="/#/project">????????????</a>???????????????Case</span>}/> :

          <Row gutter={16}>
            <FormForModal title={modalTitle} onCancel={() => setRootModal(false)}
                          fields={fields} onFinish={onCreateDirectory} record={record}
                          visible={rootModal} left={6} right={18} width={400} formName="root"/>
            <Drawer bodyStyle={{padding: 0}} visible={addCaseVisible} width={1300} title="????????????"
                    onClose={() => setAddCaseVisible(false)} maskClosable={false}>
              <AddTestCaseComponent listTestcase={listTestcase} directory_id={currentDirectory[0]}
                                    setAddCaseVisible={setAddCaseVisible}/>
            </Drawer>
            <RecorderDrawer directory={directory} visible={recorderModal} setVisible={setRecorderModal}/>
            <SplitPane className="pikaSplit" split="vertical" minSize={260} defaultSize={300} maxSize={800}>
              <ScrollCard className="card" hideOverflowX bodyPadding={12}>
                <Row gutter={8}>
                  <Col span={24}>
                    <div style={{height: 40, lineHeight: '40px'}}>
                      {
                        // editing ? <Select style={{marginLeft: 32, width: 150}} showSearch allowClear
                        editing ? <Select style={{marginLeft: 32, width: 150}} showSearch
                                          placeholder="???????????????" value={project_id} autoFocus={true}
                                          onChange={e => {
                                            if (e !== undefined) {
                                              save({project_id: e})
                                            }
                                          }}
                                          onSelect={e => {
                                            setEditing(false)
                                          }}
                                          onBlur={e => {
                                            setEditing(false)
                                          }}
                                          filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                          }>
                            {projects.map(v => <Option value={v.id}>{v.name}</Option>)}
                          </Select> :
                          <div onClick={() => setEditing(true)}>
                            <Avatar style={{marginLeft: 8, marginRight: 6}} size="large"
                                    src={getProject().avatar || `https://api.prodless.com/avatar.png`}/>
                            <span style={{
                              display: 'inline-block',
                              marginLeft: 12,
                              fontWeight: 400,
                              fontSize: 14
                            }}>{getProject().name}</span>
                            <IconFont type="icon-qiehuan2" style={{
                              display: 'inline-block',
                              cursor: 'pointer',
                              fontSize: 16,
                              marginLeft: 16,
                              lineHeight: '40px'
                            }}/>
                          </div>
                      }
                    </div>
                  </Col>
                </Row>
                <div style={{marginTop: 24}}>
                  <Spin spinning={loading.effects['testcase/listTestcaseDirectory']}>
                    {directory.length > 0 ?
                      <>
                        <SearchTree treeData={directory} menu={content}
                                    addDirectory={AddDirectory}
                                    onSelect={keys => {
                                      saveCase({currentDirectory: keys[0] === currentDirectory[0] ? [] : keys})
                                    }} onAddNode={node => {
                          setCurrentNode(node.key)
                          handleItemClick(1, node)
                        }} selectedKeys={currentDirectory}
                        />
                      </> : <NoRecord height={180} desc={<div>
                        ??????????????????<a onClick={() => {
                        setRootModal(true)
                        setRecord({name: ''})
                        setModalTitle("???????????????");
                        setCurrentNode(null);
                      }}>??????</a>?????????~
                      </div>}/>
                    }
                  </Spin>
                </div>
              </ScrollCard>
              <ScrollCard className="card" hideOverflowX>
                {
                  currentDirectory.length > 0 ? <>
                    <Form form={form}>
                      <Row gutter={6}>
                        <Col span={8}>
                          <Form.Item label="????????????"  {...layout} name="name">
                            <Input placeholder="??????????????????"/>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="????????????"  {...layout} name="request_type">
                            <Input placeholder="??????????????????"/>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="?????????"  {...layout} name="priority">
                            <Input placeholder="??????????????????"/>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="??????"  {...layout} name="status">
                            <Input placeholder="????????????"/>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="?????????"  {...layout} name="create_emp_no">
                            <UserSelect users={userList} placeholder="?????????????????????"/>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <div style={{float: 'right'}}>
                            <Button type="primary" onClick={async () => {
                              await listTestcase();
                            }}><SearchOutlined/> ??????</Button>
                            <Button style={{marginLeft: 8}} onClick={async () => {
                              form.resetFields();
                              await listTestcase();
                            }}><ReloadOutlined/> ??????</Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                    <Row gutter={8} style={{marginTop: 4}}>
                      <Col span={24}>
                        <Dropdown overlay={AddCaseMenu} trigger="click">
                          <Button type="primary"><PlusOutlined/> ????????????</Button>
                        </Dropdown>
                        {selectedRowKeys.length > 0 ?
                          <Dropdown overlay={menu()} trigger={['hover']}>
                            <Button style={{marginLeft: 8}} icon={<PlayCircleOutlined/>} onClick={(e) => {
                              e.stopPropagation()
                            }}>???????????? <DownOutlined/></Button>
                          </Dropdown>
                          : null}
                        {selectedRowKeys.length > 0 ?
                          <Button type="primary" danger style={{marginLeft: 8}} icon={<DeleteOutlined/>}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteTestcase();
                                  }}>????????????</Button>
                          : null}
                        {selectedRowKeys.length > 0 ?
                          <Button type="dashed" style={{marginLeft: 8}} icon={<ExportOutlined/>}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onMoveTestCase();
                                  }}>????????????</Button>
                          : null}
                      </Col>
                    </Row>
                    <Row style={{marginTop: 16}}>
                      <Col span={24}>
                        <Table columns={columns} rowKey={record => record.id} rowSelection={rowSelection}
                               pagination={pagination}
                               bordered
                               onChange={pg => {
                                 saveCase({pagination: {...pagination, current: pg.current}})
                               }}
                               dataSource={testcases}
                               loading={loading.effects['testcase/listTestcase'] || loading.effects['testcase/executeTestcase']}/>
                      </Col>
                    </Row>
                  </> : <Empty image={emptyWork} imageStyle={{height: 230}}
                               description="?????????????????????????????????????????????~"/>
                }
              </ScrollCard>
            </SplitPane>
          </Row>
      }
    </PageContainer>
  )
}

export default connect(({testcase, gconfig, project, user, loading}) => ({
  loading,
  gconfig,
  user,
  project,
  testcase,
}))(memo(TestCaseDirectory))
