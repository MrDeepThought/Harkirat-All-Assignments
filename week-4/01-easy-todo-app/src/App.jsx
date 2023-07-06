import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function TodoInput({ props }) {

  return (
    <div id="todo-input" className="child-container-1">
      <h1>Easy Todo App</h1>
      <input type="text" placeholder="Title" value={props.titleValue} onChange={props.onChangeTitle} />
      <input type="text-area" placeholder="Description" id="description-input" value={props.descValue} onChange={props.onChangeDesc} />
      <button onClick={props.onClickAdd} id="add-btn">ADD</button>
    </div>
  );
}

function Todo(props) {
  function pressDelete(){
    props.onClickDelete(props.todoInfo.id);
  }

  return (
    <div className="todo">
      <div className="title-box">{props.todoInfo.title}</div>
      <div className="desc-box">{props.todoInfo.description}</div>
      <div className="delete-box"><button className="delete-btn" onClick={pressDelete}>DELETE</button></div>
    </div>
  );
}

// Custom Hook to fetch the todos from the server
function useTodos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      responseType: "json",
      url: "http://localhost:3000/todos",
    })
      .then(response => {
        console.log("fetched Todos from the backend!");
        setTodos(response.data);
      });
  }, []);

  return [todos, setTodos];
}

function App() {
  // states and hooks
  const [todos, setTodos] = useTodos();
  const [titleInput, setTitleInput] = useState(null);
  const [descInput, setDescInput] = useState(null);

  function handleAdd() {
    const title = titleInput;
    const desc = descInput;

    axios({
      method: "post",
      url: "http://localhost:3000/todos",
      data: {
        title: title,
        description: desc
      }
    })
      .then(response => {
        if (response.status === 201) {
          console.log(`New Title : ${title} and New Description : ${desc} and todo ID : ${response.data.id}`);
          setTodos([...todos, { id: response.data.id, title: title, description: desc }]);
          setTitleInput("");
          setDescInput("");
        }
      });
  }

  const handleTitleChange = (event) => {
    setTitleInput(event.target.value);
  };

  const handleDescChange = (event) => {
    setDescInput(event.target.value);
  }

  const handleDelete = (todoId) => {
    axios({
      method: "delete",
      url: `http://localhost:3000/todos/${todoId}`,
      responseType: "text"
    })
      .then(response => {
        if (response.status === 200) {
          let newTodos = todos.slice();
          newTodos = newTodos.filter((todo) => { return todo.id !== todoId });
          setTodos(newTodos);
          console.log(`Deleted todo with ID : ${todoId}`);
        }
        else {
          alert(response.data);
        }
      });
  }

  // created an object of props for TodoInput component instead of writing them individually in the component
  const todoInputProps = {
    onClickAdd: handleAdd,
    onChangeTitle: handleTitleChange,
    onChangeDesc: handleDescChange,
    titleValue: titleInput,
    descValue: descInput
  }

  // creating todos components for displaying
  const allTodos = todos.map((todo) => {
    const id = todo.id;
    return (<Todo todoInfo={todo} key={id} onClickDelete={() => {handleDelete(id)}} />);
  })

  return (
    <>
      <div id="main-container">
        <TodoInput props={todoInputProps} />
        <div id="todo-details" className="child-container-2">
          <h2> CURRENT TODOS</h2>
          {allTodos}
        </div>
      </div>
    </>
  )
}

export default App
