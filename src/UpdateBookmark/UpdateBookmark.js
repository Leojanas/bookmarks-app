import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'

class UpdateBookmark extends Component {
    static contextType = BookmarksContext;
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            url: '',
            description: '',
            rating: 1
        }
    }
    handleChangeTitle = event => {
        const newTitle = document.getElementById('title').value;
        this.setState({
            title: newTitle
        })
    }
    handleChangeUrl = event => {
        const newUrl = document.getElementById('url').value;
        this.setState({
            url: newUrl
        })
    }
    handleChangeDescription = event => {
        const newDescription = document.getElementById('description').value;
        this.setState({
            description: newDescription
        })
    }
    handleChangeRating = event => {
        const newRating = parseInt(document.getElementById('rating').value);
        this.setState({
            rating: newRating
        })
    }
    handleSubmitUpdate = e => {
        e.preventDefault()
        const id = parseInt(this.props.match.params.id)
        //Validation needed
        fetch(config.API_ENDPOINT + `/${id}`, {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${config.API_KEY}`
          },
          body: JSON.stringify(this.state)
        })
        .then(res => {
          if(!res.ok){
            return res.json().then(error => {
              throw error
            })
          }
          this.props.history.push('/')
          const newBookmark = {id: id, ...this.state}
          this.context.updateBookmark(newBookmark)
        })
        .catch(error => {
          console.error(error)
        })
    }
    handleClickCancel = e => {
        this.props.history.push('/')
    }
    componentDidMount(){
        const id = this.props.match.params.id
        fetch(config.API_ENDPOINT + `/${id}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(response => {
            const {title, url, description, rating} = response
            this.setState({
                title, url, description, rating: parseInt(rating)
            })
        })
    }

    render(){
        let {title, url, description, rating} = this.state
        return (
            <section className='editBookmarkForm'>
                <h2>Edit Bookmark</h2>
                <form>
                    <label htmlFor='title'>Title: </label>
                    <input id='title' name='title' value={title} onChange={this.handleChangeTitle}/>
                    <label htmlFor='url'>URL: </label>
                    <input id='url' name='url' value={url} onChange={this.handleChangeUrl}/>
                    <label htmlFor='description'>Description: </label>
                    <input id='description' name='description' value={description} onChange={this.handleChangeDescription}/>
                    <label htmlFor='rating'>Rating: </label>
                    <input type='number'
                        name='rating'
                        id='rating'
                        value={rating}
                        onChange={this.handleChangeRating}
                        min='1'
                        max='5'
                    />
                    <button type='submit' onClick={this.handleSubmitUpdate}>
                        Submit
                    </button>
                    <button onClick={this.handleClickCancel}>
                        Cancel
                    </button>
                </form>
            </section>
        )
    }
}

export default UpdateBookmark