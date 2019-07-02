import { nimGetTeam, nimGetTeamMembers, nimGetUser, nimLeaveTeam } from '../../../utils/chat/nimMethods';

export default {
    state: {
        teamList: [],
        // 群对象的成员列表，数据结构如：{tid: {members: [...], ...}, ...}
        teamMembers: {},
        teamMemberState: false,
    },

    getters: {
        teamList: state => state.teamList,
        teamMembers: state => state.teamMembers,
        teamMemberState: state => state.teamMemberState,
    },

    mutations: {
        TEAM_LIST: (state, teamList) => state.teamList = teamList,
        TEAM_MEMBERS(state, teamMembers) {
            if (!Array.isArray(teamMembers)) teamMembers = [teamMembers];
            teamMembers.forEach(team => {
                if (!state.teamMembers[team.teamId]) state.teamMembers[team.teamId] = [];

                state.teamMembers[team.teamId] = team.members;

                state.teamMembers[team.teamId].sort((a, b) => {
                    // 将群主和管理员排在队列前方
                    if (a.type === 'owner' || b.type === 'owner') {
                        return a.type === 'owner' ? -1 : 1;
                    }

                    if (a.type === 'manager' || b.type === 'manager') {
                        return a.type === 'manager' ? -1 : b.type === 'manager' ? 1 : 0;
                    }
                    return -1;
                }).forEach(async acc => {
                    nimGetUser(state.nim, acc.account).then(user => {
                        acc.avatar = user.avatar;
                        acc.nick = user.nick;
                    });
                });
            });
        },
        TEAM_MEMBERS_STATE: (state, teamMemberState) => state.teamMemberState = teamMemberState
    },

    actions: {
        /**
         * 更新群列表
         */
        UPDATE_TEAMS({ state, commit, dispatch }, teams) {
            console.log('群回调:', teams);
            if (!Array.isArray(teams)) teams = [teams];
            teams = teams.filter(item => !!item);
            teams.forEach(team => {
                if (team.validToCurrentUser === undefined) {
                    team.validToCurrentUser = true;
                }
            });

            const teamList = state.nim.mergeTeams(state.teamList, teams);

            commit('TEAM_LIST', teamList);

            dispatch('UPDATE_TEAM_MEMBERS', teamList);
        },

        /**
         * 更新群成员
         */
        UPDATE_TEAM_MEMBERS({ state, commit }, teamList) {
            if (!Array.isArray(teamList)) teamList = [teamList];
            const teams = teamList.map(async team => await nimGetTeamMembers(state.nim, team.teamId));

            Promise.all(teams).then(res => {
                commit('TEAM_MEMBERS', res);
            });
        },

        GET_TEAM_MEMBERS({ state, commit }, teamId) {
            nimGetTeamMembers(state.nim, teamId).then(res => {
                commit('TEAM_MEMBERS', res);
            });
        },

        async LEAVE_TEAM({state, rootGetters, commit}) {
           nimLeaveTeam(state.nim, rootGetters.currentContactInfo.teamId);
        }
    }
};
