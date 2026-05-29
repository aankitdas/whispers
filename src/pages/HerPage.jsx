import { useStore } from '../store/useStore'
import PinScreen from '../components/shared/PinScreen'
import ReceiverHome from '../components/receiver/ReceiverHome'

export default function HerPage() {
  const { receiverAuthenticated, setReceiverAuthenticated } = useStore()

  if (!receiverAuthenticated) {
    return <PinScreen side="receiver" onSuccess={() => setReceiverAuthenticated(true)} />
  }
  return <ReceiverHome target="her" />
}
