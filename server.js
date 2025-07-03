const app = require('./app');
console.log(process.env)


const port = 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});