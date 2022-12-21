import React from 'react';

const LoginForm = () => {
  return (
    <form action='/login' method='post'>
      <div>
        <h1>Login</h1>
        <div>
          <label>Username: </label>
          <input type="text" placeholder="Enter Username" name="uname" required />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" placeholder="Enter Password" name="pw" required />
        </div>

        <div>
          <button formAction="/login" type="submit">Login</button>
        </div>
      </div>
    </form>
  )
}

export default LoginForm;
