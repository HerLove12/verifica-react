import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function App() {
  const [username, setUsername] = useState(null);
  //const [password, setPassword] = useState('null');
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null)
  const [email, setEmail] = useState(null)
  const [reg_date, setRegDate] = useState(null)

  const [loggedIn, setLoggedIn] = useState(false);

  const [successful, setSuccessful] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  async function register() {
    setErrorMessage(null);

    const s_username = document.getElementById('susername').value;
    const s_password = document.getElementById('spassword').value;
    const s_email = document.getElementById('semail').value;

    const response = await fetch('http://localhost:8080/signup',{
      method:'POST',
      body: JSON.stringify({username:s_username,password:s_password,email:s_email})}); //{"username": "benve", "password": "asdasdasd", "email": "claudio@benve.it"}
    const s_json = await response.json(); //{"status":" true}

    setSuccessful(s_json.status);
    if(s_json.status == false){
      setErrorMessage("Errore nella registrazione")
    }else{
      setErrorMessage(null);
    }
    console.log(s_json.status);
  }

  async function login() {
    setErrorMessage(null);

    const l_username = document.getElementById('lusername').value;
    const l_password = document.getElementById('lpassword').value;

    const response = await fetch('http://localhost:8080/login',{
      method:'POST',
      body: JSON.stringify({username:l_username,password:l_password})}); //{"username": "benve", "password": "asdasdasd"}
    const l_json = await response.json(); //{"token":"OBVkIUQ8M6wzGFtjKyrs"}
    console.log(l_json.token)
    if(l_json.token === ""){
      setErrorMessage("Errore nel Log-in, dati errati")
    }
    else{
      const lt = l_json.token
      setErrorMessage(null);
      setLoggedIn(true);
      console.log("this is the json token: " + lt)

      getData(lt)
    }

  }

  async function getData(token) {
    setErrorMessage(null);

    const response = await fetch(`http://localhost:8080/user/${token}` ,{method: 'GET'});
    const d_json = await response.json(); //{"id":7,"username":"aaa","email":"aaa@aaa.aa","token":"OBVkIUQ8M6wzGFtjKyrs","reg_date":"2024-05-14 11:02:35"}

    console.log(d_json);
    
    setToken(token);
    setEmail(d_json.email);
    setId(d_json.id);
    setUsername(d_json.username);
    setRegDate(d_json.reg_date);
  }

  return (
    <div className="App">
      <p class='errore'>{errorMessage}</p>
      {(!successful && !loggedIn) || (successful && !loggedIn)?
      <div>
        <div>
          <h1>Register here:</h1>
          <form>
            <input type="text" required id="susername" placeholder="Username" />
            <input type="password" required id="spassword" placeholder="Password" />
            <input type="email" required id="semail" placeholder="Email" />
            <button type="button" onClick={register}>Register</button>
          </form>
          {successful ? <p class="win">registrato con successo</p> : null}
          <br></br>
          <hr></hr>
        </div>
        <div>
          <h1>Login here:</h1>
          <form>
            <input type="text" id="lusername" placeholder="Username" />
            <input type="password" id="lpassword" placeholder="Password" />
            <button type="button" onClick={login}>Login</button>
          </form>  
        </div>
        </div>
      :loggedIn ?
        <div>
          <h1>Welcome {username}</h1>
          <ul>
            <li>id: {id}</li>
            <li>username: {username}</li>
            <li>email: {email}</li>
            <li>Registration date: {reg_date}</li>
          </ul> 
        </div>
      :
        <div>
          <h1>Something went wrong</h1>
        </div>
      }
    </div>
  );
}

export default App;
