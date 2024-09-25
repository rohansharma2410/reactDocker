// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../src/assets/image/logo.png';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav>
      <Link to="/">
      <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
    </Link>
      <Hamburger onClick={toggleMenu}>
        <span />
        <span />
        <span />
      </Hamburger>
      <Menu isOpen={isOpen}>
        <MenuItem to="/logscreen">Home</MenuItem>
        <MenuItem to="/logscreen">Billing</MenuItem> 
        <MenuItem to="/logscreen">Report</MenuItem>
        <MenuItem to="/logscreen">Contact</MenuItem>
      </Menu>
    </Nav>
  );
};

export default Navbar;

// Styled Components
const Nav = styled.nav`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:#223329;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  span {
    height: 3px;
    width: 25px;
    background: #fff;
    margin-bottom: 4px;
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: #333;
    transition: all 0.3s ease-in-out;
    height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
    overflow: hidden;
  }
`;

const MenuItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  margin: 0 15px;
  transition: color 0.3s;

  &:hover {
    color: #ddd;
  }

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;
