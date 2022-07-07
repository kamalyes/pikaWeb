import {
  deleteUsers,
  listUserActivities,
  listUserOperationLog,
  listUsers,
  loginGithub,
  queryCurrent,
  queryFollowTestPlanData,
  queryUserStatistics,
  updateAvatar,
  updateUsers
} from '@/services/user';
import {history} from 'umi';
import {getPageQuery} from "@/utils/utils";
import {message} from "antd";
import auth from "@/utils/auth";
import {stringify} from "querystring";

// const client_id = `c46c7ae33442d13498cd`;
// const key = `c79fafe58ff45f6b5b51ddde70d2d645209e38b9`;

const getUserMap = data => {
  const temp = {}
  const userNameMap = {}
  data.forEach(item => {
    temp[item.id] = item
    userNameMap[item.id] = item.username
  })
  return {userMap: temp, userNameMap};
}

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userList: [],
    currentUserList: [],
    userMap: {},
    userNameMap: {},
    // 用户活动轨迹数据
    activities: [],
    operationLog: [],
    project_count: 0,
    case_count: 0,
    user_rank: 0,
    total_user: 0,
    weekly_case: [],
    // 关注的测试计划数据
    followPlan: [],
  },
  effects: {
    // * fetch(_, {call, put}) {
    //   const token = localStorage.getItem("pikaToken")
    //   const response = yield call(queryCurrent, {token});
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },

    * fetchUserActivities({payload}, {call, put}) {
      const res = yield call(listUserActivities, payload);
      yield put({
        type: 'save',
        payload: {
          activities: res.data,
        }
      })
    },

    * fetchUserRecord({payload}, {call, put}) {
      const res = yield call(listUserOperationLog, payload);
      yield put({
        type: 'save',
        payload: {
          operationLog: res.data,
        }
      })
    },

    * updateUser({payload}, {call, put}) {
      const response = yield call(updateUsers, payload);
      return auth.response(response, true);
    },

    * deleteUser({payload}, {call, put}) {
      const response = yield call(deleteUsers, payload);
      return auth.response(response, true);
    },

    * fetchUserList(_, {call, put}) {
      const response = yield call(listUsers);
      const {userMap, userNameMap} = getUserMap(response);
      yield put({
        type: 'save',
        payload: {
          userList: response,
          currentUserList: response,
          userMap,
          userNameMap
        },
      });
    },

    * getGithubToken({payload}, {call, put}) {
      const response = yield call(loginGithub, payload);
      if (response.code === 200) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        yield put({
          type: 'login/changeLoginStatus',
          payload: response,
        }); // Login successfully
        yield put({
          type: 'fetchCurrent',
        })
        let {redirect} = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      } else {
        message.error(response.detail);
      }

    },

    * avatar({payload}, {call, put}) {
      const res = yield call(updateAvatar, payload)
      const pikaUser = localStorage.getItem("pikaUser")
      const info = JSON.parse(pikaUser)
      info.avatar = res.data;
      localStorage.setItem("pikaUser", JSON.stringify(info))
      yield put({
        type: 'saveCurrentUser',
        payload: info,
      });
    },

    * queryUserStatistics(_, {call, put}) {
      const response = yield call(queryUserStatistics);
      yield put({
        type: 'save',
        payload: {
          project_count: response.data.project_count,
          case_count: response.data.case_count,
          user_rank: response.data.user_rank,
          total_user: response.data.total_user,
          weekly_case: response.data.weekly_case,

        },
      });
    },

    /**
     * 获取用户关注的测试计划执行数据
     * @param _
     * @param call
     * @param put
     * @returns {Generator<*, void, *>}
     */
    * queryFollowTestPlanData(_, {call, put}) {
      const response = yield call(queryFollowTestPlanData);
      yield put({
          type: 'save',
          payload: {
            followPlan: response.data,
          },
        });
    },


    * fetchCurrent(_, {call, put}) {
      const token = localStorage.getItem("pikaToken")
      const emp_no = localStorage.getItem("pikaEmpNo")
      if (token === null || token === '') {
        history.push("/#/user/login");
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        return;
      }
      const response = yield call(queryCurrent, {token, emp_no});
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
      // if (auth.response(response)) {
      //   yield put({
      //     type: 'saveCurrentUser',
      //     payload: response.result,
      //   });
      // } else {
      //   localStorage.removeItem("pikaToken")
      //   localStorage.removeItem('pikaUser');
      //   localStorage.removeItem("pikaUserName")
      //   localStorage.removeItem("pikaEmpNo")
      //   history.push("/#/user/login");
      //   history.replace({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   });
      // }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },

    saveCurrentUser(state, action) {
      localStorage.setItem("pikaUser", JSON.stringify(action.payload || {}))
      return {...state, currentUser: action.payload || {}};
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
