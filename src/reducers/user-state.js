/*
 * @Author: wjy-mac
 * @Date: 2020-06-07 01:41:31
 * @LastEditors: wjy-mac
 * @LastEditTime: 2020-06-08 21:00:04
 * @Description: 用户是否登录
 */
const UPDATE_TARGET_LOGIN = 'scratch-gui/userstate/UPDATE_TARGET_LOGIN';
const UPDATE_TARGET_LOGINOUT = 'scratch-gui/userstate/UPDATE_TARGET_LOGINOUT';
import keyMirror from 'keymirror';

const UserState = keyMirror({
    NOT_LOGINED: null,
    LOGINED: null
});
const initialState = {
    error: null,
    userData: null,
    loginState: UserState.NOT_LOGINED
};
const getIsLogined = loginState => (
    loginState === UserState.LOGINED
);
const setLogined = function () {
  console.log(123123)
  console.log({
    type: UPDATE_TARGET_LOGIN,
    login: UserState.LOGINED
})
    return {
        type: UPDATE_TARGET_LOGIN,
        login: UserState.LOGINED
    };
};
const reducer = function (state = initialState, action) {
    if (action.type === UPDATE_TARGET_LOGIN)  console.log(action.type)
    switch (action.type) {
    case UPDATE_TARGET_LOGIN:
        return Object.assign({}, state, {
            loginState: action.login
        });
    case UPDATE_TARGET_LOGINOUT:
        return Object.assign({}, state, {
            loginState: action.login
        });
    default:
        return state;
    }

};

export {
    reducer as default,
    initialState as userStateInitialState,
    getIsLogined,
    setLogined
};
