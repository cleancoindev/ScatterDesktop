import { nimGetHistoryMsgs, nimGetUser } from '../../../utils/chat/nimMethods';
import util from '../../../utils/chat';
import emojiObj from '../../../NIM_WEB/emoji';

export default {
    state: {
        noMoreHistoryMsg: true
    },

    getters: {
        noMoreHistoryMsg: state => state.noMoreHistoryMsg
    },

    mutations: {
        NO_MORE_HISTORY_MSG: (state, noMoreHistoryMsg) => state.noMoreHistoryMsg = noMoreHistoryMsg
    },

    actions: {
        async GET_HISTORY_MSG({ state, commit, dispatch, rootGetters }, sessionInfo) {
            return new Promise((resolve, reject) => {
                nimGetHistoryMsgs(state.nim, sessionInfo).then(res => {
                    const { msgs } = res;
                    if (msgs) {
                        // console.log('历史消息:', msgs);
                        commit('NO_MORE_HISTORY_MSG', true);
                        const arr = [];
                        let concatLastMsgTime = 0;
                        const msgList = msgs.map(async msg => {
                            if (msg.from) {
                                if (msg.attach && !msg.avatar) {
                                    const info = msg.attach.users.find(acc => acc.account === msg.from);
                                    msg.avatar = info.avatar;
                                } else {
                                    await nimGetUser(state.nim, msg.from).then(user => {
                                        msg.avatar = user.avatar;
                                    });
                                }
                            }

                            if (msg.content) msg.content = JSON.parse(msg.content);

                            if (msg.type === 'text') {
                                msg.text = util.escape(msg.text);
                                if (/\[[^\]]+\]/.test(msg.text)) {
                                    let emojiItems = msg.text.match(/\[[^\]]+\]/g);
                                    emojiItems.forEach(text => {
                                        let emojiCnt = emojiObj.emojiList.emoji;
                                        if (emojiCnt[text]) {
                                            msg.text = msg.text.replace(text, `<img class="emoji-small" src="${emojiCnt[text].img}">`);
                                        }
                                    });
                                }
                            }

                            return msg;
                        });

                        Promise.all(msgList).then(res => {
                            res.forEach(msg => {
                                if ((msg.time - concatLastMsgTime) > 1000 * 60 * 5) {
                                    concatLastMsgTime = msg.time;
                                    arr.push({
                                        type: 'timeTag',
                                        date: util.formatDate(msg.time, rootGetters.currentLanguage, false)
                                    });
                                }
                                arr.push(msg);
                            });

                            resolve(arr);
                        }).catch(err => reject(err));
                    } else {
                        commit('NO_MORE_HISTORY_MSG', false);
                    }
                });
            });
        }
    }
};
