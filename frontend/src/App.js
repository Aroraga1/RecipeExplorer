import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FindPage from "./pages/FindPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import BrowsePage from "./pages/BrowsePage";
import CreateRecipePage from "./pages/CreateRecipePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<BrowsePage />} />
            <Route path="/find" element={<FindPage />} />
            <Route path="/recipe/new" element={<CreateRecipePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
