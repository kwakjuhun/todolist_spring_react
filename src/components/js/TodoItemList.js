import React from "react";
import TodoItem from "./TodoItem";
// TodoItemList 컴포넌트는 TodoItem 컴포넌트 여러 개를 렌더링해주는 역할을 한다.
// 동적인 '리스트'를 렌더링을 하는 경우에는 함수형이 아닌 클래스형 컴포넌트로 작성하는 것이 컴포넌트 성능 최적화를 하기에 유리하다.
class TodoItemList extends React.Component {

    //최적화 코드  컴포넌트가 리렌더링 할지말지 결정 해줌
    // 훅으로 변경 하면서 제거
    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.props.todos !== nextProps.todos;
    // }
    render() {
        const {todos, onToggle, onRemove} = this.props;
        console.log(todos);
  
        const todoList = todos.map (
            ({id, content, isComplete}) => (
                <TodoItem
                    id={id}
                    content={content}
                    isComplete={isComplete}
                    onToggle={onToggle}
                    onRemove={onRemove}
                    key={id} />
            )
        );
 
        return (
            <div>
                {todoList}
            </div>
        );
    }
}
 
export default TodoItemList;