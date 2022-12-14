---
title: react组件
date: 2022/10/01
tags:
 - react
categories:
 - react
--- 

### 谈谈类组件和函数组件
类组件与函数组件的共同点，就是它们的实际用途是一样的，无论是高阶组件，还是异步加载，都可以用它们作为基础组件展示 UI。也就是作为组件本身的所有基础功能都是一致的。

那不同点呢？可以从使用场景、独有的功能、设计模式及未来趋势等不同的角度进行挖掘。


#### 相同点
组件是 React 可复用的最小代码片段，它们会返回要在页面中渲染的 React 元素。也正因为组件是 React 的最小编码单位，所以无论是函数组件还是类组件，在使用方式和最终呈现效果上都是完全一致的。

甚至可以将一个类组件改写成函数组件，或者把函数组件改写成一个类组件（不推荐这种重构）。从使用者的角度而言，很难从使用体验上区分两者，而且在现代浏览器中，闭包和类的性能只在极端场景下才会有明显的差别。

所以基本可认为两者作为组件是完全一致的。


#### 不同点
+ 基础认知

类组件与函数组件本质上代表了两种不同的设计思想与心智模式。

类组件的根基是 ***OOP（面向对象编程）*** ，所以它有继承、有属性、有内部状态的管理。

函数组件的根基是 ***FP***，也就是函数式编程。它属于“结构化编程”的一种，与数学函数思想类似。也就是假定输入与输出存在某种特定的映射关系，那么输入一定的情况下，输出必然是确定的。

相较于类组件，函数组件更纯粹、简单、易测试。 这是它们本质上最大的不同。

```js
import React from "react";
import ProfileFunction from './components/ProfileFunction';
import ProfileClass from './components/ProfileClass';


import { createRoot } from 'react-dom/client';


class App extends React.Component {
  state = {
    user: '小明',
  };
  render() {
    return (
      <>
        <label>
          <b> : </b>
          <select
            value={this.state.user}
            onChange={e => this.setState({ user: e.target.value })}
          >
            <option value='小明'>Dan</option>
            <option value='小白'>Sophie</option>
            <option value='小黄'>Sunil</option>
          </select>
        </label>
        <h1>{this.state.user}</h1>
        <p>
          <ProfileFunction user={this.state.user} />
          <b> (function)</b>
        </p>
        <p>
          <ProfileClass user={this.state.user} />
          <b> (class)</b>
        </p>
      </>
    )
  }
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);


export default App;
```
```js
import React from 'react'
class Profile extends React.Component {
    showMessage = (user) => {
     
      alert('用户是' + this.props.user);
    };
    handleClick = () => {
      const {user} = this.props;
      setTimeout(() => this.showMessage(user), 3 * 1000);
    };
    render() {
      return <button onClick={this.handleClick}>查询</button>;
    }
    
   static getDerivedStateFromProps(nextProps,prevProps){
      console.log(nextProps,prevProps)
      return null
    }
   
  }
  
  export default Profile;

```
```js
const Profile = (props) => {
    const showMessage = () => {
      alert('用户是' + props.user);
    };
    const handleClick = () => {
      setTimeout(showMessage, 3 * 1000);
    };
    return (
      <button onClick={handleClick}>查询</button>
    );
  }
  export default Profile;

```

:::warning 注意
这时，将会看到一个现象：
+ 使用函数组件时，当前账号是小白，点击查询按钮，然后立马将当前账号切换到小黄，但弹框显示的内容依然还是小白；
+ 而当使用类组件时，同样的操作下，弹框显示的是小黄。
:::

那为什么会这样呢？因为当切换下拉框后，新的 user 作为 props 传入了类组件中，所以此时组件内的 user 已经发生变化了。如下代码所示：
```js
showMessage = () => {
     // 这里每次都是取最新的 this.props。
    alert('用户是' + this.props.user);
};
```
这里的 this 存在一定的模糊性，容易引起错误使用。如果希望组件能正确运行，那么我们可以这样修改：
```js
 showMessage = (user) => {
    alert('用户是' + user);
  };
  handleClick = () => {
    const {user} = this.props;
    setTimeout(() => this.showMessage(user), 3 * 1000);
  }
```
**但在函数组件的闭包中，这就不是问题，它捕获的值永远是确定且安全的。** ***每次改变state/props造成函数组件重新执行，从而每次渲染函数中的state/props都是独立的，固定的。*** 

