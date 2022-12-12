import { useState } from 'react'
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { localizer, getMessagesEs } from '../../helpers'
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks'
import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../'
import { useEffect } from 'react'
import { onCloseDateModal } from '../../store'

export const CalendarPage = () => {

    const [ lastView, setLastView ] = useState( localStorage.getItem( 'lastView' ) || 'month' )

    const { user } = useAuthStore()

    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore()

    const { openDateModal, closeDateModal } = useUiStore()

    const eventStyleGetter = ( event ) => {

        const isMyEvent = ( user.uid === event.user._id ) || ( user.uid === event.user.uid )

        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }

        return {
            style
        }
    }

    const onDoubleClick = ( event ) => {
        openDateModal()
    }

    const onSelect = ( event ) => {
        setActiveEvent( event )
    }

    const onViewChanged = ( event ) => {
        closeDateModal()
        localStorage.setItem( 'lastView', event )
        setLastView( event )
    }

    useEffect( () => {
        startLoadingEvents()
    }, [] )

    return (

        <>

            <Navbar />

            <Calendar
                culture='es'
                localizer={ localizer }
                events={ events }
                defaultView={ lastView }
                startAccessor="start"
                endAccessor="end"
                style={ { height: 'calc(100vh - 80px)' } }
                messages={ getMessagesEs() }
                eventPropGetter={ eventStyleGetter }
                components={ {
                    event: CalendarEvent
                } }
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelect }
                onView={ onViewChanged }
            />

            <CalendarModal />

            <FabAddNew />

            <FabDelete />

        </>
    )
}
