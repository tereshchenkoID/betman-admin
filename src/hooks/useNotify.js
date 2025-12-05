import { useToastifyStore } from 'stores/toastifyStore'

export const useNotify = () => {
  const { setToastify } = useToastifyStore()

  const notify = (json, message) => {
    setToastify({
      type: json?.code === '0' ? 'success' : 'error',
      text: json?.message || message,
    })
  }

  return { notify }
}
