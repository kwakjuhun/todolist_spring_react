import './App.css';
import TodoListTemplate from './components/js/TodoListTemplate';
import Form from './components/js/Form';
import TodoItemList from './components/js/TodoItemList';
import React from 'react';

// Form.js 에서 Hook(useSatte) 를 사용하기 위해 제거
class App extends React.Component{
  constructor(props){
    super(props);
    this.id = 2;
    this.state = {
      // input:"",
      todos: [
      //   {id:0, content:'00000', isComplete:false},
      //   {id:1, content:'11111', isComplete:true},
      ]
    }
    // this.handleChange = this.handleChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    // this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleInitInfo = this.handleInitInfo.bind(this)
  }
  componentDidMount(){
    this.handleInitInfo()
  }
  handleInitInfo(){
    fetch("/api/todos")
      .then(res => res.json())
      .then(todos => this.setState({todos}))
      .catch(err => console.error(err))
  }
  // handleChange(e){
  //   this.setState({
  //     input: e.target.value
  //   });
  // }

  // 여기서도 input값을 스테이터스에서 참조받는 형태로 변경
  handleCreate(inputValue){
    const {todos} = this.state;
    if (inputValue === ""){
      alert("오늘 할 일을 입력해주세요");
      return;
    }
    this.setState({
      // input:"",
      todos:todos.concat({ // 콘캣은 배열을 복사할때 새 배열을 만들어줌
        id: this.id++,
        content:inputValue,
        isComplete:false
      })
    });
    // 처리
    const data = {
      body: JSON.stringify({"content" : inputValue}),
      headers: {'Content-Type': 'application/json'},
      method: 'post'
    }
    fetch("/api/todos", data)
      .then(res => {
        if(!res.ok) {
          throw new Error(res.status);
        } else {
          return this.handleInitInfo();
        }
      })
      .catch(err => console.log(err));
  }
  handleKeyPress(e){
    if (e.key === "Enter"){
      this.handleCreate();
    }
  }
// 수정
handleToggle(id) {
  const { todos } = this.state;

  const isComplete = todos.find(todo => todo.id === id).isComplete;
  if(!window.confirm(isComplete ? "미완료 처리 하시겠습니까?" : "완료 처리 하시겠습니까?")) {
    return;
  }

  // 파라미터로 받은 id 를 가지고 몇 번째 아이템인지 찾는다.
  const index = todos.findIndex(todo => todo.id === id);

  // 선택한 객체를 저장한다.
  const selected = todos[index];

  // 배열을 복사한다.
  const nextTodos = [...todos];

  // 기존의 값을 복사하고 isComplete 값을 덮어쓴다.
  nextTodos[index] = {
    ...selected,
    isComplete : !selected.isComplete
  };

  this.setState({
    todos : nextTodos
  });

  const data = {
    headers: {'Content-Type':'application/json'},
    method: 'put'
  }
  fetch("/api/todos/" + id, data)
  .then(res => {
    if(!res.ok) {
      throw new Error(res.status);
    } else {
      return this.handleInitInfo();
    }
  })
  .catch(err => console.log(err));
}
  // 삭제
handleRemove(id) {
  const { todos } = this.state;

  const removeContent = todos.find(todo => todo.id === id).content;
  if(!window.confirm("'" + removeContent + "' 을 삭제하시겠습니까?")) {
    return;
  }

  this.setState({
    todos : todos.filter(todo => todo.id !== id)
  });

  const data = {
    headers: {'Content-Type':'application/json'},
    method: 'delete'
  }
  fetch("/api/todos/" + id, data)
  .then(res => {
      if(!res.ok) {
        throw new Error(res.status);
      } else {
        return this.handleInitInfo();
      }
  })
  .catch(err => console.log(err));
}

  render(){
    return (
      <div className="App">
        <TodoListTemplate form={(
        <Form
          // value = {this.state.input}
          // onChange = {this.handleChange}
          // onCreate = {this.handleCreate}
          // onKeyPress = {this.handleKeyPress}
          onCreate={this.handleCreate}/>
        )}>
          <TodoItemList
            todos={this.state.todos}
            onToggle={this.handleToggle} 
            onRemove={this.handleRemove}/>
        </TodoListTemplate>
      </div>
    );  
  }
}

export default App;
