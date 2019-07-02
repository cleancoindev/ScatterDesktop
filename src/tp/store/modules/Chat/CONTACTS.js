export default {
    state: {
        groupType: {
            teams: false,
            follow: false
        }
    },

    getters: {
        groupType: state => state.groupType
    },

    mutations: {
        GROUP_TYPE(state, type) {
            state.groupType[type] = !state.groupType[type];
        }
    },

    actions: {}
};
