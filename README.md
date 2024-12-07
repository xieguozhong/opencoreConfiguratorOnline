# opencoreConfiguratorOnline


最新适配版本: OpenCore-1.0.2-RELEASE


web版的OpenCore引导工具config.plist的在线编辑器
使用方法:

1 直接使用在线版, 地址 https://xieguozhong.github.io/opencoreConfiguratorOnline/


2 git clone 后直接双击index.html使用


3 强烈推荐使用utools( https://www.u.tools )工具, 非常多插件，好用方便还免费。 安装后在插件应用市场搜 opencore
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/utools.png)

4 macos 系统使用独立的应用, 下载后解压直接用就可以了

演示图
1 打开config文件
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/open.gif)

2 一键勾选是否启用
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/enable.gif)

3 复制粘贴行
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/copy.gif)

4 双击行修改，修改后回车确认修改
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/edit.gif)

5 删除行
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/delete.gif)

5 用鼠标直接拖动行顺序
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/move.gif)

6 多选框勾选
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/checkbox.gif)

7 custom
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/custom.gif)

8 Macos下挂载 EFI 分区
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/mountefidisk.gif)

9 Macos下更新 opencore
![image](https://github.com/xieguozhong/opencoreConfiguratorOnline/blob/main/readme/upgradeopencore.gif)

修改方式:

打开终端 1
#git clone https://github.com/xieguozhong/opencoreConfiguratorOnline.git

#cd opencoreConfiguratorOnline

#npm install

#gulp

#gulp watch


tauri 修改方法,提前安装好 rust , brew install rust

#cd opencoreConfiguratorOnline/tauriapp

#npm install

#npm run tauri dev



