import { useStore } from '../store/useStore'
import PinScreen from '../components/shared/PinScreen'
import SenderHome from '../components/sender/SenderHome'

export default function SendPage() {
  const { senderAuthenticated, setSenderAuthenticated } = useStore()

  if (!senderAuthenticated) {
    return <PinScreen side="sender" onSuccess={() => setSenderAuthenticated(true)} />
  }
  return <SenderHome />
}
