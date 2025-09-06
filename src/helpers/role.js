import { ACCOUNT_TYPE } from 'constant/config'

export const role = (data) => {
  return Object.entries(ACCOUNT_TYPE).find(([_, val]) => val === data)?.[0] || null
}
