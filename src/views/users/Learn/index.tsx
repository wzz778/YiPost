import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const Learn: FC<IProps> = () => {

  
  return <div>Learn</div>
}

export default memo(Learn)
