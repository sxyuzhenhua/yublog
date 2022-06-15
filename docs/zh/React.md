
[在线写代码](https://codesandbox.io/s/react-hooks-course-20vzg?file=/src/08/PriceInput.js:0-802 "超链接title")
## 生命周期
https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
![react-line](@imgs/react-line.png)

#### 1. constructor
* 用于初始化内部状态，很少使用
+ 唯一可以直接修改state的地方

#### 2. get­Derived­State­From­Props
* 当state 需要从props 初始化时使用
* 尽量不要使用，维护两者状态一直行会增加复杂度
* 每次render 都会调用
* 典型场景：表单控件获取默认值

#### 3. component­Did­Mount
* UI 渲染完成后调用
+ 只执行一次
+ 典型场景：获取外部资源

#### 4. component­Will­Unmount
+ 组件被移除始调用
+ 典型场景：资源释放

#### 5. get­Snapshot­Before­Update
+ 在页面render 之前调用，state 已更新
+ 典型场景： 获取 render 之前的 DOM 状态

#### 6. component­Did­Update
+ 每次UI更新时被调用
+ 典型场景： 页面需要根据 props 变化重新获取数据

#### 7. should­Component­Update
+ 决定 Virtual DOM 是否要重绘
+ 一般可以由 PureComponent 自动实现
+ 典型场景：性能优化

## 使用第三方库, d3
```
componentDidUpdate(prevProps, prevState) {
    if(this.state.data !== prevState.data) this.updateDiagarame()
}

<div ref={node => {this.d3Node = node}}></div>
```

## Hooks
```
const getSize = () => {
  return window.innerWidth > 1000 ? "large" : "small";
}
const useWindowSize = () => {
  const [size, setSize] = useState(getSize());
  useEffect(() => {
	const handler = () => {
      setSize(getSize())
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);
	
  return size;
};
```

这样，我们在组件中使用窗口大小就会非常简单：

```
const Demo = () => {
  const size = useWindowSize();
  if (size === "small") return ;
  else return ;
};

```

#### Hooks
useState、useEffect、useCallback、useMemo、useRef、useContext

## useState：让函数组件具有维持状态的能力
 state 是 React 组件的一个核心机制，那么 useState 这个 Hook 就是用来管理 state 的，它可以让函数组件具有维持状态的能力。也就是说，在一个函数组件的多次渲染之间，这个 state 是共享的。下面这个例子就显示了 useState 的用法：

```
import React, { useState } from 'react';

function Example() {
  // 创建一个保存 count 的 state，并给初始值 0
  const [count, setCount] = useState(0);

  return (
    {count}
        setCount(count + 1)}>
            +
    );
    }
```

#### 在这个例子中，我们声明了一个名为 count 的 state，并得到了设置这个 count 值的函数 setCount。当调用 setCount 时，count 这个 state 就会被更新，并触发组件的刷新。那么 useState 这个 Hook 的用法总结出来就是这样的：
1. useState(initialState) 的参数 initialState 是创建 state 的初始值，它可以是任意类型，比如数字、对象、数组等等。
2. useState() 的返回值是一个有着两个元素的数组。第一个数组元素用来读取 state 的值，第二个则是用来设置这个 state 的值。在这里要注意的是，state 的变量（例子中的 count）是只读的，所以我们必须通过第二个数组元素 setCount 来设置它的值。
3. 如果要创建多个 state，那么我们就需要多次调用 useState。比如要创建多个 state，使用的代码如下：

```
// 定义一个年龄的 state，初始值是 42
const [age, setAge] = useState(42);
// 定义一个水果的 state，初始值是 banana
const [fruit, setFruit] = useState('banana');
// 定一个一个数组 state，初始值是包含一个 todo 的数组
const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);

```

#### state 中永远不要保存可以通过计算得到的值
1. 从 props 传递过来的值。有时候 props 传递过来的值无法直接使用，而是要通过一定的计算后再在 UI 上展示，比如说排序。那么我们要做的就是每次用的时候，都重新排序一下，或者利用某些 cache 机制，而不是将结果直接放到 state 里。
2. 从 URL 中读到的值。比如有时需要读取 URL 中的参数，把它作为组件的一部分状态。那么我们可以在每次需要用的时候从 URL 中读取，而不是读出来直接放到 state 里。
3. 从 cookie、localStorage 中读取的值。通常来说，也是每次要用的时候直接去读取，而不是读出来后放到 state 里。

#### 一旦组件有自己状态，意味着组件如果重新创建，就需要有恢复状态的过程，这通常会让组件变得更复杂。
比如一个组件想在服务器端请求获取一个用户列表并显示，如果把读取到的数据放到本地的 state 里，那么每个用到这个组件的地方，就都需要重新获取一遍。

而如果通过一些状态管理框架，去管理所有组件的 state 的话，比如我在第7讲会介绍的 Redux，那么**组件本身就可以是无状态的**。无状态组件可以成为更纯粹的表现层，没有太多的业务逻辑，从而更易于使用、测试和维护。


## useEffect：执行副作用
**副作用是指一段和当前执行结果无关的代码**。比如说要修改函数外部的某个变量，要发起一个请求，等等。也就是说，在函数组件的当次执行过程中，useEffect 中代码的执行是不影响渲染出来的 UI 的。
```
useEffect(callback, dependencies)
```

第一个为要执行的函数callback，**第二个是可选的依赖项数组dependencies**。其中依赖项是可选的，如果不指定，那么 callback 就会在每次函数组件执行完后都执行；如果指定了，那么只有依赖项中的值发生变化的时候，它才会执行。

对应到 Class 组件，那么 useEffect 就涵盖了 ComponentDidMount、componentDidUpdate和componentWillUnmount 三个生命周期方法。不过如果你习惯了使用Class 组件，那千万不要按照把 useEffect 对应到某个或者某几个生命周期的方法。你只要记住，**useEffect 是每次组件 render 完后判断依赖并执行就可以了**。

举个例子，某个组件用于显示一篇 Blog 文章，那么这个组件会接收一个参数来表示 Blog 的 ID。而当 ID 发生变化时，组件需要发起请求来获取文章内容并展示：

```
import React, { useState, useEffect } from "react";

function BlogView({ id }) {
  // 设置一个本地 state 用于保存 blog 内容
  const [blogContent, setBlogContent] = useState(null);

  useEffect(() => {
    // useEffect 的 callback 要避免直接的 async 函数，需要封装一下
    const doAsync = async () => {
      // 当 id 发生变化时，将当前内容清楚以保持一致性
      setBlogContent(null);
      // 发起请求获取数据
      const res = await fetch(`/blog-content/${id}`);
      // 将获取的数据放入 state
      setBlogContent(await res.text());
    };
    doAsync();
  }, [id]); // 使用 id 作为依赖项，变化时则执行副作用

  // 如果没有 blogContent 则认为是在 loading 状态
  const isLoading = !blogContent;
  return 
    {isLoading ? "Loading..." : blogContent}
    ;
    }

```


### useEffect 还有两个特殊的用法： 没有依赖项，以及依赖项作为空数组。

1. 没有依赖项，则每次 render 后都会重新执行。例如：
```
useEffect(() => {
  // 每次 render 完一定执行
  console.log('re-rendered');
});
```

2. 空数组作为依赖项，则只在首次执行时触发，对应到 Class 组件就是 componentDidMount。例如：
```
useEffect(() => {
  // 组件首次渲染时执行，等价于 class 组件中的 componentDidMount
  console.log('did mount');
}, [])
```

除了这些机制之外，useEffect 还允许你返回一个函数，用于在组件销毁的时候做一些清理的操作。比如移除事件的监听。这个机制就几乎等价于类组件中的 componentWillUnmount。举个例子，在组件中，我们需要监听窗口的大小变化，以便做一些布局上的调整：

```
// 设置一个 size 的 state 用于保存当前窗口尺寸
const [size, setSize] = useState({});
useEffect(() => {
  // 窗口大小变化事件处理函数
  const handler = () => {
    setSize(getSize());
  };
  // 监听 resize 事件
  window.addEventListener('resize', handler);
  
  // 返回一个 callback 在组件销毁时调用
  return () => {
    // 移除 resize 事件
    window.removeEventListener('resize', handler);
  };
}, []);

```

**总结**

1. 每次 render 后执行：不提供第二个依赖项参数。比如
useEffect(() => {})。
2. 仅第一次render 后执行：提供一个空数组作为依赖项。比如
useEffect(() => {}, [])。
3. 第一次以及依赖项发生变化后执行：提供依赖项数组。比如
useEffect(() => {}, [deps])。
4. 组件 unmount 后执行：返回一个回调函数。比如
useEffect() => { return () => {} }, [])。


