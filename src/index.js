import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Features/Store";
import { SnackbarProvider } from 'notistack';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
        <Provider store={store} >
           <SnackbarProvider maxSnack={4}>
                <App/> {/*now useState is awailable for our whole app by adding our <App/> into this <Provide> element */}
            </SnackbarProvider>
        </Provider>
        </BrowserRouter>
    </React.StrictMode>
);