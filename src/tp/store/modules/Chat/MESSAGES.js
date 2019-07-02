import { Message } from 'element-ui';
import util from '../../../utils/chat';
import { nimGetUser, nimSendText } from '../../../utils/chat/nimMethods';

// 查询需要发送回执的消息
function getMsgNeedToReceipt(state, teamId, msgs) {
    if (!Array.isArray(msgs)) msgs = [msgs];
    const sentReceiptList = state.sentReceipedMap[teamId] || [];
    return msgs.filter(msg => {
        // 需要回执，且未发送过
        return msg.needMsgReceipt && msg.from !== state.myInfo.account && !sentReceiptList.find(id => id === msg.idServer);
    }).map(msg => {
        return {
            teamId: teamId,
            idServer: msg.idServer
        };
    });
}

export default {
    state: {
        // 以sessionId作为key
        messages: {},
        messageList: [],
        messageMap: {},
        currentSessionLastMsg: null,
        // 已发送群消息回执Map,key为群Id
        sentReceiptMap: {},
        // 当前群消息回执查询的群id
        currentReceiptQueryTeamId: null,
        // 群消息回执查询的消息列表
        receiptQueryList: [],
        // 群消息回执查询结果列表
        teamMsgReads: [],
        // 群消息已读未读账号列表
        teamMsgReadsDetail: {
            readAccounts: [],
            unreadAccounts: []
        },
    },

    getters: {
        messages: state => state.messages,
        messageList: state => state.messageList,
        messageMap: state => state.messageMap,
        sentReceiptMap: state => state.sentReceiptMap,
        currentReceiptQueryTeamId: state => state.currentReceiptQueryTeamId,
        receiptQueryList: state => state.receiptQueryList,
        teamMsgReads: state => state.teamMsgReads,
        teamMsgReadsDetail: state => state.teamMsgReadsDetail,
    },

    mutations: {
        MESSAGES(state, messageInfo) {
            const { type, msgs, sessionId } = messageInfo;
            switch (type) {
                case 'update':
                    state.messages = msgs;
                    break;
                case 'put':
                    state.messages[sessionId] = msgs;
                    break;
            }

        },

        CURRENT_SESSION_MSG(state, session) {
            const { type, data } = session;
            switch (type) {
                // 初始化消息
                case 'init':
                    state.currentSessionMsg = data;
                    break;

                // 添加聊天消息
                case 'put':
                    state.currentSessionMsg.push(data);
                    break;

                // 连接历史消息
                case 'concat':
                    state.currentSessionMsg = [...data, ...state.currentSessionMsg];
                    break;

                // 清空会话消息
                case 'reset':
                    state.nim.resetCurrSession();
                    state.currentSessionMsg = [];
                    state.currentSessionLastMsg = null;
                    break;
            }
        },

        CURRENT_SESSION_LAST_MSG: (state, currentSessionLastMsg) => state.currentSessionLastMsg = currentSessionLastMsg,
        SENT_RECEIPT_MAP: (state, sentReceiptMap) => state.sentReceiptMap = sentReceiptMap,
        RECEIPT_QUERY_LIST(state, receiptQuery) {
            const { type, data } = receiptQuery;
            switch (type) {
                case 'init':
                    state.receiptQueryList = data;
                    break;
                case 'put':
                    state.receiptQueryList.push(data);
                    break;
            }
        },
        TEAM_MSG_READS(state, teamMsgReads) {
            const { type, data } = teamMsgReads;
            switch (type) {
                case 'init':
                    state.teamMsgReads = data;
                    break;
                case 'put':
                    state.teamMsgReads.push(data);
                    break;
            }
        },
        CURRENT_RECEIPT_QUERY_TEAM_ID: (state, currentReceiptQueryTeamId) => state.currentReceiptQueryTeamId = currentReceiptQueryTeamId,


    },

    actions: {
        /**
         * 更新回调消息
         */
        UPDATE_MESSAGE({ state, commit, dispatch }, msgs) {
            if (!Array.isArray(msgs)) msgs = [msgs];
            const tempSessionMap = {};
            const messages = { ...state.messages };
            const tempTime = (new Date()).getTime();
            msgs.forEach(msg => {
                let sessionId = msg.sessionId;
                tempSessionMap[sessionId] = true;
                if (!messages[sessionId]) messages[sessionId] = [];


                // sdk会做消息去重
                messages[sessionId] = state.nim.mergeMsgs(messages[sessionId], [msg]);

                // 有idClient更新消息且5分钟以内的消息,目前用于消息撤回
                if (msg.idClient && (tempTime - msg.time < 1000 * 60 * 5)) {
                    messages[msg.idClient] = msg;
                }
            });


            commit('MESSAGES', { type: 'update', msgs: messages });
            console.log('更新回调消息', messages);

            for (let sessionId in tempSessionMap) {
                if (sessionId === state.currentSessionId) {
                    // commit('INIT_CURRENT_SESSION_MSG', state.currentSessionId);
                }
            }
        },

        /**
         * 更新追加一条消息
         */
        async PUT_MESSAGE({ state, getters, commit, dispatch }, msg) {
            console.log('更新追加一条消息:', msg);
            if(msg.sessionId === getters.currentSessionId) {
                const user = await nimGetUser(state.nim, msg.from);
                msg.avatar = user.avatar;
                dispatch('PUT_CURRENT_SESSION_MSG', msg)
            }
        },

        // DELETE_MESSAHE({state, commit, dispatch}, msg) {
        //     let sessionId = msg.sessionId;
        //     let tempMsgs = state.msgs[sessionId];
        //     if (!tempMsgs || tempMsgs.length === 0) {
        //         return;
        //     }
        //     let lastMsgIndex = tempMsgs.length - 1;
        //     for (let i = lastMsgIndex; i >= 0; i--) {
        //         let currMsg = tempMsgs[i];
        //         if (msg.idClient === currMsg.idClient) {
        //             state.msgs[sessionId].splice(i, 1);
        //             break;
        //         }
        //     }
        //
        //     // commit('MESSAGES', {
        //     //     type: 'delete',
        //     //     msgs: { messages },
        //     //     sessionId
        //     // });
        //
        //     console.log(messages);
        // },

        // REPLACE_MESSAGE({ state }, obj) {
        //     const { sessionId, idClient, msg } = obj;
        //     const tempMsgs = state.message[sessionId];
        //
        //     if (!tempMsgs || tempMsgs.length === 0) {
        //         return;
        //     }
        //
        //     const lastMsgIndex = tempMsgs.length - 1;
        //
        //     for (let i = lastMsgIndex; i >= 0; i--) {
        //         let currMsg = tempMsgs[i];
        //         // console.log(idClient, currMsg.idClient, currMsg.text)
        //         if (idClient === currMsg.idClient) {
        //             state.message[sessionId].splice(i, 1, msg);
        //             break;
        //         }
        //     }
        // },


        /**
         * 初始化会话消息列表
         */
        async INIT_CURRENT_SESSION_MSG({ state, commit, dispatch, rootGetters }, sessionInfo) {
            commit('CURRENT_SESSION_MSG', { type: 'init', data: [] });
            dispatch('GET_HISTORY_MSG', sessionInfo).then(res => {
                commit('CURRENT_SESSION_MSG', { type: 'init', data: res });
            });
        },

        /**
         * 追加一条消息
         */
        async PUT_CURRENT_SESSION_MSG({ state, commit, dispatch, rootGetters }, msg) {
            let putLastMsgTime = 0;
            let lenCurrMsgs = state.currentSessionMsg.length;
            if (lenCurrMsgs > 0) {
                putLastMsgTime = state.currentSessionMsg[lenCurrMsgs - 1].time;
            }

            if (msg) {
                console.log('PUT_CURRENT_SESSION_MSG:', msg);
                if ((msg.time - putLastMsgTime) > 1000 * 60 * 5) {
                    const data = {
                        type: 'timeTag',
                        text: util.formatDate(msg.time, rootGetters.currentLanguage, false)
                    };
                    commit('CURRENT_SESSION_MSG', { type: 'put', data });
                }
                commit('CURRENT_SESSION_MSG', { type: 'put', data: msg });
            }
        },

        /**
         * 历史消息拼接
         */
        async CONCAT_CURRENT_SESSION_MSG({ state, commit, dispatch, rootGetters }, sessionInfo) {
            dispatch('GET_HISTORY_MSG', sessionInfo).then(res => {
                commit('CURRENT_SESSION_MSG', { type: 'concat', data: res });
                dispatch('TEAM_MSG_RECEIPT', res);
            });
        },

        async SENT_TEXT_MSG({ state, commit, dispatch }, obj = {}) {
            if (state.myInfo.avatar) {
                obj.avatar = state.myInfo.avatar;
                nimSendText(state.nim, obj).then(msg => {
                    // 追加一条消息
                    dispatch('PUT_CURRENT_SESSION_MSG', msg);
                });
            }
        },

        async SEND_CUSTOM_MSG({ state, commit, dispatch }, obj = {}) {
            state.nim.sendCustomMsg({
                scene: obj.scene,
                to: obj.to,
                pushContent: obj.pushContent,
                content: JSON.stringify(obj.content),
                done: (error, msg) => {
                    if (error) {
                        // 被拉黑
                        if (error.code === 7101) {
                            msg.status = 'success';
                            Message.error(error.message);
                        } else {
                            Message.error(error.message);
                        }
                    }

                    // 追加一条消息
                    dispatch('PUT_CURRENT_SESSION_MSG', msg);
                },
            });
        },

        /**
         * 发送消息已读回执
         */
        MSG_RECEIPT({ state }, msg) {
            const { currentSessionId } = state;
            if (currentSessionId && msg.scene === 'p2p') {
                if (state.sessionMap[currentSessionId]) {
                    state.nim.sendMsgReceipt({
                        msg: state.sessionMap[currentSessionId].lastMsg,
                        done: (error, obj) => {
                            console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj);
                        }
                    });
                }
            }
        },

        TEAM_MSG_RECEIPT({ state, dispatch }, msgs) {
            if (!Array.isArray(msgs)) msgs = [msgs];
            const result = /team-(\d+)/.exec(state.currSessionId);

            if (result) {
                const teamId = result[1];
                const needToReceiptList = getMsgNeedToReceipt(state, teamId, msgs);

                if (needToReceiptList && needToReceiptList.length > 0) {
                    state.nim.sendTeamMsgReceipt({
                        teamMsgReceipts: needToReceiptList,
                        done: (err, obj, content) => {
                            console.log('标记群组消息已读' + (!err ? '成功' : '失败'));

                            if (!err) {
                                dispatch('UPDATE_SENT_RECEIPT_MAP', needToReceiptList);
                            }
                        }
                    });
                }

                dispatch('UPDATE_RECEIPT_QUERY_LIST', { teamId, msgs });
            }

        },

        UPDATE_SENT_RECEIPT_MAP({ state, commit }, msgs) {
            if (msgs.length > 1) {
                const teamId = obj[0].teamId;

                const sentReceiptMap = {};
                if (!state.sentReceiptMap[teamId]) {
                    sentReceiptMap[teamId] = [];
                }

                sentReceiptMap[teamId].push(...msgs.map(msg => msg.idServer));

                commit('SENT_RECEIPT_MAP', sentReceiptMap);
            }
        },

        UPDATE_RECEIPT_QUERY_LIST({ state, commit, dispatch }, obj) {
            const { teamId, msgs } = obj;
            if (state.currentReceiptQueryTeamId !== teamId) {
                commit('RECEIPT_QUERY_LIST', { type: 'init', data: [] });
                commit('TEAM_MSG_READS', { type: 'init', date: [] });
                commit('CURRENT_RECEIPT_QUERY_TEAM_ID', teamId);
            }

            const needQuery = msgs
            .filter(msg =>
                msg.needMsgReceipt &&
                msg.from === state.myInfo.account &&
                !state.receiptQueryList.find(item => item.idServer === msg.idServer)
            )
            .map(msg => {
                return {
                    teamId,
                    idServer: msg.idServer
                };
            });

            if (needQuery.length > 0) {
                commit('RECEIPT_QUERY_LIST', { type: 'put', data: [...needQuery] });
                // dispatch('getTeamMsgReads', needQuery);

                // 获取群组消息已读
                state.nim.getTeamMsgReads({
                    teamMsgReceipts: needQuery,
                    done: (error, obj, content) => {
                        if (error) {
                            console.log('获取群组消息已读' + error);
                        } else {
                            // console.log('获取群组消息已读：', content);
                            commit('TEAM_MSG_READS', { type: 'put', data: content });
                        }
                    }
                });
            }
        },

        /**
         * 用idClient 更新消息，目前用于消息撤回
         */
        // UPDATE_MESSAGE_BY_ID_CLIENT(state, msgs) {
        //     // console.log('用idClient 更新消息，目前用于消息撤回', msgs);
        //     if (!Array.isArray(msgs)) msgs = [msgs];
        //
        //
        //     const tempTime = (new Date()).getTime();
        //     msgs.forEach(msg => {
        //         // 有idClient 且 5分钟以内的消息
        //         if (msg.idClient && (tempTime - msg.time < 1000 * 300)) {
        //             state.messages[msg.idClient] = msg;
        //             commit('');
        //         }
        //     });
        // }
    }
};
