import React from 'react'
import Article from "../Article"
import DetailedRowArticle from '../DetailedRowArticle'

const Articles = props => {

        let article = props.data.map(article => {
                return (
                    <tr style={{"cursor": "pointer"}} key={article.id} onClick={() => props.onRowSelect(article)}>

                        <Article  {...article}/>
                    </tr>

                )
            }
        )
        return (
            <>
                { props.row  ?  <DetailedRowArticle  clearRowData = {props.clearRowData} {...props.row}/> :
                    props.data.length ? <table className="table mt-15">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>



                        </tr>
                        </thead>
                        <tbody>

                        {article}


                        </tbody>
                    </table>
                        : props.pagesCount === 0 ? <div>Ничего не найдено</div> : null
                }


            </>
        )
}


export default Articles