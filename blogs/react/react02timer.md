---
title: react生命周期以及如何避坑
date: 2022/09/30
tags:
 - react
categories:
 - react
--- 

## react生命周期挂载阶段

### getDerivedStateFromProps
getDerivedStateFromProps 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。

此方法适用于 ***罕见*** 的用例，即 ***state 的值在任何时候都取决于 props。***

getDerivedStateFromProps 的存在只有一个目的：让组件在 props 变化时更新 state。

```js
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritesite: "runoob"};
  }
  static getDerivedStateFromProps(props, state) {
    return {favoritesite: props.favsite };
  }
  render() {
    return (
      <h1>我喜欢的网站是 {this.state.favoritesite}</h1>
    );
  }
}
 
ReactDOM.render(<Header favsite="Google"/>, document.getElementById('root'));
```

> 派生状态（state）就是根据props派生（可以理解为把接到的值放进了一个新的变量）得来的数据

+ 这样写有bug，如果正好子元素state自行更改，那么一对比，又执行了props.color的颜色
```js
Class ColorPicker extends React.Component {
    state = {
        color: '#000000'
    }
    static getDerivedStateFromProps (props, state) {
        if (props.color !== state.color) {
            return {
                color: props.color
            }
        }
        return null
    }
    ... // 选择颜色方法
    render () {
        .... // 显示颜色和选择颜色操作
    }
} 
```
+ 修改为,通过保存一个之前 prop 值，我们就可以在只有 prop 变化时才去修改 state
```js
Class ColorPicker extends React.Component {
    state = {
        color: '#000000',
        prevPropColor: ''
    }
    static getDerivedStateFromProps (props, state) {
        if (props.color !== state.prevPropColor) {
            return {
                color: props.color
                prevPropColor: props.color
            }
        }
        return null
    }
    ... // 选择颜色方法
    render () {
        .... // 显示颜色和选择颜色操作
    }
}
```


### UNSAFE_componentWillMount
也就是 componentWillMount，本来用于组件即将加载前做某些操作，但目前被标记为 ***弃用*** 。因为在 React 的异步渲染机制下，该方法可能会被多次调用。

一个常见的错误是 componentWillMount 跟 ***服务器端同构渲染*** 的时候，如果在该函数里面发起网络请求，拉取数据，那么会在`服务器端与客户端分别执行一次。`所以更推荐在componentDidMount中完成数据拉取操作。


### render
render 函数返回的 JSX 结构，用于描述具体的渲染内容。但切记，render 函数并没有真正的去渲染组件，渲染是依靠 React 操作 JSX 描述结构来完成的。还有一点需要注意，render 函数应该是一个纯函数，不应该在里面产生副作用，比如调用 setState 或者绑定事件。

那为什么不能 setState 呢？因为 render 函数在每次渲染时都会被调用，而 setState 会触发渲染，就会造成死循环。

那又为什么不能绑定事件呢？因为容易被频繁调用注册。

### componentDidMount

componentDidMount 主要用于组件加载完成时做某些操作，比如发起网络请求或者绑定事件，该函数是接着 render 之后调用的。但 componentDidMount 一定是在真实 DOM 绘制完成之后调用吗？在浏览器端，可以这么认为。

但在其他场景下，尤其是 React Native 场景下，componentDidMount 并不意味着真实的界面已绘制完毕。由于机器的性能所限，视图可能还在绘制中。

## react更新生命周期钩子
更新阶段是指外部 props 传入，或者 state 发生变化时的阶段。

### UNSAFE_componentWillReceiveProps
该函数已被标记弃用，因为其功能可被函数 getDerivedStateFromProps 所替代。

另外，当 getDerivedStateFromProps 存在时，UNSAFE_componentWillReceiveProps 不会被调用。

#### getDerivedStateFromProps render

同挂载阶段的表现一致。

### shouldComponentUpdate

该方法通过返回 true 或者 false 来确定是否需要触发新的渲染。因为渲染触发最后一道关卡，所以也是性能优化的必争之地。通过添加判断条件来阻止不必要的渲染。

