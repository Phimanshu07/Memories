import React,{useState} from 'react';
import { Avatar,Typography,Paper,Grid,Container,Button, TextField } from '@material-ui/core';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import Icon from './icon';
import GoogleLogin from 'react-google-login';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { AUTH } from '../../constants/actionTypes';
import {signup,signin} from '../../actions/auth';

const initialState = {firstName: '', lastName: '', email:'', password:'', confirmPassword: ''};

const Auth = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp,setIsSignUp] = useState(false);
    const [formData,setFormData] = useState(initialState);
    const state = null;
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useNavigate();
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const handleSubmit = (e) => {
      e.preventDefault();
      // console.log(formData);
      if(isSignUp) {
        dispatch(signup(formData,history))
      } else {
        dispatch(signin(formData,history))
      }
    }
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]:e.target.value })
    }
    const switchMode = () => {
      setIsSignUp((prevIsSignUp => !prevIsSignUp))
      setShowPassword(false);
    }
    const goggleSuccess = async (res) => {
      const result = res?.profileObj;
      const token = res?.tokenId;
      try {
        dispatch({type:AUTH, data:{result,token}});
        history('/');
      } catch (error) {
        console.log(error);
      }
    }
    const googleFailure = (error) => {
      console.log(error)
      console.log("Google Sign In was unsuccessfull. Try again later");
    }
  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography variant='h5'>{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignUp && (
                <>
                  <Input name='firstName' label='First Name' handleChange = {handleChange} autoFocus half/>
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )
            }  
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }          
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit} >
            { isSignUp ? 'Sign Up' : 'Sign In' }
          </Button> 
          <GoogleLogin
            clientId='191366791819-hh4fs0qqelo618qfbe26ef8p4il1q7kp.apps.googleusercontent.com'
            render={(renderProps) => (
              <Button 
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon/>}
                variant="contained"
              >
                Google Sign In
              </Button>
            )}  
            onSuccess={goggleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          <Grid container justify='center'>
              <Grid item>
                <Button onClick={switchMode}>
                  { isSignUp ? 'Already have an account ? Sign In' : "Don't havr an account ? Sign Up" }
                </Button>
              </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth