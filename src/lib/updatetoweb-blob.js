/*
 * @Author: wjy-mac
 * @Date: 2020-06-22 22:17:33
 * @LastEditors: wjy-mac
 * @LastEditTime: 2020-06-28 23:29:39
 * @Description: 保存文件到服务器
 */ 

const domin = 'http://47.105.231.23:8080';

export default (filename, blob) => {
    // const downloadLink = document.createElement('a');
    // document.body.appendChild(downloadLink);

    // Use special ms version if available to get it working on Edge.
    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
        return;
    }
    let search = window.sessionStorage.getItem('search');
    if (search) {
        search = JSON.parse(search);
    } else {
        return;
    }
    console.log(search)
    return new Promise((resolve, reject) => {
        const file = new File([blob], filename, {type: blob.type, lastModified: Date.now()});
        const formData = new FormData();
        formData.append('file', file);
        fetch(`${domin}/api/common/upload`, {
            method: 'POST',
            body: formData,
            headers: new Headers({
                token: window.sessionStorage.getItem('token'),
                loginName: search.loginName,
                dqUserId: search.dqUserId
            })
        }).then(res => res.json()).then(res =>{
            const resFile = res.data;
            const homeWorks = JSON.stringify({
                courseId: search.courseId,
                topicId: search.topicId || 0,
                cover: '',
                answerContent: resFile.fileName,
                answerTime: Date.now(),
                studentId: search.userId,
                fileId: search.fileId
            });
            setWork(`[${homeWorks}]`, search).then(() => resolve()).catch(() => reject());
        }).catch(err => {
            console.log(err)
            alert('上传文件失败!');
            reject();
        });
    })
    

};

const setWork = (homeWorks, search) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('homeWorks', homeWorks);
        fetch(`${domin}/api/student/writeWork`, {
            method: 'POST',
            body: formData,
            headers: new Headers({
                token: window.sessionStorage.getItem('token'),
                loginName: search.loginName,
                dqUserId: search.dqUserId
            })
        }).then(res => res.json()).then(res =>{
            resolve();
        }).catch(err => {
            alert('保存失败!')
            reject();
        });
    });
    
}
