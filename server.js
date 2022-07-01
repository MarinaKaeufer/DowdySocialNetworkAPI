const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const db = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/populatedb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.set('debug', true);

// Create new user
app.post('/user', ({ body }, response) => {
  db.User.create(body)
  .then(user => response.json(user))
  .catch(error => { 
    console.log(error);
    response.json(error);
  });
});

// Get all users
app.get('/user', (request, response) => {
  db.User.find({})
  .then(user => {
    response.json(user);
  })
  .catch(error => {
    response.json(error);
  });
})

// Get single user
app.get('/user/:id', ({params}, response) => {
  db.User.findOne({ _id: params.id })
  .populate([
      { path: 'thoughts', select: "-__v" }, 
      { path: 'friends', select: "-__v" }
  ])
  .select('-__v')
  .then(user => {
      if (!user) {
          response.json({message: 'Sorry, no user found.'});
          return;
      }
      response.json(user);
  })
  .catch(error => {
      response.json(error);
  });
})

app.put('/user/:id', ({ params, body }, response) => {
  db.User.findOneAndUpdate({ _id: params.id }, body, { new: true })
    .then((note) => {
      if (!note) {
        response.json({ message: 'Sorry, no note was found.' });
      }
      response.json(note);
    })
    .catch((error) => {
      response.json(error);
    });
});

// Delete user by its id
app.delete('/user/:id', ({ params }, response) => {
  db.User.findOneAndDelete({ _id: params.id })
    .then((note) => {
      if (!note) {
        response.json({ message: 'Sorry, no note was found.' });
      }
      response.json(note);
    })
    .catch((error) => {
      response.json(error);
    });
});

// Add a friend
app.post('/user/:uID/friends/:fID', ({ params }, response) => {
  db.User.findOneAndUpdate(
    { _id: params.uID },
    { $addToSet: { friends: params.fID } }, 
    { new: true }
  )
  .then(user => {
      if (!user) {
        response.json({ message: 'Sorry, no user was found.' });
        return;
      }
      response.json(user);
  })
  .catch((error) => {
    response.json(error);
  });
});

// Delete a friend
app.delete('/user/:uID/friends/:fID', ({ params }, response) => {
  db.User.findOneAndUpdate(
    { _id: params.uID },
    { $pull: { friends: params.fID } }, 
    { new: true }
  )
  .then(user => {
      if (!user) {
        response.json({ message: 'Sorry, no user was found.' });
        return;
      }
      response.json(user);
  })
  .catch((error) => {
    response.json(error);
  });
});


// ========================= Thought End Point ================================
// Create new thought
app.post('/thought', ({ body }, response) => {
  db.Thought.create(body)
  .then(thought => { 
    db.User.findOneAndUpdate(
      { username: body.username },
      { $push: { thoughts: thought._id } },
      { new: true }
    )
    .then(user => {
        if (!user) {
            response.json({ message: 'Sorry, no user was found.'});
            return;
        }
        response.json(user);
    })
    .catch(error => { 
      response.json(error);
    });
  })
  .catch(error => { 
    response.json(error);
  });
});


// Get all thoughts
app.get('/thought', (request, response) => {
  db.Thought.find({})
  .then(thought => {
    response.json(thought);
  })
  .catch(error => {
    response.json(error);
  });
})

// Get single thought
app.get('/thought/:id', ({params}, response) => {
  db.Thought.findOne({ _id: params.id })
  .populate([
      { path: 'reactions', select: "-__v" }
  ])
  .select('-__v')
  .then(thought => {
      if (!thought) {
          response.json({message: 'Sorry, no thought was found.'});
          return;
      }
      response.json(thought);
  })
  .catch(error => {
      response.json(error);
  });
})

app.put('/thought/:id', ({ params, body }, response) => {
  db.Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
    .then((note) => {
      if (!note) {
        response.json({ message: 'Sorry, no note was found.' });
      }
      response.json(note);
    })
    .catch((error) => {
      response.json(error);
    });
});

// Delete thought by its id
app.delete('/thought/:id', ({ params }, response) => {
  db.Thought.findOneAndDelete({ _id: params.id })
    .then((note) => {
      if (!note) {
        response.json({ message: 'Sorry, no note was found.' });
      }
      response.json(note);
    })
    .catch((error) => {
      response.json(error);
    });
});

// Add a reaction to a thought
app.post('/thought/:thoughtId/reactions', ({ body, params }, response) => {
  db.Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $addToSet: { reactions: body } }, 
    { new: true } 
  )
  .then(thought => {
      if (!thought) {
        response.json({ message: 'Sorry, no thought was found.' });
        return;
      }
      response.json(thought);
  })
  .catch((error) => {
    response.json(error);
  });
});

// Delete a reaction to a thought
app.delete('/thought/:thoughtId/reactions', ({ body, params }, response) => {
  db.Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $pull: { reactions: { reactionId: body.reactionId } } },
    { new: true }
  )
  .then(thought => {
      if (!thought) {
        response.json({ message: 'Sorry, no thought was found.' });
        return;
      }
      response.json(thought);
  })
  .catch((error) => {
    response.json(error);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
