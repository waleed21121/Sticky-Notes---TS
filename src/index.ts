import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Note from './models/note';

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// routing

// get notes from database
app.get('/', async (req: Request, res: Response) => {
  const notes = await Note.find({});
    res.locals.notes = notes;
    res.render('index');
});

app.get('/notes/add', (req: Request, res: Response) => {
  res.render('addNote');
});

// Add new note to Database
app.post('/notes/add', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = new Note({
    contents: req.body.contents,
    });
    await note.save();
    res.redirect(`/`);
} catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send("Error: Invalid Data");
    }
}
});

mongoose.connect("mongodb://127.0.0.1:27017/notesDB")
.then(() => {
    console.log("Connected to database");
    const port = 3000;
    app.listen(port, () => {
        console.log(`Listening on http://localhost: ${port}`);
    })
})
.catch((err) => {
    console.error(err);
});