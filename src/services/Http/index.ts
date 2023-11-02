import Axios, { AxiosRequestHeaders } from 'axios'

export const HttpService = Axios.create({
    baseURL: ''
})
export const CreateHttpService = (baseURL: string, headers?: AxiosRequestHeaders) => {
    const instance = Axios.create({
        baseURL,
        headers
    })
    return instance
}

export default HttpService