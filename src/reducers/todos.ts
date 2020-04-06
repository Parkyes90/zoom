import { ActionTypes, Action, Todo } from "../actions";

export const todosReducer = (state: Todo[] = [], action: Action) => {
  switch (action.type) {
    case ActionTypes.fetchTodos:
      return action.payload;
    case ActionTypes.deleteTodo:
      return state.filter((todo) => {
        return todo.id !== action.payload;
      });
    default:
      return state;
  }
};
