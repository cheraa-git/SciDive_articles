import axios from 'axios'
import { SERVER_URL } from '../config'

export default axios.create({
  baseURL: SERVER_URL,
})
