import React from "react";
import "./App.css";
import styled from "styled-components";
import RecentUpdates from "./components/RecentUpdates/RecentUpdates";
import TopTracks from "./components/TopTracks/TopTracks";

const Container = styled.div`
  font-family: "Space Grotesk";
  display: flex;
  flex-direction: row;
  padding: 20px;
`;

const LeftPane = styled.div`
  width: 70%;
  padding-right: 20px;
`;

const RightPane = styled.div`
  width: 30%;
  padding-left: 20px;
  border-left: 3px solid rgba(255, 255, 255, 0.1);
`;

const App = () => {
  return (
    <Container>
      <LeftPane>
        <RecentUpdates />
      </LeftPane>
      <RightPane>
        <TopTracks />
      </RightPane>
    </Container>
  );
};

export default App;
