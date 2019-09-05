import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import RecipeCard from "./recipeCard.jsx";

class UnconnectedHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomRecipe: {}
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

  randomDesc = url => {
    if (url !== undefined) {
      let recipeId = "#recipe_";
      let id = url.indexOf(recipeId) + recipeId.length;
      let uid = url.slice(id, url.length);
      return "/randomRecipeDescription/" + uid;
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
    if (this.props.counter * 10 + 10 === this.props.allRecipe.length) {
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

  componentDidMount = () => {
    document.getElementById("recipeSuggested").style.backgroundImage =
      "url(" + this.props.randomRecipe.image + ")";
    document.getElementById("recipeSuggested").style.backgroundSize =
      "auto 100%";
    document.getElementById("recipeSuggested").style.backgroundRepeat =
      "no-repeat";
    return;
  };

  render() {
    let recipeList = this.props.allRecipe.slice(0, 10 * this.props.counter);
    return (
      <div>
        {recipeList ? (
          <div className="recipSugg">
            <h1>Recipe suggested</h1>
            <div
              className="anim position"
              key={this.itemKey(this.props.randomRecipe.uri)}
            >
              <Link
                to={this.randomDesc(this.props.randomRecipe.uri)}
                id="randomRecipe"
                className="link"
              >
                <div id="recipeSuggested" className="elem show">
                  <div className="randDesc">
                    <div className="recipeTitle">
                      {this.props.randomRecipe.label}
                    </div>
                    <div className="description">
                      <div>
                        {Math.round(
                          (this.props.randomRecipe.totalWeight /
                            this.props.randomRecipe.yield) *
                            100
                        ) / 100}{" "}
                        g /servings
                      </div>
                      <div>
                        {Math.round(
                          (this.props.randomRecipe.calories /
                            this.props.randomRecipe.yield) *
                            100
                        ) / 100}{" "}
                        kcal / serving
                      </div>
                      {this.props.randomRecipe.dietLabels.map(label => {
                        if (label !== undefined) {
                          return (
                            <div
                              key={
                                this.itemKey(this.props.randomRecipe.uri) +
                                Math.floor(Math.random() * 100)
                              }
                            >
                              {label}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div id="searchList" className="researchList">
              {recipeList.map(recipe => {
                return (
                  <Link
                    to={this.itemDesc(recipe.recipe.uri)}
                    key={
                      this.itemKey(recipe.recipe.uri) +
                      Math.floor(Math.random() * 100)
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <RecipeCard
                      key={this.itemKey(recipe.recipe.uri)}
                      title={recipe.recipe.label}
                      calorie={
                        Math.round(
                          (recipe.recipe.calories / recipe.recipe.yield) * 100
                        ) / 100
                      }
                      weight={Math.round(
                        ((recipe.recipe.totalWeight / recipe.recipe.yield) *
                          100) /
                          100
                      )}
                      itemDesc={recipe.recipe.uri}
                      image={recipe.recipe.image}
                      dietLabel={recipe.recipe.dietLabels}
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
        ) : (
          <div
            id="loading"
            className="loading"
            style={{ display: "block" }}
          ></div>
        )}
      </div>
    );
  }
}

let mapStateToProps = st => {
  return {
    allRecipe: st.allRecipe,
    counter: st.counter,
    randomRecipe: st.randomRecipe
  };
};

let HomePage = connect(mapStateToProps)(UnconnectedHomePage);
export default HomePage;
