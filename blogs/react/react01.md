---
title: react
date: 2022/09/30
tags:
 - react
categories:
 - react
--- 

### 说说react
可以从从概念、用途、思路、优缺点入手：

React 是一个网页开发框架，通过组件化的方式解决视图层开发复用的问题，`本质是一个组件化框架。`

它的核心设计思路有三点，分别是声明式、组件化与 通用性。 
+ 声明式的优势在于直观与组合。 
+ 组件化的优势在于视图的拆分与模块复用，***可以更容易做到高内聚低耦合。*** 
+ 通用性在于一次学习，随处编写。比如 React Native，React360 等， 这里主要靠`虚拟DOM` 来保证实现。 
+ 这使得 React 的适用范围变得足够广，无论是 Web、Native、VR，甚至Shell 应用都可以进行开发。这也是 React 的优势。 
+ 但作为一个视图层的框架，React的劣势也十分明显。它并没有提供完整的一揽子解决方案，在开发大型前端应用时，需要向社区寻找并整合解决方案。虽然一定程度上促进了社区的繁荣，但也为开发者在技术选型和学习适用上造成了一定的成本。

### react使用jsx的思考

JSX 是一个 JavaScript 的语法扩展，结构类似 XML。

JSX 主要用于声明 React 元素，但 React 中并不强制使用 JSX。即使使用了 JSX，也会在构建过程中，通过 Babel 插件编译为 `React.createElement` 。所以 JSX 更像是 React.createElement 的一种语法糖。

所以从这里可以看出，React 团队并不想引入 JavaScript 本身以外的开发体系。而是希望通过合理的关注点分离保持组件开发的纯粹性。

接下来与 JSX 以外的三种技术方案进行对比。

+ 首先是模板，React 团队认为模板不应该是开发过程中的关注点，因为引入了模板语法、模板指令等概念，是一种不佳的实现方案。
+ 其次是模板字符串，模板字符串编写的结构会造成多次内部嵌套，使整个结构变得复杂，并且优化代码提示也会变得困难重重。
+ 最后是 JXON，同样因为代码提示困难的原因而被放弃。

所以 React 最后选用了 JSX，因为 JSX 与其设计思想贴合，不需要引入过多新的概念，对编辑器的代码提示也极为友好。

```js
class Hello extends React.Component {
  render() {
    return React.createElement(
        'div',
        null, 
        `Hello ${this.props.toWhat}`
      );
  }
}
ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```
```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}
ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);

```