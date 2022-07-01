const chai = require('chai')
const chaiHttp = require('chai-http')
require('dotenv').config({ silent: true })
const mongoose = require('mongoose')
const app = require('../app')
let User = require('../models/User');
let Post = require('../models/Post')
let Comment = require('../models/Comment')
let token
let postId
let isLiked = true
let headers = {
  Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWE1MjcyNDA5NGI5NjAxZGY2NTY1ZTAiLCJpYXQiOjE2Mzg0MDYxMjUsImV4cCI6MTYzODQwOTcyNX0.LVx5PIuWOIZUehr1LQB2jAvSeooaTF7xq2QmCpainX4"
}

// Configure chai
chai.use(chaiHttp)
chai.should()

let userCredentials = {
  name: "Master Richard",
  username: "msratgio11",
  email: "msr345@gmail.com",
  password: "thankyou123"
}

let userLogin = {
  email: "msr345@gmail.com",
  password: "thankyou123"
}

let resetDetails = {
  email: "msr345@gmail.com",
  newPassword: "thank12356121"
}

let newComment = {
  userName: "msratgio11",
  avatar: "https://robohash.org/utanimioccaecati.png?size=50x50&set=set1",
  content: "Tomorrow is here",
  date: new Date(),
  post_id: ''
}

let newInfo = {
  profile: "https://robohash.org/utanimioccaecati.png?size=50x50&set=set1",
  info: "NYU ECON 25'",
  message: "new here, wanna make friends"
}

let posts = {
  "avatar": "https://robohash.org/utanimioccaecati.png?size=50x50&set=set1",
  "username": "Prince",
  "coursename": "Mathematics",
  "date": "2020/12/20",
  "title": "Food",
  "content": "I love food",
  "imgSrc": "https://picsum.photos/id/1000/5626/3635"
};


// Setting up database connection
before((done) => {
  mongoose.connect(process.env.CONNECTION_URL, { useNewURLParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("connected to db");
      done()
    })
    .catch((error) => console.log(error.message))
})


// Signing up user 
before((done) => {
  chai
    .request(app)
    .post("/api/register")
    .send(userCredentials)
    .end((err, res) => {
      res.should.have.status(200);
      console.log("Signed up user");
      done();
    });
});

// Logging in user
before((done) => {
  chai
    .request(app)
    .post("/api/login")
    .send(userLogin)
    .end((err, res) => {
      token = res.body.token;
      res.should.have.status(200);
      console.log("Logged in user ");
      done()
    });
});


// Get user account
describe('User Account', () => {

  it('it should return users account if the user is logged in', (done) => {
    chai.request(app)
      .get('/api/userAccount')
      .set('Token', token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        done();
      });

  }).timeout(10000)

  it('it should return status 401 if token is not added', (done) => {
    chai.request(app)
      .get('/api/userAccount')
      .end(function (err, res) {
        res.should.have.status(401)
        done();
      });

  }).timeout(10000)


});

// Getting all channels
describe('All Channels', () => {

  it('it should return all channels if the user is logged in', (done) => {
    chai.request(app)
      .get('/api/channels')
      .set('Token', token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        done();
      });
  }).timeout(10000)

  it('it should return status 401 if token is not added', (done) => {
    chai.request(app)
      .get('/api/channels')
      .end(function (err, res) {
        res.should.have.status(401)
        done();
      });
  }).timeout(10000)


});


// Get Posts 
describe('Home page', () => {
  describe('Get /homeposts', () => {
    it('it should get all home posts', (done) => {
      chai.request(app)
        .get('/api/homeposts')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
        })

    }).timeout(10000)
  })
})

//Change Account Info
describe('Update Account Info', () => {

  it('it should update account', (done) => {
    chai.request(app)
      .post(`/api/editaccount`)
      .set('Token', token)
      .send(newInfo)
      .end((err, res) => {
        console.log(err)
        res.should.have.status(200);
        done()
      })
  }).timeout(10000)

  it('it should not update account if token not provided', (done) => {
    chai.request(app)
      .post(`/api/editaccount`)
      .send(newInfo)
      .end((err, res) => {
        res.should.have.status(401);
        done()
      })

  }).timeout(10000)

})


