require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();
app.use(cors());
app.use(express.json());

const DOCKER_IMAGES = {
  python: 'python:3',
  java: 'openjdk',
  c: 'gcc',
  cpp: 'gcc'
};
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.post('/api/run', async (req, res) => {
  const { code, language } = req.body;
  const id = uuidv4();
  const tempDir = `./tmp/${id}`;
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    let filename, compileCmd, runCmd;

    switch (language) {
      case 'python':
        filename = `${tempDir}/script.py`;
        fs.writeFileSync(filename, code);
        runCmd = `docker run --rm -v ${tempDir}:/code ${DOCKER_IMAGES.python} python /code/script.py`;
        break;

      case 'java':
        filename = `${tempDir}/Main.java`;
        fs.writeFileSync(filename, code);
        compileCmd = `docker run --rm -v ${tempDir}:/code ${DOCKER_IMAGES.java} javac /code/Main.java`;
        runCmd = `docker run --rm -v ${tempDir}:/code ${DOCKER_IMAGES.java} java -cp /code Main`;
        break;

      case 'c':
        filename = `${tempDir}/program.c`;
        fs.writeFileSync(filename, code);
        compileCmd = `docker run --rm -v ${tempDir}:/code ${DOCKER_IMAGES.c} gcc /code/program.c -o /code/program`;
        runCmd = `docker run --rm -v ${tempDir}:/code ${DOCKER_IMAGES.c} /code/program`;
        break;

      case 'cpp':
        filename = `${tempDir}/program.cpp`;
        fs.writeFileSync(filename, code);
        compileCmd = `docker run --rm -v ${tempDir}:/code ${DOCKER_IMAGES.cpp} g++ /code/program.cpp -o /code/program`;
        runCmd = `docker run --rm -v ${tempDir}:/code ${DOCKER_IMAGES.cpp} /code/program`;
        break;

      case 'javascript':
        filename = `${tempDir}/script.js`;
        fs.writeFileSync(filename, code);
        runCmd = `node ${filename}`;
        break;

      default:
        return res.json({ output: 'Unsupported language.' });
    }

    if (compileCmd) {
      console.log('🔧 Compiling:', compileCmd);
      await execPromise(compileCmd);
    }

    console.log('Running:', runCmd);
    const { stdout, stderr } = await execPromise(runCmd);

    fs.rmSync(tempDir, { recursive: true, force: true });

    res.json({ output: stdout || stderr || 'No output' });

  } catch (error) {
    console.error('Execution error:', error);
    fs.rmSync(tempDir, { recursive: true, force: true });
    res.json({ output: error.stderr || error.message });
  }
});
const execPromise = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) reject({ error, stderr });
      else resolve({ stdout, stderr });
    });
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
