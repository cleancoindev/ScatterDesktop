export default {
    TP: {
        GENERIC: {
            Back: 'Back',
            Confirm: 'Confirm',
            Allow: 'Allow',
            Deny: 'Deny',
            Okay: 'Okay',
            Cancel: 'Cancel',
            Open: 'Open',
            Yes: 'Yes',
            No: 'No',
            Enable: 'Enable',
            Disable: 'Disable',
            Select: 'Select',
            Unselect: 'Unselect',
            Edit: 'Edit',
            Add: 'Add',
            Save: 'Save',
            New: 'New',
            Delete: 'Delete',
            Remove: 'Remove',
            RemoveAll: 'Remove All',
            Copy: 'Copy',
            Import: 'Import',
            Identity: 'Identity',
            Export: 'Export',
            Refresh: 'Refresh',
            Manage: 'Manage',
            PrivateKey: 'Private Key',
            PublicKey: 'Public Key',
            Keys: 'Key',
            Hide: 'Hide',
            Reveal: 'Reveal',
            Tokens: 'Token',
            Network: 'Network',
            Blockchain: 'Blockchain',
            Contract: 'Contract',
            Memo: 'Memo',
            Symbol: 'Symbol',
            Decimals: 'Decimals',
            PasswordOrPhrase: 'Password or Backup Phrase',
            Timestamp: 'Timestamp',
            ChainID: 'Chain ID',
            Name: 'Name',
            Accounts: 'Account',
            AccountName: 'Account Name',
            Address: 'Address',
            Search: 'Search',
            Buy: 'Buy',
            Sell: 'Sell',
            Buying: 'Buying',
            Selling: 'Selling',
            MyAccounts: 'My Accounts',
            Contacts: 'Contacts',
            OpenContacts: 'Open Contacts',
            ContactName: 'Contact Name',
            AddContact: 'Add Contact',
            SelectToken: 'Select Token',
            DisplayToken: 'Display Token & Fiat Symbol',
            History: 'History',
            Exchange: 'Exchange',
            Redo: 'Redo',
            AllNetworks: 'All Networks',
            RefreshBalances: 'Refresh Balances',
            Browse: 'Browse',

            MyAsset: 'My Assets',
            Password: 'Password',
            Asset: 'Asset',
            Wallet: 'Wallet',
            Setting: 'Setting',
            Available: 'Available',
            Mortgage: 'Total',
            Detail: 'Detail',
            Play: 'Play',
            Preferences: 'Preferences',
            Security: 'Security',
            Generic: 'General',
            Login: 'Login',
            Chat: 'Chat',
            AddKeys: 'Add Keys',
            SearchKeys: 'Search Keys',
            Reset: 'Reset',

            General: 'General',
            Language: 'Language',
            Explorers: 'Explorers',
            PIN: 'Pin',
            Firewall: 'Firewall',
            Networks: 'Networks',
            Backup: 'Backup',
            Destroy: 'Destroy',
            AboutUs: 'About Us',
            All: 'All',

            Blockchains: 'Blockchains',

            WhitelistNotificationsLabel: 'Whitelist Notifications',
            WhitelistNotificationsDescription: 'These notifications appear on certain operating systems when you auto-sign whitelisted transactions.',
        },

        LOGIN: {
            NOTICE: 'Noticed',
            PASSWORD_DESC: 'Enter you password',
            SET_PASSWORD_DESC: 'Set you password',
            CONFIRM_PASSWORD_DESC: 'Confirm you password',
            FORGET_PASSWORD: 'Forget password',
            CANT_LOGIN: 'Unable to login',
            CANT_LOGIN_DESC: 'If you are unable to log in due to forgotten password, version upgrade or other reasons, please click the "Reset" button to reset the wallet and re-import the private key.',
            CANT_LOGIN_NOTICE_1: '1. Before resetting your wallet, please make sure that you have backed up the private key.',
            CANT_LOGIN_NOTICE_2: '2. It will remove all data including identity and key pairs from the computer.',
            CANT_LOGIN_NOTICE_3: '3. Resetting your wallet will not delete or affect your account that on the blockchain.',
            CANT_LOGIN_NOTICE_4: 'Set the wallet password to protect your asset.',
            DESC: 'YOUR UNIVERSAL DIGITAL WALLET'
        },

        ASSET: {
            TRANSFER: {
                Title: 'Transfer',
                SendButton: 'Send Tokens',
                Sender: 'Sender',
                Recipient: 'Recipient',
                MemoPlaceholder: 'Optional Memo',
            },
        },

        IM: {
            SIGNATURE: 'Verify',
            SIGNATURE_DESC: 'Chat is closely related to your account, requires to verify your identity',
            TEAM_SESSION: 'Go Chat',
            CHAT: 'Messages',
            FOLLOW: 'Follow',
            FOLLOWING: 'Following',
            UNFOLLOW: 'Unfollow',
            GROUP_CHAT: 'Group Chats',
            GROUP_NAME: 'Group Name',
            GROUP_NOTICE: 'Group Notice',
            GROUP_NO_NOTICE: 'No group announcement',
            GROUP_DELETE: 'Delete and Leave',
        },

        SETTINGS: {
            ABOUT: {
                AboutUsText: 'TokenPocket is a universal digital wallet that supports multi-chain and multi-currency. It combines digital asset management, Dapps store, and accounts management.'
            },

            DESTROY: {
                Description: 'This action will remove all the data including your private key from your computer, which will not delete or affect your account from on the actual  blockchain.Before resetting your wallet, please make sure that you have backed up the private key.'
            },

            PASSWORD: {
                NewPasswordLabel: 'New Password',
                NewPasswordPlaceholder: 'Password',
                ConfirmPassword: 'Change Password',
                ConfirmPasswordLabel: 'Confirm new Password',
                ConfirmPasswordPlaceholder: 'Retype Password',
                ChangePasswordButton: 'Change Password',
                Label: 'Password',
                Placeholder: 'Please Enter Your Password',
            },
        },

        KEYS: {
            IMPORT: {
                NameLabel: 'Key Name',
                NamePlaceholder: 'Give this key a name to remember.',
                TextTitle: 'Import private key as text',
                TextDescription: 'If you would like to type in or paste your private key',
                TextButton: 'Text',
                HardwareTitle: 'Import from a hardware wallet',
                HardwareDescription: 'If you have a supported hardware wallet',
                HardwareButton: 'Hardware',
                QrTitle: 'Import private key from a QR code',
                QrDescription: 'If you have an encrypted paper wallet QR code',
                QrButton: 'QR',
            },

            IMPORT_KEY: {
                KeyLabel: 'Enter a Private Key',
                KeyPlaceholder: 'Make sure to enter it correctly',
            },

            ERRORS: {
                InvalidKeyLength: 'Private key not long enough',
            }
        },

        ACCOUNT: {
            UNLINK_ACCOUNT: {
                Title:'Unlink Accounts',
                Desc:'Removing a linked account also removes all of its application permissions',
                SubDesc:'Select all the authorities you want to remove.',
                AuthoritiesLabel:'Authorities',
            }
        }
    }
};
