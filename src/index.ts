import app from "./app.ts";

app.listen(process.env.port || 8080, () => {
    console.log(`Server is running on port ${process.env.port || 8080}`);
});