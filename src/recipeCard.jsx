import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedRecipeCard extends Component {
  itemKey = uri => {
    let recipeId = "#recipe_";
    let id = uri.indexOf(recipeId) + recipeId.length;
    let uid = uri.slice(id, uri.length);
    return uid;
  };

  render() {
    return (
      <div className="anim" key={this.itemKey(this.props.itemDesc)}>
        <div className="searchElement show">
          <img
            src={this.props.image}
            alt="recipe"
            width="100%"
            className="img"
          />
          <div>
            <h3 className="recipeCardTitle">{this.props.title}</h3>
            <div className="recipeCardDesc">
              <div>{this.props.calorie} kcal / serving</div>
              <div>{this.props.weight} g /servings</div>
              {this.props.dietLabel.map(label => {
                return (
                  <div
                    key={
                      this.itemKey(this.props.itemDesc) +
                      Math.floor(Math.random() * 100)
                    }
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let RecipeCard = connect()(UnconnectedRecipeCard);

export default RecipeCard;
