## Learning about reconcilation in context with React

Reconciliation is the process in React that compares the current state of the user interface (UI) with the desired state and efficiently updates the UI to reflect the changes. It is a key part of React's virtual DOM diffing algorithm, which helps minimize the number of updates needed to keep the UI in sync with the application's data.

When changes occur in a React component's state or props, React needs to determine what parts of the UI need to be updated. Reconciliation is the process of identifying the differences between the previous and current representations of the UI and applying the necessary updates.

Here's a high-level overview of how reconciliation works in React:

1. Element Creation: React creates a new tree of React elements that represents the desired state of the UI.

2. Diffing: React compares the new element tree with the previous one (if any) and performs a "diffing" process to determine the minimal set of changes required to update the UI.

3. Update Strategy: React identifies the type of change needed for each element (e.g., creating a new element, updating an existing element, or removing an element) and builds a plan for updating the UI accordingly.

4. Reconciliation: React applies the update plan to the actual DOM, making the necessary changes to bring the UI in line with the desired state.

5. Component Lifecycle: Throughout the reconciliation process, React also invokes various component lifecycle methods, such as `componentWillReceiveProps`, `shouldComponentUpdate`, `componentWillUpdate`, and `componentDidUpdate`, which allow developers to perform additional logic or optimizations.

Reconciliation is an efficient process because React's diffing algorithm attempts to minimize the number of actual changes made to the DOM. It achieves this by recursively comparing elements and their children, identifying changes at a granular level, and selectively updating only the necessary parts of the UI.

By performing efficient reconciliation, React helps ensure optimal performance and responsiveness of the UI, even in complex and dynamic applications.

### Dataset attribute of the DOM element in client-side JS

The `dataset` attribute of a DOM element in JavaScript provides access to custom data attributes that have been set on the element. Custom data attributes are attributes that are prefixed with "data-" in HTML, and they can be used to store custom data or metadata associated with an element.

The `dataset` attribute is an object that represents the collection of custom data attributes on the element. Each custom data attribute is represented as a property in the `dataset` object, where the property name is derived from the custom data attribute name by converting it to camelCase.

For example, consider the following HTML element:

```html
<div id="myElement" data-user-id="123" data-user-name="John"></div>
```

In JavaScript, you can access the custom data attributes using the `dataset` attribute of the element:

```javascript
const element = document.getElementById('myElement');

// Accessing custom data attributes
const userId = element.dataset.userId; // "123"
const userName = element.dataset.userName; // "John"
```

In this example, `data-user-id` and `data-user-name` are the custom data attributes, and their values can be accessed through the `dataset` object as `userId` and `userName` respectively.

The `dataset` attribute provides a convenient way to store and retrieve custom data associated with elements, making it easier to work with dynamic data in JavaScript.

**Time for adding elements with array based strucuture to hold the children elements of the main area.**
Time elapsed : 1500 msecs for adding 96
script.js:71 Time elapsed : 200.00004768371582 msecs for adding 9
script.js:71 Time elapsed : 899.9999761581421 msecs for adding 60
script.js:71 Time elapsed : 200.00004768371582 msecs for adding 1
script.js:71 Time elapsed : 1000 msecs for adding 56
script.js:71 Time elapsed : 699.9999284744263 msecs for adding 71
script.js:71 Time elapsed : 199.99992847442627 msecs for adding 10
script.js:71 Time elapsed : 1000 msecs for adding 50
script.js:71 Time elapsed : 500 msecs for adding 10
script.js:71 Time elapsed : 1100.000023841858 msecs for adding 69
script.js:71 Time elapsed : 899.9999761581421 msecs for adding 11
script.js:71 Time elapsed : 1299.9999523162842 msecs for adding 97
script.js:71 Time elapsed : 700.0000476837158 msecs for adding 26
script.js:71 Time elapsed : 899.9999761581421 msecs for adding 79
script.js:71 Time elapsed : 700.0000476837158 msecs for adding 85
script.js:71 Time elapsed : 700.0000476837158 msecs for adding 39
script.js:71 Time elapsed : 299.9999523162842 msecs for adding 13
script.js:71 Time elapsed : 300.00007152557373 msecs for adding 11
script.js:71 Time elapsed : 1100.000023841858 msecs for adding 96
script.js:71 Time elapsed : 700.0000476837158 msecs for adding 20