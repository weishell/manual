---
title: react生命周期
date: 2022/09/30
tags:
 - react
categories:
 - react
--- 

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

### UNSAFE_componentWillMount
也就是 componentWillMount，本来用于组件即将加载前做某些操作，但目前被标记为 ***弃用*** 。因为在 React 的异步渲染机制下，该方法可能会被多次调用。

一个常见的错误是 componentWillMount 跟 ***服务器端同构渲染*** 的时候，如果在该函数里面发起网络请求，拉取数据，那么会在`服务器端与客户端分别执行一次。`所以更推荐在componentDidMount中完成数据拉取操作。

