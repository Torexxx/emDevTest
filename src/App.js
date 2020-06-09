import React from 'react';
import './App.css';
import * as axios from "axios"
import  ReactPaginate from 'react-paginate'
import { Form, Button} from 'react-bootstrap'
import Articles from "./components/Articles"
import Loader from "./components/Loader"


class App extends React.Component{


    formData = {
        search: {
            type: 'text',
            value: '',
            label: 'Что ищем?',
            errorText: 'Латинский символы не менее 2-х символов',
            validator: val => /^[aA-zZ0-9 ]{2,}$/.test(val),
            valid: null,
            required: true

        },
        fromDate: {
            type: 'date',
            label: 'От',
            value: '',
            validator: val => /([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01]))$/.test(val),
            errorText: 'Формат даты : ГГГГ.ММММ.ДДДД',
            valid: null,
            required: true

        },
        toDate: {
            type: 'date',
            value: '',
            label: 'До',
            validator: val => /([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01]))$/.test(val),
            errorText: 'Формат даты : ГГГГ.ММММ.ДДДД',
            valid: null,
            required: true

        }
    }

    state = {
        data: [],
        isLoading: false,
        search: '',
        fromDate: '',
        toDate: '',
        row: null,
        pagesCount: null,
        currentPage: 1,
        pageSize: null,
    }

    get getUrl(){
        return `https://content.guardianapis.com/search?q=${this.state.search}
&page=${this.state.currentPage}
&from-date=${this.state.fromDate }
&to-date=${this.state.toDate}
&api-key=2f7b2dd9-6931-4275-a0e4-4225e0df1efd `
    }


    formValid(){
        return Object.values(this.formData).every( field => field.valid)
    }

    static lastCall = undefined
    static lastCallTimer = undefined

    debounce(f, t) {
        return function(args) {

            let previousCall = App.lastCall
            App.lastCall = Date.now()
            if (previousCall && ((App.lastCall - previousCall) <= t)) {
                clearTimeout(App.lastCallTimer)
            }
            App.lastCallTimer = setTimeout( () => f(args), t)
        }
    }


    valueChangeHandler = (key, e) => {
        let field = this.formData[key]
        field.value = e.target.value

        this.setState({
            [key]: e.target.value
        })
        if(field.value) {

            field.valid = field.validator(field.value)
        }
        if(this.formValid()) {
            let logger = () => {
                this.searchHandler()

            }

            let debouncedLogger = this.debounce(logger, 2000)
            debouncedLogger()
        }
    }

    async fetchData(url){
        try{
            let res = await axios.get(url)
            let { response } = await res.data
            let data = response.results
            let { pages, pageSize } = response

            this.setState({data, isLoading: false, row: null, pages, pageSize})

        }catch(error){
            throw new Error(error)
        }

    }

     searchHandler(e) {
        if(e){
            e.preventDefault()
        }
        clearTimeout(App.lastCallTimer)
            this.setState(()=> ({isLoading: true,  currentPage: 1}),
                () => this.fetchData(this.getUrl).catch(err => console.error(err)))
    }

    onRowSelect = row => {
        this.setState({row})
    }

    clearRowData = () => {
        this.setState({row: null})
    }

    changePageHandler = ({ selected }) => {
        this.setState(() => ({currentPage: selected + 1, isLoading: true}),
            () => this.fetchData(this.getUrl).catch(err => console.error(err)))


    }
        render() {
            let formFields = []
            for(let name in this.formData) {
               let field = this.formData[name]

                formFields.push(
                    <Form.Group key = {name}>
                        <Form.Label> {field.label}</Form.Label>
                        <Form.Control
                            type={field.type}
                            required = {field.required}
                            onChange={ e => this.valueChangeHandler(name, e)}
                            value={this.state[name]}

                        />
                        { field.valid === null || field.valid ? '' :
                            <Form.Text className='text-muted'>
                                { field.errorText  }
                            </Form.Text>
                        }
                    </Form.Group>
                )
            }
            return (

                <div className="container">

                    { !this.state.row && <>
                        <div className="row">
                            <div className="col col-6">
                                <Form onSubmit={e => this.searchHandler(e)}>

                                    {formFields}
                                </Form>
                            </div>
                        </div>
                        <Button disabled={
                            !this.formValid()
                        } variant="primary mb-5" onClick={e => this.searchHandler(e)}>Поиск</Button>

                    </>

                    }
                    {

                        this.state.isLoading
                            ? <Loader/>
                            :
                            <Articles data={this.state.data}
                                   pagesCount={this.state.pages}
                                   onRowSelect = {this.onRowSelect}
                                   row = {this.state.row}
                                   clearRowData = {this.clearRowData}
                            />
                    }
                    {
                        this.state.pages > this.state.pageSize && !this.state.row && !this.state.isLoading
                            ? <ReactPaginate
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            pageCount={this.state.pages}
                            onPageChange={this.changePageHandler}
                            activeClassName={'active'}
                            containerClassName={'pagination'}
                            pageClassName='page-item'
                            pageLinkClassName='page-link'
                            previousClassName='page-item'
                            nextClassName='page-item'
                            previousLinkClassName='page-link'
                            nextLinkClassName='page-link'
                            forcePage={this.state.currentPage -1}

                            />
                            : null
                    }
                </div>

            )
        }

}

export default App;