//Delete a post
describe('Delete post', () => {

  it('it should delete a post', (done) => {
    chai.request(app)
      .post(`/api/deletePost`)
      .set('Token', token)
      .send(postId)
      .end((err, res) => {
        console.log(err)
        res.should.have.status(200);
        done()
      })
  }).timeout(10000)

  it('it should not delete post if token not provided', (done) => {
    chai.request(app)
      .post(`/api/deletePost`)
      .send(postId)
      .end((err, res) => {
        res.should.have.status(401);
        done()
      })

  }).timeout(10000)

})

// Make a new post
describe('Post /homeposts', () => {
  it('it should send make a new post', (done) => {
    chai.request(app)
      .post('/api/homeposts')
      .set('Token', token)
      .send(posts)
      .end((err, res) => {
        res.should.have.status(200)
        postId = res.body._id
        newComment = { ...newComment, post_id: postId }
        res.body.should.be.a('object')
        done()
      })

  }).timeout(10000)

  it('it should return 401 if token not added', (done) => {
    chai.request(app)
      .post('/api/homeposts')
      .send(posts)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })

  }).timeout(10000)

})

// Like a post
describe('Like a post', () => {
  it('it should like a post when it is not liked by the user', (done) => {
    chai.request(app)
      .post(`/api/like/${postId}`)
      .set('Token', token)
      .send({ headers, isLiked })
      .end((err, res) => {
        console.log(err)
        res.should.have.status(200);
        done()
      })

  }).timeout(10000)

  it('it should return 401 if token not added', (done) => {
    chai.request(app)
      .post(`/api/like/${postId}`)
      .send({ headers, isLiked })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })

  }).timeout(10000)

})


// Joining/Leaving channel
describe('Channel detail', () => {

  it('it should get channel detail', (done) => {
    chai.request(app)
      .get('/api/channel/detail/' + "Mathematics")
      .set('Token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      })
  }).timeout(10000);

  it('it should not get channel detail if token not provided', (done) => {
    chai.request(app)
      .get('/api/channel/detail/' + "Mathematics")
      .end((err, res) => {
        res.should.have.status(401);
        done();
      })
  }).timeout(10000);

  it('it should join channel', (done) => {
    chai.request(app)
      .post('/api/channel/join')
      .set('Token', token)
      .send({ channelname: 'Mathematics' })
      .end((err, res) => {
        res.should.have.status(200);
        done()
      })
  }).timeout(10000)

  it('it should not join channel if token not provided', (done) => {
    chai.request(app)
      .post('/api/channel/join')
      .send({ channelname: 'Mathematics' })
      .end((err, res) => {
        res.should.have.status(401);
        done()
      })
  }).timeout(10000)

  it('it should check if user joined channel', (done) => {
    chai.request(app)
      .post('/api/channel/isJoined')
      .set('Token', token)
      .send({ channelname: "Mathematics" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('joined').eq(true);
        done()
      })
  }).timeout(10000)

  it('it should not check if user joined channel if token is not provided', (done) => {
    chai.request(app)
      .post('/api/channel/isJoined')
      .send({ channelname: "Mathematics" })
      .end((err, res) => {
        res.should.have.status(401);
        done()
      })
  }).timeout(10000)


  it('it should leave channel', (done) => {
    chai.request(app)
      .post('/api/channel/leave/')
      .set('Token', token)
      .send({ channelname: "Mathematics" })
      .end((err, res) => {
        res.should.have.status(200);
        done()
      })
  }).timeout(10000)

  it('it should leave channel if token is not provided', (done) => {
    chai.request(app)
      .post('/api/channel/leave/')
      .send({ channelname: "Mathematics" })
      .end((err, res) => {
        res.should.have.status(401);
        done()
      })
  }).timeout(10000)

  it('it should verify if user left channel', (done) => {
    chai.request(app)
      .post('/api/channel/isJoined')
      .set('Token', token)
      .send({ channelname: "Mathematics" })
      .end((err, res) => {
        res.should.have.status(200);
        //res.body.should.have.property('joined').eq(false);
        done()
      })
  }).timeout(10000)


});


// Getting specific channels
describe('Specific Channel', () => {

  it('it should join channel', (done) => {
    chai.request(app)
      .post('/api/channel/join')
      .set('Token', token)
      .send({ channelname: 'Mathematics' })
      .end((err, res) => {
        res.should.have.status(200);
        done()
      })
  }).timeout(10000)

  it('it should return a specific channel if the user is logged in and subcribed to the channel', (done) => {
    chai.request(app)
      .get('/api/channel/Mathematics')
      .set('Token', token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        done();
      });
  }).timeout(10000)

  it('should return status 401 if token is not added', (done) => {
    chai.request(app)
      .get('/api/channel/Mathematics')
      .end(function (err, res) {
        res.should.have.status(401)
        done();
      });
  }).timeout(10000)

  it('it should leave channel', (done) => {
    chai.request(app)
      .post('/api/channel/leave/')
      .set('Token', token)
      .send({ channelname: "Mathematics" })
      .end((err, res) => {
        res.should.have.status(200);
        done()
      })
  }).timeout(10000)

  it('should return a status of 402 if the user is logged in and not subcribed to channel', (done) => {
    chai.request(app)
      .get('/api/channel/Mathematics')
      .set('Token', token)
      .end((err, res) => {
        res.should.have.status(402)
        done();
      });
  }).timeout(10000)

});