## 理解 Hooks 的依赖
1. 依赖项中定义的变量一定是会在回调函数中用到的，否则声明依赖项其实是没有意义的。
2. 依赖项一般是一个常量数组，而不是一个变量。因为一般在创建 callback 的时候，你其实非常清楚其中要用到哪些依赖项了。
3. React 会使用浅比较来对比依赖项是否发生了变化，所以要特别注意数组或者对象类型。如果你是每次创建一个新对象，即使和之前的值是等价的，也会被认为是依赖项发生了变化。这是一个刚开始使用 Hooks时很容易导致 Bug 的地方。例如下面的代码：

```
function Sample() {
  // 这里在每次组件执行时创建了一个新数组
  const todos = [{ text: 'Learn hooks.'}];
  useEffect(() => {
    console.log('Todos changed.');
  }, [todos]);
}

```

代码的原意可能是在 todos 变化的时候去产生一些副作用，但是这里的 todos 变量是在函数内创建的，实际上每次都产生了一个新数组。所以在作为依赖项的时候进行引用的比较，实际上被认为是发生了变化的。


## 掌握 Hooks 的使用规则
**只能在函数组件的顶级作用域使用；只能在函数组件或者其他Hooks中使用。**

#### Hooks 只能在函数组件的顶级作用域使用
所谓**顶层作用域**，就是 **Hooks 不能在循环、条件判断或者嵌套函数内执行，而必须是在顶层**。同时 **Hooks 在组件的多次渲染之间，必须按顺序被执行**。因为在 React 组件内部，其实是维护了一个对应组件的固定 Hooks 执行列表的，以便在多次渲染之间保持 Hooks 的状态，并做对比。


而下面的代码是错误的，因为在某些条件下 Hooks 是不会被执行到的：


```
function MyComp() {
  const [count, setCount] = useState(0);
  if (count > 10) {
    // 错误：不能将 Hook 用在条件判断里
    useEffect(() => {
      // ...
    }, [count])
  }
  
  // 这里可能提前返回组件渲染结果，后面就不能再用 Hooks 了
  if (count === 0) {
    return 'No content';
  }

  // 错误：不能将 Hook 放在可能的 return 之后
  const [loading, setLoading] = useState(false);
  
  //...
  return 
{count}

}

```

**总结为两点：第一，所有 Hook 必须要被执行到。第二，必须按顺序执行。**

#### Hooks 只能在函数组件或者其它 Hooks 中使用

一种是在函数组件内，另外一种则是在自定义的 Hooks 里面。


这个规则在函数组件和类组件同时存在的项目中，可能会造成一定的困扰，因为 Hooks 简洁、直观，我们可能都倾向于用 Hooks 来实现逻辑的重用，但是如果一定要在 Class 组件中使用，那应该如何做呢？其实有一个通用的机制，那就是利用高阶组件的模式，将 Hooks 封装成高阶组件，从而让类组件使用。


举个例子。我们已经定义了监听窗口大小变化的一个 Hook：useWindowSize。那么很容易就可以将其转换为高阶组件：
```
import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

export const withWindowSize = (Comp) => {
  return props => {
    const windowSize = useWindowSize();
    return ;
  };
};
```

那么我们就可以通过如下代码来使用这个高阶组件：
```
import React from 'react';
import { withWindowSize } from './withWindowSize';

class MyComp {
  render() {
    const { windowSize } = this.props;
    // ...
  }
}

// 通过 withWindowSize 高阶组件给 MyComp 添加 windowSize 属性
export default withWindowSize(MyComp);

```
这样，通过 withWindowSize 这样一个高阶组件模式，你就可以把 useWindowSize 的结果作为属性，传递给需要使用窗口大小的类组件，这样就可以实现在 Class 组件中复用 Hooks 的逻辑了。


**专门用来检查 Hooks 是否正确被使用，它就是 eslint-plugin-react-hooks 。**

## 为什么要避免重复定义回调函数？
### useCallback：缓存回调函数
在 React 函数组件中，每一次 UI 的变化，都是通过重新执行整个函数来完成的，这和传统的 Class 组件有很大区别：函数组件中并没有一个直接的方式在多次渲染之间维持一个状态。

比如下面的代码中，我们在加号按钮上定义了一个事件处理函数，用来让计数器加1。但是因为定义是在函数组件内部，因此在多次渲染之间，是无法重用 handleIncrement 这个函数的，而是每次都需要创建一个新的：
```
function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = () => setCount(count + 1);
  // ...
  return +
}
```
你不妨思考下这个过程。每次组件状态发生变化的时候，函数组件实际上都会重新执行一遍。在每次执行的时候，实际上都会创建一个新的事件处理函数 handleIncrement。这个事件处理函数中呢，包含了 count 这个变量的闭包，以确保每次能够得到正确的结果。

这也意味着，即使 count 没有发生变化，但是函数组件因为其它状态发生变化而重新渲染时，这种写法也会每次创建一个新的函数。创建一个新的事件处理函数，虽然不影响结果的正确性，但其实是没必要的。因为这样做不仅增加了系统的开销，更重要的是：**每次创建新函数的方式会让接收事件处理函数的组件，需要重新渲染**。


比如这个例子中的 button 组件，接收了 handleIncrement ，并作为一个属性。如果每次都是一个新的，那么这个 React 就会认为这个组件的 props 发生了变化，从而必须重新渲染。因此，我们需要做到的是：**只有当 count 发生变化时，我们才需要重新定一个回调函数**。而这正是 useCallback 这个 Hook 的作用。

它的 API 签名如下：
```
useCallback(fn, deps)
```

这里fn是定义的回调函数，deps是依赖的变量数组。只有当某个依赖变量发生变化时，才会重新声明 fn这个回调函数。那么对于上面的例子，我们可以把 handleIncrement这个事件处理函数通过 useCallback 来进行性能的优化：
```
import React, { useState, useCallback } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = useCallback(
    () => setCount(count + 1),
    [count], // 只有当 count 发生变化时，才会重新创建回调函数
  );
  // ...
  return +
}
```
在这里，我们把 count 这个 state ，作为一个依赖传递给 useCallback。这样，只有 count 发生变化的时候，才需要重新创建一个回调函数，这样就保证了组件不会创建重复的回调函数。而接收这个回调函数作为属性的组件，也不会频繁地需要重新渲染。

### useMemo：缓存计算的结果
useMemo 的 API 签名如下：
```
useMemo(fn, deps);

```
这里的fn是产生所需数据的一个计算函数。通常来说，fn会使用 deps 中声明的一些变量来生成一个结果，用来渲染出最终的 UI。

这个场景应该很容易理解：**如果某个数据是通过其它数据计算得到的，那么只有当用到的数据，也就是依赖的数据发生变化的时候，才应该需要重新计算**。

举个例子，对于一个显示用户信息的列表，现在需要对用户名进行搜索，且 UI 上需要根据搜索关键字显示过滤后的用户，那么这样一个功能需要有两个状态：

1. 用户列表数据本身：来自某个请求。
2. 搜索关键字：用户在搜索框输入的数据。

无论是两个数据中的哪一个发生变化，都需要过滤用户列表以获得需要展示的数据。那么如果不使用 useMemo 的话，就需要用这样的代码实现：
```
import React, { useState, useEffect } from "react";

export default function SearchUserList() {
  const [users, setUsers] = useState(null);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    const doFetch = async () => {
      // 组件首次加载时发请求获取用户数据
      const res = await fetch("https://reqres.in/api/users/");
      setUsers(await res.json());
    };
    doFetch();
  }, []);
  let usersToShow = null;

  if (users) {
    // 无论组件为何刷新，这里一定会对数组做一次过滤的操作
    usersToShow = users.data.filter((user) =>
      user.first_name.includes(searchKey),
    );
  }

  return (
    

      
{searchKey}
 setSearchKey(evt.target.value)}
      />
      

        {usersToShow &&
          usersToShow.length > 0 &&
          usersToShow.map((user) => {
            return 
{user.first_name}
;
          })}
      

    

  );
}
```

在这个例子中，无论组件为何要进行一次重新渲染，实际上都需要进行一次过滤的操作。但其实你只需要在 users 或者 searchKey 这两个状态中的某一个发生变化时，重新计算获得需要展示的数据就行了。那么，这个时候，我们就可以用 useMemo 这个 Hook 来实现这个逻辑，缓存计算的结果：

```
//...
// 使用 userMemo 缓存计算的结果
const usersToShow = useMemo(() => {
    if (!users) return null;
    return users.data.filter((user) => {
      return user.first_name.includes(searchKey));
    }
  }, [users, searchKey]);
//...
```
可以看到，通过 useMemo 这个 Hook，可以避免在用到的数据没发生变化时进行的重复计算。虽然例子展示的是一个很简单的场景，但如果是一个复杂的计算，那么对于提升性能会有很大的帮助。这也是userMemo的一大好处：避免重复计算。

