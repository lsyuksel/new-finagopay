import React from 'react'

export default function LoginFooter({text,className}) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: text }} />
  )
}
