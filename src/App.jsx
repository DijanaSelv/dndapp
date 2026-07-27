import React, { useEffect } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";
import ErrorPage from "./pages/errorpage/Error";
import LoginPage from "./pages/loginpage/LoginPage";
import HomePage from "./pages/homepage/HomePage";
import CampaignInfoPage from "./pages/campaigninfopage/CampaignInfoPage";
import CampaignPlayPage from "./pages/campaignplaypage/CampaignPlayPage";
import NewCampaignPage from "./pages/newcampaignpage/NewCampaignPage";
import NewCharacterPage from "./pages/newcharacterpage/NewCharacterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { auth } from "./app/actions/base";
import { userSliceActions } from "./app/userSlice";
import { getUserData } from "./app/actions/databaseActions";
import { onAuthStateChanged } from "firebase/auth";
import LoggedInRoute from "./components/LoggedInRoute";
import CampaignShopsPage from "./pages/campaignshopspage/CampaignShopsPage";

import ShopPage from "./pages/shoppage/ShopPage";
import EditShopPage from "./pages/editshoppage/EditShopPage";
import NewShopPage from "./pages/newshoppage/NewShopPage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import NotesPage from "./pages/notespage/NotesPage";
import { uiSliceActions } from "./app/uiSlice";
import CharacterPage from "./pages/characterpage/CharacterPage";
import CombatPage from "./pages/combatpage/CombatPage";
import CampaignsPage from "./pages/campaignspage/CampaignsPage";
import CharactersPage from "./pages/characterspage/CharactersPage";

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
        path: "/campaigns",
        element: (
          <ProtectedRoute>
            <CampaignsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/characters",
        element: (
          <ProtectedRoute>
            <CharactersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <LoggedInRoute>
            <LoginPage />
          </LoggedInRoute>
        ),
      },

      {
        path: "/new-campaign",
        element: (
          <ProtectedRoute>
            <NewCampaignPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/new-character",
        element: (
          <ProtectedRoute>
            <NewCharacterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/campaigns/:campaignId/info",
        element: (
          <ProtectedRoute>
            <CampaignInfoPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/campaigns/:campaignId/play",
        element: <CampaignPlayPage />,
      },
      {
        path: "/campaigns/:campaignId/play/character/:characterId",
        element: <CharacterPage />,
      },
      {
        path: "/campaigns/:campaignId/play/shops",
        element: <CampaignShopsPage />,
      },
      {
        path: "/campaigns/:campaignId/play/:uid/combat",
        element: <CombatPage />,
      },
      {
        path: "/campaigns/:campaignId/play/shops/:shopId",
        element: <ShopPage />,
      },
      {
        path: "/campaigns/:campaignId/play/notes",
        element: <NotesPage />,
      },
      {
        path: "/campaigns/:campaignId/play/shops/:shopId/edit",
        element: (
          <RoleProtectedRoute permittedRoles={["dm"]}>
            <EditShopPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/campaigns/:campaignId/play/shops/NewShop",
        element: (
          <RoleProtectedRoute permittedRoles={["dm"]}>
            <NewShopPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "characters/:characterId",
        element: (
          <ProtectedRoute>
            <CharacterPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();

  //when app mounts, we set a listener on authStateChanged, if there's a user it sets it in store. OnAuthStateChanged returns an unsubscribe function that we call when the component unmounts (because we return it with use effect.)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(userSliceActions.setLoggedInUser(user.uid));

        //it gets the user data and sets it in userSlice
        await dispatch(getUserData(user.uid));
      }

      //userChecked flag prevents LoginPage flicker on repfresh when a user is Logged in.
      dispatch(uiSliceActions.setUserChecked());
    });

    return () => unsubscribe();
  });

  return <RouterProvider router={router}> </RouterProvider>;
}

export default App;

/*    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider> */

/* This was before state refresh persistence with npm redux persist <RouterProvider router={router}> </RouterProvider> */
