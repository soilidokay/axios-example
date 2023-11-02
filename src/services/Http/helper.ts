import { AxiosError } from 'axios'

export const PushError = (message: string) => {
  alert(message)
}
export const Sleep = (sec: number) => new Promise((resolve) => setTimeout(resolve, sec))

type TAction<TModel> = () => Promise<TModel>

export const FetchDelay = async function <TModel>(action: TAction<TModel>, sec: number) {
  const [res] = await Promise.all([action(), Sleep(sec)])
  return res
}
export const ProcessRepose = async (err: AxiosError) => {
  if (err.response?.status === 403) {
    const dataError: { Code: number; Message: string } = err.response.data as any
    PushError('error 403')
  } else if (err.response?.status === 401) {
    PushError('error 401')
  } else if (err.code === 'ERR_CANCELED') {
    console.log('ERR_CANCELED')
  } else if ((err.response?.status ?? 500) >= 500) {
    PushError('error 500')
  } else if (err.response?.status === 404) {
    PushError('error 404')
  }
  return Promise.reject(err)
}
