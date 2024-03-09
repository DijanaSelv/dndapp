import React, { useEffect } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";
import ErrorPage from "./pages/errorpage/Error";
import LoginPage from "./pages/loginpage/LoginPage";
import HomePage from "./pages/homepage/HomePage";
import SignupPage from "./pages/signuppage/SignupPage";
import CampaignInfoPage from "./pages/campaigninfopage/CampaignInfoPage";
import CampaignPlayPage from "./pages/campaignplaypage/CampaignPlayPage";
import NewCampaignPage from "./pages/newcampaignpage/NewCampaignPage";
import NewCharacterPage from "./pages/newcharacterpage/NewCharacterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch, Provider } from "react-redux";
import { auth } from "./app/actions/base";
import { userSliceActions } from "./app/userSlice";
import { getUserData } from "./app/actions/databaseActions";
import { onAuthStateChanged } from "firebase/auth";
import LoggedInRoute from "./components/LoggedInRoute";
import CampaignShopsPage from "./pages/campaignshopspage/CampaignShopsPage";
import ProtectedCampaignsRoute from "./components/ProtectedCampaignsRoute";
import ShopPage from "./pages/shoppage/ShopPage";
import EditShopPage from "./pages/editshoppage/EditShopPage";
import NewShopPage from "./pages/newshoppage/NewShopPage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

//refresh state persistence
/* import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/configureStore"; */

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Login",
        element: (
          <LoggedInRoute>
            <LoginPage />
          </LoggedInRoute>
        ),
      },
      { path: "/Signup", element: <SignupPage /> },
      {
        path: "/NewCampaign",
        element: (
          <ProtectedRoute>
            <NewCampaignPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/NewCharacter",
        element: (
          <ProtectedRoute>
            <NewCharacterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Campaigns/:type/:campaignId/info",
        element: (
          <ProtectedCampaignsRoute>
            <CampaignInfoPage />
          </ProtectedCampaignsRoute>
        ),
      },
      {
        path: "/Campaigns/:type/:campaignId/play",
        element: (
          <ProtectedCampaignsRoute>
            <CampaignPlayPage />
          </ProtectedCampaignsRoute>
        ),
      },
      {
        path: "/Campaigns/:type/:campaignId/play/shops",
        element: (
          <ProtectedCampaignsRoute>
            <CampaignShopsPage />
          </ProtectedCampaignsRoute>
        ),
      },
      {
        path: "/Campaigns/:type/:campaignId/play/shops/:shopId",
        element: <ShopPage />,
      },
      {
        path: "/Campaigns/:type/:campaignId/play/shops/:shopId/edit",
        element: (
          <RoleProtectedRoute permittedRoles={["dm"]}>
            <EditShopPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/Campaigns/:type/:campaignId/play/shops/NewShop",
        element: (
          <RoleProtectedRoute permittedRoles={["dm"]}>
            <NewShopPage />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(userSliceActions.setLoggedInUser(user.uid));
        dispatch(getUserData(user.uid));
      }
    });

    return () => unsubscribe();
  }, []);

  return <RouterProvider router={router}> </RouterProvider>;
}

export default App;

/*    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider> */

/* This was before state refresh persistence with npm redux persist <RouterProvider router={router}> </RouterProvider> */
