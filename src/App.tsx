import { HashRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import CreateCrawl from './pages/CreateCrawl'
import JoinCrawl from './pages/JoinCrawl'
import LiveCrawl from './pages/LiveCrawl'
import ActiveCrawl from './pages/ActiveCrawl'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/create" element={<CreateCrawl />} />

        <Route path="/join" element={<JoinCrawl />} />

        <Route path="/crawl/:id" element={<LiveCrawl />} />
        <Route path="/crawl/:id/active" element={<ActiveCrawl />} />
      </Routes>
    </HashRouter>
  )
}

export default App