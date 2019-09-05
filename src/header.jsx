import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import Swal from "sweetalert2";

class UnconnectedHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: " ",
      recipes: [],
      excluded: "",
      diet: [],
      health: [],
      calories: "",
      redirect: false,
      savedRedirect: false
    };
  }

  handleClick = async evt => {
    evt.preventDefault();
    if (this.state.query !== "") {
      document.getElementById("loading").style.display = "block";
      let exclude = "";
      if (this.state.excluded.length > 0) {
        let exc = this.state.excluded.split(" ");
        console.log(exc);
        exc.map(ingredient => {
          exclude += ingredient;
        });
      }
      this.setState({ exclude: exclude });
      try {
        console.log(this.state.excluded);
        let response = await fetch(
          `https://api.edamam.com/search?q=${this.state.query}&app_id=5243650a&app_key=a57dade71caf78566c7762746a714fb2&from=0&to=50&excluded=${this.state.excluded}${this.state.diet}${this.state.health}${this.state.calories}`
        );
        let body = await response.json();
        console.log(body);
        if (body.hits.length === 0) {
          document.getElementById("loading").style.display = "none";
          document.getElementById("showMore").style.display = "none";
          document.getElementById("searchList").style.display = "none";
          Swal.fire("recipe not found");
        } else {
          document.getElementById("loading").style.display = "none";
          this.setState({ recipes: body.hits });
          this.props.dispatch({ type: "allRecipe", allRecipe: body.hits });
          this.props.dispatch({ type: "showMore", counter: 1 });
          console.log(body.hits);
          this.setState({ redirect: true });
        }
      } catch (err) {
        console.log(err);
        document.getElementById("loading").style.display = "none";
        Swal.fire("recipe not found");
      }
    } else {
      this.setState({ recipes: [] });
      this.props.dispatch({ type: "allRecipe", allRecipe: [] });
    }
  };

  handleSearchName = evt => {
    this.setState({ query: evt.target.value });
  };

  optionHandler = () => {
    let div = document.getElementById("option");
    if (div.className === "showMores") {
      this.setState({ exclude: [], diet: [], health: [], calories: "" });
      div.className = "dontShow";
      setTimeout(function() {
        div.style.visibility = "hidden";
        div.style.display = "none";
        document.getElementById("input2").reset();
        document.getElementById("diet").selectedIndex = 0;
        document.getElementById("health").selectedIndex = 0;
      }, 300);
    } else {
      div.style.display = "block";
      setTimeout(function() {
        div.className = "showMores";
        div.style.visibility = "visible";
      }, 300);
    }
  };

  excludeHandler = evt => {
    this.setState({ excluded: evt.target.value });
  };

  dietHandler = evt => {
    this.setState({ diet: "&diet=" + evt.target.value });
  };
  healthHandler = evt => {
    this.setState({ health: "&health=" + evt.target.value });
  };

  maxCaloriesHandler = evt => {
    this.setState({ calories: "&calories=0-" + evt.target.value });
  };

  signUpSubmitHandler = evt => {
    evt.preventDefault();
    Swal.mixin({
      input: "text",
      confirmButtonText: "Next &rarr;",
      showCancelButton: true,
      progressSteps: ["1", "2", "3"]
    })
      .queue([
        {
          title: "Username",
          text: "Please enter your username"
        },
        {
          input: "password",
          title: "Password",
          text: "Please enter your password"
        }
      ])
      .then(async result => {
        if (result.value) {
          let data = new FormData();
          data.append("username", result.value[0]);
          data.append("password", result.value[1]);
          let response = await fetch("/signup", {
            body: data,
            method: "POST",
            credentials: "include"
          });
          let responseBody = await response.text();
          let body = JSON.parse(responseBody);
          console.log("parsed body", body);
          if (!body.success) {
            Swal.fire("Please try again");
            return;
          } else if (body.success === "same username") {
            Swal.fire("Try another username");
            return;
          } else {
            this.props.dispatch({
              type: "username",
              username: result.value[0],
              status: true
            });
            return;
          }
        }
      });
  };

  loginSubmitHandler = evt => {
    evt.preventDefault();
    Swal.mixin({
      input: "text",
      confirmButtonText: "Next &rarr;",
      showCancelButton: true,
      progressSteps: ["1", "2", "3"]
    })
      .queue([
        {
          title: "Username",
          text: "Please enter your username"
        },
        {
          input: "password",
          title: "Password",
          text: "Please enter your password"
        }
      ])
      .then(async result => {
        if (result.value) {
          let data = new FormData();
          data.append("username", result.value[0]);
          data.append("password", result.value[1]);
          let response = await fetch("/login", {
            method: "POST",
            body: data,
            credentials: "include"
          });
          let responseBody = await response.text();
          let body = JSON.parse(responseBody);
          if (!body.success) {
            Swal.fire("Please try again");
            return;
          } else if (body.success === "wrong password") {
            Swal.fire("wrong password, try again!");
            return;
          } else if (body.success === "username doesn't exist") {
            Swal.fire("username doesn't exist, please signup!");
            return;
          } else {
            this.props.dispatch({
              type: "username",
              username: result.value[0],
              status: true
            });
            return;
          }
        }
      });
  };

  logoutHandler = async () => {
    let response = await fetch("/logout", {
      method: "POST",
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (body.success) {
      console.log("test");
      this.props.dispatch({
        type: "username",
        username: undefined,
        status: false
      });
      return;
    }
  };

  savedLink = user => {
    if (user !== undefined) {
      return "/savedRecipe/" + user;
    }
  };

  savedHandler = () => {
    this.setState({ savedRedirect: true });
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
    if (this.state.savedRedirect) {
      return (
        <div>
          <Header />
          <Redirect
            to={this.savedLink(this.props.username)}
            recipeList={this.props.recipeList}
          />
        </div>
      );
    }
    return (
      <div className="header">
        <Link to="/">
          <img src="/upload/logo.png" height="150px" alt=" " />
        </Link>
        <div className="inputContent inputSize">
          <form onSubmit={this.handleClick} className="form">
            <div id="searchBar" className="input_wrapper">
              <input
                type="text"
                id="searchRec"
                alt=""
                placeholder="Search Recipe"
                onChange={this.handleSearchName}
                className="input"
              />
              <input
                type="image"
                src="/upload/output-onlinepngtools.png"
                className="searchButton"
              />
            </div>
          </form>
          <button onClick={this.optionHandler} className="moreOption">
            More Option
          </button>
          <div id="option" className="dontShow">
            <form id="input2">
              <input
                type="text"
                placeholder="Max Calories"
                className="input2"
                onChange={this.maxCaloriesHandler}
              ></input>
              <input
                type="text"
                placeholder="excluded ingredient"
                className="input2"
                onChange={this.excludeHandler}
              ></input>
            </form>
            <div>
              <select id="diet" onChange={this.dietHandler} required>
                <option value="">Select diet label</option>
                <option value="balanced">Balanced</option>
                <option value="high-fiber">High Fiber</option>
                <option value="high-protein">High Protein</option>
                <option value="low-carb">Low Carb</option>
                <option value="low-fat">Low Fat</option>
              </select>
              <select id="health" onChange={this.healthHandler} required>
                <option value="">Select health label</option>
                <option id="health" value="gluten-free">
                  Gluten-free
                </option>
                <option id="health" value="vegan">
                  Vegan
                </option>
                <option id="health" value="keto-friendly">
                  Keto Friendly
                </option>
                <option id="health" value="low-sugar">
                  Low Sugar
                </option>
                <option id="health" value="paleo">
                  Paleo
                </option>
                <option id="health" value="peanut-free">
                  Peanut-free
                </option>
                <option id="health" value="tree-nut-free">
                  Tree Nuts Free
                </option>
                <option id="health" value="wheat-free">
                  Wheat-free
                </option>
              </select>
            </div>
          </div>
          <div id="loading" className="loading"></div>
        </div>
        {this.props.username ? (
          <div>
            <ul className="profilList">
              <li className="userMenu">
                {this.props.username}
                <ul>
                  <li className="userMenu" onClick={this.logoutHandler}>
                    Logout
                  </li>
                  <li className="userMenu" onClick={this.savedHandler}>
                    Recipe saved
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        ) : (
          <div className="profilLink">
            <button
              className="buttonRegister"
              onClick={this.loginSubmitHandler}
            >
              Login{" "}
            </button>
            <button
              className="buttonRegister"
              onClick={this.signUpSubmitHandler}
            >
              Signup
            </button>
          </div>
        )}
      </div>
    );
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

let Header = connect(mapStateToProps)(UnconnectedHeader);
export default Header;
