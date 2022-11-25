import Head from 'next/head'
import Container from '@mui/material/Container'
import { Box, Button, Checkbox, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useState } from 'react';
import client from '../libs/apollo-client';
import { gql } from '@apollo/client';

export default function Home() {
  const [data, setData] = useState([])
  const [id, setId] = useState(0)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [count, setCount] = useState(0)

  useEffect(() => {

    client.query({
      query: gql`
        query {
          allTodo{
            id
            title
            description
            checked
          }
        }
      `
    }).then(result => {
      setData(result.data.allTodo)
      setCount(0)
    })

    return () => { }
  }, [])




  function handleAddToDo(e) {
    e.preventDefault()

    if(desc==="" || title===""){
      return
    }



    if(id==0){

      let temp = [...data]
      let tempCount = ++count

      setData([...data, { id: count, title: title, description: desc }])
      setCount(tempCount)
      client.mutate({
        mutation: gql`
          mutation addTodoMutation($title:String!, $description: String! ){
            addTodo(title:$title, description:$description){
              code
              msg
            }
          }
        `,
        variables:{
          title:title,
          description:desc
        }
      }).then(result=>{
        console.log(result)
      })

    }else{
 
  
      client.mutate({
        mutation: gql`
        mutation updateTodoMutation($title:String!, $description: String! ){
          updateTodo(
            id: ${id},
            title:$title,
            description:$description
          ) {
            code
            msg
          } 
        }`,
        variables:{
          title:title,
          description:desc
        }
      }).then(result=>{


        const newState = data.map(obj => {
          if (obj.id === id) {
            return {...obj, title:title,description:desc};
          }
          return obj;
        });

        setData(newState);


        setId(0)
        setTitle("")
        setDesc("")
        
      })

    }

   
  }

  function deleteItem(id) {

    client.mutate({
      mutation: gql`
      mutation {
        deleteTodo(
            id: ${id}
        ) {
          code
          msg
        } 
      } 
      `
    }).then(result=>{
      console.log(result)
    })
 
    var filtered = data.filter(function (value, index, arr) {
      return value.id != id;
    });
    setData(filtered)
  }


  function editItem(id) {
    const filtered = data.filter((newData) => newData.id === id);
    filtered.map((item) => {
      setId(item.id)
      setTitle(item.title)
      setDesc(item.description)
    });


  }


  return (
    <div>
      <Head>
        <title>To Do List App</title>
        <meta name="description" content="Simple to do list" />
      </Head>

      <main>
        <Typography variant='h1'>Simple To Do List</Typography>

        <Container>
          <Grid container spacing={2}>
            <Grid item>
              <Box>
                <TextField
                  id="todolist-id" value={title} required
                  label="To Do"
                  onChange={(e) => { setTitle(e.target.value) }}
                />
                <TextField
                  id="todolist-id" value={desc} required
                  label="Description"
                  onChange={(e) => { setDesc(e.target.value) }}
                  sx={{ mx: 2 }}
                />
                <Button sx={{ m: 2 }} onClick={handleAddToDo}>
                   {id==0?"+ Add":"Update"}
                </Button>
              </Box>

              <List dense>
                {data.map((val, idx) => {
                  return (<ListItem
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(val.id)}>
                        <DeleteIcon />
                      </IconButton>
                      
                    }
                  >
                    <Checkbox />
                    <ListItemText
                      primary={val.title}
                      secondary={val.description}
                    />

                      <IconButton edge="end" aria-label="delete" onClick={() => editItem(val.id)}>
                        <EditIcon />
                      </IconButton>

                  </ListItem>)
                })
                }
              </List>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}
