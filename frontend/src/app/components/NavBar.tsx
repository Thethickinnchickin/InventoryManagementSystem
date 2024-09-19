'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userRole, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Typography variant="h6" component={Link} href={userRole === 'admin' ? '/admin' : '/'} color="inherit" sx={{ textDecoration: 'none' }}>
          Inventory Management 
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isLoggedIn ? (
              userRole === 'admin' ? (
                <>
                  <Button component={Link} href="/admin" color="inherit">Dashboard</Button>
                  <Button component={Link} href="/admin/orders" color="inherit">Orders</Button>
                  <Button component={Link} href="/admin/products" color="inherit">Products</Button>
                  <Button component={Link} href="/admin/categories" color="inherit">Categories</Button>
                  <Button component={Link} href="/admin/reports" color="inherit">Reports</Button>
                  <Button component={Link} href="/admin/audit-logs" color="inherit">Audit Logs</Button>
                </>
              ) : (
                <>
                  <Button component={Link} href="/user/orders" color="inherit">Your Orders</Button>
                  <Button component={Link} href="/user/products" color="inherit">Products</Button>
                  <Button component={Link} href="/user/cart" color="inherit">Cart</Button>
                  <Button component={Link} href="/user/profile" color="inherit">Profile</Button>
                  <Button onClick={() => { logout(); closeMenu(); }} color="secondary" variant="contained">Logout</Button>
                </>
              )
            ) : (
              <>
                <Button component={Link} href="/login" color="inherit">Login</Button>
                <Button component={Link} href="/register" color="inherit">Register</Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Icon */}
        {isMobile && (
          <IconButton edge="start" color="inherit" onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Navigation Menu */}
        <Menu
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          open={isOpen}
          onClose={closeMenu}
        >
          {isLoggedIn ? (
            <>
              {userRole === 'admin' ? (
                <>
                  <MenuItem onClick={closeMenu} component={Link} href="/admin">Dashboard</MenuItem>
                  <MenuItem onClick={closeMenu} component={Link} href="/admin/orders">Orders</MenuItem>
                  <MenuItem onClick={closeMenu} component={Link} href="/admin/products">Products</MenuItem>
                  <MenuItem onClick={closeMenu} component={Link} href="/admin/categories">Categories</MenuItem>
                  <MenuItem onClick={closeMenu} component={Link} href="/admin/reports">Reports</MenuItem>
                  <MenuItem onClick={closeMenu} component={Link} href="/admin/audit-logs">Audit Logs</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={closeMenu} component={Link} href="/user/orders">Your Orders</MenuItem>
                  <MenuItem onClick={closeMenu} component={Link} href="/user/products">Products</MenuItem>
                  <MenuItem onClick={closeMenu} component={Link} href="/user/cart">Cart</MenuItem>
                  <MenuItem onClick={closeMenu} component={Link} href="/user/profile">Profile</MenuItem>
                </>
              )}
              <MenuItem onClick={() => { logout(); closeMenu(); }}>
                <Button color="secondary" variant="contained">Logout</Button>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={closeMenu} component={Link} href="/login">Login</MenuItem>
              <MenuItem onClick={closeMenu} component={Link} href="/register">Register</MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
