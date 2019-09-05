import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "allRecipe") {
    return {
      ...state,
      allRecipe: action.allRecipe
    };
  }
  if (action.type === "showMore") {
    return {
      ...state,
      counter: action.counter
    };
  }
  if (action.type === "username") {
    return {
      ...state,
      username: action.username,
      loginStatus: action.status
    };
  }
  if (action.type === "randomRecipe") {
    return {
      ...state,
      randomRecipe: action.randomRecipe
    };
  }
  if (action.type === "savedList") {
    return {
      ...state,
      recipeList: action.recipeList
    };
  }
  return state;
};

const store = createStore(
  reducer,
  {
    allRecipe: [],
    counter: 1,
    username: undefined,
    loginStatus: false,
    randomRecipe: undefined,
    recipeList: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
