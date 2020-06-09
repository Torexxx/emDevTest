import React from 'react'
import {  Button } from 'react-bootstrap'


export default ({webTitle, sectionName, webUrl, clearRowData}) => (

<>
    <table className="table">
        <thead>
        <tr>
            <th>Title</th>
            <th>Section name</th>
            <th>Url</th>


        </tr>
        </thead>
        <tbody>
        <tr>
            <td> {webTitle}</td>
            <td> {sectionName}</td>
            <td><a href={webUrl} target = "_blank" rel="noopener noreferrer">{webUrl}</a></td>
        </tr>

        </tbody>
    </table>
    <Button variant="warning" onClick={() => clearRowData()}  >Назад</Button>
        </>

)

