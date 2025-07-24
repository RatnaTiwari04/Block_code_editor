const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/run', async (req, res) => {
  const { code, language } = req.body;
  const id = uuidv4();
  const tempDir = `./tmp/${id}`;
  fs.mkdirSync(tempDir, { recursive: true });  // safer way to always create

  try {
    let filename, compileCmd, runCmd;

    switch (language) {
      case 'python':
        filename = `${tempDir}/script.py`;
        fs.writeFileSync(filename, code);
        runCmd = `docker run --rm -v ${tempDir}:/code python:3 python /code/script.py`;
        break;
      case 'java':
        filename = `${tempDir}/Main.java`;
        fs.writeFileSync(filename, code);
        compileCmd = `docker run --rm -v ${tempDir}:/code openjdk javac /code/Main.java`;
        runCmd = `docker run --rm -v ${tempDir}:/code openjdk java -cp /code Main`;
        break;
      case 'c':
        filename = `${tempDir}/program.c`;
        fs.writeFileSync(filename, code);
        compileCmd = `docker run --rm -v ${tempDir}:/code gcc gcc /code/program.c -o /code/program`;
        runCmd = `docker run --rm -v ${tempDir}:/code gcc /code/program`;
        break;
      case 'cpp':
        filename = `${tempDir}/program.cpp`;
        fs.writeFileSync(filename, code);
        compileCmd = `docker run --rm -v ${tempDir}:/code gcc g++ /code/program.cpp -o /code/program`;
        runCmd = `docker run --rm -v ${tempDir}:/code gcc /code/program`;
        break;
      case 'javascript':
        filename = `${tempDir}/script.js`;
        fs.writeFileSync(filename, code);
        runCmd = `node ${filename}`;   // directly run with local Node.js
        break;
      default:
        return res.json({ output: 'Unsupported language.' });
    }

    if (compileCmd) await execPromise(compileCmd);
    const { stdout, stderr } = await execPromise(runCmd);
    fs.rmSync(tempDir, { recursive: true, force: true });
    res.json({ output: stdout || stderr || 'No output' });

  } catch (error) {
    console.error('Execution error:', error);   // add log for debugging
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

app.listen(5000, () => console.log('Backend server running on http://localhost:5000'));
