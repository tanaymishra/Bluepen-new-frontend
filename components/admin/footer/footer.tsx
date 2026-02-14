import React from 'react'

const AdminFooter = () => {
    return (
        <div style={
            {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "SF Pro Display",
                fontSize: "13px",
                lineHeight: "15px",
                color: "#615959",
            }}>
            {`©2024, Bluepen All rights Reserved`}
        </div>
    )
}

export default AdminFooter
