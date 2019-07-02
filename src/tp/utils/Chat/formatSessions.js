import { nimGetTeam, nimGetUser } from './nimMethods';
import util from './index';

export function formatSessions(sessions, rootGetters) {
    return new Promise((resolve, reject) => {
        const arr = [...sessions].map(async item => {
            item.name = '';
            item.avatar = '';

            switch (item.scene) {
                case 'p2p':
                    await nimGetUser(rootGetters.nim, item.to).then(user => {
                        item.name = user.nick;
                        item.avatar = user.avatar;
                    });
                    break;
                case 'team':
                    await nimGetTeam(rootGetters.nim, item.to).then(team => {
                        item.name = team.name;
                        item.avatar = team.avatar;
                    });
                    break;
            }

            let lastMsg = item.lastMsg || {};
            if (lastMsg.type) {
                if (lastMsg.type === 'text') {
                    item.lastMsgShow = lastMsg.text || '';
                } else if (lastMsg.type === 'custom') {
                    item.lastMsgShow = util.parseCustomMsg(lastMsg);
                } else if (lastMsg.scene === 'team' && lastMsg.type === 'notification') {
                    item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
                } else if (util.mapMsgType(lastMsg)) {
                    item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
                } else {
                    item.lastMsgShow = '';
                }
            }

            if (item.updateTime) {
                item.updateTimeShow = util.formatDate(item.updateTime, rootGetters.currentLanguage, true);
            }

            item.uniqu = `${item.id}:${item.name}`;

            return item;
        });

        Promise.all(arr).then(sessionArr => {
            resolve(sessionArr);
        });
    });
}
