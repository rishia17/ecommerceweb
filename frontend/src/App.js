import logo from './logo.svg';
import './App.css';
import Home from './components/home/Home';
import Layout from './Layout';
import About from './components/about/About';
import Products from './components/products/Products';
import Contact from './components/contact/Contact';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import SignUp from './components/signup/Signup';
import Signin from './components/signin/Signin';
import Addproduct from './components/addproduct/AddProduct';
import Product from './components/product/Product';
import Carts from './components/carts/Carts';
import Adminlogin from './components/adminLogin/Adminlogin';
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const browserRouter=createBrowserRouter([
    {
      path:'/',
      element:<Layout/>,
      children:[
        {
          path:'/',
          element:<Home/>,
        },
        {
          path:'/about',
          element:<About/>,

        },
        {
          path:'/products',
          element:<Products/>,
        },
        {
          path:'/contact',
          element:<Contact/>
        },
        {
          path:'/signup',
          element:<SignUp/>
        },
        {
          path:'/signin',
          element:<Signin/>
        },
        {
          path:'/addproduct',
          element:<Addproduct/>
        },
        {
          path:'/product',
          element:<Product/>
        },
        {
          path:'/cart',
          element:<Carts/>
        },
        {
          path:'/admin',
          element:<Adminlogin/>
        }
      ]

    
    }

  ])
  return (
    <div className="App">
      
    <RouterProvider router={browserRouter}/>
    </div>
  );
}

export default App;
