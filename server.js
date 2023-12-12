const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// store users
//testing this commit - test branch
const registeredUsers = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { name, occupation, purpose } = req.body;

  // add users
  registeredUsers.push({ name, occupation, purpose });

  res.json({ message: 'User registered successfully' });
});

app.post('/users', (req, res) => {
    res.json(registeredUsers);
})

//endpoints for events
const events = {};

app.post('/addEvent', (req, res) => {
  const { day, title, date, location, category, color } = req.body;
  const event = { title, date, location, category, color };

  if (!events[day]) {
    events[day] = [];
  }

  events[day].push(event);

  res.json({ success: true, message: 'Event created' });
});

//endpoint for selected day
app.get('/getEvents/:day', (req, res) => {
  const { day } = req.params;
  const dayEvents = events[day] || [];

  res.json({ success: true, events: dayEvents });
});

//endpoint update event
app.put('/updateEvent/:day/:index', (req, res) => {
  const { day, index } = req.params;
  const { title, location } = req.body;

  if (events[day] && events[day][index]) {
    events[day][index] = { ...events[day][index], title, location };
    res.json({ success: true, message: 'Event updated' });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

//endpoint delete event
app.delete('/deleteEvent/:day/:index', (req, res) => {
  const { day, index } = req.params;

  if (events[day] && events[day][index]) {
    events[day].splice(index, 1);
    res.json({ success: true, message: 'Event deleted' });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

//endpoints for comments section
const comments = [];

//endpoint to specific comment
app.post('/addComment', (req, res) => {
  const { comment } = req.body;

  comments.push(comment);

  res.json({ success: true, message: 'Comment added successfully' });
});

// endpoint to all the comments
app.get('/getComments', (req, res) => {
  res.json({ success: true, comments });
});

// endpoint update comment
app.put('/updateComment/:index', (req, res) => {
  const { index } = req.params;
  const { updatedComment } = req.body;

  if (comments[index]) {
    comments[index] = updatedComment;
    res.json({ success: true, message: 'Comment updated successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Comment not found' });
  }
});

// endpoint delete comment
app.delete('/deleteComment/:index', (req, res) => {
  const { index } = req.params;

  if (comments[index]) {
    comments.splice(index, 1);
    res.json({ success: true, message: 'Comment deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Comment not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
