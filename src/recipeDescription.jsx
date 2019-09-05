import React, { Component } from "react";
import { connect } from "react-redux";
import "./recipeDescription.css";
import Header from "./header.jsx";
import { Redirect } from "react-router";
import Swal from "sweetalert2";

class UnconnectedRecipeDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: [],
      redirect: false,
      saved: false
    };
  }

  nutrimentHandler = nutriments => {
    let arr = [];
    for (let property in nutriments) {
      let msg =
        nutriments[property].label +
        ": " +
        Math.round(
          ((nutriments[property].quantity / this.props.recipe.yield) * 100) /
            100
        ) +
        " " +
        nutriments[property].unit;
      arr.push(
        <li className="nutri" key={Math.floor(Math.random() * 1000000)}>
          {msg}
        </li>
      );
    }
    return arr;
  };

  searchTag = async evt => {
    evt.preventDefault();
    let label = "&health=" + evt.target.value.toLowerCase();
    let response = await fetch(
      `https://api.edamam.com/search?q=&app_id=5243650a&app_key=a57dade71caf78566c7762746a714fb2&from=0&to=50${label}`
    );
    let body = await response.json();
    if (body.hits.length === 0) {
      document.getElementsByClassName("loading").display = "none";
      document.getElementsByClassName("showMore").display = "none";
      Swal.fire("recipe not found");
    } else {
      document.getElementsByClassName("loading").display = "none";
      document.getElementsByClassName("researchList").display = "flex";
      if (this.state.recipes === []) {
        document.getElementsByClassName("showMore").display = "none";
      } else {
        document.getElementsByClassName("showMore").display = "block";
      }
      this.setState({ recipes: body.hits, redirect: true });
      this.props.dispatch({ type: "allRecipe", allRecipe: body.hits });
      this.props.dispatch({ type: "showMore", counter: 1 });
    }
    this.props.dispatch({ type: "allRecipe", allRecipe: body.hits });
  };

  saveRecipe = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("recipe", JSON.stringify(this.props.recipe));
    data.append("username", this.props.username);
    let response = await fetch("/liked", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (!body.success) {
      Swal.fire("oops an error occurred");
      return;
    } else {
      this.setState({ saved: true });
      Swal.fire("Great, the recipe has been saved successfully!");
      return;
    }
  };

  deleteSavedItem = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("recipe", JSON.stringify(this.props.recipe));
    data.append("username", this.props.username);
    let response = await fetch("/delete", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      Swal.fire("Great, the recipe has been removed successfully!");
      this.setState({ saved: false });
    }
  };

  savedStatus = async () => {
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
      let status = false;
      body.recipe.map(recipe => {
        let value = Object.values(recipe);
        if (value.includes(this.props.recipe.uri)) {
          status = true;
        }
      });
      if (status) {
        this.setState({ saved: true });
      }
    }
  };

  componentDidMount = () => {
    if (this.props.loginStatus) {
      document.getElementById("addButton").style.display = "block";
    } else {
      document.getElementById("addButton").style.display = "none";
    }
    if (this.props.username) {
      this.savedStatus();
    }
  };

  render() {
    if (this.state.redirect) {
      return (
        <div>
          <Header />
          <Redirect
            to="/"
            recipe={this.props.randomRecipe}
            allRecipe={this.state.recipes}
          />
        </div>
      );
    }
    if (this.state.recipe !== undefined) {
      return (
        <div className="descContent">
          <div className="desc">
            <img
              src={this.props.recipe.image}
              alt=""
              width="auto"
              height="auto"
              style={{ borderRadius: "16px" }}
            />
            <div className="detail">
              <h1>{this.props.recipe.label}</h1>
              <h3>Caution:</h3>
              {this.props.recipe.cautions.map(elem => {
                return (
                  <div
                    className="caution"
                    key={Math.floor(Math.random() * 100000)}
                  >
                    {elem}
                  </div>
                );
              })}
              <div>
                <h3>Health Label</h3>
                <div className="healthLabel">
                  {this.props.recipe.healthLabels.map(elem => {
                    return (
                      <button
                        className="labelButton"
                        onClick={this.searchTag}
                        value={elem}
                        key={Math.floor(Math.random() * 100000)}
                      >
                        {elem}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="servingInfo">
                <div className="portion">
                  <img
                    src="https://cdn4.iconfinder.com/data/icons/eldorado-food-2/40/pizza-512.png"
                    alt=""
                    width="20px"
                  />
                  <div className="portVal">
                    {" "}
                    {Math.round(
                      (this.props.recipe.totalWeight /
                        this.props.recipe.yield) *
                        100
                    ) / 100}{" "}
                    g / serving
                  </div>
                </div>
                <div className="portion">
                  <img
                    src="https://banner2.kisspng.com/20180713/wsh/kisspng-computer-icons-hydrogen-chemical-element-download-caloric-5b494fa4958cc8.3664333515315311726126.jpg"
                    alt=""
                    width="20px"
                  />
                  <div className="portVal">
                    {Math.round(
                      (this.props.recipe.calories / this.props.recipe.yield) *
                        100
                    ) / 100}{" "}
                    kcal / serving
                  </div>
                </div>
              </div>
              <h3>{this.props.recipe.ingredientLines.length} Ingredients</h3>
              <ul className="ingredients">
                {this.props.recipe.ingredientLines.map(ingre => {
                  return (
                    <li
                      key={Math.floor(Math.random() * 100000)}
                      className="ingre"
                    >
                      {ingre}
                    </li>
                  );
                })}
              </ul>
              {!this.state.saved ? (
                <form
                  onSubmit={this.saveRecipe}
                  id="addButton"
                  style={{ display: "none" }}
                  className="addButton"
                >
                  <img
                    src="/upload/80-512.png"
                    height="25px"
                    style={{ position: "relative", top: "6px" }}
                  />
                  <input
                    type="submit"
                    className="buttonContent"
                    value="Save this recipe"
                  />
                </form>
              ) : (
                <form
                  onSubmit={this.deleteSavedItem}
                  id="addButton"
                  style={{ display: "none" }}
                  className="addButton"
                >
                  <img
                    src="/upload/Deletion_icon.svg"
                    height="25px"
                    style={{ position: "relative", top: "6px" }}
                  />
                  <input
                    type="submit"
                    className="buttonContent"
                    value="Remove this recipe"
                  />
                </form>
              )}
            </div>
          </div>
          <h2>Nutrients/serving</h2>
          <ul className="nutriment">
            {this.nutrimentHandler(this.props.recipe.totalNutrients)}
          </ul>
          <div className="recipeLink">
            <h4>See full recipe on: </h4>
            <a href={this.props.recipe.url}>{this.props.recipe.source}</a>
          </div>
        </div>
      );
    }
  }
}

let mapStateToProps = st => {
  return {
    username: st.username,
    loginStatus: st.loginStatus,
    randomRecipe: st.randomRecipe,
    recipeList: st.recipeList
  };
};

let RecipeDescription = connect(mapStateToProps)(UnconnectedRecipeDescription);

export default RecipeDescription;
