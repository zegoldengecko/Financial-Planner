const app = require("./app");
const { PORT } = require("./Common/Constants.js");

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));