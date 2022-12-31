export const initialState = {
    status: 'not-authenticated',
    user: {},
    errorMessage: null
}

export const checkingState = {
    status: 'checking',
    user: {},
    errorMessage: null
}

export const authenticatedState = {
    status: 'authenticated',
    user: {
        uid: 'ABC',
        name: 'Test'
    },
    errorMessage: null
}