除了避免重复计算之外，**useMemo 还有一个很重要的好处：避免子组件的重复渲染**。比如在例子中的 usersToShow 这个变量，如果每次都需要重新计算来得到，那么对于 UserList 这个组件而言，就会每次都需要刷新，因为它将 usersToShow 作为了一个属性。而一旦能够缓存上次的结果，就和 useCallback 的场景一样，可以避免很多不必要的组件刷新。


这个时候，如果我们结合 useMemo 和 useCallback 这两个 Hooks 一起看，**会发现一个有趣的特性，那就是 useCallback 的功能其实是可以用 useMemo 来实现的**。比如下面的代码就是利用 useMemo 实现了 useCallback 的功能：

```
 const myEventHandler = useMemo(() => {
   // 返回一个函数作为缓存结果
   return () => {
     // 在这里进行事件处理
   }
 }, [dep1, dep2]);
```
理解了这一点，相信你一下子会对这两个 Hooks 的机制有更进一步的认识，也就不用死记硬背两个 API 都是干嘛的了，因为从本质上来说，它们只是做了同一件事情：**建立了一个绑定某个结果到依赖数据的关系。只有当依赖变了，这个结果才需要被重新得到**。

### useRef：在多次渲染之间共享数据
函数组件虽然非常直观，简化了思考 UI 实现的逻辑，但是比起 Class 组件，**还缺少了一个很重要的能力：在多次渲染之间共享数据**。

在类组件中，我们可以定义类的成员变量，以便能在对象上通过成员属性去保存一些数据。但是在函数组件中，是没有这样一个空间去保存数据的。因此，React 让useRef 这样一个 Hook 来提供这样的功能。

useRef 的API签名如下：
```
const myRefContainer = useRef(initialValue);
```
我们可以把useRef看作是在函数组件之外创建的一个容器空间。在这个容器上，我们可以通过唯一的 current 属设置一个值，从而在函数组件的多次渲染之间共享这个值。

假设你要去做一个计时器组件，这个组件有开始和暂停两个功能。很显然，你需要用 window.setInterval 来提供计时功能；而为了能够暂停，你就需要在某个地方保存这个 window.setInterval 返回的计数器的引用，确保在点击暂停按钮的同时，也能用 window.clearInterval 停止计时器。那么，这个保存计数器引用的最合适的地方，就是 useRef，因为它可以存储跨渲染的数据。代码如下：

```

import React, { useState, useCallback, useRef } from "react";

export default function Timer() {
  // 定义 time state 用于保存计时的累积时间
  const [time, setTime] = useState(0);

  // 定义 timer 这样一个容器用于在跨组件渲染之间保存一个变量
  const timer = useRef(null);

  // 开始计时的事件处理函数
  const handleStart = useCallback(() => {
    // 使用 current 属性设置 ref 的值
    timer.current = window.setInterval(() => {
      setTime((time) => time + 1);
    }, 100);
  }, []);

  // 暂停计时的事件处理函数
  const handlePause = useCallback(() => {
    // 使用 clearInterval 来停止计时
    window.clearInterval(timer.current);
    timer.current = null;
  }, []);

  return (
    

      {time / 10} seconds.
      

      Start
      Pause
    

  );
}
```

这里可以看到，我们使用了 useRef 来创建了一个保存 window.setInterval 返回句柄的空间，从而能够在用户点击暂停按钮时清除定时器，达到暂停计时的目的。

同时你也可以看到，**使用 useRef 保存的数据一般是和 UI 的渲染无关的，因此当 ref 的值发生变化时，是不会触发组件的重新渲染的，这也是 useRef 区别于 useState 的地方**。

除了存储**跨渲染**的数据之外，useRef还有一个重要的功能，**就是保存某个 DOM 节点的引用**。我们知道，在React 中，几乎不需要关心真实的 DOM 节点是如何渲染和修改的。但是在某些场景中，我们必须要获得真实 DOM 节点的引用，所以结合 React 的 ref属性和 useRef 这个 Hook，我们就可以获得真实的 DOM 节点，并对这个节点进行操作。

比如说，你需要在点击某个按钮时让某个输入框获得焦点，可以通过下面的代码来实现：
```
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // current 属性指向了真实的 input 这个 DOM 节点，从而可以调用 focus 方法
    inputEl.current.focus();
  };
  return (
    <>
      

      Focus the input
    
  );
}

```
这段代码是 React 官方文档提供的一个例子，可以看到ref 这个属性提供了获得 DOM 节点的能力，并利用 useRef 保存了这个节点的应用。这样的话，一旦 input 节点被渲染到界面上，那我们通过 inputEl.current 就能访问到真实的 DOM 节点的实例了。

### useContext：定义全局状态
React 组件之间的状态传递只有一种方式，那就是通过 props。这就意味着这种传递关系只能在父子组件之间进行。

看到这里你肯定会问，如果要跨层次，或者同层的组件之间要进行数据的共享，那应该如何去实现呢？这其实就涉及到一个新的命题：全局状态管理。

为此，React 提供了 Context 这样一个机制，能够让所有在某个组件开始的组件树上创建一个 Context。这样这个组件树上的所有组件，就都能访问和修改这个 Context了。那么在函数组件里，我们就可以使用 useContext 这样一个 Hook 来管理 Context。

useContext 的API 签名如下：

```
const value = useContext(MyContext);
```

正如刚才提到的，一个 Context 是从某个组件为根组件的组件树上可用的，所以我们需要有 API 能够创建一个 Context，这就是 React.createContext API，如下：

```
const MyContext = React.createContext(initialValue);
```

这里的 MyContext 具有一个 Provider 的属性，一般是作为组件树的根组件。这里我仍然以 React 官方文档的例子来讲解，即：一个主题的切换机制。代码如下：

```
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};
// 创建一个 Theme 的 Context

const ThemeContext = React.createContext(themes.light);
function App() {
  // 整个应用使用 ThemeContext.Provider 作为根组件
  return (
    // 使用 themes.dark 作为当前 Context 
    
  );
}

// 在 Toolbar 组件中使用一个会使用 Theme 的 Button
function Toolbar(props) {
  return (

  );
}

// 在 Theme Button 中使用 useContext 来获取当前的主题
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    
      I am styled by theme context!
    
  );
}
```

看到这里你也许会有点好奇，Context 看上去就是一个全局的数据，为什么要设计这样一个复杂的机制，而不是直接用一个全局的变量去保存数据呢？

答案其实很简单，就是**为了能够进行数据的绑定**。当这个 Context 的数据发生变化时，使用这个数据的组件就能够自动刷新。但如果没有 Context，而是使用一个简单的全局变量，就很难去实现了。

不过刚才我们看到的其实是一个静态的使用 Context 的例子，直接用了 thems.dark 作为 Context 的值。那么如何让它变得动态呢？

可以看到，themes.dark 是作为一个属性值传给 Provider 这个组件的，如果要让它变得动态，其实只要用一个 state 来保存，通过修改 state，就能实现动态的切换Context 的值了。而且这么做，所有用到这个Context 的地方都会自动刷新。比如这样的代码：

```
function App() {
  // 使用 state 来保存 theme 从而可以动态修改
  const [theme, setTheme] = useState("light");

  // 切换 theme 的回调函数
  const toggleTheme = useCallback(() => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }, []);

  return (
    // 使用 theme state 作为当前 Context
    
      Toggle Theme
      
    
  );
}

```

可以看到，Context 提供了一个方便在多个组件之间共享数据的机制。不过需要注意的是，它的灵活性也是一柄双刃剑。你或许已经发现，Context 相当于提供了一个定义 React 世界中全局变量的机制，而全局变量则意味着两点：
1. 会让调试变得困难，因为你很难跟踪某个 Context 的变化究竟是如何产生的。
2. 让组件的复用变得困难，因为一个组件如果使用了某个 Context，它就必须确保被用到的地方一定有这个 Context 的 Provider 在其父组件的路径上。

所以在 React 的开发中，除了像 Theme、Language 等一目了然的需要全局设置的变量外，我们很少会使用 Context 来做太多数据的共享。需要再三强调的是，**Context 更多的是提供了一个强大的机制，让 React 应用具备定义全局的响应式数据的能力**。

## 如何正确理解函数组件的生命周期？
 React 的本质：**从 Model 到 View 的映射**。假设状态永远不变，那么实际上函数组件就相当于是一个模板引擎，只执行一次。但是 React 本身正是为动态的状态变化而设计的，而可能引起状态变化的原因基本只有两个：
 1. 用户操作产生的事件，比如点击了某个按钮。
 2. 副作用产生的事件，比如发起某个请求正确返回了。

