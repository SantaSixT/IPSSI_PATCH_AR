import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// URL de base de ton API sécurisée
// Si ton backend est sur le port 3000 et React aussi, React passera probablement sur 3001.
// Assure-toi que le backend tourne bien sur 3000.
const API_URL = 'http://localhost:3000';

function App() {
  const [users, setUsers] = useState([]);
  const [queryId, setQueryId] = useState('');
  const [queriedUser, setQueriedUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    loadComments();
  }, []);

  const fetchUsers = () => {
    axios.get(`${API_URL}/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error("Erreur chargement users:", err));
  };

  const loadComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Erreur chargement commentaires:', err);
    }
  };

  // REFONTE SÉCURISÉE : Plus de SQL envoyé au serveur !
  const handleQuery = async (e) => {
    e.preventDefault();
    setError('');
    setQueriedUser(null);

    try {
      // On demande poliment au serveur l'utilisateur n°X
      // Le serveur gère la requête SQL, pas le client.
      const response = await axios.get(`${API_URL}/users/${queryId}`);
      setQueriedUser(response.data);
    } catch (err) {
      setError("Utilisateur introuvable ou erreur serveur.");
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
        // Envoi simple d'un JSON
        await axios.post(`${API_URL}/comment`, { content: newComment });
        setNewComment('');
        loadComments(); // Recharger la liste
    } catch (err) {
        console.error("Erreur envoi commentaire", err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Admin Dashboard (Secured) 🔒</h1>
        
        {/* Section Liste Utilisateurs */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>All Users</h2>
          <ul>
            {users.map(u => <li key={u.id}>{u.name} (ID: {u.id})</li>)}
          </ul>
        </section>

        {/* Section Recherche Sécurisée */}
        <section style={{ border: '1px solid white', padding: '1rem', borderRadius: '8px' }}>
          <h2>Search User by ID</h2>
          <form onSubmit={handleQuery}>
            <input 
              type="number" 
              value={queryId} 
              onChange={(e) => setQueryId(e.target.value)} 
              placeholder="Enter User ID"
              style={{ padding: '0.5rem' }}
            />
            <button type="submit" style={{ marginLeft: '10px', padding: '0.5rem' }}>Search</button>
          </form>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {queriedUser && (
            <div style={{ marginTop: '1rem', background: '#333', padding: '10px' }}>
              <h3>Result:</h3>
              <p>ID: {queriedUser.id}</p>
              <p>Name: {queriedUser.name}</p>
              {/* Le mot de passe n'est jamais renvoyé par le backend sécurisé ! */}
            </div>
          )}
        </section>

        {/* Section Commentaires */}
        <section style={{ marginTop: '2rem', width: '100%', maxWidth: '600px' }}>
          <h3>Comments</h3>
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
              style={{ flex: 1, padding: '10px' }}
            />
            <button type="submit">Post</button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            {comments.map(c => (
               <div key={c.id} style={{ background: '#2c3e50', margin: '5px 0', padding: '10px', borderRadius: '4px' }}>
                 {c.content}
               </div>
            ))}
          </div>
        </section>

      </header>
    </div>
  );
}

export default App;