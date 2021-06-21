---
title: 前端篇-React 快速入门
date: 2020-08-12 20:49:05
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/react.jpeg
category: 前端相关
tags: React
---

# 简介

-  React is a JavaScript library - one of the most popular ones, with over 100,000 stars on GitHub.
-  React is not a framework (unlike Angular, which is more opinionated).
-  React is an open-source project created by Facebook.
-  React is used to build user interfaces (UI) on the front end.
-  React is the view layer of an MVC application (Model View Controller)
>  One of the most important aspects of React is the fact that you can create components, which are like custom, reusable HTML elements, to quickly and efficiently build user interfaces. React also streamlines how data is stored and handled, using state and props.

# JSX简介

```const element = <h1>Hello, world!</h1>;```

这个有趣的标签语法既不是字符串也不是 HTML。

它被称为 JSX，是一个 JavaScript 的语法扩展。我们建议在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。JSX 可能会使人联想到模版语言，但它具有 JavaScript 的全部功能。

## 为什么使用 JSX？

React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。

React 并没有采用将标记与逻辑进行分离到不同文件这种人为地分离方式，而是通过将二者共同存放在称之为“组件”的松散耦合单元之中，来实现关注点分离。我们将在后面章节中深入学习组件。如果你还没有适应在 JS 中使用标记语言，这个会议讨论应该可以说服你。

React 不强制要求使用 JSX，但是大多数人发现，在 JavaScript 代码中将 JSX 和 UI 放在一起时，会在视觉上有辅助作用。它还可以使 React 显示更多有用的错误和警告消息。

搞清楚这个问题后，我们就开始学习 JSX 吧！

## 在 JSX 中嵌入表达式

在下面的例子中，我们声明了一个名为 name 的变量，然后在 JSX 中使用它，并将它包裹在大括号中：
``````
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
``````

在 JSX 语法中
# 元素渲染

# 组件 & Props

# State & 生命周期

# 事件处理

# 条件渲染

# 列表 & Key

# 表单

# 状态提升

# 组合 vs 继承


# 参考资料

[官网](https://www.taniarascia.com/)

[快速开始](https://www.taniarascia.com/getting-started-with-react/)  


 