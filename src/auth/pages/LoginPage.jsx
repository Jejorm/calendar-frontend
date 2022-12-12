import { useEffect } from 'react'
import Swal from 'sweetalert2'
import { useAuthStore, useForm } from '../../hooks'
import './LoginPage.css'

/*
    jeremy9@gmail.com
    5551233
*/

const loginFormFields = {
    loginEmail: '',
    loginPassword: ''
}

const registerFormFields = {
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerPassword2: ''
}

export const LoginPage = () => {

    const { loginEmail, loginPassword, onInputChange: onLoginInputChange } = useForm( loginFormFields )
    const { formState, registerName, registerEmail, registerPassword, registerPassword2, onInputChange: onRegisterInputChange } = useForm( registerFormFields )

    const { startLogin, startRegister, errorMessage } = useAuthStore()

    useEffect( () => {

        if ( errorMessage ) {
            Swal.fire( 'Authentication error', errorMessage, 'error' )
        }

    }, [ errorMessage ] )


    const loginSubmit = ( event ) => {

        event.preventDefault()

        startLogin( { email: loginEmail, password: loginPassword } )
    }

    const registerSubmit = ( event ) => {

        event.preventDefault()

        if ( Object.values( formState ).some( x => x === '' ) ) {
            return Swal.fire( 'Register error', 'Please enter all fields', 'error' )
        }

        if ( registerPassword !== registerPassword2 ) {
            return Swal.fire( 'Register error', 'Passwords are not the same', 'error' )
        }

        startRegister( { name: registerName, email: registerEmail, password: registerPassword } )
    }

    return (

        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Login</h3>
                    <form onSubmit={ loginSubmit }>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                name='loginEmail'
                                value={ loginEmail }
                                onChange={ onLoginInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name='loginPassword'
                                value={ loginPassword }
                                onChange={ onLoginInputChange }
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <input
                                type="submit"
                                className="btnSubmit"
                                value="Login"
                            />
                        </div>
                    </form>
                </div>

                <div className="col-md-6 login-form-2">
                    <h3>Register</h3>
                    <form onSubmit={ registerSubmit }>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                name='registerName'
                                value={ registerName }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                name='registerEmail'
                                value={ registerEmail }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name='registerPassword'
                                value={ registerPassword }
                                onChange={ onRegisterInputChange }
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repeat the password"
                                name='registerPassword2'
                                value={ registerPassword2 }
                                onChange={ onRegisterInputChange }
                            />
                        </div>

                        <div className="d-grid gap-2">
                            <input
                                type="submit"
                                className="btnSubmit"
                                value="Create account" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}