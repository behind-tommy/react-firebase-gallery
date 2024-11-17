// Imports React which is necessary to use components, and useState to manage state (storing email, password, etc)
import React, { useState } from 'react';
// A firebase auth function that enables sign-in with email and password
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

    // This triggers when the user submits the sign-up form.
   const handleLogin = async (e) => {
        // prevents page reload
       e.preventDefault();
       try {
            // signs in with the email & password state values
            await signInWithEmailAndPassword(auth, email, password);
            alert('Logged in successfully!');
       } catch (err) {
           setError(err.message);
       }
   };

   return (
       <div className="login-form-holder">
           <form onSubmit={handleLogin}>
               <input
                   type="email"
                   placeholder="Artist Email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
               />
               <input
                   type="password"
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
               />
               <button type="submit">Enter Studio</button>
           </form>
           {error && <p style={{ color: 'red' }}>{error}</p>}
       </div>
   );
};

export default Login;
