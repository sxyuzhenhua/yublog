## package.json  版本区别（～ ^ lastest）
* ~   固定前两位
* ^ 固定第一位
* lastest 永远安装最新版，包括alpha


### 查看
```
npm view uba-server 
npm view uba-server versions  // 查看所有已发布版本
```


### 获取所有 npm tag 对应的版本: (包括prerelease与稳定版本)
```
npm dist-tag ls uba-server
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

### 发版测试版本： 通过  beta 标识 tag 和版本，这样的话，发布的测试版就不会被 npm 和 yarn 等自动安装
```
npm publish --tag=beta
```

### 发布一个带tag的版本
```
npm publish --tag next(tag名字)
```

### 如何安装tag版本
```
npm install uba-server@next -D
```

### 如果发布的版本有问题，有两个解决方案
1. 确认没有人使用的话，撤回   ```mnpm unpublish uba-server"0.12.0" ```
2. 通过发布新的版本来解决问题，并且通过 decrpted 舍弃此版本  ``` npm deprecate my-thing@1.x "1.x is no longer supported"  ```

### 给开发者添加 npm 包权限
```
npm owner add xx 
```



### 总结
1. npm publish --tag next 发布tag
2. npm dist-tag ls uba-server 查看tag
3. npm dist-tag add uba-server@1.0.0 latest 切换tag
4. npm install uba-server@next -D 安装tag版本
