import React from 'react'

const SingleLineFooter = () => {
    return (
        <div style={{
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 400,
            fontSize: 'calc(var(--variable) * 1.6)',
            lineHeight: 'calc(var(--variable) * 1.9)',
            textAlign: 'center',
            color: '#615959',
            margin: '2rem 0 2rem 0',
        }}>
            {`©2024, Bluepen All rights Reserved`}
        </div>
    )
}

export default SingleLineFooter