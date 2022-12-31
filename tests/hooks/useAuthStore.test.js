import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { calendarApi } from '../../src/api'
import { useAuthStore } from '../../src/hooks/useAuthStore'
import { authSlice } from '../../src/store'
import { checkingState, initialState } from '../fixtures/authStates'
import { testUserCredentials } from '../fixtures/testUser'

const getMockStore = ( initialState ) => {
    return configureStore( {
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    } )
}

describe( 'Pruebas en useAuthStore', () => {

    beforeEach( () => localStorage.clear() )

    test( 'Debe regresar los valores por defecto', () => {

        const mockStore = getMockStore( { ...initialState } )

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={ mockStore }>{ children }</Provider>
        } )

        expect( result.current ).toEqual( {
            ...initialState,
            startLogin: expect.any( Function ),
            startRegister: expect.any( Function ),
            checkAuthToken: expect.any( Function ),
            startLogout: expect.any( Function ),
        } )
    } )

    test( 'startLogin debe realizar el login correctamente', async () => {

        const mockStore = getMockStore( { ...initialState } )

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={ mockStore }>{ children }</Provider>
        } )

        await act( async () => {
            await result.current.startLogin( testUserCredentials )
        } )

        const { errorMessage, status, user } = result.current

        expect( { errorMessage, status, user } ).toEqual( {
            errorMessage: null,
            status: 'authenticated',
            user: {
                name: 'Test User', uid: '639b9a03056282f1e4cf73a7'
            }
        } )

        expect( localStorage.getItem( 'token' ) ).toEqual( expect.any( String ) )
        expect( localStorage.getItem( 'token-init-date' ) ).toEqual( expect.any( String ) )
    } )

    test( 'El startLogin debe fallar la autenticacion', async () => {

        const mockStore = getMockStore( { ...initialState } )

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={ mockStore }>{ children }</Provider>
        } )

        await act( async () => {
            await result.current.startLogin( { email: 'error@google.com', password: 'abcdefg' } )
        } )

        const { errorMessage, status, user } = result.current

        expect( { errorMessage, status, user } ).toEqual( {
            errorMessage: 'Incorrect credentials',
            status: 'not-authenticated',
            user: {}
        } )

        expect( localStorage.getItem( 'token' ) ).toBe( null )

        await waitFor(
            () => expect( result.current.errorMessage ).toBe( null )
        )
    } )

    test( 'startRegister debe crear un usuario', async () => {

        const mockStore = getMockStore( { ...initialState } )

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={ mockStore }>{ children }</Provider>
        } )

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue( {
            data: {
                ok: true,
                uid: 'SOMEID',
                name: 'Test User 2',
                token: 'SOMETOKEn'
            }
        } )

        await act( async () => {
            await result.current.startRegister( { email: 'something@google.com', password: 'abc123456', name: 'Test User 2' } )
        } )

        const { errorMessage, status, user } = result.current

        expect( { errorMessage, status, user } ).toEqual( {
            errorMessage: null,
            status: 'authenticated',
            user: { name: 'Test User 2', uid: 'SOMEID' }
        } )

        spy.mockRestore()
    } )

    test( 'startRegister debe fallar la creacion', async () => {

        const mockStore = getMockStore( { ...initialState } )

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={ mockStore }>{ children }</Provider>
        } )

        await act( async () => {
            await result.current.startRegister( testUserCredentials )
        } )

        const { errorMessage, status, user } = result.current

        expect( { errorMessage, status, user } ).toEqual( {
            errorMessage: 'User already exists',
            status: 'not-authenticated',
            user: {}
        } )
    } )

    test( 'checkAuthToken debe fallar si no hay token', async () => {

        const mockStore = getMockStore( { ...checkingState } )

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={ mockStore }>{ children }</Provider>
        } )

        await act( async () => {
            await result.current.checkAuthToken()
        } )

        const { errorMessage, status, user } = result.current

        expect( { errorMessage, status, user } ).toEqual( {
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        } )
    } )

    test( 'checkAuthToken debe autenticar el usuario si hay un token', async () => {

        const { data } = await calendarApi.post( '/auth', testUserCredentials )

        localStorage.setItem( 'token', data.token )

        const mockStore = getMockStore( { ...checkingState } )

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={ mockStore }>{ children }</Provider>
        } )

        await act( async () => {
            await result.current.checkAuthToken()
        } )

        const { errorMessage, status, user } = result.current

        console.log( { errorMessage, status, user } )

        expect( { errorMessage, status, user } ).toEqual( {
            errorMessage: null,
            status: 'authenticated',
            user: {
                name: 'Test User',
                uid: '639b9a03056282f1e4cf73a7'
            }
        } )
    } )
} )
