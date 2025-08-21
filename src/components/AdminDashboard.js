import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Button, 
  Tab, 
  Tabs,
  Alert,
  Spinner
} from 'react-bootstrap';
import { useWeb3 } from '../contexts/Web3Context';
import { useLikes } from '../contexts/LikesContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [likes, setLikes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { connected, account } = useWeb3();
  const { loadAllLikesFromBackend } = useLikes();

  useEffect(() => {
    if (connected) {
      fetchDashboardData();
    }
  }, [connected]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch various data from backend
      await Promise.all([
        fetchUsers(),
        fetchProperties(),
        fetchLikes(),
        fetchOrders(),
        fetchStats()
      ]);
    } catch (error) {
      setError('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/user/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Set demo data for testing
      setUsers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          createdAt: new Date(),
          walletAddress: '0x1234567890abcdef'
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin',
          createdAt: new Date(),
          walletAddress: '0xabcdef1234567890'
        }
      ]);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Set demo data for testing
      setProperties([
        {
          _id: 'cottage-forest-1',
          name: 'Cottage Forest 1',
          price: '29.71',
          currency: 'ETH',
          location: 'Norway',
          status: 'active',
          createdAt: new Date()
        },
        {
          _id: 'freshness-property',
          name: 'Freshness Property',
          price: '14.81',
          currency: 'ETH',
          location: 'California, US',
          status: 'active',
          createdAt: new Date()
        }
      ]);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/likes/all');
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes || []);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
      // Set demo data for testing
      setLikes([
        {
          _id: '1',
          propertyId: 'cottage-forest-1',
          userAddress: '0x1234567890abcdef',
          liked: true,
          createdAt: new Date()
        },
        {
          _id: '2',
          propertyId: 'freshness-property',
          userAddress: '0xabcdef1234567890',
          liked: true,
          createdAt: new Date()
        }
      ]);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Set demo data for testing
      setOrders([
        {
          _id: '1',
          propertyId: 'cottage-forest-1',
          userAddress: '0x1234567890abcdef',
          amount: '29.71',
          currency: 'ETH',
          status: 'completed',
          createdAt: new Date()
        }
      ]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/likes/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set demo stats
      setStats({
        totalLikes: 45,
        uniqueUsers: 12,
        uniqueProperties: 6,
        totalOrders: 8,
        totalRevenue: '156.23'
      });
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (!connected) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <h4>Admin Dashboard</h4>
          <p>Please connect your wallet to access the admin dashboard.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-white">Admin Dashboard</h2>
          <p className="text-muted">Monitor your real estate platform data and analytics</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Loading dashboard data...</p>
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
          fill
        >
          <Tab eventKey="overview" title="Overview">
            <Row>
              <Col xl={3} md={6} className="mb-4">
                <Card className="bg-primary text-white">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3>{stats.totalLikes || 0}</h3>
                        <p className="mb-0">Total Likes</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-heart fa-2x"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={3} md={6} className="mb-4">
                <Card className="bg-success text-white">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3>{stats.uniqueUsers || 0}</h3>
                        <p className="mb-0">Active Users</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-users fa-2x"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={3} md={6} className="mb-4">
                <Card className="bg-info text-white">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3>{stats.uniqueProperties || 0}</h3>
                        <p className="mb-0">Properties Listed</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-home fa-2x"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={3} md={6} className="mb-4">
                <Card className="bg-warning text-white">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3>{stats.totalRevenue || 0} ETH</h3>
                        <p className="mb-0">Total Volume</p>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-chart-line fa-2x"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="users" title="Users">
            <Card>
              <Card.Header>
                <h5>User Management</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Wallet Address</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{formatAddress(user.walletAddress)}</td>
                        <td>
                          <Badge variant={user.role === 'admin' ? 'danger' : 'primary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="properties" title="Properties">
            <Card>
              <Card.Header>
                <h5>Property Listings</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Property Name</th>
                      <th>Price</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Listed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property._id}>
                        <td>{property.name}</td>
                        <td>{property.price} {property.currency}</td>
                        <td>{property.location}</td>
                        <td>
                          <Badge variant={property.status === 'active' ? 'success' : 'secondary'}>
                            {property.status}
                          </Badge>
                        </td>
                        <td>{formatDate(property.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="likes" title="Likes">
            <Card>
              <Card.Header>
                <h5>Property Likes</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Property ID</th>
                      <th>User Address</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {likes.map((like) => (
                      <tr key={like._id}>
                        <td>{like.propertyId}</td>
                        <td>{formatAddress(like.userAddress)}</td>
                        <td>
                          <Badge variant={like.liked ? 'danger' : 'secondary'}>
                            {like.liked ? 'Liked' : 'Unliked'}
                          </Badge>
                        </td>
                        <td>{formatDate(like.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="orders" title="Orders">
            <Card>
              <Card.Header>
                <h5>Transaction History</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Property ID</th>
                      <th>Buyer Address</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.propertyId}</td>
                        <td>{formatAddress(order.userAddress)}</td>
                        <td>{order.amount} {order.currency}</td>
                        <td>
                          <Badge variant={
                            order.status === 'completed' ? 'success' : 
                            order.status === 'pending' ? 'warning' : 'danger'
                          }>
                            {order.status}
                          </Badge>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}

      <Row className="mt-4">
        <Col>
          <Button variant="primary" onClick={fetchDashboardData}>
            <i className="fas fa-sync-alt me-2"></i>
            Refresh Data
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
