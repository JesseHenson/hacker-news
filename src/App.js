import React from 'react';
import './App.css';
import NavigationComp from './Components/Nav';
import {Table, Container, Modal, Button, Image, Row, Col} from 'react-bootstrap'

import Unsplash from 'unsplash-js';



class App extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      show: false,
      currentPost: {},
      currentAbout: {},
      currentPostImage: {},
      currentSubmittedItems: []
    };
    this.getRandomAbout = this.getRandomAbout.bind(this)
    this.getRandomNumber = this.getRandomNumber.bind(this)
    this.fetchUserData = this.fetchUserData.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  
  componentWillMount() {
      this.fetchLatestNews();
      this.getRandomImage()
      this.getRandomAbout()
  }


  getRandomNumber() {
    const randomSmNum = Math.floor(Math.random()*11)
    return randomSmNum
  }

  getRandomAbout() {
    fetch(`https://jsonplaceholder.typicode.com/users/${this.getRandomNumber()}`)
      .then(res=>res.json())
      .then(data=>{
        this.setState({currentAbout: data.company.catchPhrase})
      })
  }
  
  fetchLatestNews() {
    fetch('https://hacker-news.firebaseio.com/v0/newstories.json')
      .then(response => response.json())
      .then((data) => {
        data.slice(0,50).map((newsId) => {
          fetch(` https://hacker-news.firebaseio.com/v0/item/${newsId}.json`)
          .then(response => response.json())
          .then((itemDetail) => {
            this.setState((currentState) => {
              currentState.posts.push(itemDetail);
              return { posts: currentState.posts };
            })
          })
        });
    })
  }

  fetchUserData(postIndex, userId) {
    fetch(` https://hacker-news.firebaseio.com/v0/user/${userId}.json`)
      .then(res=> res.json())
      // .then(data=>console.log(data))
      .then(data=> {
        this.setState(() => ({currentPost: data}))
        if (data.submitted.length) {
          return data.submitted.slice(0,10).map(item=>{
            fetch(`https://hacker-news.firebaseio.com/v0/item/${item}.json`)
              .then(res=>res.json())
              .then(data=>{
                this.setState((currentState) => {
                  currentState.currentSubmittedItems.push(data);
                  return { currentSubmittedItems: currentState.currentSubmittedItems };
                })
              })
          }
            
            )
        }
      })
      this.setState({posts: this.state.posts, show: true})
    }
    
    
    handleClose() {
      this.setState({posts: this.state.posts, show: false})
      this.getRandomImage()
      this.getRandomAbout();
  }

  render() {

    return (
      <div className="App">
        <NavigationComp fetchImage={this.fetchImages}/>
          <Container fluid className="my-2">
            <Table variant='dark' responsive striped bordered hover>
              <thead >
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Title</th>
                </tr>
              </thead>
              {this.state.posts.map((post,index)=>(
                <tbody>
                  <tr>
                    <td>{post.id}</td>
                    <td className="cursor" onClick={()=>this.fetchUserData(index + 1, post.by)}>{post.by}</td>
                    <td><a target="blank" href={post.url}>{post.title}</a></td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </Container>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                  {this.state.currentPost.id}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  {this.state.currentAbout}
                </Col>
                <Col>
                  <Image src="https://source.unsplash.com/random" fluid rounded />

                </Col>
              </Row>
            <Container fluid className="my-2">
            <Table variant='dark' responsive striped bordered hover>
              <thead >
                <tr>
                  <th>Title</th>
                </tr>
              </thead>
              {this.state.currentSubmittedItems.map((post,index)=>(
                <tbody>
                  <tr>
                    <td><a target="blank" href={post.url}>{post.title||null}</a></td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default App;
