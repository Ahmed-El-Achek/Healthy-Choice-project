import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import HomePage from "./homePage.jsx";
import RecipeDescription from "./recipeDescription.jsx";
import { connect } from "react-redux";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import SavedRecipe from "./savedRecipe.jsx";

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomRecipe: undefined,
      state: false
    };
  }
  randomRecipe = async () => {
    let random = Math.floor(Math.random() * 200);
    let response = await fetch(
      `https://api.edamam.com/search?q=${random}&app_id=5243650a&app_key=a57dade71caf78566c7762746a714fb2&from=0&to=50`
    );
    if (!this.state.state) {
      let body = await response.json();
      console.log(body.hits[0].recipe);
      this.props.dispatch({
        type: "randomRecipe",
        randomRecipe: body.hits[0].recipe
      });
      this.setState({ randomRecipe: body.hits[0].recipe, state: true });
    }
    return;
  };
  homePage = () => {
    if (!this.state.state) {
      this.randomRecipe();
    }
    if (this.props.randomRecipe === undefined) {
      return (
        <div
          id="loading"
          className="loading"
          style={{ display: "block" }}
        ></div>
      );
    }
    return (
      <div>
        <HomePage recipe={this.state.randomRecipe} />
      </div>
    );
  };

  recipeDesc = routerData => {
    let id = routerData.match.params.uri;
    let recipeId = this.props.allRecipe.find(recipe => {
      let recipeId = recipe.recipe.uri.indexOf("#recipe_") + 8;
      let uid = recipe.recipe.uri.slice(recipeId, recipe.recipe.uri.length);
      if (id === uid) {
        console.log(recipe.recipe);
        return recipe.recipe;
      }
    });
    if (recipeId !== undefined) {
      return (
        <div>
          <RecipeDescription key={id} recipe={recipeId.recipe} />
        </div>
      );
    }
    if (recipeId === undefined) {
      let recipeId = this.props.recipeList.find(recipe => {
        let recipeId = recipe.uri.indexOf("#recipe_") + 8;
        let uid = recipe.uri.slice(recipeId, recipe.uri.length);
        if (id === uid) {
          console.log(recipe);
          return recipe;
        }
      });
      console.log(recipeId);
      if (recipeId !== undefined) {
        return (
          <div>
            <RecipeDescription key={id} recipe={recipeId} />
          </div>
        );
      }
      window.location.href = "/";
      return (
        <div>
          <HomePage
            recipe={this.state.randomRecipe}
            allRecipe={this.props.allRecipe}
          />
        </div>
      );
    }
  };

  randomRecipeList = () => {
    if (this.props.randomRecipe !== undefined) {
      return (
        <div>
          <RecipeDescription
            key={Math.floor(Math.random() * 100)}
            recipe={this.props.randomRecipe}
          />
        </div>
      );
    }
    window.location.href = "/";
    return (
      <div>
        <HomePage
          recipe={this.state.randomRecipe}
          allRecipe={this.props.allRecipe}
        />
      </div>
    );
  };

  savedRecipe = () => {
    if (this.props.username !== undefined) {
      return (
        <div>
          <SavedRecipe />
        </div>
      );
    }
    window.location.href = "/";
    return (
      <div>
        <HomePage
          recipe={this.state.randomRecipe}
          allRecipe={this.props.allRecipe}
        />
      </div>
    );
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route exact={true} path="/" render={this.homePage} />
          <Route
            exact={true}
            path="/recipeDescription/:uri"
            render={this.recipeDesc}
          />
          <Route
            exact={true}
            path="/randomRecipeDescription/:uri"
            render={this.randomRecipeList}
          />
          <Route
            exact={true}
            path="/savedRecipe/:user"
            render={this.savedRecipe}
          />
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

let mapStateToProps = st => {
  return {
    allRecipe: st.allRecipe,
    randomRecipe: st.randomRecipe,
    username: st.username,
    recipeList: st.recipeList
  };
};
let App = connect(mapStateToProps)(UnconnectedApp);
export default App;
