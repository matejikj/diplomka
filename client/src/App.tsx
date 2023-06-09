import React, { useEffect } from "react";
import './styles/style.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import { handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";
import { BrowserRouter } from 'react-router-dom';
import { checkContainer } from "./service/containerService";
import Classes from "./pages/Classes";
import Messages from "./pages/Messages";
import ProfileView from "./pages/ProfileView";
import Class from "./pages/Class";
import { UserSession, defaultSessionValue } from "./models/types/UserSession";
import { SessionContext } from "./sessionContext";
import Chat from "./pages/Chat";
import ExamPage from "./pages/ExamPage";
import Browser from "./pages/Browser";

const App: React.FC = () => {

  const [sessionInfo, setSessionInfo]
    = React.useState<UserSession>(defaultSessionValue);
  const [waiting, setWaiting] = React.useState(false);

  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true
    }).then((info) => {
      if (info?.isLoggedIn && info?.webId !== undefined) {
        try {
          setWaiting(true)
          checkContainer(info?.webId).then((value) => {
            setSessionInfo({
              isLogged: true,
              webId: info?.webId!,
              podUrl: value.podUrl,
              podAccessControlPolicy: value.accessControlPolicy
            })
            setWaiting(false)
          })
        } catch (error) {
          console.log("There is problem when logging: ", error)
        }
      }
    })
  }, []);

  return (
    <SessionContext.Provider value={{
      sessionInfo,
      setSessionInfo
    }}>
      <BrowserRouter>
        {(() => {
          if (sessionInfo.isLogged) {
            return (
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/class" element={<Class />} />
                <Route path="/browser" element={<Browser />} />
                <Route path="/profile" element={<ProfileView />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/exam" element={<ExamPage />} />
              </Routes>
            )
          } else if (!sessionInfo.isLogged && waiting) {
            return (
              <div className="loader-wrapper">
                <div className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )
          } else if (window.location.href.includes('/browser')) {
            return (
              <Browser></Browser>
            )
          } else {
            return (
              <Login></Login>
            )
          }
        })()}
      </BrowserRouter>
    </SessionContext.Provider>

  );
};

export default App;
