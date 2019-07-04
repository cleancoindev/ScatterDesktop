export default {
    TP: {
        GENERIC: {
            Back: '返回',
            Confirm: '确认',
            Allow: '同意',
            Deny: '拒绝',
            Okay: '确定',
            Cancel: '取消',
            Open: '打开',
            Yes: '是',
            No: '否',
            Enable: '允许',
            Disable: '禁止',
            Select: '选中',
            Unselect: '取消选择',
            Edit: '编辑',
            Add: '增加',
            Save: '保存',
            New: '新增',
            Delete: '删除',
            Remove: '移除',
            RemoveAll: '移除全部',
            Copy: '复制',
            Import: '导入',
            Identity: '身份',
            Export: '导出',
            Refresh: '刷新',
            Manage: '管理',
            PrivateKey: '私钥',
            PublicKey: '公钥',
            Keys: '密钥',
            Hide: '隐藏',
            Reveal: '还原',
            Tokens: '代币',
            Network: '网络',
            Blockchain: '区块链',
            Contract: '合约',
            Memo: 'Memo',
            Symbol: '符号',
            Decimals: '位数',
            PasswordOrPhrase: '密码或助记词',
            Timestamp: '时间戳',
            ChainID: 'Chain ID',
            Name: '名称',
            Accounts: '账号',
            AccountName: '账号名',
            Address: '地址',
            Search: '搜索',
            Buy: '购买',
            Sell: '出售',
            Buying: '购买中',
            Selling: '出售中',
            MyAccounts: '我的账户',
            Contacts: '往来',
            OpenContacts: '打开联系人',
            ContactName: '联系人姓名',
            AddContact: '添加联系人',
            SelectToken: '选择代币',
            DisplayToken: '选择显示的代币和法币符号',
            History: '历史',
            Exchange: '交换',
            Redo: '重做',
            AllNetworks: '所有网络',
            RefreshBalances: '刷新余额',
            Browse: '浏览',

            MyAsset: '我的资产',
            Password: '密码',
            Asset: '资产',
            Wallet: '钱包',
            Setting: '设置',
            Available: '可用',
            Mortgage: '抵押',
            Detail: '详情',
            Play: '游戏',
            Preferences: '首选项',
            Security: '安全',
            Generic: '常规',
            Login: '登录',
            Chat: '聊天',
            AddKeys: '添加账号',
            SearchKeys: '搜索账号',
            Reset: '重置',

            General: '通用',
            Language: '语言',
            Explorers: '浏览器',
            PIN: 'PIN',
            Firewall: '防火墙',
            Networks: '网络',
            Backup: '备份',
            Destroy: '重置',
            AboutUs: '关于',
            All: '全部',

            Blockchains: '底层',

            WhitelistNotificationsLabel: '白名单通知',
            WhitelistNotificationsDescription: '当您对白名单交易进行自动签名时，在某些特定的操作系统上这些通知会出现。',
        },

        LOGIN: {
            NOTICE: '提示',
            PASSWORD_DESC: '请输入密码',
            SET_PASSWORD_DESC: '请设置登录密码',
            CONFIRM_PASSWORD_DESC: '确认密码',
            FORGET_PASSWORD: '忘记密码',
            CANT_LOGIN: '无法登录',
            CANT_LOGIN_DESC: '如因忘记密码、版本升级或其他原因导致无法登入，可点击"确定"按钮重置钱包，重新导入私钥。',
            CANT_LOGIN_NOTICE_1: '1. 重置钱包前请确保已备份好相关的私钥等重要信息。',
            CANT_LOGIN_NOTICE_2: '2. 该操作将从计算机中删除所有身份和密钥对等数据。',
            CANT_LOGIN_NOTICE_3: '3. 重置钱包不会删除或影响你在区块链上的账号数据。',
            CANT_LOGIN_NOTICE_4: '设置钱包登录密码，以保护你的资产安全。',
            DESC: 'YOUR UNIVERSAL DIGITAL WALLET'
        },

        ASSET: {
            TRANSFER: {
                Title: '转账',
                SendButton: '发送令牌',
                Sender: '发送人',
                Recipient: '接收人',
                MemoPlaceholder: '备注',
            },
        },

        IM: {
            SIGNATURE: '开始验证',
            SIGNATURE_DESC: '聊天与您账号紧密关联，需要您进行签名验证',
            TEAM_SESSION: '进入群聊',
            CHAT: '发送消息',
            FOLLOW: '关注',
            FOLLOWING: '我的关注',
            UNFOLLOW: '取消关注',
            GROUP_CHAT: '群聊',
            GROUP_NAME: '群名',
            GROUP_NOTICE: '群公告',
            GROUP_NO_NOTICE: '暂无群公告',
            GROUP_DELETE: '退出群聊',
        },

        SETTINGS: {
            ABOUT: {
                AboutUsText: 'TokenPocket 是一款支持多币种、多底层的去中心化通用数字钱包，融合了数字资产管理、账号管理和DApp商店等多种功能。'
            },

            PASSWORD: {
                NewPasswordLabel: '新密码',
                NewPasswordPlaceholder: '密码',
                ConfirmPassword: '确认密码',
                ConfirmPasswordLabel: '确认新密码',
                ConfirmPasswordPlaceholder: '再次输入密码',
                ChangePasswordButton: '更改密码',
                Label: '密码',
                Placeholder: '请输入密码',
            },

            DESTROY: {
                Description: '该操作将从本地计算机中删除包括私钥等的重要数据，但不会删除或影响到你在真实区块链上的账号。执行该操作前请确保已备份好私钥等重要信息。'
            }
        },

        KEYS: {
            IMPORT: {
                NameLabel: '密钥名称',
                NamePlaceholder: '为秘钥命名，方便记忆',
                TextTitle: '导入私钥',
                TextDescription: '输入或粘贴私钥',
                TextButton: '文本',
                HardwareTitle: '从硬件钱包导入',
                HardwareDescription: '如果您有支持的硬件钱包',
                HardwareButton: '硬件钱包',
                QrTitle: '从二维码导入私钥',
                QrDescription: '如果你有一个加密的纸质钱包二维码',
                QrButton: '二维码',
            },

            IMPORT_KEY: {
                KeyLabel: '输入私钥',
                KeyPlaceholder: '请输入私钥',
            },

            ERRORS: {
                InvalidKeyLength: '密码长度不够',
            }
        },

        WALLET: {
            UNLINK_ACCOUNT: {
                Title: '账户取消关联',
                Desc: '清除账户的关联并同时清除全部的应用权限',
                SubDesc: '选择要删除的所有权限',
                AuthoritiesLabel: '授权',
            }
        }
    }
};