import util from './index';
import emojiObj from '../../NIM_WEB/emoji';

export function formatMsgs(msgs) {

    return [...msgs].map(msg => {
        let item = Object.assign({}, msg);
        switch (msg.type) {
            case 'timeTag':
                // 标记发送的时间
                item.showText = item.text;
                break;
            case 'text':
                item.showText = util.escape(item.text);
                if (/\[[^\]]+\]/.test(item.showText)) {
                    let emojiItems = item.showText.match(/\[[^\]]+\]/g);
                    emojiItems.forEach(text => {
                        let emojiCnt = emojiObj.emojiList.emoji;
                        if (emojiCnt[text]) {
                            item.showText = item.showText.replace(text, `<img class="emoji-small" src="${emojiCnt[text].img}">`);
                        }
                    });
                }
                break;
            // 自定义消息
            case 'custom':
                let content = item.content = JSON.parse(item.content);
                // 4 文章
                if (content.type === 4) {
                    item.showText = content.title;
                    item.originLink = content.icon_url;
                } else {
                    item.showText = util.parseCustomMsg(item);
                    if (item.showText !== '[自定义消息]') {
                        item.showText += ',请到手机端查看';
                    }
                }
                break;
            case 'image':
                item.originLink = item.file.url;
                break;
            case 'notification':
                if (item.scene === 'team') {
                    item.showText = util.generateTeamSysmMsg(item);
                } else {
                    //对于系统通知，更新下用户信息的状态
                    item.showText = util.generateChatroomSysMsg(item);
                }
                break;
            case  'tip':
                //对于系统通知，更新下用户信息的状态
                item.showText = item.tip;
                break;
            default:
                item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`;
        }

        return item;
    });
}
