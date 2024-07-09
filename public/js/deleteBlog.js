function deleteBlogs(id, authorID){
    axios.delete(`/api/blogs/${id}`).then( data => {
        if(data.status == 200){
            location.replace(`/myBlogs/${authorID}`)
        }else if(data.status == 404){
            location.replace(`/notFound`)
        }
    })
}