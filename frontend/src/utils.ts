import axios from "axios";
const apiAxios = axios.create();
export function getAxios(){
  return apiAxios;
}
