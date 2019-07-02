import { Message } from 'element-ui';

/**
 * 获取用户信息
 * @param nim
 * @param account
 * @returns {Promise<any>}
 */
export function nimGetUser(nim, account) {
    return new Promise((resolve, reject) => {
        nim.getUser({
            account: account,
            done: (error, user) => {
                error ? reject(error) : resolve(user);
            }
        });
    });
}

/**
 * 获取群信息
 * @param nim
 * @param teamId
 * @returns {Promise<any>}
 */
export function nimGetTeam(nim, teamId) {
    return new Promise((resolve, reject) => {
        nim.getTeam({
            teamId,
            done: (error, teamInfo) => {
                error ? reject(error) : resolve(teamInfo);
            }
        });
    });
}

/**
 * 获取群成员列表
 * @param nim
 * @param teamId
 * @returns {Promise<any>}
 */
export function nimGetTeamMembers(nim, teamId) {
    return new Promise((resolve, reject) => {
        nim.getTeamMembers({
            teamId,
            done: (error, teamMembers) => {
                error ? reject(error) : resolve(teamMembers);
            }
        });
    });
}

/**
 * 退群
 * @param nim
 * @param teamId
 * @returns {Promise<any>}
 */
export function nimLeaveTeam(nim, teamId) {
    return new Promise((resolve, reject) => {
        nim.leaveTeam({
            teamId,
            done: (error, obj) => {
                error ? reject(error) : resolve(obj);
            }
        });
    });
}

/**
 * 获取历史记录
 * @param nim
 * @param sessionInfo
 * @returns {Promise<any>}
 */
export function nimGetHistoryMsgs(nim, sessionInfo) {
    return new Promise((resolve, reject) => {
        const { scene, to } = sessionInfo;

        nim.getHistoryMsgs({
            scene,
            to,
            endTime: sessionInfo.time,
            reverse: false,
            asc: true,
            limit: 20,
            done: (error, response) => {
                error ? reject(error) : resolve(response);
            }
        });
    });
}

/**
 * 发送文本消息
 * @param nim
 * @param msgInfo
 * @returns {Promise<any>}
 */
export function nimSendText(nim, msgInfo) {
    return new Promise((resolve, reject) => {
        const { scene, to, text, avatar } = msgInfo;
        nim.sendText({
            scene,
            to,
            text,
            needMsgReceipt: true,
            done: (error, msg) => {
                if (error) {
                    // 被拉黑
                    if (error.code === 7101) {
                        msg.status = 'success';
                        Message.error(error.message);
                    } else {
                        Message.error(error.message);
                    }
                    reject(error);
                }

                msg = { ...msg, avatar };
                resolve(msg);
            }
        });
    });
}

/**
 * https://dev.yunxin.163.com/docs/product/IM%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF/SDK%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/Web%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/%E6%9C%80%E8%BF%91%E4%BC%9A%E8%AF%9D?#%E5%88%A0%E9%99%A4%E6%9C%AC%E5%9C%B0%E4%BC%9A%E8%AF%9D
 * 删除本地会话
 * 在支持数据库时, 删了本地会话之后, 下次同步就同步不到对应的会话
 * 如果不支持数据库, 算成功
 * 如果对应的会话不存在, 算成功
 * 参数 id 为会话 id 或 id 数组
 * @param nim
 * @param id
 * @returns {Promise<any>}
 */
export function nimDeleteLocalSession(nim, id) {
    return new Promise((resolve, reject) => {
        nim.deleteLocalSession({
            id,
            done: (error, obj) => {
                error ? reject(error) : resolve(obj);
            }
        });
    });
}

/**
 * https://dev.yunxin.163.com/docs/product/IM%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF/SDK%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/Web%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/%E6%9C%80%E8%BF%91%E4%BC%9A%E8%AF%9D?#%E5%88%A0%E9%99%A4%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84%E4%BC%9A%E8%AF%9D
 * 删除服务器会话
 * 删了服务器上的会话之后, 在不支持数据库时, 下次同步就同步不到对应的会话以及会话对应的漫游消息; 此外, 在新设备上也同步不到对应的会话以及会话对应的漫游消息
 * scene请参考消息场景
 * to 为对方账号或群ID
 * @param nim
 * @param session
 * @returns {Promise<any>}
 */
export function nimDeleteSession(nim, session) {
    return new Promise((resolve, reject) => {
        // to 为对方账号或群ID
        const { scene, to } = session;
        nim.deleteSession({
            scene,
            to,
            done: (error, obj) => {
                error ? reject(error) : resolve(obj);
            }
        });
    });
}
