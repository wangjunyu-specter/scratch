import classNames from 'classnames';
import Modal from '../../containers/modal.jsx';
import styles from './task-modal.css';
import React from 'react';
import PropTypes from 'prop-types';
import Box from '../box/box.jsx';
import ToggleArrowBtn from './arrow-btn.jsx';
import connect from 'react-redux/es/connect/connect';
import {injectIntl} from 'react-intl';
import {closeTaskModal} from '../../reducers/modals';
import {
    setSwiperIndexAdd,
    setSwiperIndexReduce
} from '../../reducers/swiper-index';
const TaskModal = props => {
    return (
        <Modal
            className={styles.modalContent}
            contentLabel={`任务${  props.index  + 1 }`}
            id="taskModal"
            onRequestClose={props.onCancel}
        >
            <Box className={styles.modalBox}>
                <ToggleArrowBtn
                    type={1}
                    disabled={props.index === 0}
                    onClick={props.setIndex2}
                />
                <ToggleArrowBtn
                    type={2}
                    disabled={props.index === props.list.length - 1}
                    onClick={props.setIndex}
                />
                {
                    props.list.map((item, index) =>
                        (<div
                            key={item.taskId}
                            className={styles.contentCenter}
                            // eslint-disable-next-line no-negated-condition
                            style={{display: index !== props.index ? 'none' : 'block'}}
                        >
                            <div className={classNames(styles.fullWidth, styles.boxMargin)}>
                                <p className={styles.area}>
                                    {item.description}
                                </p>
                            </div>
                            {
                                item.picture ? (
                                    <img
                                        className={classNames(styles.fullWidth, styles.imgMaxh)}
                                        src={`http://47.105.231.23:8080/profile${item.picture}`}
                                    />
                                ) : item.vedio ? (
                                    <video
                                        className={styles.fullWidth}
                                        height="300"
                                        src={`http://47.105.231.23:8080/profile${item.vedio}`}
                                        controls="controls"
                                        controlslist="nodownload"
                                        webkit-playsinline="true"
                                        // eslint-disable-next-line react/jsx-no-literals
                                    >
                                        您的浏览器不支持 video 标签。
                                    </video>
                                ) : null
                            }
                            
                        </div>)
                    )
                }
            </Box>
        </Modal>
    );
};
TaskModal.propTypes = {
    title: PropTypes.string.isRequired,
    // ms: PropTypes.string.isRequired,
    // src: PropTypes.string,
    // video: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape),
    index: PropTypes.number,
    setIndex: PropTypes.func,
    setIndex2: PropTypes.func
};
TaskModal.defaultProps = {
    setIndex: () => {},
    setIndex2: () => {}
};
const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeTaskModal()),
    setIndex2: () => dispatch(setSwiperIndexAdd()),
    setIndex: () => dispatch(setSwiperIndexReduce())
});
export default injectIntl(connect(
    null,
    mapDispatchToProps,
)(TaskModal));
