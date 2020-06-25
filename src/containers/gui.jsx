import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import VM from 'scratch-vm';
import {injectIntl, intlShape} from 'react-intl';

import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {
    getIsError,
    getIsShowingProject
} from '../reducers/project-state';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';
import {
    setCommentFormdata,
    clearCommentFormData
} from '../reducers/comment-form';
// import {
//     getIsLogined,
//     setLogined
// } from '../reducers/user-state';
import {
    closeCostumeLibrary,
    closeBackdropLibrary,
    closeTelemetryModal,
    openExtensionLibrary
} from '../reducers/modals';

import FontLoaderHOC from '../lib/font-loader-hoc.jsx';
import LocalizationHOC from '../lib/localization-hoc.jsx';
import ProjectFetcherHOC from '../lib/project-fetcher-hoc.jsx';
import TitledHOC from '../lib/titled-hoc.jsx';
import ProjectSaverHOC from '../lib/project-saver-hoc.jsx';
import QueryParserHOC from '../lib/query-parser-hoc.jsx';
import storage from '../lib/storage';
import vmListenerHOC from '../lib/vm-listener-hoc.jsx';
import vmManagerHOC from '../lib/vm-manager-hoc.jsx';
import cloudManagerHOC from '../lib/cloud-manager-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';
import {setIsScratchDesktop} from '../lib/isScratchDesktop.js';
import GoogleAnalytics from '../lib/analytics.js';
class GUI extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loginState: false,
            username2: '',
            courseId: '',
            taskList: [],
            commentData: '',
            filepath: false,
            ispl: 0, // 1 是评论 2 上课 3 答题 4 看答案
            loading: false
        };
        bindAll(this, [
            'setLogin',
            'setTaskList',
            'submitCommentForm',
            'setFilepath',
            'setIspl',
            'getFileForPath',
            'getFilePath'
        ]);
        this.domini = 'http://47.105.231.23:8080';
    }
    componentDidMount () {
        setIsScratchDesktop(this.props.isScratchDesktop);
        this.props.onStorageInit(storage);
        this.props.onVmInit(this.props.vm);
        let search;
        if (window.location.search) {
            search = window.location.search;
        }
        this.search = {};
        if (search) {
            search = decodeURI(search);
            if (search.startsWith('?')) {
                search = search.replace('?', '');
                const array = search.split('&');
                const obj = {};
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    const arr2 = element.split('=');
                    obj[arr2[0]] = arr2[1];
                }
                this.search = obj;
                window.sessionStorage.setItem('search', JSON.stringify(this.search));
            }
            window.history.replaceState(null, null, '?');
        } else if (window.sessionStorage.getItem('search')) {
            search = window.sessionStorage.getItem('search');
            try {
                search = JSON.parse(search);
                this.search = search;
            } catch(err) {
                console.error(err);
            }
        }
        this.token = '';
        if (this.search.token) {
            const num = this.search.token.length - this.search.num;
            let token = this.search.token.substr(0, num);
            token = token.split('');
            const token2 = this.search.token.substr(num);
            for (let index = this.search.num - 1; index >= 0; index--) {
                const element = token2[index];
                token.splice(element, 1);
            }
            token = token.toString();
            token = token.replace(/,/g, '');
            this.token = token;
            window.sessionStorage.setItem('token', this.token);
            // this.$store.dispatch(setLogined())
            this.setLogin();
            if (this.search.ispl) {
                this.setIspl(+this.search.ispl)
            }
        }
        if (this.search.filepath) {
            this.setFilepath();
            this.getFileForPath(this.search.filepath);
        } else if (this.search.ispl && this.search.courseId) {
            let link = '';
            const obj = {
                courseId: +this.search.courseId
            };
            let type = 'POST';
            if (+this.search.ispl === 1) {
                link = '/api/teacher/getHomeWorkInfo';
                obj.studentId = this.search.studentId;
                type = 'GET';
            } else if (+this.search.ispl === 2) {
                if (this.search.teacherId) {
                    link = '/api/teacher/getCourseFiles';
                } else {
                    link = '/api/student/getCourseFiles';
                }
                obj.fileType = 'course_code';
            } else if (+this.search.ispl === 3) {
                link = '/api/student/getCourseWorks';
                type = 'GET';
            } else if (+this.search.ispl === 4) {
                if (this.search.teacherId) {
                    link = '/api/teacher/getCourseFiles';
                } else {
                    link = '/api/student/getCourseFiles';
                }
                obj.fileType = 'course_answer';
            }
            this.getFilePath(link, obj, type);
        }
        if (this.search.fileId) { // 获取任务列表
            fetch(`${this.domini}/api/student/getTasks?fileId=${this.search.fileId}`, {
                method: 'GET',
                headers: new Headers({
                    token: this.token,
                    loginName: this.search.loginName,
                    dqUserId: this.search.dqUserId
                })
            }).then(response => response.json()).then( res => {
                console.log(res)
                if (res.data.total > 0) {
                    console.log(res.data.rows)
                    this.setTaskList(res.data.rows);
                }
            }).catch( error => {
                alert(`任务获取失败`);
            })
        }

    }
    
    componentDidUpdate (prevProps) {
        if (this.props.projectId !== prevProps.projectId && this.props.projectId !== null) {
            this.props.onUpdateProjectId(this.props.projectId);
        }
        if (this.props.isShowingProject && !prevProps.isShowingProject) {
            // this only notifies container when a project changes from not yet loaded to loaded
            // At this time the project view in www doesn't need to know when a project is unloaded
            this.props.onProjectLoaded();
        }
    }
    /**
     * @Author: wjy-mac
     * @description: 设置
     * @Date: 2020-06-24 00:16:08
     * @param {type} 
     * @return: 
     */    
    setLoading (bool) {
        this.setState({
            loading: bool
        });
    }
    /**
     * @Author: wjy-mac
     * @description: 获取编程文件地址
     * @Date: 2020-06-10 23:46:45
     * @param {type} path 请求地址
     * @param {type} obj 请求参数
     * @param {type} type 请求方式
     * @return:
     */
    getFilePath (path, obj, type) {
        if (type === 'GET') {
            path = `${path}?`;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const element = obj[key];
                    if (element) {
                        path = `${path}&${key}=${element}`;
                    }
                }
            }
        }
        const obj2 = new FormData();
        obj2.append('courseId', obj.courseId);
        obj2.append('fileType', obj.fileType);
        const xhr = new XMLHttpRequest();
        xhr.open(type, `${this.domini}${path}`, true);
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
        xhr.setRequestHeader('token', this.token);
        xhr.setRequestHeader('loginName', this.search.loginName);
        xhr.setRequestHeader('dqUserId', this.search.dqUserId);
        // responseType要放到send前面
        xhr.onload = () => {
            console.log(xhr.response)
            const res = JSON.parse(xhr.response);
            let filePath;
            if (+this.search.ispl === 1) {
                filePath = res.data && res.data.rows && res.data.rows.length > 0 ? res.data.rows[0].answerCode : '';
            } else if (+this.search.ispl === 2) {
                filePath = res.data && res.data.length > 0 ? res.data[0].url : '';
            } else if (+this.search.ispl === 3) {
                filePath = res.data && res.data.length > 0 ? res.data[0].topic.code : '';
            } else if (+this.search.ispl === 4) {
                filePath = res.data && res.data.length > 0 ? res.data[0].url : '';
            }
            console.log(filePath)
            // eslint-disable-next-line no-unused-expressions
            filePath && this.getFileForPath(filePath);
        };
        if (type === 'POST') {
            xhr.send(obj2);
        } else {
            xhr.send();
        }
    }
    // eslint-disable-next-line react/sort-comp
    getFileForPath (path) { // 获取编程文件
        console.log(path)
        if (!path || typeof path !== 'string') {
            return;
        }
        this.setLoading(true);
        const obj = new FormData();
        obj.append('path', path);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${this.domini}/api/common/download`, true);
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
        xhr.setRequestHeader('token', this.token);
        xhr.setRequestHeader('loginName', this.search.loginName);
        xhr.setRequestHeader('dqUserId', this.search.dqUserId);
        // responseType要放到send前面
        xhr.responseType = 'blob';
        xhr.onload = () => {
            // response会根据responseType指定的类型自动处理结果
            const reader = new FileReader();
            reader.readAsArrayBuffer(xhr.response);
            reader.onloadend = () => this.props.vm.loadProject(reader.result).then(() => {
                GoogleAnalytics.event({
                    category: 'project',
                    action: 'Import Project File',
                    nonInteraction: true
                });
                this.setLoading(false);
            });
        };
        xhr.send(obj);
    }
    submitCommentForm () { // 提交评语
        const obj = {
            correctContent: this.props.commentFormData,
            correctType: 0,
            courseId: this.state.courseId,
            score: 5,
            studentId: this.search.studentId,
            teacherId: this.search.teacherId
        }
        const obj2 = new FormData();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                obj2.append(key, element);
            }
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${this.domini}/api/teacher/correctWork`, true);
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
        xhr.setRequestHeader('token', this.token);
        xhr.setRequestHeader('loginName', this.search.loginName);
        xhr.setRequestHeader('dqUserId', this.search.dqUserId);
        // responseType要放到send前面
        xhr.onload = () => {
            console.log('提交成功了')
            console.log(xhr.response)
            const res = JSON.parse(xhr.response);
            if (res.code !== 0) {
                alert(res.msg);
            }
        };
        xhr.send(obj2);
    }
    setLogin () {
        this.setState({
            loginState: true,
            username2: this.search.name,
            courseId: this.search.courseId
        });
    }
    setFilepath () { // 设置课程附件地址
        this.setState({
            filepath: true
        });
    }
    setIspl (type) { // 设置跳转类型
        this.setState({
            ispl: type
        });
    }
    setTaskList (arr) { // 设置任务
        this.setState({
            taskList: arr
        });
    }
    render () {
        if (this.props.isError) {
            throw new Error(
                `Error in Scratch GUI [location=${window.location}]: ${this.props.error}`);
        }
        const {
            /* eslint-disable no-unused-vars */
            assetHost,
            cloudHost,
            error,
            isError,
            isScratchDesktop,
            isShowingProject,
            onProjectLoaded,
            onStorageInit,
            onUpdateProjectId,
            onVmInit,
            projectHost,
            projectId,
            /* eslint-enable no-unused-vars */
            children,
            fetchingProject,
            isLoading,
            loadingStateVisible,
            commentFormData,
            changeComentForm,
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                loading={fetchingProject || isLoading || loadingStateVisible || this.state.loading}
                loginState={this.state.loginState}
                username2={this.state.username2}
                courseId={this.state.courseId}
                filepath={this.state.filepath}
                taskList={this.state.taskList}
                submitCommentForm={this.submitCommentForm}
                changeComentForm={changeComentForm}
                commentFormData={commentFormData}
                ispl={this.state.ispl}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    assetHost: PropTypes.string,
    children: PropTypes.node,
    cloudHost: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    fetchingProject: PropTypes.bool,
    intl: intlShape,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    isScratchDesktop: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    onProjectLoaded: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onStorageInit: PropTypes.func,
    onUpdateProjectId: PropTypes.func,
    onVmInit: PropTypes.func,
    projectHost: PropTypes.string,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    telemetryModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    commentFormData: PropTypes.string,
    changeComentForm: PropTypes.func
    // loginState: PropTypes.bool
};

GUI.defaultProps = {
    isScratchDesktop: false,
    onStorageInit: storageInstance => storageInstance.addOfficialScratchWebStores(),
    onProjectLoaded: () => {},
    onUpdateProjectId: () => {},
    onVmInit: (/* vm */) => {}
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    // const loginState = state.scratchGui.userState.loginState;
    return {
        activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
        alertsVisible: state.scratchGui.alerts.visible,
        backdropLibraryVisible: state.scratchGui.modals.backdropLibrary,
        blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
        cardsVisible: state.scratchGui.cards.visible,
        connectionModalVisible: state.scratchGui.modals.connectionModal,
        costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
        costumesTabVisible: state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
        error: state.scratchGui.projectState.error,
        isError: getIsError(loadingState),
        isFullScreen: state.scratchGui.mode.isFullScreen,
        isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
        isRtl: state.locales.isRtl,
        isShowingProject: getIsShowingProject(loadingState),
        loadingStateVisible: state.scratchGui.modals.loadingProject,
        projectId: state.scratchGui.projectState.projectId,
        soundsTabVisible: state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
        targetIsStage: (
            state.scratchGui.targets.stage &&
            state.scratchGui.targets.stage.id === state.scratchGui.targets.editingTarget
        ),
        telemetryModalVisible: state.scratchGui.modals.telemetryModal,
        tipsLibraryVisible: state.scratchGui.modals.tipsLibrary,
        vm: state.scratchGui.vm,
        showTaskModal: state.scratchGui.modals.taskModal,
        showComemetFormModal: state.scratchGui.modals.commentFormModal,
        taskSwiperIndex: state.scratchGui.taskSwiperIndex.taskSwiperIndex,
        commentFormData: state.scratchGui.commentFormData.commentFormData
        // loginState: getIsLogined(loginState)
    };
};

const mapDispatchToProps = dispatch => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: tab => dispatch(activateTab(tab)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onRequestCloseBackdropLibrary: () => dispatch(closeBackdropLibrary()),
    onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary()),
    onRequestCloseTelemetryModal: () => dispatch(closeTelemetryModal()),
    changeComentForm: (data) => dispatch(setCommentFormdata(data))
});

const ConnectedGUI = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI));

// note that redux's 'compose' function is just being used as a general utility to make
// the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
// ability to compose reducers.
const WrappedGui = compose(
    LocalizationHOC,
    ErrorBoundaryHOC('Top Level App'),
    FontLoaderHOC,
    QueryParserHOC,
    ProjectFetcherHOC,
    TitledHOC,
    ProjectSaverHOC,
    vmListenerHOC,
    vmManagerHOC,
    cloudManagerHOC
)(ConnectedGUI);

WrappedGui.setAppElement = ReactModal.setAppElement;
export default WrappedGui;
