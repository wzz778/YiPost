import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const Dept: FC<IProps> = () => {
  return <div>Dept</div>
}

export default memo(Dept)
