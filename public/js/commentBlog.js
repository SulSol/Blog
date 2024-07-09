function sendComment(e){
    e.preventDefault()
    const comment_text = document.querySelector('#comment-text').value
    const author = document.querySelector('#comment_author').value 
    const blog = document.querySelector('#comment_blog').value 

    if(comment_text.length > 0){
        axios.post('/api/comment', {text: comment_text, authorId: author, blogId: blog}).then(data => {
            if(data.data){
                location.reload()
            }
        })
    }
}