这两种事件本身并不会导致组件的重新渲染，但我们在这两种事件处理函数中，一定是因为改变了某个状态，这个状态可能是 State 或者 Context，从而导致了 UI 的重新渲染。

比如对于在第三讲介绍的例子，一个用于显示博客文章的组件接收一个文章的 id 作为参数，然后根据这个 id 从服务器端获取文章的内容并显示出来。那么当 id 变化的时候，你就需要检测到这个变化，并重新发送请求，显示在界面上。在 Class 组件中，你通常要用如下的代码实现：

```
class BlogView extends React.Component {
  // ...
  componentDidMount() {
    // 组件第一次加载时去获取 Blog 数据
    fetchBlog(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      // 当 Blog 的 id 发生变化时去获取博客文章
      fetchBlog(this.props.id);
    }
  }
  // ...
}
```

可以看到，在 Class 组件中，需要在两个生命周期方法中去实现副作用，一个是首次加载，另外一个则是每次 UI 更新后。而在函数组件中不再有生命周期的概念，而是提供了 useEffect 这样一个 Hook 专门用来执行副作用，因此，只需下面的代码即可实现同样的功能：

```
function BlogView({ id }) {
  useEffect(() => {
    // 当 id 变化时重新获取博客文章
    fetchBlog(id);
  }, [id]); // 定义了依赖项 id
}

```

可以看到，在函数组件中你要思考的方式永远是：**当某个状态发生变化时，我要做什么**，而不再是在 Class 组件中的某个生命周期方法中我要做什么。

### 重新思考组件的生命周期
#### 构造函数
在所以其它代码执行之前的一次性初始化工作。在函数组件中，因为没有生命周期的机制，那么转换一下思路，其实我们要实现的是：一次性的代码执行。

虽然没有直接的机制可以做到这一点，但是利用 useRef 这个 Hook，我们可以实现一个 useSingleton 这样的一次性执行某段代码的自定义 Hook，代码如下：

```
import { useRef } from 'react';

// 创建一个自定义 Hook 用于执行一次性代码
function useSingleton(callback) {
  // 用一个 called ref 标记 callback 是否执行过
  const called = useRef(false);
  // 如果已经执行过，则直接返回
  if (called.current) return;
  // 第一次调用时直接执行
  callBack();
  // 设置标记为已执行过
  called.current = true;
}

```

从而在一个函数组件中，可以调用这个自定义 Hook 来执行一些一次性的初始化逻辑：

```
import useSingleton from './useSingleton';

const MyComp = () => {
  // 使用自定义 Hook
  useSingleton(() => {
    console.log('这段代码只执行一次');
  });

  return (
    
My Component

  );
};
```

#### 三种常用的生命周期方法

```
import React, { useEffect } from 'react';
import comments from './comments';

function BlogView({ id }) {
  const handleCommentsChange = useCallback(() => {
    // 处理评论变化的通知
  }, []);
  useEffect(() => {
    // 获取博客内容
    fetchBlog(id);
    // 监听指定 id 的博客文章的评论变化通知
    const listener = comments.addListener(id, handleCommentsChange);
    
    return () => {
      // 当 id 发生变化时，移除之前的监听
      comments.removeListener(listener);
    };
  }, [id, handleCommentsChange])
}

```

理解这一点非常重要。useEffect 中返回的回调函数，只是清理当前执行的 Effect 本身。这其实是更加语义化的，因此你不用将其映射到 componentWillUnmount，它也完全不等价于 componentWillUnmount。**你只需记住它的作用就是用于清理上一次 Effect 的结果就行了**，这样在实际的开发中才能够使用得更加自然和合理。

#### 其它的生命周期方法
但是 Class 组件中还有其它一些比较少用的方法，比如 getSnapshotBeforeUpdate, componentDidCatch, getDerivedStateFromError。比较遗憾的是目前 Hooks 还没法实现这些功能。因此如果必须用到，你的组件仍然需要用类组件去实现。

#### 已有应用是否应该迁移到 Hooks？

答案其实很明确：完全没必要。

在 React 中，Class 组件和函数组件是完全可以共存的。对于新的功能，我会更推荐使用函数组件。而对于已有的功能，则维持现状就可以。除非要进行大的功能改变，可以顺便把相关的类组件进行重构，否则是没有必要进行迁移的。

因为终究来说，能正确工作的代码就是好代码。React 组件的两种写法本身就可以很好地一起工作了：
1. 类组件和函数组件可以互相引用；
2. Hooks 很容易就能转换成高阶组件，并供类组件使用。

总结来说，我们完全没必要为了迁移而迁移。


## 自定义Hooks ：四个典型的使用场景
在遇到一个功能开发的需求时，首先问自己一个问题：**这个功能中的哪些逻辑可以抽出来成为独立的 Hooks**？

 Hooks 有两个非常核心的优点：
 1. 一是方便进行逻辑复用；
 2. 二是帮助关注分离。

###  如何创建自定义 Hooks？
自定义 Hooks 在形式上其实非常简单，**就是声明一个名字以 use 开头的函数**，比如 useCounter。这个函数在形式上和普通的 JavaScript 函数没有任何区别，你可以传递任意参数给这个 Hook，也可以返回任何值。

但是要注意，Hooks 和普通函数在语义上是有区别的，**就在于函数中有没有用到其它 Hooks**。

什么意思呢？就是说如果你创建了一个 useXXX 的函数，但是内部并没有用任何其它 Hooks，那么这个函数就不是一个 Hook，而只是一个普通的函数。但是如果用了其它 Hooks ，那么它就是一个 Hook。

举一个简单的例子，在第3讲中我们看到过一个简单计数器的实现，当时把业务逻辑都写在了函数组件内部，但其实是可以把业务逻辑提取出来成为一个 Hook。比如下面的代码：

```
import { useState, useCallback }from 'react';
 
function useCounter() {
  // 定义 count 这个 state 用于保存当前数值
  const [count, setCount] = useState(0);
  // 实现加 1 的操作
  const increment = useCallback(() => setCount(count + 1), [count]);
  // 实现减 1 的操作
  const decrement = useCallback(() => setCount(count - 1), [count]);
  // 重置计数器
  const reset = useCallback(() => setCount(0), []);
  
  // 将业务逻辑的操作 export 出去供调用者使用
  return { count, increment, decrement, reset };
}
有了这个 Hook，我们就可以在组件中使用它，比如下面的代码：

import React from 'react';

function Counter() {
  // 调用自定义 Hook
  const { count, increment, decrement, reset } = useCounter();

  // 渲染 UI
  return (
    

       - 
      
{count}


       + 
       reset 
    

  );
}
```

在这段代码中，我们把原来在函数组件中实现的逻辑提取了出来，成为一个单独的 Hook，**一方面能让这个逻辑得到重用，另外一方面也能让代码更加语义化，并且易于理解和维护**。

从这个例子，我们可以看到自定义 Hooks 的两个特点：
1. 名字一定是以 use 开头的函数，这样 React 才能够知道这个函数是一个 Hook；
2. 函数内部一定调用了其它的 Hooks，可以是内置的 Hooks，也可以是其它自定义 Hooks。这样才能够让组件刷新，或者去产生副作用。

### 封装通用逻辑：useAsync
在组件的开发过程中，有一些常用的通用逻辑。过去可能会因为逻辑重用比较繁琐，而经常在每个组件中去自己实现，造成维护的困难。但现在有了 Hooks，就可以将更多的通用逻辑通过 Hooks 的形式进行封装，方便被不同的组件重用。

比如说，在日常 UI 的开发中，有一个最常见的需求：**发起异步请求获取数据并显示在界面上**。在这个过程中，我们不仅要关心请求正确返回时，UI 会如何展现数据；还需要处理请求出错，以及关注 Loading 状态在 UI 上如何显示。

我们可以重新看下在第1讲中看到的异步请求的例子，从 Server 端获取用户列表，并显示在界面上：

```
import React from "react";

export default function UserList() {
  // 使用三个 state 分别保存用户列表，loading 状态和错误状态
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // 定义获取用户的回调函数
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://reqres.in/api/users/");
      const json = await res.json();
      // 请求成功后将用户数据放入 state
      setUsers(json.data);
    } catch (err) {
      // 请求失败将错误状态放入 state
      setError(err);
    }
    setLoading(false);
  };

  return (
    

      
        {loading ? "Loading..." : "Show Users"}
      
      {error && 
        
Failed: {String(error)}

      }
      

      

        {users && users.length > 0 &&
          users.map((user) => {
            return 
{user.first_name}
;
          })}
      

    

  );
}
```