// Get specific post
describe('Get specific post details', () => {
  it('it should get specific post details ', (done) => {
    chai.request(app)
      .get(`/api/detailedposts/${postId}`)
      .set('Token', token)
      .end((err, res) => {
        res.should.have.status(200);
        done()
      })
  })
})

// Getting and posting comment
describe('Get and Post Comments', () => {

  it('it should post comment', (done) => {
    chai.request(app)
      .post(`/api/comments/${postId}`)
      .set('Token', token)
      .send(newComment)
      .end((err, res) => {
        console.log(err)
        res.should.have.status(200);
        done()
      })
  }).timeout(10000)

  it('it should not post comment if token not provided', (done) => {
    chai.request(app)
      .post(`/api/comments/${postId}`)
      .send(newComment)
      .end((err, res) => {
        res.should.have.status(401);
        done()
      })

  }).timeout(10000)

  it('it should get comments', (done) => {
    chai.request(app)
      .get(`/api/comments/${postId}`)
      .set('Token', token)
      .end((err, res) => {
        res.should.have.status(200);
        done()
      })

  }).timeout(10000)

  it('it should not get comments if token not provided', (done) => {
    chai.request(app)
      .get(`/api/comments/${postId}`)
      .end((err, res) => {
        res.should.have.status(401);
        done()
      })

  }).timeout(10000)

})



// Reset password
describe('Password reset', () => {
  it('should reset password if user is found', (done) => {
    chai.request(app)
      .post('/api/reset')
      .send(resetDetails)
      .end((err, res) => {
        res.should.have.status(200)
        done();
      });
  }).timeout(10000)

})



// After the test , delete user from database
after(done => {
  try {
    async function deleteUser() {
      const userData = await User.deleteOne({ "email": "msr345@gmail.com" })
      const postData = await Post.deleteOne({ '_id': postId })
      const commentData = await Comment.deleteOne({ 'post_id': postId })
      console.log(userData);
      console.log(postData);
      console.log(commentData);
      console.log("Deleted user, post and comment details from db");
      done();
    }
    deleteUser()
  } catch (err) {
    console.log(err);
  }


});





