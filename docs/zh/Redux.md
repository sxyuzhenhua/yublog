## 一、不可变数据
复制一份store，而不是修改；

## 二、为啥需要不可变数据
+ 性能优化： 不需要深度遍历，只需要比较是否是相通的引用
+ 易于调试和跟踪： 可以记录store的变化
+ 易于推测：是有什么引起store的变化，action

## 三、如何操作不可变数据
3.1 原生写法：{...}, Object.assign
3.2 immutability-helper
3.3 immer
