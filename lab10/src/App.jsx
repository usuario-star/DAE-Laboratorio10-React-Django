import React, { Component } from 'react';
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Grid
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      recuperado: false,
      cargando: true,
      // Form state
      codigo: '',
      descripcion: '',
      precio: '',
      // Feedback state
      mensaje: null,
      tipoMensaje: 'success',
      enviando: false
    };

    // Binding de métodos de eventos
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cargarProductos = this.cargarProductos.bind(this);
  }

  componentDidMount() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.setState({ cargando: true });
    fetch('http://localhost:8000/api/producto/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          productos: data,
          recuperado: true,
          cargando: false
        });
      })
      .catch((error) => {
        console.error('Error al recuperar datos:', error);
        this.setState({
          cargando: false,
          mensaje: 'Error de conexión con la API de Django',
          tipoMensaje: 'error'
        });
      });
  }

  // Manejador de eventos para inputs del formulario
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  // Manejador del evento Submit para registrar un nuevo producto
  handleSubmit(e) {
    e.preventDefault();
    const { codigo, descripcion, precio } = this.state;

    // Validación básica de campos
    if (!codigo || !descripcion || !precio) {
      this.setState({
        mensaje: 'Por favor, complete todos los campos del formulario.',
        tipoMensaje: 'warning'
      });
      return;
    }

    this.setState({ enviando: true });

    const nuevoProducto = {
      codigo: parseInt(codigo, 10),
      descripcion: descripcion.trim(),
      precio: parseFloat(precio)
    };

    fetch('http://localhost:8000/api/producto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProducto)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo registrar el producto en el backend');
        }
        return response.json();
      })
      .then((data) => {
        this.setState((prevState) => ({
          productos: [...prevState.productos.filter(p => p.codigo !== nuevoProducto.codigo), nuevoProducto].sort((a, b) => a.codigo - b.codigo),
          codigo: '',
          descripcion: '',
          precio: '',
          enviando: false,
          mensaje: `¡Producto "${nuevoProducto.descripcion}" guardado exitosamente en Django!`,
          tipoMensaje: 'success'
        }));
      })
      .catch((err) => {
        console.error('Error al guardar:', err);
        this.setState({
          enviando: false,
          mensaje: 'Ocurrió un error al enviar la petición al servidor.',
          tipoMensaje: 'error'
        });
      });
  }

  renderTabla() {
    const { productos } = this.state;

    return (
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 600 }} aria-label="tabla de productos">
          <TableHead sx={{ backgroundColor: '#0284c7' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Código</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Descripción</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }} align="right">Precio Unitario</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }} align="center">Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow
                key={producto.codigo}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: '0.2s' }}
              >
                <TableCell component="th" scope="row">
                  <Chip
                    label={`#${producto.codigo}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                  {producto.descripcion}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#0f766e', fontSize: '1rem' }}>
                  S/. {parseFloat(producto.precio).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<CheckCircleIcon fontSize="small" />}
                    label="Disponible"
                    size="small"
                    color="success"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  render() {
    const {
      recuperado,
      cargando,
      codigo,
      descripcion,
      precio,
      mensaje,
      tipoMensaje,
      enviando,
      productos
    } = this.state;

    return (
      <Box sx={{ flexGrow: 1, backgroundColor: '#f1f5f9', minHeight: '100vh', pb: 6 }}>
        {/* Barra Superior Tecsup */}
        <AppBar position="static" sx={{ backgroundColor: '#0284c7', boxShadow: 2 }}>
          <Toolbar>
            <StorefrontIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}>
              TECSUP - DAE | Laboratorio 10: Componentes y Eventos
            </Typography>
            <Chip
              label="React + Django REST"
              color="secondary"
              sx={{ fontWeight: 'bold', backgroundColor: '#38bdf8', color: '#0f172a' }}
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {/* Alertas de notificación */}
          {mensaje && (
            <Alert
              severity={tipoMensaje}
              sx={{ mb: 3, boxShadow: 1 }}
              onClose={() => this.setState({ mensaje: null })}
            >
              {mensaje}
            </Alert>
          )}

          {/* Formulario para agregar productos (TAREA) */}
          <Card elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddCircleIcon color="primary" /> Agregar Nuevo Producto a la Base de Datos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ingrese los datos del producto. Los cambios se sincronizarán mediante petición <b>POST</b> con el backend de Django.
              </Typography>

              <Box component="form" onSubmit={this.handleSubmit} noValidate>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      id="codigo"
                      name="codigo"
                      label="Código"
                      type="number"
                      size="small"
                      value={codigo}
                      onChange={this.handleChange}
                      placeholder="Ej. 3"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      id="descripcion"
                      name="descripcion"
                      label="Descripción"
                      type="text"
                      size="small"
                      value={descripcion}
                      onChange={this.handleChange}
                      placeholder="Ej. Inka Kola 1.5L"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      id="precio"
                      name="precio"
                      label="Precio (S/.)"
                      type="number"
                      step="0.01"
                      size="small"
                      value={precio}
                      onChange={this.handleChange}
                      placeholder="Ej. 3.50"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={enviando}
                      startIcon={<AddCircleIcon />}
                      sx={{
                        backgroundColor: '#0284c7',
                        '&:hover': { backgroundColor: '#0369a1' },
                        py: 0.9,
                        fontWeight: 'bold',
                        textTransform: 'none'
                      }}
                    >
                      {enviando ? 'Guardando...' : 'Agregar'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Sección de la Tabla */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Catálogo de Productos Disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de registros cargados: <b>{productos.length}</b>
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={this.cargarProductos}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Recargar
            </Button>
          </Box>

          {/* Renderizado condicional según estado recuperado / cargando */}
          {cargando && !recuperado ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <CircularProgress color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                recuperando datos...
              </Typography>
            </Paper>
          ) : (
            this.renderTabla()
          )}
        </Container>
      </Box>
    );
  }
}

export default App;
