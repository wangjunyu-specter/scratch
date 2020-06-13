/*
 * @Author: wjy-mac
 * @Date: 2020-06-10 00:28:08
 * @LastEditors: wjy-mac
 * @LastEditTime: 2020-06-12 00:18:51
 * @Description: 评语内容
 */
const COMMENT_FORM_SET = 'scratch-gui/comment-form/SET_DATA';
const COMMENT_FORM_CLEAR = 'scratch-gui/comment-form/CLEAR_DATA';
const COMMENT_FORM = 'commentFormData';

const initialState = {
    [COMMENT_FORM]: ''
};
const setCommentFormdata = function (data) {
    return {
        type: COMMENT_FORM_SET,
        modal: COMMENT_FORM,
        data: data.target.value
    };
};
const clearCommentFormData = function () {
    return {
        type: COMMENT_FORM_CLEAR,
        modal: COMMENT_FORM,
        data: ''
    };
};
const reducer = function (state = initialState, action) {
    switch (action.type) {
    case COMMENT_FORM_SET:
        return Object.assign({}, state, {
            [action.modal]: action.data
        });
    case COMMENT_FORM_CLEAR:
        return Object.assign({}, state, {
            [action.modal]: ''
        });
    default:
        return state;
    }

};

export {
    reducer as default,
    initialState as commentFormDataInitialState,
    setCommentFormdata,
    clearCommentFormData
};
