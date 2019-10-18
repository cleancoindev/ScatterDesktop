export default {
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
      QrButton: 'QR'
    },

    IMPORT_KEY: {
      KeyLabel: 'Enter a Private Key',
      KeyPlaceholder: 'Make sure to enter it correctly'
    },

    ERRORS: {
      InvalidKeyLength: 'Private key not long enough'
    }
  },

  WALLET: {
    UNLINK_ACCOUNT: {
      Title: 'Unlink Accounts',
      Desc:
        'Removing a linked account also removes all of its application permissions',
      SubDesc: 'Select all the authorities you want to remove.',
      AuthoritiesLabel: 'Authorities'
    }
  },

  ASSET: {
    TotalBalance: 'Total Balance',
    AddToken: 'Add Token'
  },

  TRANSFER: {
    In: 'In',
    Out: 'Out',
    Send: 'Send',
    Receive: 'Receive',
    Receiver: 'Receiver',
    ReceiverAccount: 'Receiver Account',
    ReceiveCode: 'Receive Code',
    YourAccount: 'Your Account',
    Amount: 'Amount',
    AmountInput: 'Input transfer amount',
    Balance: 'Balance',
    Memo: 'Memo'
  }
}
