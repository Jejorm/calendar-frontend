import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from '../../../src/store/auth/AuthSlice'
import { authenticatedState, initialState } from '../../fixtures/authStates'
import { testUserCredentials } from '../../fixtures/testUser'

describe( 'Pruebas en authSlice', () => {

    test( 'Debe regresar el estado inicial', () => {

        expect( authSlice.getInitialState() ).toEqual( initialState )
    } )

    test( 'Debe realizar el checking', () => {

        const state = authSlice.reducer( initialState, onChecking() )

        expect( state ).toEqual( {
            status: 'checking',
            user: {},
            errorMessage: null
        } )
    } )

    test( 'Debe realizar un login', () => {

        const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) )

        expect( state ).toEqual( {
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: null
        } )
    } )

    test( 'Debe realizar el logout', () => {

        const state = authSlice.reducer( authenticatedState, onLogout() )

        expect( state ).toEqual( {
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        } )
    } )

    test( 'Debe realizar el logout con mensaje de error', () => {

        const errorMessage = 'Credenciales no validas'

        const state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) )

        expect( state ).toEqual( {
            status: 'not-authenticated',
            user: {},
            errorMessage
        } )
    } )

    test( 'Debe limpiar el mensaje de error', () => {

        const errorMessage = 'Credenciales no validas'

        let state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) )

        state = authSlice.reducer( state, clearErrorMessage() )

        expect( state.errorMessage ).toBe( null )
    } )
} )