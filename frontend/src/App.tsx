import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Upload from "./components/Upload";
import "./app.scss";

function App() {
    const router = createBrowserRouter([
        {
            path: "",
            element: <Upload />,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
