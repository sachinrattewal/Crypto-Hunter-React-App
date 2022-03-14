import { Box, Button, TextField } from '@material-ui/core';
import React, {useState} from 'react';
import { CryptoState } from '../../CryptoContext';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from '../../firebase'; 


const Login = ({handleClose}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAlert } = CryptoState(); 


  const handleSubmit = async () => {
    if(!email || !password){
      setAlert({
          open: true,
          message: "Please fill all the fields",
          type: "error"
      });
      return;
  }
  try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setAlert({open: true, message: `Login Successful. Welcome ${result.user.email}`, type: 'success'});
      handleClose();
      console.log(result);
  } catch (error) {
      setAlert({open: true, message: error.message, type: 'error'});
      return;
  }
  }

  return (
    <Box p={3} style={{display: 'flex', flexDirection: 'column'}}>
      <TextField variant="outlined" type="email" label="Enter Email" value={email} onChange={(e)=> setEmail(e.target.value)} fullWidth style={{marginBottom: 15}}></TextField>
      <TextField variant="outlined" type="password" label="Enter Password" value={password} onChange={(e)=> setPassword(e.target.value)} fullWidth style={{marginBottom: 15}}></TextField>
      <Button variant="contained" size="large" style={{backgroundColor: "#EEBC1D"}} onClick={handleSubmit}>Login</Button>
    </Box>
  )
}

export default Login