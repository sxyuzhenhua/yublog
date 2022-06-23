## package.json  版本区别（～ ^ lastest）
* ~   固定前两位
* ^ 固定第一位
* lastest 永远安装最新版，包括alpha


### 查看
```
npm view uba-server
```

### 查看具体的dist-tag (包括prerelease与稳定版本)
```
npm dist-tag ls uba-server
```

### 发布一个带tag的版本
```
npm publish --tag next(tag名字)
```

### 切换版本
当我们的当前版本出现了BUG，需要切回之前的版本或者指定的版本，不用慌，这样做：

```
npm dist-tag add uba-server@1.0.0 latest
```

### 用户默认安装的版本就是latest
```
npm install uba-server -D
```

### 如何安装tag版本
```
npm install uba-server@next -D
```


### 总结
1. npm publish --tag next 发布tag
2. npm dist-tag ls uba-server 查看tag
3. npm dist-tag add uba-server@1.0.0 latest 切换tag
4. npm install uba-server@next -D 安装tag版本
