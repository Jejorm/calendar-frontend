export const events = [
    {
        id: '1',
        start: new Date( '2022-12-17 12:00:00' ),
        end: new Date( '2022-12-17 14:00:00' ),
        title: 'Aniversario',
        notes: 'Comprar',
    },
    {
        id: '2',
        start: new Date( '2022-12-18 13:00:00' ),
        end: new Date( '2022-12-18 15:00:00' ),
        title: 'Aniversario 2',
        notes: 'Comprar 2',
    },
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[ 0 ] }
}