事实上，在处理这类请求的时候，模式都是类似的，通常都会遵循下面步骤：
1. 创建 data，loading，error 这3个 state；
2. 请求发出后，设置 loading state 为 true；
3. 请求成功后，将返回的数据放到某个 state 中，并将 loading state 设为 false；
4. 请求失败后，设置 error state 为 true，并将 loading state 设为 false。

所以，通过创建一个自定义 Hook，可以很好地将这样的逻辑提取出来，成为一个可重用的模块。比如代码可以这样实现：

```
import { useState } from 'react';

const useAsync = (asyncFunction) => {
  // 设置三个异步逻辑相关的 state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 定义一个 callback 用于执行异步逻辑
  const execute = useCallback(() => {
    // 请求开始时，设置 loading 为 true，清除已有数据和 error 状态
    setLoading(true);
    setData(null);
    setError(null);
    return asyncFunction()
      .then((response) => {
        // 请求成功时，将数据写进 state，设置 loading 为 false
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        // 请求失败时，设置 loading 为 false，并设置错误状态
        setError(error);
        setLoading(false);
      });
  }, [asyncFunction]);

  return { execute, loading, data, error };
};

```

那么有了这个 Hook，我们在组件中就只需要关心与业务逻辑相关的部分。比如代码可以简化成这样的形式：

```
import React from "react";
import useAsync from './useAsync';

export default function UserList() {
  // 通过 useAsync 这个函数，只需要提供异步逻辑的实现
  const {
    execute: fetchUsers,
    data: users,
    loading,
    error,
  } = useAsync(async () => {
    const res = await fetch("https://reqres.in/api/users/");
    const json = await res.json();
    return json.data;
  });
  
  return (
    // 根据状态渲染 UI...
  );
}
```

通过这个例子可以看到，我们**利用了 Hooks 能够管理 React 组件状态的能力，将一个组件中的某一部分状态独立出来，从而实现了通用逻辑的重用**。

不过在这里你可能会有一个疑问：这种类型的封装我写一个工具类不就可以了？为什么一定要通过 Hooks 进行封装呢？

答案很容易就能想到。因为在 Hooks 中，你可以管理当前组件的 state，从而将更多的逻辑写在可重用的 Hooks 中。但是要知道，在普通的工具类中是无法直接修改组件 state 的，那么也就无法在数据改变的时候触发组件的重新渲染。

### 监听浏览器状态：useScroll
虽然 React 组件基本上不需要关心太多的浏览器 API，但是有时候却是必须的：
+ 界面需要根据在窗口大小变化重新布局；
+ 在页面滚动时，需要根据滚动条位置，来决定是否显示一个“返回顶部”的按钮。

正如 Hooks 的字面意思是“钩子”，它带来的一大好处就是：**可以让 React 的组件绑定在任何可能的数据源上。这样当数据源发生变化时，组件能够自动刷新**。把这个好处对应到滚动条位置这个场景就是：组件需要绑定到当前滚动条的位置数据上。

```
import { useState, useEffect } from 'react';

// 获取横向，纵向滚动条位置
const getPosition = () => {
  return {
    x: document.body.scrollLeft,
    y: document.body.scrollTop,
  };
};
const useScroll = () => {
  // 定一个 position 这个 state 保存滚动条位置
  const [position, setPosition] = useState(getPosition());
  useEffect(() => {
    const handler = () => {
      setPosition(getPosition(document));
    };
    // 监听 scroll 事件，更新滚动条位置
    document.addEventListener("scroll", handler);
    return () => {
      // 组件销毁时，取消事件监听
      document.removeEventListener("scroll", handler);
    };
  }, []);
  return position;
};
```

有了这个 Hook，你就可以非常方便地监听当前浏览器窗口的滚动条位置了。比如下面的代码就展示了“返回顶部”这样一个功能的实现：


```
import React, { useCallback } from 'react';
import useScroll from './useScroll';

function ScrollTop() {
  const { y } = useScroll();

  const goTop = useCallback(() => {
    document.body.scrollTop = 0;
  }, []);

  const style = {
    position: "fixed",
    right: "10px",
    bottom: "10px",
  };
  // 当滚动条位置纵向超过 300 时，显示返回顶部按钮
  if (y > 300) {
    return (
      
        Back to Top
      
    );
  }
  // 否则不 render 任何 UI
  return null;
}
```

通过这个例子，我们看到了如何将浏览器状态变成可被 React 组件绑定的数据源，从而在使用上更加便捷和直观。当然，除了窗口大小、滚动条位置这些状态，还有其它一些数据也可以这样操作，比如 cookies，localStorage, URL，等等。你都可以通过这样的方法来实现。


### 拆分复杂组件
保持每个函数的短小

做法很简单，**就是尽量将相关的逻辑做成独立的 Hooks，然后在函数组中使用这些 Hooks，通过参数传递和返回值让 Hooks 之间完成交互**。

这里可以注意一点，拆分逻辑的目的不一定是为了重用，而可以是仅仅为了业务逻辑的隔离。所以在这个场景下，我们不一定要把 Hooks 放到独立的文件中，而是可以和函数组件写在一个文件中。这么做的原因就在于，这些 Hooks 是和当前函数组件紧密相关的，所以写到一起，反而更容易阅读和理解。

为了让你对这一点有更直观的感受，我们来看一个例子。设想现在有这样一个需求：我们需要展示一个博客文章的列表，并且有一列要显示文章的分类。同时，我们还需要提供表格过滤功能，以便能够只显示某个分类的文章。

为了支持过滤功能，后端提供了两个 API：一个用于获取文章的列表，另一个用于获取所有的分类。这就需要我们在前端将文章列表返回的数据分类 ID 映射到分类的名字，以便显示在列表里。

**改变这个状况的关键仍然在于开发思路的转变。** 我们要真正**把 Hooks 就看成普通的函数，能隔离的尽量去做隔离**，从而让代码更加模块化，更易于理解和维护。

那么针对这样一个功能，我们甚至可以将其拆分成4个 Hooks，每一个 Hook 都尽量小，代码如下：

```
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { Select, Table } from "antd";
import _ from "lodash";
import useAsync from "./useAsync";

const endpoint = "https://myserver.com/api/";
const useArticles = () => {
  // 使用上面创建的 useAsync 获取文章列表
  const { execute, data, loading, error } = useAsync(
    useCallback(async () => {
      const res = await fetch(`${endpoint}/posts`);
      return await res.json();
    }, []),
  );
  // 执行异步调用
  useEffect(() => execute(), [execute]);
  // 返回语义化的数据结构
  return {
    articles: data,
    articlesLoading: loading,
    articlesError: error,
  };
};
const useCategories = () => {
  // 使用上面创建的 useAsync 获取分类列表
  const { execute, data, loading, error } = useAsync(
    useCallback(async () => {
      const res = await fetch(`${endpoint}/categories`);
      return await res.json();
    }, []),
  );
  // 执行异步调用
  useEffect(() => execute(), [execute]);

  // 返回语义化的数据结构
  return {
    categories: data,
    categoriesLoading: loading,
    categoriesError: error,
  };
};
const useCombinedArticles = (articles, categories) => {
  // 将文章数据和分类数据组合到一起
  return useMemo(() => {
    // 如果没有文章或者分类数据则返回 null
    if (!articles || !categories) return null;
    return articles.map((article) => {
      return {
        ...article,
        category: categories.find(
          (c) => String(c.id) === String(article.categoryId),
        ),
      };
    });
  }, [articles, categories]);
};
const useFilteredArticles = (articles, selectedCategory) => {
  // 实现按照分类过滤
  return useMemo(() => {
    if (!articles) return null;
    if (!selectedCategory) return articles;
    return articles.filter((article) => {
      console.log("filter: ", article.categoryId, selectedCategory);
      return String(article?.category?.name) === String(selectedCategory);
    });
  }, [articles, selectedCategory]);
};

const columns = [
  { dataIndex: "title", title: "Title" },
  { dataIndex: ["category", "name"], title: "Category" },
];

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  // 获取文章列表
  const { articles, articlesError } = useArticles();
  // 获取分类列表
  const { categories, categoriesError } = useCategories();
  // 组合数据
  const combined = useCombinedArticles(articles, categories);
  // 实现过滤
  const result = useFilteredArticles(combined, selectedCategory);

  // 分类下拉框选项用于过滤
  const options = useMemo(() => {
    const arr = _.uniqBy(categories, (c) => c.name).map((c) => ({
      value: c.name,
      label: c.name,
    }));
    arr.unshift({ value: null, label: "All" });
    return arr;
  }, [categories]);

  // 如果出错，简单返回 Failed
  if (articlesError || categoriesError) return "Failed";

  // 如果没有结果，说明正在加载
  if (!result) return "Loading...";

  return (
```


