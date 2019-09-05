import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import RecipeCard from "./recipeCard.jsx";
import RecipeDescription from "./recipeDescription.jsx";

class UnconnectedSavedRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeList: [],
      recipeLink: [],
      status: false
    };
  }

  itemKey = url => {
    if (url !== undefined) {
      let recipeId = "#recipe_";
      let id = url.indexOf(recipeId) + recipeId.length;
      let uid = url.slice(id, url.length);
      return uid;
    }
  };

  itemDesc = url => {
    if (url !== undefined) {
      let recipeId = "#recipe_";
      let id = url.indexOf(recipeId) + recipeId.length;
      let uid = url.slice(id, url.length);
      return "/recipeDescription/" + uid;
    }
  };

  showMoreHandler = () => {
    if (this.props.counter * 10 + 10 === this.props.recipeList.length) {
      document.getElementById("showMore").style.display = "none";
      this.props.dispatch({
        type: "showMore",
        counter: this.props.counter + 1
      });
    } else {
      this.props.dispatch({
        type: "showMore",
        counter: this.props.counter + 1
      });
    }
  };

  savedList = async () => {
    let data = new FormData();
    data.append("username", this.props.username);
    let response = await fetch("/saved", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      this.setState({ recipeList: body.recipe });
      this.props.dispatch({ type: "savedList", recipeList: body.recipe });
    }
  };

  recipeLink = recipe => {
    this.setState({ recipeLink: recipe, status: true });
  };

  render() {
    if (this.state.recipeList.length === 0) {
      this.savedList();
      return (
        <div
          id="loading"
          className="loading"
          style={{ display: "block" }}
        ></div>
      );
    }
    if (this.state.status) {
      return <RecipeDescription recipe={this.state.recipeLink} />;
    }
    let recipeList = this.state.recipeList.slice(0, 10 * this.props.counter);
    return (
      <div className="recipSugg">
        <h1>Your Favorite Recipe</h1>
        <div id="searchList" className="researchList">
          {recipeList.map(recipe => {
            return (
              <Link
                to={this.itemDesc(recipe.uri)}
                key={this.itemKey(recipe.uri) + Math.floor(Math.random() * 100)}
                style={{ textDecoration: "none" }}
              >
                <RecipeCard
                  key={this.itemKey(recipe.uri)}
                  title={recipe.label}
                  calorie={
                    Math.round((recipe.calories / recipe.yield) * 100) / 100
                  }
                  weight={Math.round(
                    ((recipe.totalWeight / recipe.yield) * 100) / 100
                  )}
                  itemDesc={recipe.uri}
                  image={recipe.image}
                  dietLabel={recipe.dietLabels}
                />
              </Link>
            );
          })}
        </div>
        {recipeList.length > 0 ? (
          <div className="inputContent">
            <button
              id="showMore"
              className="showMore"
              onClick={this.showMoreHandler}
            >
              Show More
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

let mapStateToProps = st => {
  return {
    username: st.username,
    counter: st.counter,
    recipeList: st.recipeList
  };
};

let SavedRecipe = connect(mapStateToProps)(UnconnectedSavedRecipe);
export default SavedRecipe;
