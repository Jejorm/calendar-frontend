import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { calendarApi } from '../api'
import { convertEventsToDatesEvents } from '../helpers'
import { onAddNewEvent, onClearActiveEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store'

export const useCalendarStore = () => {

    const { events, activeEvent } = useSelector( state => state.calendar )
    const { user } = useSelector( state => state.auth )

    const dispatch = useDispatch()

    const setActiveEvent = ( calendarEvent ) => {

        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async ( calendarEvent ) => {

        try {

            if ( calendarEvent.id ) {

                await calendarApi.put( `/events/${ calendarEvent.id }`, calendarEvent )

                dispatch( onUpdateEvent( { ...calendarEvent, user } ) )

                return
            }

            const { data } = await calendarApi.post( '/events', calendarEvent )

            dispatch( onAddNewEvent( {
                ...calendarEvent,
                id: data.event.id,
                user
            } ) )

        } catch ( error ) {
            console.log( error )
            Swal.fire( 'Error saving', error.response.data.msg, 'error' )
        }
    }

    const startDeletingEvent = async () => {

        try {

            await calendarApi.delete( `/events/${ activeEvent.id }` )

            dispatch( onDeleteEvent() )

        } catch ( error ) {
            dispatch( onClearActiveEvent() )
            console.log( error )
            Swal.fire( 'Error deleting', error.response.data.msg, 'error' )
        }
    }

    const startLoadingEvents = async () => {

        try {

            const { data } = await calendarApi.get( '/events' )

            const events = convertEventsToDatesEvents( data.events )

            dispatch( onLoadEvents( events ) )

        } catch ( error ) {
            console.log( 'Error loading events' )
            console.log( error )
        }
    }

    return {
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents
    }
}