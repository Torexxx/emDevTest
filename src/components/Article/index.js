import React from 'react'

export default ({webTitle, webPublicationDate}) => {
    let date = new Date(webPublicationDate).toLocaleDateString()
    return (

        <>
            <td>{webTitle}</td>
            <td>{date}</td>


        </>
    )
}