React 官方提供了一个通用的优化方案，也就是 PureComponent。PureComponent 的核心原理就是默认实现了shouldComponentUpdate函数，在这个***函数中对 props 和 state 进行浅比较***，用来判断是否触发更新。
```js
shouldComponentUpdate(nextProps, nextState) {
  // 浅比较仅比较值与引用，并不会对 Object 中的每一项值进行比较
  if (shadowEqual(nextProps, this.props) || shadowEqual(nextState, this.state) ) {
    return true
  }
  return false
}
```

### UNSAFE_componentWillUpdate

同样已废弃，因为后续的 React 异步渲染设计中，可能会出现组件暂停更新渲染的情况。

### getSnapshotBeforeUpdate

getSnapshotBeforeUpdate 方法是配合 React 新的异步渲染的机制，在 DOM 更新发生前被调用，返回值将作为 componentDidUpdate 的第三个参数。

```js
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }
 
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }
 
  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }
 
  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
```

### componentDidUpdate

正如上面的案例，getSnapshotBeforeUpdate 的返回值会作为componentDidUpdate的第三个参数使用。

componentDidUpdate中可以使用 setState，会触发重渲染，但一定要小心使用，避免死循环。

## react生命周期卸载阶段

卸载阶段就容易很多了，只有一个回调函数。

### componentWillUnmount

该函数主要用于执行清理工作。一个比较常见的 Bug 就是忘记在 componentWillUnmount 中取消定时器，导致定时操作依然在组件销毁后不停地执行。所以一定要在该阶段解除事件绑定，取消定时器。


<img src='/img/0008.png'/>


#### 函数组件

函数组件任何情况下都会重新渲染。它并没有生命周期，但官方提供了一种方式优化手段，那就是 React.memo。
```js
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```
React.memo 并不是阻断渲染，而是跳过渲染组件的操作并直接复用最近一次渲染的结果，这与 shouldComponentUpdate 是完全不同的。


#### React.Component

如果不实现 shouldComponentUpdate 函数，那么有两种情况触发重新渲染。

+ 当 state 发生变化时。这个很好理解，是常见的情况。
+ 当父级组件的 Props 传入时。无论 Props 有没有变化，只要传入就会引发重新渲染。

#### React.PureComponent

PureComponent 默认实现了 shouldComponentUpdate 函数。所以仅在 props 与 state 进行浅比较后，确认有变更时才会触发重新渲染。

#### 错误边界

错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI，如下 React 官方所给的示例：
```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}
```
无论是 React，还是 React Native，如果没有错误边界，在用户侧看到的现象会是这样的：在执行某个操作时，触发了 Bug，引发了崩溃，页面突然白屏。

但渲染时的报错，只能通过 componentDidCatch 捕获。这是在做线上页面报错监控时，极其容易忽略的点儿。


:::tip 生命周期避坑
 避免生命周期中的坑需要做好两件事：
 + 不在恰当的时候调用了不该调用的代码；
 + 在需要调用时，不要忘了调用。
 
 那么主要有这么 7 种情况容易造成生命周期的坑。
 1. getDerivedStateFromProps 容易编写反模式代码，使受控组件与非受控组件区分模糊。
 2. componentWillMount 在 React 中已被标记弃用，不推荐使用，主要原因是新的异步渲染架构会导致它被多次调用。所以网络请求及事件绑定代码应移至 componentDidMount 中。
 3. componentWillReceiveProps 同样被标记弃用，被 getDerivedStateFromProps 所取代，主要原因是性能问题。
 4. shouldComponentUpdate 通过返回 true 或者 false 来确定是否需要触发新的渲染。主要用于性能优化。
 5. componentWillUpdate 同样是由于新的异步渲染机制，而被标记废弃，不推荐使用，原先的逻辑可结合 getSnapshotBeforeUpdate 与 componentDidUpdate 改造使用。
 6. 如果在 componentWillUnmount 函数中忘记解除事件绑定，取消定时器等清理操作，容易引发 bug。
 7. 如果没有添加错误边界处理，当渲染发生异常时，用户将会看到一个无法操作的白屏，所以一定要添加。
:::