如果函数组件需要根据最后点击的变化，更改数据，那么可以考虑使用useRef(多次渲染之间的纽带)。

[参考文档](https://juejin.cn/post/6996171186719686693#comment)

#### 独有能力
类组件通过生命周期包装业务逻辑，这是类组件所特有的。
```js
class A extends React.Component {
  componentDidMount() {
     fetchPosts().then(posts => {
      this.setState({ posts });
    }
  }
  render() {
    return ...
  }
}
```
在还没有 Hooks 的时代，函数组件的能力是相对较弱的。在那个时候常常用高阶组件包裹函数组件模拟生命周期。当时流行的解决方案是 Recompose。如下代码所示：
```js
const PostsList = ({ posts }) => (
  <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
)
const PostsListWithData = lifecycle({
  componentDidMount() {
    fetchPosts().then(posts => {
      this.setState({ posts });
    })
  }
})(PostsList);
```
这一解决方案在一定程度上增强了函数组件的能力，但它并没有解决业务逻辑掺杂在生命周期中的问题。Recompose 后来加入了 React 团队，参与了 Hooks 标准的制定，并基于 Hooks 创建了一个完全耳目一新的方案。

这个方案从一个全新的角度解决问题：不是让函数组件去模仿类组件的功能，而是提供新的开发模式让组件渲染与业务逻辑更分离。设计出如下代码：
```js
import React, { useState, useEffect } from 'react';

function App() {
	const [data, setData] = useState({ posts: [] });
	useEffect(() => {
		(async () => {
		const result = await fetchPosts();
		setData(result.data);
		}()
	}, []);

	return (
	<ul>{data.posts.map(p => <li>{p.title}</li>)}</ul>
	);
}

export default App;
```
#### 使用场景

在不使用 Recompose 或者 Hooks 的情况下，如果需要使用生命周期，那么就用类组件，限定的场景是非常固定的；

但在 recompose 或 Hooks 的加持下，这样的边界就模糊化了，类组件与函数组件的能力边界是完全相同的，都可以使用类似生命周期等能力。

#### 设计模式

在设计模式上，因为类本身的原因，类组件是可以实现继承的，而函数组件缺少继承的能力。

当然在 React 中也是不推荐继承已有的组件的，因为继承的灵活性更差，细节屏蔽过多，所以有这样一个铁律，组合优于继承。 

#### 性能优化

那么类组件和函数组件都是怎样来进行性能优化的呢？这里需要联动一下上一讲的知识了。

类组件的优化主要依靠 `shouldComponentUpdate` 函数去阻断渲染。

而函数组件一般靠 `React.memo` 来优化。React.memo 并不是去阻断渲染。


#### 未来趋势

由于 React Hooks 的推出，函数组件成了社区未来主推的方案。

React 团队从 Facebook 的实际业务出发，通过探索时间切片与并发模式，以及考虑性能的进一步优化与组件间更合理的代码拆分结构后，认为类组件的模式并不能很好地适应未来的趋势。 他们给出了 3 个原因：
+ this 的模糊性；
+ 业务逻辑散落在生命周期中；
+ React 的组件代码缺乏标准的拆分方式。

而使用 Hooks 的函数组件可以提供比原先更细粒度的逻辑组织与复用，且能更好地适用于时间切片与并发模式。

::: tip 解答
作为组件而言，类组件与函数组件在使用与呈现上没有任何不同，性能上在现代浏览器中也不会有明显差异。

它们在开发时的心智模型上却存在巨大的差异。类组件是基于面向对象编程的，它主打的是继承、生命周期等核心概念；而函数组件内核是函数式编程，主打的是 immutable、没有副作用、引用透明等特点。

之前，在使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件。

但现在由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。

其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。

性能优化上，类组件主要依靠 shouldComponentUpdate 阻断渲染来提升性能，而函数组件依靠 React.memo 缓存渲染结果来提升性能。

从上手程度而言，类组件更容易上手，从未来趋势上看，由于React Hooks 的推出，函数组件成了社区未来主推的方案。

类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展。
:::

### 如何设计 React 组件

<img src='/img/0009.png'/>

其实就是在考察 React 组件的设计模式.这里可以直接采用 React 社区中非常经典的分类模式：
+ 把只作展示、独立运行、不额外增加功能的组件，称为哑组件，或无状态组件，还有一种叫法是展示组件；
+ 把处理业务逻辑与数据状态的组件称为有状态组件，或灵巧组件，灵巧组件一定包含至少一个灵巧组件或者展示组件。

#### 展示组件
展示组件内部是没有状态管理的，正如其名，就像一个个“装饰物”一样，完全受制于外部的 props 控制。展示组件具有极强的`通用性`，`复用率`也很高，往往与当前的前端工程关系相对薄弱，甚至可以做到跨项目级的复用。

先来看一下展示组件中最常用的代理组件。

1. 代理组件

***代理组件*** 常用于封装常用属性，减少重复代码。举一个最常见的例子，当需要定义一个按钮的时候，需要在按钮上添加 button 属性，代码如下：
```js
<button type="button">
```

当然在 React 中使用的时候，不可能每次都写这样一段代码，非常麻烦。常见的做法是封装：
```js
const Button = props =>
  <button type="button" {...props}>
```
在开发中使用 Button 组件替代原生的 button，可以确保 type 保证一致。

在使用 Antd 开发时，你也会采用类似的设计模式，大致情况如下：
```js
import { Button as AntdButton } from from 'antd'
const Button = props =>
  <AntdButton size="small" type="primary" {...props}>
export default Button
```

虽然进行封装感觉是多此一举，**但切断了外部组件库的强依赖特性**。在大厂中引入外部组件库需要考虑两点：
+ 如果当前组件库不能使用了，是否能实现业务上的无痛切换；
+ 如果需要批量修改基础组件的字段，如何解决？

代理组件的设计模式很好地解决了上面两个问题。从业务上看，代理组件隔绝了 Antd，仅仅是一个组件 Props API 层的交互。这一层如若未来需要替换，是可以保证兼容、快速替换的，而不需要在原有的代码库中查找修改。其次，如果要修改基础组件的颜色、大小、间距，代理组件也可以相对优雅地解决，使得这些修改都内聚在当前的 Button 组件中，而非散落在其他地方。

基于展示组件的思想，可以封装类似的其他组件，比如样式组件。

2. 样式组件

样式组件也是一种代理组件，只是又细分了处理样式领域，将当前的关注点分离到当前组件内。

但在工程实践中，并不会因为一个按钮需要协商 className 而封装成一个组件，就像下面这样：
```js
const Button = props => (
  <button type="button" className="btn btn-primary">
)
```
这并没有什么意义。真实工程项目的样式管理往往是复杂的，它更接近于下面这个例子：
```js
import classnames from "classnames";
const StyleButton = ({ className, primary, isHighLighted, …props }) => (
  <Button
    type=“button”
    className={classnames('btn', {
btn-primary: primary,
highLight: isHighLighted,
}, className)}
    {…props}
  />
);
```
复杂的样式管理对于 Button 是没有意义的，如果直接使用 Button，在属性上修改，对工程代码而言就是编写大量的面条代码。而 StyleButton 的思路是将样式判断逻辑分离到自身上，面向未来改动的时候会更为友好。

接下来可以看下基于样式组件的优化设计。

3. 布局组件

布局组件的基本设计与样式组件完全一样，但它基于自身特性做了一个小小的优化。

首先来看下它的基础使用案例，主要用于安放其他组件，类似于这样的用法：
```js
<Layout
  Top={<NavigationBar />}
  Content={<Article />}
  Bottom={<BottomBar />}
/>
```
布局本身是确定的，不需要根据外部状态的变化去修改内部组件。所以这也是一个可以减少渲染的优化点。
```js
class Layout extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    <div>
      <div>{this.props.NavigationBar}</div>
      <div>{this.props.Article}</div>
      <div>{this.props.BottomBar}</div>
    </div>
  }
}
```
由于布局组件无需更新，就可以通过写死shouldComponentUpdate 的返回值直接阻断渲染过程。对于大型前端工程，类似的小心思可以带来性能上的提升。当然，这也是基于代理组件更易于维护而带来的好处。

#### 灵巧组件
由于灵巧组件面向业务，所以相对于展示组件来说，其功能更为丰富、复杂性更高，而复用度更低。展示组件专注于组件本身特性，灵巧组件更专注于组合组件。那么最常见的案例则是容器组件。

容器组件

容器组件几乎没有复用性，它主要用在两个方面：`拉取数据与组合组件`。
```js
const CardList = ({ cards }) => (
  <div>
    {cards.map(card => (
      <CardLayout
        header={<Avatar url={card.avatarUrl} />}
        Content={<Card {...card} />}
      />
        {comment.body}-{comment.author}
    ))}
  </div>
);
```
这是一个 CardList 组件，负责将 cards 数据渲染出来，接下来将获取网络数据。如下代码所示：
```js
class CardListContainer extends React.Component {
  state = { cards: [] }
 
  async componentDidMount() {
    const response = await fetch('/api/cards')
    this.setState({cards: response})
  }
 
  render() {
    return <CardList cards={this.state.cards} />
  }
}
```
像这样切分代码后，会发现容器组件内非常干净，没有冗余的样式与逻辑处理。互联网人的工作常常是多线并行，如果想把事做得更漂亮，可以尝试把它切分成多个片段，让自己的关注点在短时间内更为集中，从而做到高效快速地处理。

回到组件的问题上来，那么对复用性更强的业务逻辑采用什么方式处理呢？

#### 高阶组件

React 的官方文档将高阶组件称为 React 中复用组件逻辑的高级技术。高阶组件本身并不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。简而言之，高阶组件的参数是组件，返回值为新组件的函数。

这样听起来有一些高阶函数的味儿了。那什么是高阶函数呢？如果一个函数可以接收另一个函数作为参数，且在执行后返回一个函数，这种函数就称为高阶函数。在 React 的社区生态中，有很多基于高阶函数设计的库，比如 reselector 就是其中之一。

思想一脉相承，React 团队在组件方向也汲取了同样的设计模式。源自高阶函数的高阶组件，可以同样优雅地抽取公共逻辑。

##### 抽取公共逻辑

用一个常见的例子来说，就是登录态的判断。假设当前项目有订单页面、用户信息页面及购物车首页，那么对于订单页面与用户信息页面都需要检查当前是否已登录，如果没有登录，则应该跳转登录页。

一般的思路类似于：
```js
const checkLogin = () => {
  return !!localStorage.getItem('token')
}
class CartPage extends React.Component {
   ...
}
class UserPage extends  React.Component {
  componentDidMount() {
    if(!checkLogin) {
      // 重定向跳转登录页面
    }
  }
  ...
}
class OrderPage extends  React.Component {
  componentDidMount() {
    if(!checkLogin) {
      // 重定向跳转登录页面
    }
  }
  ...
 }
```
虽然已经抽取了一个函数，但还是需要在对应的页面添加登录态的判断逻辑。然而如果有高阶组件的话，情况会完全不同。
```js
const checkLogin = () => {
  return !!localStorage.getItem('token')
}
const checkLogin = (WrappedComponent) => {
          return (props) => {
              return checkLogin() ? <WrappedComponent {...props} /> : <LoginPage />;
          }
// 函数写法
class RawUserPage extends  React.Component {
  ...
}
const UserPage = checkLogin(RawUserPage)
// 装饰器写法
@checkLogin
class UserPage extends  React.Component {
  ...
}
@checkLogin
class OrderPage extends  React.Component {
  ...
}
```

从上面的例子中可以看出无论采用函数还是装饰器的写法，都使得重复代码量下降了一个维度。

还有一个非常经典的场景就是页面埋点统计。如果使用装饰器编写的话，大概是这样的：
```js
const trackPageView = (pageName) = { 
   // 发送埋点信息请求
   ... 
}
const PV = (pageName) => {
  return (WrappedComponent) => {
    return class Wrap extends Component {
      componentDidMount() {
        trackPageView(pageName)
      }

  render() {
    <span class="hljs-keyword">return</span> (
      <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">WrappedComponent</span> {<span class="hljs-attr">...this.props</span>} /&gt;</span></span>
    );
  }
}

};
}
@PV(‘用户页面’)
class UserPage extends React.Component {
…
}
@PV(‘购物车页面’)
class CartPage extends React.Component {
…
}
@PV(‘订单页面’)
class OrderPage extends React.Component {
…
}
```
就连埋点这样的烦琐操作都变得优雅了起来。那我想同时使用 checkLogin 与 PV 怎么办呢？这里涉及到了一个新的概念，就是链式调用。

链式调用

由于高阶组件返回的是一个新的组件，所以链式调用是默认支持的。基于 checkLogin 与 PV 两个例子，链式使用是这样的：
```js
// 函数调用方式
class RawUserPage extends React.Component {
  ...
}
const UserPage = checkLogin(PV('用户页面')(RawUserPage))
// 装饰器调用方式
@checkLogin
@PV('用户页面')
class UserPage extends  React.Component {
  ...
}
```
在链式调用后，装饰器会按照从外向内、从上往下的顺序进行执行。

除了抽取公用逻辑以外，还有一种修改渲染结果的方式，被称为渲染劫持。

渲染劫持

渲染劫持可以通过控制 render 函数修改输出内容，常见的场景是显示加载元素，如下情况所示：
```js
 function withLoading(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            if(this.props.isLoading) {
                return <Loading />;
            } else {
                return super.render();
            }
        }
    };
}
```
通过高阶函数中继承原组件的方式，劫持修改 render 函数，篡改返回修改，达到显示 Loading 的效果。

但高阶组件并非万能，它同样也有缺陷。

缺陷

丢失静态函数

由于被包裹了一层，所以静态函数在外层是无法获取的。如下面的案例中 getUser 是无法被调用的。
```js
// UserPage.jsx
@PV('用户页面')
export default class UserPage extends  React.Component {
  static getUser() {
      ...
  } 
}
// page.js
import UserPage from './UserPage'
UserPage.checkLogin() // 调用失败，并不存在。
```
如果希望外界能够被调用，那么可以在 PV 函数中将静态函数复制出来。
```
const PV = (pageName) => {
  return (WrappedComponent) => {
    class Wrap extends Component {
      componentDidMount() {
        trackPageView(pageName)
      }

  render() {
    <span class="hljs-keyword">return</span> (
      <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">WrappedComponent</span> {<span class="hljs-attr">...this.props</span>} /&gt;</span></span>
    );
  }
}
```
```js
Wrap.getUser = WrappedComponent.getUser;
 <span class="hljs-keyword">return</span> Wrap;


};
}
```
这样做确实能解决静态函数在外部无法调用的问题，但一个类的静态函数可能会有很多，都需要一一手动复制么？其实也有更为简便的处理方案。社区中早就有了现成的工具，通过 hoist-non-react-statics 来处理，可以自动复制所有静态函数。如下代码所示。
```js
import hoistNonReactStatics from 'hoist-non-react-statics';
const PV = (pageName) => {
  return (WrappedComponent) => {
    class Wrap extends Component {
      componentDidMount() {
        trackPageView(pageName)
      }

  render() {
    <span class="hljs-keyword">return</span> (
      <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">WrappedComponent</span> {<span class="hljs-attr">...this.props</span>} /&gt;</span></span>
    );
  }
}
 hoistNonReactStatics(Wrap, WrappedComponent);
 <span class="hljs-keyword">return</span> Wrap;

};
}
```
虽然缺少官方的解决方案，但社区方案弥补了不足。除了静态函数的问题以外，还有 refs 属性不能透传的问题。

refs 属性不能透传

ref 属性由于被高阶组件包裹了一次，所以需要进行特殊处理才能获取。React 为我们提供了一个名为 React.forwardRef 的 API 来解决这一问题，以下是官方文档中的一个案例：
```js
function withLog(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }
    render() {
      const {forwardedRef, ...rest} = this.props;
      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }
  // 注意 React.forwardRef 回调的第二个参数 “ref”。
  // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
  // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```
这段代码读起来会有点儿头皮发麻，它正确的阅读顺序应该是从最底下的 React.forwardRef 部分开始，通过 forwardedRef 转发 ref 到 LogProps 内部。

工程实践
通过以上的梳理，接下来看一下如何在目录中给组件安排位置。
```
src
├── components
│   ├── basic
│   ├── container
│   └── hoc
└── pages
```

首先将最基本的展示组件放入 basic 目录中；

然后将容器组件放入 container；

高阶组件放入 hoc 中；

将页面外层组件放在页面目录中；

通过目录级别完成切分。

在开发中，针对 basic 组件，建议使用类似 Storybook 的工具进行组件管理。因为Storybook 可以有组织地、高效地构建基础组件，有兴趣的话可以查阅下它的官网。

答题
通过以上的归类分析，关于 React 组件设计，我们的脑海中就有比较清晰的认知了。

React 组件应从设计与工程实践两个方向进行探讨。

从设计上而言，社区主流分类的方案是展示组件与灵巧组件。

展示组件内部没有状态管理，仅仅用于最简单的展示表达。展示组件中最基础的一类组件称作代理组件。代理组件常用于封装常用属性、减少重复代码。很经典的场景就是引入 Antd 的 Button 时，你再自己封一层。如果未来需要替换掉 Antd 或者需要在所有的 Button 上添加一个属性，都会非常方便。基于代理组件的思想还可以继续分类，分为样式组件与布局组件两种，分别是将样式与布局内聚在自己组件内部。

灵巧组件由于面向业务，其功能更为丰富，复杂性更高，复用度低于展示组件。最经典的灵巧组件是容器组件。在开发中，我们经常会将网络请求与事件处理放在容器组件中进行。容器组件也为组合其他组件预留了一个恰当的空间。还有一类灵巧组件是高阶组件。高阶组件被 React 官方称为 React 中复用组件逻辑的高级技术，它常用于抽取公共业务逻辑或者提供某些公用能力。常用的场景包括检查登录态，或者为埋点提供封装，减少样板代码量。高阶组件可以组合完成链式调用，如果基于装饰器使用，就更为方便了。高阶组件中还有一个经典用法就是反向劫持，通过重写渲染函数的方式实现某些功能，比如场景的页面加载圈等。但高阶组件也有两个缺陷，第一个是静态方法不能被外部直接调用，需要通过向上层组件复制的方式调用，社区有提供解决方案，使用 hoist-non-react-statics 可以解决；第二个是 refs 不能透传，使用 React.forwardRef API 可以解决。

从工程实践而言，通过文件夹划分的方式切分代码。我初步常用的分割方式是将页面单独建立一个目录，将复用性略高的 components 建立一个目录，在下面分别建立 basic、container 和 hoc 三类。这样可以保证无法复用的业务逻辑代码尽量留在 Page 中，而可以抽象复用的部分放入 components 中。其中 basic 文件夹放展示组件，由于展示组件本身与业务关联性较低，所以可以使用 Storybook 进行组件的开发管理，提升项目的工程化管理能力。

还可以通过以下知识导图来检验你的学习成果，看是否能将每部分补充完整。



进阶
“如何在渲染劫持中为原本的渲染结果添加新的样式？” 这个问题也经常被追问，其实并不难，但是有可能考察手写代码，所以这里我会做一些提示。

首先回滚上面的案例，在调用 super.render 的时候就可以拿到原本的渲染结果。
```js
function withLoading(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            if(this.props.isLoading) {
                return <Loading />;
            } else {
                return super.render();
            }
        }
    };
}
```
那 super.render() 返回的是什么呢？你可以结合 JSX 一讲中的内容思考下。

总结
在本讲中主要对 React 组件的设计模式进行了梳理与回顾，并探讨了设计模式在工程实践中的作用。

在面试中面试官不仅希望听到设计模式有哪些，社区的推荐方式有哪些，更希望听到模式具体用在哪儿。如果你知道具体的场景，就会显得更有经验。设计模式并非有确定的标准答案，社区流行的分类方式也并非万能。如果你有自己的见解，在面试中与面试官进行探讨，也是非常值得鼓励的。