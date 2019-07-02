import INIT_NIM_SDK from './INIT_NIM_SDK';
import SESSIONS from './SESSIONS';
import MESSAGES from './MESSAGES';
import HISTORY from './HISTORY';
import TEAMS from './TEAMS';
import FOLLOWS from './FOLLOWS';
import CONTACTS from './CONTACTS';

// https://dev.yunxin.163.com/docs/interface/%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AFWeb%E7%AB%AF/NIMSDK-Web/NIM.html
const Chat = {
    state: {
        ...INIT_NIM_SDK.state,
        ...SESSIONS.state,
        ...MESSAGES.state,
        ...HISTORY.state,
        ...TEAMS.state,
        ...FOLLOWS.state,
        ...CONTACTS.state,
    },

    getters: {
        ...INIT_NIM_SDK.getters,
        ...SESSIONS.getters,
        ...MESSAGES.getters,
        ...HISTORY.getters,
        ...TEAMS.getters,
        ...FOLLOWS.getters,
        ...CONTACTS.getters,
    },

    mutations: {
        ...INIT_NIM_SDK.mutations,
        ...SESSIONS.mutations,
        ...MESSAGES.mutations,
        ...HISTORY.mutations,
        ...TEAMS.mutations,
        ...FOLLOWS.mutations,
        ...CONTACTS.mutations,
    },

    actions: {
        ...INIT_NIM_SDK.actions,
        ...SESSIONS.actions,
        ...MESSAGES.actions,
        ...HISTORY.actions,
        ...TEAMS.actions,
        ...FOLLOWS.actions,
        ...CONTACTS.actions,
    }
};

export default Chat;
