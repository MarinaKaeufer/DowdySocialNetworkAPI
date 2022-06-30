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
  .catch(error => response.json(error));
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
      { path: 'thoughts', select: "-__v" }, // TODO
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



// ********************************* DELETE LATER *********************************
// A user has been created already for our activity purposes
// db.User.create({ name: 'Ernest Hemingway' })
//   .then(dbUser => {
//     console.log(dbUser);
//   })
//   .catch(({ message }) => {
//     console.log(message);
//   });

// Retrieve all notes
// app.get('/notes', (request, response) => {
//   db.Note.find({})
//     .then(note => {
//       response.json(note);
//     })
//     .catch(err => {
//       response.json(err);
//     });
// });

// Retrieve all users
// app.get('/user', (request, response) => {
//   db.User.find({})
//     .then(dbUser => {
//       response.json(dbUser);
//     })
//     .catch(err => {
//       response.json(err);
//     });
// });

// Create a new note and associate it with user
// app.post('/submit', ({ body }, response) => {
//   db.Note.create(body)
//     .then(({ _id }) =>
//       db.User.findOneAndUpdate({}, { $push: { notes: _id } }, { new: true })
//     )
//     .then(dbUser => {
//       response.json(dbUser);
//     })
//     .catch(err => {
//       response.json(err);
//     });
// });

// app.get('/populate', (request, response) => {
//   db.User.find({})
//     .populate({
//       path: 'notes',
//       select: '-__v'
//     })
//     .select('-__v')
//     .then(dbUser => {
//       response.json(dbUser);
//     })
//     .catch(err => {
//       response.json(err);
//     });
// });
// ************************************************************

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
