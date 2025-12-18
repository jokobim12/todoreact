import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { TodoList } from './pages/TodoList';
import { useEffect } from 'react';
import { startReminderService } from './services/reminderService';

function App() {
  useEffect(() => {
    startReminderService();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tasks" element={<TodoList />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
