import axios from 'axios'
import { get_api_url } from '../utility/url'
export const CREATE = 'CREATE'
export const FIND = 'FIND'
export const GET = 'GET'
export const UPDATE = 'UPDATE'
export const DELETE = 'DELETE'
export const FILE_SAVE = 'FILE_SAVE'
export const DELETE_FILE = 'DELETE_FILE'
export const PRINTE = 'PRINTE'

const sUrl = get_api_url()

export async function apiCall(operation, model, payload = {}, params = {}) {
  const { id, queries, limit, skip, sort } = params || {}

  switch (operation) {
    case CREATE:
      return await axios.post(`${sUrl}/${model}`, payload)

    case FIND:
      return await axios.get(
        `${sUrl}/${model}?${queries ? `${queries}&` : ''}${
          limit ? `$limit=${limit}` : ''
        }&$skip=${skip}${sort ? `&${sort}` : ''}     `
      )

    case GET:
      return await axios.get(`${sUrl}/${model}/${id}`)

    case UPDATE:
      return await axios.patch(`${sUrl}/${model}/${id}`, payload)

    case DELETE:
      return await axios.delete(`${sUrl}/${model}/${id}`)

    case DELETE_FILE:
      return await axios.patch(`${sUrl}/${model}/${id}`, payload)

    case PRINTE:
      console.log(`${sUrl}/${model}/`, payload)
      return await axios.patch(`${sUrl}/${model}/`, payload)

    case FILE_SAVE:
      return await axios.post(`${sUrl}/${model}/`, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data;',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE2ODQ1MTYwMzIsImV4cCI6MTY4NTM4MDAzMiwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsInN1YiI6IjY0MzZlYmMwZGU5OGU1YTBlNjk3OWZkNyIsImp0aSI6IjZmZjgwNWM1LWJjNDYtNDlmMy1hYTllLWEzZGQ4YTI0MjJkNyJ9.waxeLb4jjltCXf5cxK5C_LAwLt97fk-IU0yUuVpAfc4',
        },
      })
    default:
      return null
  }
}
