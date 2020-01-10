# TokenPocket Desktop

#### 分支

- master
- develop-fork-master

#### 目录
- electron.js 主进程文件
- insert/trx.js 波场webview注入
- src/plugins/defaults/ eos btc eth trx 底层逻辑
- src/tp/ 主要业务开发目录
- package.json version字段包版本修改

#### 开发
``` bash
  yarn install
  # 开启webpack服务
  yarn dev
  # 开启electron主进程
  yarn serve
  # 打包出来的是带版本号的包
  # 打包mac
  yarn mac
  # 打包windows
  yarn win
```

#### 发包
- https://cloud.baidu.com/doc/BOS/s/Ejwvyqobd 百度云桌面下载地址
- /tokenpocket 百度云BOS部署路径（AS SK找对应负责人，把打包的文件夹拖到这个目录下就行了）
- 官网包每次用最新的包重新命名一次
- mac-TokenPocket.pkg
- win-TokenPocket.exe

#### 下载地址
- https://dapp.tokenpocket.pro/mac-TokenPocket.pkg (官网mac包)
- https://dapp.tokenpocket.pro/mac-TokenPocket-1.3.5.pkg (版本号mac包)
- https://dapp.tokenpocket.pro/win-TokenPocket.exe (官网下载windows包)
- https://dapp.tokenpocket.pro/win-TokenPocket-1.3.5.exe (版本号windows包)