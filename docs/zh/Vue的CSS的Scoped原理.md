## Vue的CSS的Scoped原理

在组件的 tempalte 元素上 添加自定义属性 data-v- ; CSS属性选择器；

### 缺点
还是会有全局污染的情况，比如 !important, 或者写了一个元素，但是组件没有对应的CSS，别的地方有