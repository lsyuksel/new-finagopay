import React from 'react'

export default function LoginFooter({text,className}) {
  return (
    <div className="container">
      <div className={className} dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  )
}
