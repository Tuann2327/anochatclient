import { useState, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import ChatPage from "./views/ChatPage/ChatPage";
import LoginPage from "./views/LoginPage/LoginPage";
import Cookies from 'js-cookie'
function App() {
  const ENDPOINT = 'http://10.0.0.25:8080' ||'https://anochatserver.herokuapp.com'

  return (
    <Router>
      
      <div className="App">

        <Switch>
          <Route path='/register'>
            <LoginPage
            key={Math.random()}
            isLogin = '0'
            ENDPOINT={ENDPOINT}
            />
          </Route>
          <Route path='/login'>
            <LoginPage
              key={Math.random()}
              isLogin = '1'
              ENDPOINT={ENDPOINT}
            />
          </Route>
          
          <Route path='/home'>
            <ChatPage ENDPOINT={ENDPOINT}/>
          </Route>
          <Route exact path='/'>
            {Cookies.get('access_token') ? <ChatPage ENDPOINT={ENDPOINT}/> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
