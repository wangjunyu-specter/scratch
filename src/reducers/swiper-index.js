/*
 * @Author: wjy-mac
 * @Date: 2020-06-10 00:28:08
 * @LastEditors: wjy-mac
 * @LastEditTime: 2020-06-27 17:31:20
 * @Description: 任务swiper 当前序号
 */
const TASK_SWIPER_INDEX_ADD = 'scratch-gui/task_swiper_index/add';
const TASK_SWIPER_INDEX_REDUCE = 'scratch-gui/task_swiper_index/TASK_SWIPER_INDEX_REDUCE';
const TASK_SWIPER_INDEX = 'taskSwiperIndex';

const initialState = {
    [TASK_SWIPER_INDEX]: 0
};
const setSwiperIndexAdd = function () {
    return {
        type: TASK_SWIPER_INDEX_ADD,
        modal: TASK_SWIPER_INDEX
    };
};
const setSwiperIndexReduce = function () {
    return {
        type: TASK_SWIPER_INDEX_REDUCE,
        modal: TASK_SWIPER_INDEX
    };
};
const reducer = function (state = initialState, action) {
    switch (action.type) {
    case TASK_SWIPER_INDEX_ADD:
        return Object.assign({}, state, {
            [action.modal]: state[action.modal] - 1
        });
    case TASK_SWIPER_INDEX_REDUCE:
        return Object.assign({}, state, {
            [action.modal]: state[action.modal] + 1
        });
    default:
        return state;
    }

};

export {
    reducer as default,
    initialState as taskSwiperIndexInitialState,
    setSwiperIndexAdd,
    setSwiperIndexReduce
};
