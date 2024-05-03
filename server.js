const express = require('express');
const app = express();
const cors = require('cors'); // Import the cors middleware




const routes = require('./routes/fileRoutes');
app.use(express.json());
app.use(cors());

app.use('/api', routes);

const IP_ADDRESS = '192.168.1.5';
const PORT = 3000;

app.listen(PORT,IP_ADDRESS, () => {
  console.log(`Server is running on port ${IP_ADDRESS}:${PORT}`);
});