## 全局状态管理：如何在函数组件中使用 Redux？
![redux](@imgs/redux.png)

##### Redux Store 的两个特点
1. Redux Store 是全局唯一的。即整个应用程序一般只有一个 Store。
2. Redux Store 是树状结构，可以更天然地映射到组件树的结构，虽然不是必须的。

我们通过把状态放在组件之外，就可以让 React 组件成为更加纯粹的表现层，那么很多对于业务数据和状态数据的管理，就都可以在组件之外去完成（后面课程会介绍的 Reducer 和 Action）。同时这也天然提供了状态共享的能力，有两个场景可以典型地体现出这一点。

1. 跨组件的状态共享：当某个组件发起一个请求时，将某个 Loading 的数据状态设为 True，另一个全局状态组件则显示 Loading 的状态。
2. 同组件多个实例的状态共享：某个页面组件初次加载时，会发送请求拿回了一个数据，切换到另外一个页面后又返回。这时数据已经存在，无需重新加载。设想如果是本地的组件 state，那么组件销毁后重新创建，state 也会被重置，就还需要重新获取数据。

### 理解 Redux 的三个基本概念
Redux 引入的概念其实并不多，主要就是三个：State、Action 和 Reducer。

+ 其中 State 即 Store，一般就是一个纯 JavaScript Object
+ Action 也是一个 Object，用于描述发生的动作。
+ 而 Reducer 则是一个函数，接收 Action 和 State 并作为参数，通过计算得到新的 Store。

它们三者之间的关系可以用下图来表示：
![redux-relation.png](@imgs/redux-relation.png)

在 Redux 中，所有对于 Store 的修改都必须通过这样一个公式去完成，即通过 Reducer 完成，而不是直接修改 Store。这样的话，一方面可以保证数据的不可变性（Immutable），同时也能带来两个非常大的好处。
1. 可预测性（Predictable）：即给定一个初始状态和一系列的 Action，一定能得到一致的结果，同时这也让代码更容易测试。
2. 易于调试：可以跟踪 Store 中数据的变化，甚至暂停和回放。因为每次 Action 产生的变化都会产生新的对象，而我们可以缓存这些对象用于调试。Redux 的基于浏览器插件的开发工具就是基于这个机制，非常有利于调试。

这么抽象的解释，你可能不好理解，别着急，我给你举个例子，来帮助你理解这几个概念。这个例子是开发一个计数器的逻辑。比如说要实现“加一”和“减一”这两个功能，对于 Redux 来说，我们需要如下代码：

```
import { createStore } from 'redux'

// 定义 Store 的初始值
const initialState = { value: 0 }

// Reducer，处理 Action 返回新的 State
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'counter/incremented':
      return { value: state.value + 1 }
    case 'counter/decremented':
      return { value: state.value - 1 }
    default:
      return state
  }
}

// 利用 Redux API 创建一个 Store，参数就是 Reducer
const store = createStore(counterReducer)

// Store 提供了 subscribe 用于监听数据变化
store.subscribe(() => console.log(store.getState()))

// 计数器加 1，用 Store 的 dispatch 方法分发一个 Action，由 Reducer 处理
const incrementAction = { type: 'counter/incremented' };
store.dispatch(incrementAction);
// 监听函数输出：{value: 1}

// 计数器减 1
const decrementAction = { type: 'counter/decremented' };
store.dispatch(decrementAction)
// 监听函数输出：{value: 0}
```

通过这段代码，我们就用三个步骤完成了一个完整的 Redux 的逻辑：

1. 先创建 Store；
2. 再利用 Action 和 Reducer 修改 Store；
3. 最后利用 subscribe 监听 Store 的变化。

需要注意的是，**在 Reducer 中，我们每次都必须返回一个新的对象，确保不可变数据（Immutable）的原则**。一般来说，我们可以用延展操作符（Spread Operator）来简单地实现不可变数据的操作，例如：

```
return {
  ...state, // 复制原有的数据结构
  value: state.value + 1, // 变化 value 值使其 + 1
}
```

这在大多数场景下已经足够使用。当然对于复杂的数据结构，也有一些第三方的库可以帮助操作不可变数据，比如 Immutable、Immer 等等。

通过这个例子，我们看到了纯 Redux 使用的场景，从而更加清楚地看到了 Store、Action 和 Reducer 这三个基本概念，也就能理解 State + Action => New State 这样一个简单却核心的机制。

### 如何在 React 中使用 Redux
主要是两点：

1. React 组件能够在依赖的 Store 的数据发生变化时，重新 Render；
2. 在 React 组件中，能够在某些时机去 dispatch 一个 action，从而触发 Store 的更新。

要实现这两点，我们需要引入 Facebook 提供的 react-redux 这样一个工具库，工具库的作用就是建立一个桥梁，让 React 和 Redux 实现互通。

在 react-redux 的实现中，为了确保需要绑定的组件能够访问到全局唯一的 Redux Store，利用了 React 的 Conext 机制去存放 Store 的信息。通常我们会将这个 Context 作为整个 React 应用程序的根节点。因此，作为 Redux 的配置的一部分，我们通常需要如下的代码：

```
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```

这里使用了 Provider 这样一个组件来作为整个应用程序的根节点，并将 Store 作为属性传给了这个组件，这样所有下层的组件就都能够使用 Redux 了。


完成了这样的配置之后，在函数组件中使用 Redux 就非常简单了：利用 react-redux 提供的 useSelector 和 useDispatch 这两个 Hooks。

在第二讲我们已经提到，Hooks 的本质就是提供了让 React 组件能够绑定到某个可变的数据源的能力。在这里，当 Hooks 用到 Redux 时可变的对象就是 Store，而 useSelector 则让一个组件能够在 Store 的某些数据发生变化时重新 render。

```
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export function Counter() {
  // 从 state 中获取当前的计数值
  const count = useSelector(state => state.value)

  // 获得当前 store 的 dispatch 方法
  const dispatch = useDispatch()

  // 在按钮的 click 时间中去分发 action 来修改 store
  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'counter/incremented' })}
      >+</button>
      <span>{count}</span>
      <button
        onClick={() => dispatch({ type: 'counter/decremented' })}
      >-</button>
    </div>
  )
}
```

![single-data-stream.png](@imgs/single-data-stream.png)


### 使用 Redux 处理异步逻辑
在 Redux 中，处理异步逻辑也常常被称为**异步 Action**，它几乎是 React 面试中必问的一道题，可以认为这是 Redux 使用的进阶场景。

在 Redux 的 Store 中，我们不仅维护着业务数据，同时维护着应用程序的状态。比如对于发送请求获取数据这样一个异步的场景，我们来看看涉及到 Store 数据会有哪些变化：

1. 请求发送出去时：设置 state.pending = true，用于 UI 显示加载中的状态；
2. 请求发送成功时：设置 state.pending = false, state.data = result。即取消 UI 的加载状态，同时将获取的数据放到 store 中用于 UI 的显示。
3. 请求发送失败时：设置 state.pending = false, state.error = error。即取消 UI 的加载状态，同时设置错误的状态，用于 UI 显示错误的内容。

前面提到，任何对 Store 的修改都是由 action 完成的。那么对于一个异步请求，上面的三次数据修改显然必须要三个 action 才能完成。那么假设我们在 React 组件中去做这个发起请求的动作，代码逻辑应该类似如下：

前面提到，任何对 Store 的修改都是由 action 完成的。那么对于一个异步请求，上面的三次数据修改显然必须要三个 action 才能完成。那么假设我们在 React 组件中去做这个发起请求的动作，代码逻辑应该类似如下：

```

function DataList() {
  const dispatch = useDispatch();
  // 在组件初次加载时发起请求
  useEffect(() => {
    // 请求发送时
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      // 请求成功时
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      // 请求失败时
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }, []);
  
  // 绑定到 state 的变化
  const data = useSelector(state => state.data);
  const pending = useSelector(state => state.pending);
  const error = useSelector(state => state.error);
  
  // 根据 state 显示不同的状态
  if (error) return 'Error.';
  if (pending) return 'Loading...';
  return <Table data={data} />;
}
```

从这段代码可以看到，我们使用了三个（同步）Action 完成了这个异步请求的场景。这里我们将 Store 完全作为一个存放数据的地方，至于数据哪里来， Redux 并不关心。尽管这样做是可行的。

但是很显然，发送请求获取数据并进行错误处理这个逻辑是不可重用的。假设我们希望在另外一个组件中也能发送同样的请求，就不得不将这段代码重新实现一遍。因此，Redux 中提供了 middleware 这样一个机制，让我们可以巧妙地实现所谓异步 Action 的概念。

