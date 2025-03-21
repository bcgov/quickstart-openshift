import type { FC } from 'react'
import apiService from '@/service/api-service'
import { useEffect, useState } from 'react'
import type { AxiosResponse } from '~/axios'

const Dashboard: FC = () => {
  const [data, setData] = useState<any>([])

  useEffect(() => {
    apiService
      .getAxiosInstance()
      .get('/v1/users')
      .then((response: AxiosResponse) => {
        const users = []
        for (const user of response.data) {
          const userDto = {
            id: user.id,
            name: user.name,
            email: user.email,
          }
          users.push(userDto)
        }
        setData(users)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])
  const [selectedRow, setSelectedRow] = useState(null)

  const handleClose = () => {
    setSelectedRow(null)
  }
  return (
    <div
      style={{
        minHeight: '45em',
        maxHeight: '45em',
        width: '100%',
        marginLeft: '4em',
      }}
    >
      Hello World
    </div>
  )
}

export default Dashboard
