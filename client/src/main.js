import { Footer } from "./footer/footer";
import { Header } from "./header/header";
// import ReactDom from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { HomePage } from "./pages/homePage/homePage";
import { ProfilePage } from "./pages/profilePage/profilePage";
import "./styles/main.scss";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/profile" component={ProfilePage} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
