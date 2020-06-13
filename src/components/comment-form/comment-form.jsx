import classNames from 'classnames';
import Modal from '../../containers/modal.jsx';
import styles from './comment-form.css';
import React from 'react';
import PropTypes from 'prop-types';
import Box from '../box/box.jsx';
import connect from 'react-redux/es/connect/connect';
import {injectIntl} from 'react-intl';
import {closeCommentFormModal} from '../../reducers/modals';
const CommentFormModal = props => {
    return (
        <Modal
            className={styles.modalContent}
            contentLabel={'评语'}
            id="taskModal"
            onRequestClose={props.onCancel}
        >
            <Box className={styles.modalBox}>
                <textarea
                    name="account"
                    placeholder="请输入评语"
                    type="text"
                    className={styles.textarea}
                    onChange={props.changeComentForm}
                    value={props.commentFormData}
                /><br />
                <button
                    onClick={props.submitCommentForm}
                    className={styles.btn}>提交</button>
            </Box>
        </Modal>
    );
};
CommentFormModal.propTypes = {
    submitCommentForm: PropTypes.func,
    changeComentForm: PropTypes.func,
    commentFormData: PropTypes.string
};
CommentFormModal.defaultProps = {
};
const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeCommentFormModal())
});
export default injectIntl(connect(
    null,
    mapDispatchToProps,
)(CommentFormModal));