简单来说，middleware 可以让你提供一个拦截器在 reducer 处理 action 之前被调用。在这个拦截器中，你可以自由处理获得的 action。无论是把这个 action 直接传递到 reducer，或者构建新的 action 发送到 reducer，都是可以的。

从下面这张图可以看到，Middleware 正是在 Action 真正到达 Reducer 之前提供的一个额外处理 Action 的机会：
![middlewares.png](@imgs/middlewares.png)

我们刚才也提到了，**Redux 中的 Action 不仅仅可以是一个 Object，它可以是任何东西，也可以是一个函数。利用这个机制，Redux 提供了 redux-thunk 这样一个中间件，它如果发现接受到的 action 是一个函数，那么就不会传递给 Reducer，而是执行这个函数，并把 dispatch 作为参数传给这个函数，从而在这个函数中你可以自由决定何时，如何发送 Action**。

例如对于上面的场景，假设我们在创建 Redux Store 时指定了 redux-thunk 这个中间件：

```
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducer'

const composedEnhancer = applyMiddleware(thunkMiddleware)
const store = createStore(rootReducer, composedEnhancer)
```

那么在我们 dispatch action 时就可以 dispatch 一个函数用于来发送请求，通常，我们会写成如下的结构：

```
function fetchData() {
  return dispatch => {
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }
}
```

那么在我们 dispatch action 时就可以 dispatch 一个函数用于来发送请求，通常，我们会写成如下的结构：

```
import fetchData from './fetchData';

function DataList() {
  const dispatch = useDispatch();
  // dispatch 了一个函数由 redux-thunk 中间件去执行
  dispatch(fetchData());
}
```

可以看到，通过这种方式，我们就实现了异步请求逻辑的重用。那么这一套结合 redux-thunk 中间件的机制，我们就称之为异步 Action。

所以说异步 Action 并不是一个具体的概念，而可以把它看作是 Redux 的一个使用模式。它通过组合使用同步 Action ，在没有引入新概念的同时，用一致的方式提供了处理异步逻辑的方案。

## 复杂状态处理：如何保证状态一致性？

该怎么去用最优、最合理的方式，去管理你的应用程序的状态。

#### 原则一：保证状态最小化
新接触 React 的同学经常会有一个错误的习惯，就是把 State 当变量用，很容易把过多的数据放到 State 里，可以说这是对 State 的一种滥用。

那到底该怎么使用 State 呢？我们需要遵循一个原则，即：**在保证 State 完整性的同时，也要保证它的最小化**。什么意思呢？

就是说，某些数据如果能从已有的 State 中计算得到，那么我们就应该始终在用的时候去计算，而不要把计算的结果存到某个 State 中。这样的话，才能简化我们的状态处理逻辑。


举个例子。你要做一个功能，需要对一个列表的结果进行关键字搜索，我们假设是一个显示电影标题的列表，需要能够对标题进行搜索。最终的效果如下图所示：

![movies.png](@imgs/movies.png)

按照 React 的状态驱动 UI 的思想，第一步就是要考虑整个功能有哪几个状态。直观上来说，页面可能包含三个状态：
1. 电影列表的数据：可能来自某个 API 请求；
2. 用户输入的关键字：来自用户的输入；
3. 搜索的结果数据：来自原始数据结合关键字的过滤结果。

```
import React, { useState, useMemo } from "react";

function FilterList({ data }) {
  const [searchKey, setSearchKey] = useState("");
  
  // 每当 searchKey 或者 data 变化的时候，重新计算最终结果
  const filtered = useMemo(() => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchKey.toLowerCase())
    );
  }, [searchKey, data]);

  return (
    <div className="08-filter-list">
      <h2>Movies</h2>
      <input
        value={searchKey}
        placeholder="Search..."
        onChange={(evt) => setSearchKey(evt.target.value)}
      />
      <ul style={{ marginTop: 20 }}>
        {filtered.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

虽然这是一个比较简单的例子，但是在实际开发的过程中，很多复杂场景之所以变得复杂，如果抽丝剥茧来看，你会发现它们都有**定义多余状态现象的影子**，而问题的根源就在于**它们没有遵循状态最小化的原则**。

**这个状态是必须的吗？是否能通过计算得到呢？**

#### 原则二：避免中间状态，确保唯一数据源
还是拿刚才讲的可搜索电影列表的例子来说，我们需要在用户体验上做一个改进，要让搜索的结果做到可分享。这个功能就类似 Baidu 这样的搜索引擎，通过一个链接就能分享搜索结果。比如说，你通过“http://www.baidu.com/s?wd= 极客时间”就可以看到极客时间的搜索结果。

**我们要有更加完善的机制，让在 URL 不管因为什么原因而发生变化的时候，都能同步查询参数到 searchKey 这个 State。**

其实，从根源上来说，产生这个复杂度的问题在于我们定义了 searchKey 这样一个多余的中间状态，而且这个 searchKey 状态来源于两个数据源：一是用户输入；二是 URL 上的参数。这就导致逻辑非常复杂。

那么**如果我们遵循唯一数据源这个原则，把 URL 上的查询关键字作为唯一数据源，逻辑就会变得简单了**：只需要在用户输入查询关键字时，直接去改变 URL 上的查询字符串就行。这个转变可以用下面的图做一个对比，你会更直观地理解：
![only-source.png](@imgs/only-source.png)

通过对比可以看到，左边引入了一个多余的 State 作为关键字这个状态，而为了保证一致性，就需要很多复杂的同步逻辑，比如说以下几点：

+ URL 变化时，同步查询关键字到 State；
+ State 变化时，同步查询关键字到输入框；
+ 用户在输入框输入的时候，同步关键字到 URL 和 State。

但是，在去掉多余的 State 后，我们就只需要在输入框和 URL 的查询参数之间做一个同步。那么实现的代码可以简化如下：


```

import React, { useCallback, useMemo } from "react";
import { useSearchParam } from "react-use";

