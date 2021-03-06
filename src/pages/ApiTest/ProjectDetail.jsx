import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Avatar, Card, PageHeader, Tabs} from 'antd';
import {useParams} from 'umi';
import {queryProject} from '@/services/project';
import ProjectInfo from '@/components/Project/ProjectInfo';
import {queryAllUser} from '@/services/user';
import ProjectRole from '@/components/Project/ProjectRole';
import {CONFIG} from "@/consts/config";
import styles from "./Project.less";
import auth from "@/utils/auth";
import NoRecord from "@/components/NotFound/NoRecord";
import LoadingFailed from '@/assets/loading_failed.svg';

const {TabPane} = Tabs;


export default () => {
  const params = useParams();
  const projectId = params.id;
  const [projectData, setProjectData] = useState({});
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [roles, setRoles] = useState([]);
  const [authority, setAuthority] = useState(false);

  const fetchUsers = async () => {
    const res = await queryAllUser();
    setUsers(res);
    const temp = {}
    res.forEach(item => {
      temp[item.id] = item
    })
    setUserMap(temp)
  };

  const fetchData = async (projId = projectId) => {
    const res = await queryProject({projectId: projId});
    setAuthority(res.code !== 403);
    if (res.code ===200){
      setProjectData(res.data.project);
      setRoles(res.data.roles);
    }
  };

  useEffect(() => {
    fetchData()
    fetchUsers();
  }, []);


  return (
    authority ? <PageContainer breadcrumb={null} title={
      <PageHeader
        className={styles.sitePageHeader}
        onBack={() => {
          window.history.back();
        }}
        title={<span>
      <Avatar src={projectData.avatar || CONFIG.PROJECT_AVATAR_URL}/>{projectData.name}</span>}
      />
    }>
      <Card bodyStyle={{padding: '8px 18px'}}>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='ๆๅๅ่กจ' key='1'>
            <ProjectRole users={users} project={projectData} roles={roles} fetchData={fetchData}/>
          </TabPane>
          <TabPane tab='้กน็ฎ่ฎพ็ฝฎ' key='2'>
            <ProjectInfo data={projectData} users={users} reloadData={fetchData}/>
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer> : <NoRecord height={400} desc="ๅฏนไธ่ตท, ไฝ?ๆฒกๆๆ้่ฎฟ้ฎ่ฏฅ้กน็ฎ" image={LoadingFailed}/>
  );
};



