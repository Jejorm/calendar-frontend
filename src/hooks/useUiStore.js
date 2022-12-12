import { useDispatch, useSelector } from 'react-redux'
import { onClearActiveEvent, onCloseDateModal, onOpenDateModal } from '../store'

export const useUiStore = () => {

    const { isDateModalOpen } = useSelector( state => state.ui )

    const dispatch = useDispatch()

    const openDateModal = () => {
        dispatch( onOpenDateModal() )
    }

    const closeDateModal = () => {
        dispatch( onClearActiveEvent() )
        dispatch( onCloseDateModal() )
    }

    return {
        isDateModalOpen,
        openDateModal,
        closeDateModal
    }
}