function SearchBox({ data }) {
  // 使用 useSearchParam 这个 Hook 用于监听查询参数变化
  const searchKey = useSearchParam("key") || "";
  const filtered = useMemo(() => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchKey.toLowerCase())
    );
  }, [searchKey, data]);

  const handleSearch = useCallback((evt) => {
    // 当用户输入时，直接改变 URL
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?key=${evt.target.value}`
    );
  }, []);
  return (
    <div className="08-filter-list">
      <h2>Movies (Search key from URL)</h2>
      <input
        value={searchKey}
        placeholder="Search..."
        onChange={handleSearch}
      />
      <ul style={{ marginTop: 20 }}>
        {filtered.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

可以看到，当用户输入参数的时候，我们是直接改变当前的 URL，而不是去改变一个内部的状态。所以当 URL 变化的时候，我们使用了 useSearchParam 这样一个第三方的 Hook 去绑定查询参数，并将其显示在输入框内，从而实现了输入框内容和查询关键字这个状态的同步。

从本质上来说，这个例子展示了确保状态唯一数据源的重要性。我们是直接将 URL 作为唯一的数据来源，那么状态的读取和修改都是对 URL 直接进行操作，而不是通过一个中间的状态。这样就简化了状态的管理，保证了状态的一致性。

### 实战演练：创建自定义受控组件

首先我要解释下什么是受控组件。在 React 中，对表单组件的处理可以分为两种，受控组件和非受控组件：

1. 受控组件：组件的展示完全由传入的属性决定。比如说，如果一个输入框中的值完全由传入的 value 属性决定，而不是由用户输入决定，那么就是受控组件，写法是：< input value={value} onChange={handleChange} />。这也是为什么只给 < input/> 传了一个 value 值但是没有传 onChange 事件，那么键盘怎么输入都没有反应。

2. 非受控组件：表单组件可以有自己的内部状态，而且它的展示值是不受控的。比如 input 在非受控状态下的写法是：< input onChange={handleChange}/>。也就是说，父组件不会把 value 直接传递给 input 组件。

这个例子就是创建一个受控表单组件。比如，一个用于输入价格的表单组件，需要用户既能输入价格的数量，还能选择货币的种类，最终的效果类似下面这个图：
![currency.png](@imgs/currency.png)


```

import React, { useState, useCallback } from "react";

function PriceInput({
  // 定义默认的 value 的数据结构
  value = { amount: 0, currency: "rmb" },
  // 默认不处理 onChange 事件
  onChange = () => {}
}) {
  // 定义一个事件处理函数统一处理 amount 或者 currency 变化的场景
  const handleChange = useCallback(
    (deltaValue) => {
      // 直接修改外部的 value 值，而不是定义内部 state
      onChange({
        ...value,
        ...deltaValue
      });
    },
    [value, onChange]
  );
  return (
    <div className="exp-02-price-input">
      {/* 输入价格的数量 */}
      <input
        value={value.amount}
        onChange={(evt) => handleChange({ amount: evt.target.value })}
      />
      {/* 选择货币种类*/}
      <select
        value={value.currency}
        onChange={(evt) => handleChange({ currency: evt.target.value })}
      >
        <option value="rmb">RMB</option>
        <option value="dollar">Dollar</option>
      </select>
    </div>
  );
}
```

可以看到，这个自定义组件包含了 input 和 select 两个基础组件，分别用来输入价格数量和选择货币。在它们发生变化的时候，直接去触发 onChange 事件让父组件去修改 value 值；同样的，它们自己显示的值，则完全来自于传递进来的 value 属性。所以这其中的思考逻辑在于：

1. 避免多余的状态：我们不需要在 PriceInput 这个自定义组件内部，去定义状态用于保存的 amount 或者 currency。
2. 找到准确的唯一数据源：这里内部两个基础组件的值，其准确且唯一的来源就是 value 属性，而不是其它的任何中间状态。


## 异步处理：如何向服务器端发送请求？

### 实现自己的 API Client
无论大小项目，在开始实现第一个请求的时候，通常我们要做的第一件事应该都是**创建一个自己的 API Client，之后所有的请求都会通过这个 Client 发出去**。而不是上来就用 fetch 或者是 axios 去直接发起请求，因为那会造成大量的重复代码。


实现这样一个 Client 之后，你就有了一个统一的地方，去对你需要连接的服务端做一些通用的配置和处理，比如 Token、URL、错误处理等等。

通常来说，会包括以下几个方面：
1. 一些通用的 Header。比如 Authorization Token。
2. 服务器地址的配置。前端在开发和运行时可能会连接不同的服务器，比如本地服务器或者测试服务器，此时这个 API Client 内部可以根据当前环境判断该连接哪个 URL。
3. 请求未认证的处理。比如如果 Token 过期了，需要有一个统一的地方进行处理，这时就会弹出对话框提示用户重新登录。


我的经验来看，我更推荐把 axios 作为基础来实现这个功能。原因就在于，axios 比起 fetch，提供了更为方便，也更加语义化的 API，比如请求拦截。此外，还很容易创建多个实例，让代码逻辑更简洁。所以我就以 axios 为例，提供一个示例实现：

```

import axios from "axios";

// 定义相关的 endpoint
const endPoints = {
  test: "https://60b2643d62ab150017ae21de.mockapi.io/",
  prod: "https://prod.myapi.io/",
  staging: "https://staging.myapi.io/"
};

// 创建 axios 的实例
const instance = axios.create({
  // 实际项目中根据当前环境设置 baseURL
  baseURL: endPoints.test,
  timeout: 30000,
  // 为所有请求设置通用的 header
  headers: { Authorization: "Bear mytoken" }
});

// 听过 axios 定义拦截器预处理所有请求
instance.interceptors.response.use(
  (res) => {
    // 可以假如请求成功的逻辑，比如 log
    return res;
  },
  (err) => {
    if (err.response.status === 403) {
      // 统一处理未授权请求，跳转到登录界面
      document.location = '/login';
    }
    return Promise.reject(err);
  }
);

export default instance;
```

#### 使用 Hooks 思考异步请求：封装远程资源

```

import { useState, useEffect } from "react";
import apiClient from "./apiClient";

// 将获取文章的 API 封装成一个远程资源 Hook
const useArticle = (id) => {
  // 设置三个状态分别存储 data, error, loading
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    // 重新获取数据时重置三个状态
    setLoading(true);
    setData(null);
    setError(null);
    apiClient
      .get(`/posts/${id}`)
      .then((res) => {
        // 请求成功时设置返回数据到状态
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        // 请求失败时设置错误状态
        setLoading(false);
        setError(err);
      });
  }, [id]); // 当 id 变化时重新获取数据

  // 将三个状态作为 Hook 的返回值
  return {
    loading,
    error,
    data
  };
};
```

那么要显示一篇文章的时候，你的脑子里就不再是一个具体的 API 调用，而可以把它看作一个数据，只不过是个远程数据，于是很自然就有加载状态或者错误状态这些数据了。使用的时候，我们就可以把组件的表现层逻辑写得非常简洁：

```
import useArticle from "./useArticle";

const ArticleView = ({ id }) => {
  // 将 article 看成一个远程资源，有 data, loading, error 三个状态
  const { data, loading, error } = useArticle(id);
  if (error) return "Failed.";
  if (!data || loading) return "Loading...";
  return (
    <div className="exp-09-article-view">
      <h1>
        {id}. {data.title}
      </h1>
      <p>{data.content}</p>
    </div>
  );
};
```

可以看到，有了这样一个 Hook，React 的函数组件几乎不需要有任何业务的逻辑，而只是**把数据映射到 JSX 并显示出来**就可以了，在使用的时候非常方便。


这里有同学可能会问，为什么要给每个请求都定义一个 Hook 呢？我们直接提供一个通用的 Hook，比如 useRemoteData，然后把 API 地址传进去，难道不可以吗？

不是完全不可以，但这其实是**为了保证每个 Hook 自身足够简单**。一般来说，为了让服务器的返回数据满足 UI 上的展现要求，通常需要进一步处理。而这个对于每个请求的处理逻辑可能都不一样，通过一定的代码重复，能够避免产生太复杂的逻辑。

### 多个 API 调用：如何处理并发或串行请求？
需要显示作者、作者头像，以及文章的评论列表。那么，作为一个完整的页面，就需要发送三个请求：

1. 获取文章内容；
2. 获取作者信息，包括名字和头像的地址；
3. 获取文章的评论列表；

这三个请求**同时包含了并发和串行的场景**：文章内容和评论列表是两个可以并发的请求，它们都通过 Article ID 来获取；用户的信息需要等文章内容返回，这样才能知道作者的 ID，从而根据用户的 ID 获取用户信息，这是一个串行的场景。

```

// 并发获取文章和评论列表
const [article, comments] = await Promise.all([
  fetchArticle(articleId),
  fetchComments(articleId)
]);
// 得到文章信息后，通过 userId 获取用户信息
const user = await fetchUser(article.userId);
```

但是我们知道，**React 函数组件是一个同步的函数**，没有办法直接使用 await 这样的同步方法，而是要**把请求通过副作用去触发**。因此如果按照上面这种传统的思维，是很难把逻辑理顺的。

这时候我们就要回到 React 的本质，那就是状态驱动 UI。这意味着我们可以**从状态变化的角度去组织异步调用**。

函数组件的每一次 render，其实都提供了我们根据状态变化执行不同操作的机会，我们思考的路径，就是**利用这个机制，通过不同的状态组合，来实现异步请求的逻辑**。

那么刚才这个显示作者和评论列表的业务需求，主要的实现思路就包括下面这么四点：
1. 组件首次渲染，只有文章 ID 这个信息，产生两个副作用去获取文章内容和评论列表；
2. 组件首次渲染，作者 ID 还不存在，因此不发送任何请求；
3. 文章内容请求返回后，获得了作者 ID，然后发送请求获取用户信息；
4. 展示用户信息。

**异步请求，都是基于数据的状态去进行的**

所以，在代码层面，我们首先需要对 useUser 这个 Hook 做一个改造，使得它在没有传入 ID 的情况下，就不发送请求。对比上面的 useArticle 这个 Hook，唯一的变化就是在 useEffect 里加入了ID 是否存在的判断：

```

import { useState, useEffect } from "react";
import apiClient from "./apiClient";

export default (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    // 当 id 不存在，直接返回，不发送请求
    if (!id) return;
    setLoading(true);
    setData(null);
    setError(null);
    apiClient
      .get(`/users/${id}`)
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, [id]);
  return {
    loading,
    error,
    data
  };
};
```

那么，在文章的展示页面，我们就可以使用下面的代码来实现：

```

import { useState } from "react";
import CommentList from "./CommentList";
import useArticle from "./useArticle";
import useUser from "./useUser";
import useComments from "./useComments";

const ArticleView = ({ id }) => {
  const { data: article, loading, error } = useArticle(id);
  const { data: comments } = useComments(id);
  const { data: user } = useUser(article?.userId);
  if (error) return "Failed.";
  if (!article || loading) return "Loading...";
  return (
    <div className="exp-09-article-view">
      <h1>
        {id}. {article.title}
      </h1>
      {user && (
        <div className="user-info">
          <img src={user.avatar} height="40px" alt="user" />
          <div>{user.name}</div>
          <div>{article.createdAt}</div>
        </div>
      )}
      <p>{article.content}</p>
      <CommentList data={comments || []} />
    </div>
  );
};
```

## 函数组件设计模式：如何应对复杂条件渲染场景？



